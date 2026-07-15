import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Bot, Mail, Lock, User as UserIcon, AlertCircle, Briefcase, Tag } from 'lucide-react';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['ADMIN', 'HR', 'EMPLOYEE']),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  department: z.string().optional(),
  position: z.string().optional(),
});

type RegisterFields = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'EMPLOYEE',
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFields) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signup(data);
      navigate('/dashboard/home', { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please check your data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 px-4 py-12 transition-colors duration-300">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-violet-400/10 dark:bg-violet-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white mb-3 shadow-md">
            <Bot size={26} />
          </div>
          <h1 className="text-2xl font-bold font-heading">Create User Profile</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Register administrative and employee credentials</p>
        </div>

        {/* Card Panel */}
        <div className="p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-slate-100/50 dark:shadow-none">
          {error && (
            <div className="mb-6 flex items-center gap-3 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* First and Last Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                    <UserIcon size={16} />
                  </div>
                  <input
                    type="text"
                    {...register('firstName')}
                    placeholder="John"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors duration-200 ${
                      errors.firstName ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'
                    }`}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                    <UserIcon size={16} />
                  </div>
                  <input
                    type="text"
                    {...register('lastName')}
                    placeholder="Doe"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors duration-200 ${
                      errors.lastName ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'
                    }`}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="john.doe@company.com"
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
              <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors duration-200 ${
                    errors.password ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-2">
                System Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                  <Tag size={16} />
                </div>
                <select
                  {...register('role')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors duration-200"
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="HR">HR Manager</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </div>
            </div>

            {/* Department and Position (visible for standard employees) */}
            {selectedRole !== 'ADMIN' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-2">
                    Department
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                      <Briefcase size={16} />
                    </div>
                    <input
                      type="text"
                      {...register('department')}
                      placeholder="Engineering"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-2">
                    Position
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                      <Briefcase size={16} />
                    </div>
                    <input
                      type="text"
                      {...register('position')}
                      placeholder="Developer"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg bg-violet-600 dark:bg-violet-500 hover:bg-violet-700 dark:hover:bg-violet-600 text-white font-semibold text-sm shadow-md hover:shadow-lg focus:outline-none transition-all duration-200 flex items-center justify-center gap-2 mt-6"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register Account</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 dark:text-zinc-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-600 dark:text-violet-400 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
