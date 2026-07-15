import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Bot, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFields = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  });

  const from = (location.state as any)?.from?.pathname || '/dashboard/home';

  const onSubmit = async (data: LoginFields) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 px-4 transition-colors duration-300">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-violet-400/10 dark:bg-violet-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white mb-3 shadow-md">
            <Bot size={26} />
          </div>
          <h1 className="text-2xl font-bold font-heading">Sign In to AuraHR</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Enter your credentials to manage your enterprise</p>
        </div>

        {/* Card Panel */}
        <div className="p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-slate-100/50 dark:shadow-none">
          {error && (
            <div className="mb-6 flex items-center gap-3 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="name@company.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors duration-200 ${
                    errors.email ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs text-violet-600 dark:text-violet-400 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors duration-200 ${
                    errors.password ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg bg-violet-600 dark:bg-violet-500 hover:bg-violet-700 dark:hover:bg-violet-600 text-white font-semibold text-sm shadow-md hover:shadow-lg focus:outline-none transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Quick Mock Credentials Panel */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-zinc-800 text-xs">
            <span className="font-semibold text-slate-600 dark:text-zinc-400 block mb-2 uppercase tracking-wide">Development Logins</span>
            <div className="space-y-1 text-slate-500 dark:text-zinc-400">
              <p>• <span className="font-medium text-slate-700 dark:text-zinc-350">Admin:</span> admin@co.com / admin123</p>
              <p>• <span className="font-medium text-slate-700 dark:text-zinc-350">HR:</span> hr@co.com / hr12345</p>
              <p>• <span className="font-medium text-slate-700 dark:text-zinc-350">Employee:</span> charlie.b@co.com / charlie123</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 dark:text-zinc-500 mt-6">
          Don't have an administrative account?{' '}
          <Link to="/register" className="text-violet-600 dark:text-violet-400 font-medium hover:underline">
            Register Admin
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
