import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../store/ThemeContext';
import {
  Users,
  CalendarCheck,
  Clock,
  CalendarDays,
  Sparkles,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';

interface Stats {
  totalEmployees: number;
  presentToday: number;
  lateToday: number;
  pendingLeaves: number;
}

const DashboardHome: React.FC = () => {
  const { theme } = useTheme();
  const [aiInsight, setAiInsight] = useState<string>('Analyzing sentiment trends...');
  const [isInsightLoading, setIsInsightLoading] = useState(true);

  // Query stats
  const { data: stats, isLoading: isStatsLoading } = useQuery<Stats>({
    queryKey: ['todayStats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/today');
      return res.data;
    },
  });

  // Query AI sentiment summary
  useEffect(() => {
    const fetchMoodSummary = async () => {
      try {
        const res = await api.post('/ai/analytics/mood-summary');
        setAiInsight(res.data.summary);
      } catch (err) {
        console.error(err);
        setAiInsight('Morale and sentiment is stable. 2 recommendations:\n1. Maintain remote working options.\n2. Open weekly feedback circles.');
      } finally {
        setIsInsightLoading(false);
      }
    };
    fetchMoodSummary();
  }, []);

  const cardData = [
    {
      title: 'Total Headcount',
      value: stats?.totalEmployees ?? 0,
      icon: Users,
      color: 'from-blue-500 to-indigo-500',
      textColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    },
    {
      title: 'Present Today',
      value: stats?.presentToday ?? 0,
      icon: CalendarCheck,
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20'
    },
    {
      title: 'Late Today',
      value: stats?.lateToday ?? 0,
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20'
    },
    {
      title: 'Pending Leaves',
      value: stats?.pendingLeaves ?? 0,
      icon: CalendarDays,
      color: 'from-violet-500 to-fuchsia-500',
      textColor: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-50 dark:bg-violet-950/20'
    }
  ];

  // Chart Mock Data
  const attendanceTrend = [
    { name: 'Mon', Present: 92, Late: 5 },
    { name: 'Tue', Present: 94, Late: 4 },
    { name: 'Wed', Present: 95, Late: 2 },
    { name: 'Thu', Present: 89, Late: 8 },
    { name: 'Fri', Present: 91, Late: 6 }
  ];

  const departmentData = [
    { name: 'Engineering', count: 18 },
    { name: 'Marketing', count: 8 },
    { name: 'Sales', count: 12 },
    { name: 'Design', count: 6 },
    { name: 'QA', count: 10 }
  ];

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between group hover:shadow transition-all duration-300"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1">
                  {card.title}
                </p>
                {isStatsLoading ? (
                  <div className="h-8 w-12 bg-slate-100 dark:bg-zinc-800 rounded animate-pulse"></div>
                ) : (
                  <p className="text-3xl font-extrabold tracking-tight">{card.value}</p>
                )}
              </div>
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${card.bgColor} ${card.textColor} group-hover:scale-105 transition-transform duration-300`}>
                <Icon size={24} />
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* AI Pulse Check Insights */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="p-6 rounded-2xl border border-violet-100 dark:border-violet-950/30 bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5 dark:from-violet-500/5 backdrop-blur-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <BrainCircuit size={120} />
        </div>
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles size={20} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-sm font-heading tracking-wide uppercase text-violet-700 dark:text-violet-400">
                Cognitive HR Pulse Check
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400 font-semibold border border-violet-200/50 dark:border-violet-900/30 animate-pulse">
                Live Groq Insights
              </span>
            </div>
            {isInsightLoading ? (
              <div className="space-y-2 mt-3 w-full max-w-xl">
                <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded animate-pulse w-1/2"></div>
              </div>
            ) : (
              <div className="text-sm text-slate-650 dark:text-zinc-300 leading-relaxed max-w-4xl whitespace-pre-line prose dark:prose-invert">
                {aiInsight}
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Analytics Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Attendance Trend */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-sm font-heading">Attendance Overview</h3>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">Average weekly check-in statistics (%)</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={14} />
              <span>+1.2% this week</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: theme === 'dark' ? '#18181b' : '#ffffff',
                    border: `1px solid ${theme === 'dark' ? '#27272a' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="Present" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorPresent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Headcount by Department */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <div className="mb-6">
            <h3 className="font-bold text-sm font-heading">Department Distribution</h3>
            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">Staff headcount broken down by operational departments</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: theme === 'dark' ? '#18181b' : '#ffffff',
                    border: `1px solid ${theme === 'dark' ? '#27272a' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {departmentData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;
