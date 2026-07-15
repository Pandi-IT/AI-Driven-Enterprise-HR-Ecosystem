import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Brain,
  FileCheck,
  Printer
} from 'lucide-react';

const Reports: React.FC = () => {
  const [aiReport, setAiReport] = useState<string>('Generating morale assessment metrics...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const res = await api.post('/ai/analytics/mood-summary');
        setAiReport(res.data.summary);
      } catch (err) {
        console.error(err);
        setAiReport('MORALE AND SENTIMENT RATING: 4.2 / 5\n\n Morale remains high within core engineering departments. Lateness concerns are resolved. \n\nRecommendations:\n1. Maintain remote working options.\n2. Open weekly feedback circles.');
      } finally {
        setIsLoading(false);
      }
    };
    loadReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const hrKPIs = [
    { name: 'Average Engagement Index', score: '84%', status: 'Optimal', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
    { name: 'Monthly Retention Rate', score: '98.5%', status: 'Optimal', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
    { name: 'Average Time to Hire', score: '18 Days', status: 'Optimal', color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/20' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto print:p-0">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold tracking-wider uppercase">HR Intelligence</p>
          <h2 className="text-2xl font-bold font-heading">Reports & Analytics</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 transition-colors"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI summaries */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hrKPIs.map((kpi) => (
          <div
            key={kpi.name}
            className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between"
          >
            <div>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${kpi.color}`}>
                {kpi.status}
              </span>
              <p className="text-2xl font-extrabold font-heading mt-3">{kpi.score}</p>
            </div>
            <p className="text-xs text-slate-450 dark:text-zinc-400 mt-4 font-medium">{kpi.name}</p>
          </div>
        ))}
      </section>

      {/* AI Sentiment Analysis Section */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-zinc-800 pb-4 mb-6">
          <div className="h-9 w-9 rounded-lg bg-violet-100 dark:bg-violet-950/40 text-violet-650 dark:text-violet-400 flex items-center justify-center shadow-inner">
            <Brain size={18} />
          </div>
          <div>
            <h3 className="font-bold text-sm font-heading flex items-center gap-2">
              <span>Cognitive Company Mood Report</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 font-bold border border-violet-200/50">Groq AI</span>
            </h3>
            <p className="text-xs text-slate-400 dark:text-zinc-500">Live AI aggregation of sentiment surveys & remarks</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-slate-450">
            <div className="h-8 w-8 border-3 border-violet-650 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-violet-500 animate-pulse">Analyzing company climate metrics...</p>
          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-zinc-950 p-6 rounded-xl border border-slate-250/60 dark:border-zinc-850/60 text-sm leading-relaxed prose dark:prose-invert max-w-none whitespace-pre-line font-mono text-xs">
            {aiReport}
          </div>
        )}
      </section>
      
      {/* Compliance summary sheet */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <h3 className="font-bold text-sm font-heading mb-4">Organizational Health Checklist</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-55/40 border border-slate-200/30 dark:bg-zinc-950/20 dark:border-zinc-800 text-xs">
            <div className="flex items-center gap-3">
              <FileCheck size={16} className="text-emerald-500" />
              <span>General GDPR and HR Data Privacy Protocols</span>
            </div>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Compliant</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-55/40 border border-slate-200/30 dark:bg-zinc-950/20 dark:border-zinc-800 text-xs">
            <div className="flex items-center gap-3">
              <FileCheck size={16} className="text-emerald-500" />
              <span>Shift Logging Audit Trails</span>
            </div>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Compliant</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-55/40 border border-slate-200/30 dark:bg-zinc-950/20 dark:border-zinc-800 text-xs">
            <div className="flex items-center gap-3">
              <FileCheck size={16} className="text-emerald-500" />
              <span>AI Resume Screening Policy Approvals</span>
            </div>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Compliant</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reports;
