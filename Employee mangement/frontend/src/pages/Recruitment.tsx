import React, { useState } from 'react';
import api from '../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { JobPosting, Candidate } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Sparkles,
  Bot,
  Plus,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const jobSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  department: z.string().min(1, 'Department is required'),
  description: z.string().min(1, 'Description is required'),
  requirements: z.string().optional(),
  status: z.enum(['Open', 'Closed', 'Draft']),
});

type JobFields = z.infer<typeof jobSchema>;

const Recruitment: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'jobs' | 'candidates'>('jobs');
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  
  // AI JD Generation state
  const [isJdLoading, setIsJdLoading] = useState(false);
  const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<JobFields>({
    resolver: zodResolver(jobSchema),
    defaultValues: { status: 'Open' }
  });

  // AI Candidate sifting state
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isSiftOpen, setIsSiftOpen] = useState(false);
  const [siftResult, setSiftResult] = useState('');
  const [isSiftLoading, setIsSiftLoading] = useState(false);

  // Queries
  const { data: jobs = [], isLoading: isJobsLoading } = useQuery<JobPosting[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await api.get('/recruitment/jobs');
      return res.data;
    },
  });

  const { data: candidates = [], isLoading: isCandidatesLoading } = useQuery<Candidate[]>({
    queryKey: ['candidates'],
    queryFn: async () => {
      const res = await api.get('/recruitment/candidates');
      return res.data;
    },
  });

  // Mutations
  const createJobMutation = useMutation({
    mutationFn: async (data: JobFields) => {
      return api.post('/recruitment/jobs', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsJobFormOpen(false);
      reset();
    },
  });

  const generateAiJd = async () => {
    const title = getValues('title');
    const dept = getValues('department');
    if (!title || !dept) {
      alert('Please fill in Job Title and Department first.');
      return;
    }
    setIsJdLoading(true);
    try {
      const res = await api.post('/ai/recruitment/generate-jd', { title, department: dept });
      setValue('description', res.data.jd);
    } catch (err) {
      console.error(err);
      alert('Failed to generate Job Description. Check Groq connection credentials.');
    } finally {
      setIsJdLoading(false);
    }
  };

  const siftCandidate = async (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsSiftOpen(true);
    setSiftResult('');
    setIsSiftLoading(true);
    
    const jdText = candidate.jobPosting?.description || 'General requirements: Strong communication, technical skills, and team collaboration.';
    const resumeText = candidate.resumeText || `Candidate Name: ${candidate.firstName} ${candidate.lastName}. Email: ${candidate.email}. Experience in coding, testing, and system management.`;

    try {
      const res = await api.post('/ai/recruitment/rank-candidate', { jd: jdText, resume: resumeText });
      setSiftResult(res.data.ranking);
    } catch (err) {
      console.error(err);
      setSiftResult('⚠️ Suitability scoring failed. Please verify AI models configuration.');
    } finally {
      setIsSiftLoading(false);
    }
  };

  const onJobSubmit = (data: JobFields) => {
    createJobMutation.mutate(data);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold tracking-wider uppercase">Talent Acquisition</p>
          <h2 className="text-2xl font-bold font-heading">Recruitment Portal</h2>
        </div>

        {activeTab === 'jobs' && (
          <button
            onClick={() => setIsJobFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-violet-600 hover:bg-violet-750 transition-colors shadow-sm"
          >
            <Plus size={14} />
            <span>Create Job Posting</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-6 py-3 text-xs font-semibold tracking-wide border-b-2 transition-all ${
            activeTab === 'jobs'
              ? 'border-violet-600 text-violet-700 dark:border-violet-400 dark:text-violet-400'
              : 'border-transparent text-slate-400 hover:text-slate-650'
          }`}
        >
          Active Job Boards ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('candidates')}
          className={`px-6 py-3 text-xs font-semibold tracking-wide border-b-2 transition-all ${
            activeTab === 'candidates'
              ? 'border-violet-600 text-violet-700 dark:border-violet-400 dark:text-violet-400'
              : 'border-transparent text-slate-400 hover:text-slate-650'
          }`}
        >
          Candidate Applications ({candidates.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'jobs' ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isJobsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm animate-pulse space-y-4">
                <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded w-1/2"></div>
                <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded w-1/4"></div>
              </div>
            ))
          ) : jobs.length === 0 ? (
            <div className="col-span-full p-12 text-center text-slate-400 border border-dashed border-slate-200 dark:border-zinc-850 rounded-2xl">
              No active job boards. Click 'Create Job Posting' to launch one.
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between hover:shadow transition-shadow duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100/50 dark:bg-violet-950/20 dark:text-violet-450 dark:border-violet-900/20 font-bold uppercase tracking-wider">
                      {job.department}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                      job.status === 'Open' ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50' : 'bg-slate-150 text-slate-500 border-slate-200/50'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-base font-heading mb-2">{job.title}</h3>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 line-clamp-3 mb-6 whitespace-pre-line">
                    {job.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-150 dark:border-zinc-850 flex items-center justify-between text-xs text-slate-400">
                  <span>Posted: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </section>
      ) : (
        <section className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 text-[10px] uppercase font-bold text-slate-450 dark:text-zinc-550 tracking-wider">
                  <th className="py-3">Candidate</th>
                  <th className="py-3">Target Role</th>
                  <th className="py-3">Email / Contact</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">AI Cognitive Matching</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-850 text-xs">
                {isCandidatesLoading ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-slate-450">Loading applicants...</td>
                  </tr>
                ) : candidates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-450 dark:text-zinc-500">
                      No candidate applications registered yet.
                    </td>
                  </tr>
                ) : (
                  candidates.map((cand) => (
                    <tr key={cand.id}>
                      <td className="py-3.5 font-semibold">
                        {cand.firstName} {cand.lastName}
                      </td>
                      <td className="py-3.5 font-medium text-slate-700 dark:text-zinc-350">
                        {cand.jobPosting?.title || 'General Pool'}
                      </td>
                      <td className="py-3.5 text-slate-450 dark:text-zinc-400">{cand.email}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          cand.status === 'Applied'
                            ? 'bg-blue-50 text-blue-750 border-blue-200/50'
                            : cand.status === 'Interviewing'
                            ? 'bg-amber-50 text-amber-700 border-amber-200/50'
                            : cand.status === 'Shortlisted'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-250/50'
                            : 'bg-red-50 text-red-750 border-red-200/50'
                        }`}>
                          {cand.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => siftCandidate(cand)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-650 hover:bg-violet-750 text-white font-semibold text-[10px] shadow-sm transition-all duration-200"
                        >
                          <Sparkles size={11} className="animate-pulse" />
                          <span>AI Sift Matcher</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Post a Job Modal Form */}
      <AnimatePresence>
        {isJobFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsJobFormOpen(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl p-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsJobFormOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500"
              >
                <X size={18} />
              </button>
              <h3 className="text-lg font-bold font-heading mb-6">Post a New Job Opening</h3>
              
              <form onSubmit={handleSubmit(onJobSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-655 dark:text-zinc-400 mb-1.5 uppercase">Job Title</label>
                    <input
                      type="text"
                      {...register('title')}
                      placeholder="Senior Java Developer"
                      className={`w-full px-3 py-2 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 focus:ring-1 focus:ring-violet-500 ${errors.title ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'}`}
                    />
                    {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-655 dark:text-zinc-400 mb-1.5 uppercase">Department</label>
                    <input
                      type="text"
                      {...register('department')}
                      placeholder="Engineering"
                      className={`w-full px-3 py-2 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 focus:ring-1 focus:ring-violet-500 ${errors.department ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'}`}
                    />
                    {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department.message}</p>}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-slate-655 dark:text-zinc-400 uppercase">Job Description & Details</label>
                    <button
                      type="button"
                      onClick={generateAiJd}
                      disabled={isJdLoading}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-650 hover:text-violet-750 transition-colors"
                    >
                      <Bot size={12} className={isJdLoading ? 'animate-spin' : ''} />
                      <span>{isJdLoading ? 'Generating...' : 'AI Auto-Draft Description'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    {...register('description')}
                    placeholder="Enter description details or click 'AI Auto-Draft Description' to build one..."
                    className={`w-full px-3 py-2 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 focus:ring-1 focus:ring-violet-500 font-mono text-xs ${errors.description ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'}`}
                  />
                  {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                </div>

                <div className="pt-4 flex justify-end gap-3 animate-fade-in">
                  <button
                    type="button"
                    onClick={() => setIsJobFormOpen(false)}
                    className="px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-zinc-800 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-750 rounded-lg"
                  >
                    Post Job
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Sifting Matcher Drawer */}
      <AnimatePresence>
        {isSiftOpen && (
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="h-16 border-b border-slate-200 dark:border-zinc-800 px-6 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-inner">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm font-heading">AI Resume Suitability Matcher</h3>
                  <p className="text-xs text-slate-400 dark:text-zinc-550">Candidate: {selectedCandidate?.firstName} {selectedCandidate?.lastName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsSiftOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-250 dark:hover:bg-zinc-850 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {isSiftLoading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
                  <div className="h-10 w-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-500 animate-pulse">Scanning resume skills match...</p>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-zinc-950 p-6 rounded-xl border border-slate-250/60 dark:border-zinc-850/60 text-sm leading-relaxed prose dark:prose-invert max-w-none whitespace-pre-line font-mono text-xs">
                  {siftResult}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-zinc-800 text-center text-xs text-slate-400 dark:text-zinc-555 shrink-0 bg-slate-50/50 dark:bg-zinc-900/50">
              Matcher operates on Groq llama-3.3 LLM vector comparisons.
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Recruitment;
