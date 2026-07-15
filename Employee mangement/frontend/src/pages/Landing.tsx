import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, ArrowRight, Sparkles, UserCheck, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors duration-300 overflow-x-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between border-b border-slate-200/60 dark:border-zinc-800/60 sticky top-0 backdrop-blur-md bg-slate-50/70 dark:bg-zinc-950/70 z-50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white">
            <Bot size={20} />
          </div>
          <span className="font-bold text-lg font-heading tracking-tight">AuraHR</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 dark:bg-violet-500 hover:bg-violet-700 dark:hover:bg-violet-600 rounded-lg shadow-sm hover:shadow transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-200 dark:border-violet-900/60 bg-violet-50/50 dark:bg-violet-950/30 text-xs font-semibold text-violet-700 dark:text-violet-300 mb-8"
        >
          <Sparkles size={14} className="animate-spin-slow" />
          <span>Intelligent Workforce Management</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold font-heading tracking-tight max-w-4xl leading-[1.1] mb-6"
        >
          Redesigning Enterprise HR with{' '}
          <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            AI-Driven Insights
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-500 dark:text-zinc-400 max-w-2xl mb-10 leading-relaxed"
        >
          A complete HR ecosystem combining core directories, real-time attendance, leave pipelines, and cognitive resume screening powered by advanced AI models.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 dark:bg-violet-500 hover:bg-violet-700 dark:hover:bg-violet-600 text-white font-semibold shadow-lg shadow-violet-500/25 dark:shadow-violet-500/10 transition-all duration-300 group"
          >
            <span>Register Admin Account</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 font-semibold transition-all duration-300"
          >
            <span>Launch Live Console</span>
          </Link>
        </motion.div>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full text-left">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-5">
              <UserCheck size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2">Smart Profile Directory</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
              Consolidated registry tracking status, onboarding milestones, contract logs, and role histories in real-time.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-5">
              <Sparkles size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2">Resume AI Evaluator</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
              Scan candidate resume files instantly to rank suitability scores, verify core skills, and suggest improvements.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-5">
              <LineChart size={20} />
            </div>
            <h3 className="text-lg font-bold mb-2">Retention Risk Models</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
              Generate attrition predictors using machine attendance timelines, leave triggers, and active mood checks.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-zinc-800 py-10 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 dark:text-zinc-500">
          <p>© 2026 AuraHR Ecosystem. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
