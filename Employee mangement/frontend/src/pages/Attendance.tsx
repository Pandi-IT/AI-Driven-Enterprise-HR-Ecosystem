import React, { useState } from 'react';
import api from '../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../store/AuthContext';
import type { AttendanceRecord } from '../types';
import {
  Calendar,
  Sparkles,
  Bot,
  X,
  PlayCircle
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const Attendance: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [aiReport, setAiReport] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Get employee-specific attendance history
  const { data: records = [], isLoading } = useQuery<AttendanceRecord[]>({
    queryKey: ['attendance', user?.employeeId],
    queryFn: async () => {
      if (!user?.employeeId) return [];
      const res = await api.get(`/attendance/employee/${user.employeeId}`);
      return res.data;
    },
    enabled: !!user?.employeeId,
  });

  // Clock In Mutation
  const clockInMutation = useMutation({
    mutationFn: async () => {
      const now = new Date();
      const localTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
      
      const payload = {
        employee: { id: user?.employeeId },
        date: now.toISOString().split('T')[0],
        checkIn: localTime,
        status: now.getHours() >= 9 && now.getMinutes() > 15 ? 'Late' : 'Present',
        notes: 'Checked in via web portal'
      };
      
      return api.post('/attendance', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', user?.employeeId] });
      queryClient.invalidateQueries({ queryKey: ['todayStats'] });
    },
  });

  // AI Attrition Risk Mutation
  const triggerAiAttritionCheck = async () => {
    setIsAiOpen(true);
    setAiReport('');
    setIsAiLoading(true);
    try {
      const res = await api.post('/ai/analytics/attrition-risk', { id: user?.employeeId, firstName: user?.firstName, lastName: user?.lastName });
      setAiReport(res.data.riskAnalysis);
    } catch (err) {
      console.error(err);
      setAiReport('⚠️ Could not complete risk assessment. Please check Groq environment configurations.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const getTodayRecord = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    return records.find(r => r.date === todayStr);
  };

  const todayRecord = getTodayRecord();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold tracking-wider uppercase">Shift Tracker</p>
          <h2 className="text-2xl font-bold font-heading">Attendance logs</h2>
        </div>

        {user?.employeeId && (
          <button
            onClick={triggerAiAttritionCheck}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-650 hover:from-violet-700 hover:to-indigo-750 transition-all shadow-sm"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>AI Attrition Audit</span>
          </button>
        )}
      </div>

      {/* Clock Controls Card */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm font-heading text-slate-400 uppercase tracking-wider mb-2">Today's Status</h3>
            <div className="flex items-center gap-2.5">
              <span className={`h-2.5 w-2.5 rounded-full ${todayRecord ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
              <p className="text-xl font-bold font-heading">{todayRecord ? 'Clocked In' : 'Not Clocked In'}</p>
            </div>
            {todayRecord && (
              <p className="text-xs text-slate-450 dark:text-zinc-400 mt-2">
                Shift Status:{' '}
                <span className="font-semibold text-slate-700 dark:text-zinc-350">{todayRecord.status}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-6">
            <Calendar size={14} />
            <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Action card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between md:col-span-2">
          <div>
            <h3 className="font-bold text-sm font-heading text-slate-400 uppercase tracking-wider mb-2">Shift Registration</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed max-w-xl">
              Register your shift check-in times. Lateness is calculated automatically according to company policy (9:15 AM grace threshold).
            </p>
          </div>
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={() => clockInMutation.mutate()}
              disabled={!!todayRecord || clockInMutation.isPending}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-zinc-800/40 dark:disabled:text-zinc-550 transition-all duration-200 shadow-sm"
            >
              <PlayCircle size={18} />
              <span>{clockInMutation.isPending ? 'Logging...' : todayRecord ? 'Clocked In Successfully' : 'Clock In'}</span>
            </button>
            
            {todayRecord && (
              <div className="flex items-center gap-4 px-4 py-2 border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 rounded-xl text-xs">
                <div>
                  <span className="text-slate-450 block uppercase tracking-wider text-[10px]">Checked In</span>
                  <span className="font-bold text-sm font-mono">{todayRecord.checkIn}</span>
                </div>
                {todayRecord.checkOut && (
                  <div>
                    <span className="text-slate-450 block uppercase tracking-wider text-[10px]">Checked Out</span>
                    <span className="font-bold text-sm font-mono">{todayRecord.checkOut}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Logs Table */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <div className="mb-6">
          <h3 className="font-bold text-sm font-heading">Attendance History</h3>
          <p className="text-xs text-slate-450 dark:text-zinc-400 mt-0.5">Logs of your verified shift registries</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 text-[10px] uppercase font-bold text-slate-450 dark:text-zinc-550 tracking-wider">
                <th className="py-3">Date</th>
                <th className="py-3">Check In</th>
                <th className="py-3">Check Out</th>
                <th className="py-3">Status</th>
                <th className="py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-850 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-slate-400">Loading history...</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 dark:text-zinc-500">No shift records found for this employee profile.</td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3.5 font-medium">{r.date}</td>
                    <td className="py-3.5 font-mono">{r.checkIn || '--:--'}</td>
                    <td className="py-3.5 font-mono">{r.checkOut || '--:--'}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                        r.status === 'Present'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-250/40 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : r.status === 'Late'
                          ? 'bg-amber-50 text-amber-700 border-amber-250/40 dark:bg-amber-950/20 dark:text-amber-400'
                          : 'bg-red-50 text-red-750 border-red-250/40 dark:bg-red-950/20 dark:text-red-400'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400 dark:text-zinc-500">{r.notes || 'No remarks'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Attrition Drawer */}
      <AnimatePresence>
        {isAiOpen && (
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="h-16 border-b border-slate-200 dark:border-zinc-800 px-6 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-inner">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm font-heading">AI Attrition Risk Audit</h3>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">Employee: {user?.firstName} {user?.lastName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-250 dark:hover:bg-zinc-850 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
                  <div className="h-10 w-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-500 animate-pulse">Running risk evaluation...</p>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-zinc-950 p-6 rounded-xl border border-slate-250/60 dark:border-zinc-850/60 text-sm leading-relaxed prose dark:prose-invert max-w-none whitespace-pre-line font-mono text-xs">
                  {aiReport}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-zinc-800 text-center text-xs text-slate-400 dark:text-zinc-500 shrink-0 bg-slate-50/50 dark:bg-zinc-900/50">
              Generated in real-time with Groq via Spring Security context.
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Attendance;
