import React, { useState } from 'react';
import api from '../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../store/AuthContext';
import type { LeaveRequest } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Bot,
  Plus,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const leaveSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  leaveType: z.enum(['Vacation', 'Sick', 'Personal', 'Maternity', 'Paternity']),
  reason: z.string().min(1, 'Please provide a brief reason'),
});

type LeaveFields = z.infer<typeof leaveSchema>;

const Leaves: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // AI draft states
  const [aiDraft, setAiDraft] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeaveFields>({
    resolver: zodResolver(leaveSchema),
  });

  // Query leave requests
  const isHrOrAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_HR';
  
  const { data: leaves = [], isLoading } = useQuery<LeaveRequest[]>({
    queryKey: ['leaves', user?.employeeId, user?.role],
    queryFn: async () => {
      const endpoint = isHrOrAdmin ? '/leaves' : `/leaves/employee/${user?.employeeId}`;
      const res = await api.get(endpoint);
      return res.data;
    },
  });

  // Request Leave Mutation
  const requestMutation = useMutation({
    mutationFn: async (data: LeaveFields) => {
      const payload = {
        employee: { id: user?.employeeId },
        startDate: data.startDate,
        endDate: data.endDate,
        leaveType: data.leaveType,
        reason: data.reason,
        status: 'Pending'
      };
      return api.post('/leaves', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      setIsFormOpen(false);
      reset();
    },
  });

  // Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (data: { id: number; status: string }) => {
      return api.put(`/leaves/${data.id}/status`, data.status, {
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });

  // Generate AI Email Reply Mutation
  const generateAiReply = async (leave: LeaveRequest, decision: string) => {
    setIsAiOpen(true);
    setAiDraft('');
    setIsAiLoading(true);
    try {
      const res = await api.post('/ai/leave/respond', {
        id: leave.employee.id,
        decision,
        firstName: leave.employee.firstName,
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate
      });
      setAiDraft(res.data.response);
    } catch (err) {
      console.error(err);
      setAiDraft('⚠️ Failed to generate email response. Check Groq connection key configuration.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const onSubmit = (data: LeaveFields) => {
    requestMutation.mutate(data);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold tracking-wider uppercase">Absence Registry</p>
          <h2 className="text-2xl font-bold font-heading">Leave Management</h2>
        </div>

        {!isHrOrAdmin && user?.employeeId && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-violet-600 hover:bg-violet-750 transition-colors shadow-sm"
          >
            <Plus size={14} />
            <span>Request Time Off</span>
          </button>
        )}
      </div>

      {/* Leave request list table */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <div className="mb-6">
          <h3 className="font-bold text-sm font-heading">
            {isHrOrAdmin ? 'Leave Application Review Panel' : 'Your Leave History'}
          </h3>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
            {isHrOrAdmin ? 'Manage employee leave requests and generate professional replies' : 'Check approval status of your leave requests'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 text-[10px] uppercase font-bold text-slate-450 dark:text-zinc-555 tracking-wider">
                {isHrOrAdmin && <th className="py-3">Employee</th>}
                <th className="py-3">Leave Type</th>
                <th className="py-3">Timeline</th>
                <th className="py-3">Reason</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-850 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={isHrOrAdmin ? 6 : 5} className="py-4 text-center text-slate-450">Loading leave data...</td>
                </tr>
              ) : leaves.length === 0 ? (
                <tr>
                  <td colSpan={isHrOrAdmin ? 6 : 5} className="py-8 text-center text-slate-400 dark:text-zinc-500">
                    No leave requests found in the system.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.id}>
                    {isHrOrAdmin && (
                      <td className="py-3.5 font-semibold">
                        {leave.employee?.firstName} {leave.employee?.lastName}
                      </td>
                    )}
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200/50 dark:bg-zinc-800/40 dark:border-zinc-700/50 dark:text-zinc-300">
                        {leave.leaveType}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="font-mono">{leave.startDate}</span> to <span className="font-mono">{leave.endDate}</span>
                    </td>
                    <td className="py-3.5 text-slate-550 dark:text-zinc-400 max-w-xs truncate" title={leave.reason}>
                      {leave.reason}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                        leave.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-250/40 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : leave.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-250/40 dark:bg-amber-950/20 dark:text-amber-400'
                          : 'bg-red-50 text-red-750 border-red-250/40 dark:bg-red-950/20 dark:text-red-400'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {isHrOrAdmin && leave.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              updateStatusMutation.mutate({ id: leave.id, status: 'Approved' });
                              generateAiReply(leave, 'Approved');
                            }}
                            className="px-2 py-1 rounded bg-emerald-600 text-white font-semibold text-[10px] hover:bg-emerald-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              updateStatusMutation.mutate({ id: leave.id, status: 'Rejected' });
                              generateAiReply(leave, 'Rejected');
                            }}
                            className="px-2 py-1 rounded bg-red-600 text-white font-semibold text-[10px] hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : isHrOrAdmin ? (
                        <button
                          onClick={() => generateAiReply(leave, leave.status)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-violet-650 hover:text-violet-750 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-950/30 rounded border border-violet-100/50 dark:border-violet-900/20 transition-all duration-200"
                        >
                          <Bot size={12} />
                          <span>AI Mail Draft</span>
                        </button>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal Form */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md p-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl z-10"
            >
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500"
              >
                <X size={18} />
              </button>
              <h3 className="text-lg font-bold font-heading mb-6">Request Paid Time Off</h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-650 dark:text-zinc-400 mb-1.5 uppercase">Start Date</label>
                    <input
                      type="date"
                      {...register('startDate')}
                      className={`w-full px-3 py-2 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 focus:ring-1 focus:ring-violet-500 ${errors.startDate ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-650 dark:text-zinc-400 mb-1.5 uppercase">End Date</label>
                    <input
                      type="date"
                      {...register('endDate')}
                      className={`w-full px-3 py-2 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 focus:ring-1 focus:ring-violet-500 ${errors.endDate ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-650 dark:text-zinc-400 mb-1.5 uppercase">Leave Type</label>
                  <select
                    {...register('leaveType')}
                    className="w-full px-3 py-2 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 focus:ring-1 focus:ring-violet-500"
                  >
                    <option value="Vacation">Vacation</option>
                    <option value="Sick">Sick Leave</option>
                    <option value="Personal">Personal Leave</option>
                    <option value="Maternity">Maternity</option>
                    <option value="Paternity">Paternity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-650 dark:text-zinc-400 mb-1.5 uppercase">Reason</label>
                  <textarea
                    rows={3}
                    {...register('reason')}
                    placeholder="Brief description..."
                    className={`w-full px-3 py-2 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 focus:ring-1 focus:ring-violet-500 ${errors.reason ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'}`}
                  />
                  {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-zinc-800 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-750 rounded-lg shadow-sm"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Mail Draft Response Panel */}
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
                  <h3 className="font-bold text-sm font-heading">AI Response Letter Draft</h3>
                  <p className="text-xs text-slate-450">Formal notification template for email communications</p>
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
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-500 animate-pulse">Formulating email response...</p>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-zinc-950 p-6 rounded-xl border border-slate-250/60 dark:border-zinc-850/60 text-sm leading-relaxed prose dark:prose-invert max-w-none whitespace-pre-line font-mono text-xs">
                  {aiDraft}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-zinc-800 text-center text-xs text-slate-400 dark:text-zinc-500 shrink-0 bg-slate-50/50 dark:bg-zinc-900/50">
              Generated templates align with AuraHR V1.0 compliance policies.
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leaves;
