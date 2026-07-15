import React, { useState } from 'react';
import api from '../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Employee } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Brain,
  Sparkles,
  X,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
  startDate: z.string().min(1, 'Start date is required'),
  status: z.enum(['Active', 'Inactive', 'On Leave']),
});

type EmployeeFields = z.infer<typeof employeeSchema>;

const EmployeeDirectory: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [isAiEvalOpen, setIsAiEvalOpen] = useState(false);
  const [aiReport, setAiReport] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiEvalMode, setAiEvalMode] = useState<'perf' | 'attendance'>('perf');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EmployeeFields>({
    resolver: zodResolver(employeeSchema),
  });

  // Query employees
  const { data: employees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const res = await api.get('/employees');
      return res.data;
    },
  });

  // Create Employee Mutation
  const createMutation = useMutation({
    mutationFn: async (data: EmployeeFields) => {
      return api.post('/employees', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsFormOpen(false);
      reset();
    },
  });

  // Update Employee Mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; fields: EmployeeFields }) => {
      return api.put(`/employees/${data.id}`, data.fields);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsFormOpen(false);
      setSelectedEmployee(null);
      reset();
    },
  });

  // Delete Employee Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  const handleAddClick = () => {
    setFormMode('add');
    reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: 'Engineering',
      position: 'Software Developer',
      startDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
    setIsFormOpen(true);
  };

  const handleEditClick = (emp: Employee) => {
    setFormMode('edit');
    setSelectedEmployee(emp);
    setValue('firstName', emp.firstName);
    setValue('lastName', emp.lastName);
    setValue('email', emp.email);
    setValue('phone', emp.phone || '');
    setValue('department', emp.department);
    setValue('position', emp.position);
    setValue('startDate', emp.startDate);
    setValue('status', emp.status);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    if (confirm('Are you sure you want to delete this employee record?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = (data: EmployeeFields) => {
    if (formMode === 'add') {
      createMutation.mutate(data);
    } else if (formMode === 'edit' && selectedEmployee) {
      updateMutation.mutate({ id: selectedEmployee.id, fields: data });
    }
  };

  const triggerAiEvaluation = async (emp: Employee, mode: 'perf' | 'attendance') => {
    setAiEvalMode(mode);
    setSelectedEmployee(emp);
    setAiReport('');
    setIsAiLoading(true);
    setIsAiEvalOpen(true);
    try {
      const endpoint = mode === 'perf' ? '/ai/evaluate' : '/ai/attendance/analyze';
      const res = await api.post(endpoint, { id: emp.id, firstName: emp.firstName, lastName: emp.lastName, email: emp.email, department: emp.department, position: emp.position });
      setAiReport(mode === 'perf' ? res.data.evaluation : res.data.analysis);
    } catch (err) {
      console.error(err);
      setAiReport('⚠️ Could not complete AI evaluation. Please verify your Groq connection properties in docker configurations.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filter Logic
  const filteredEmployees = employees.filter((emp) => {
    const nameMatches = `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const deptMatches = deptFilter === 'All' || emp.department === deptFilter;
    const statusMatches = statusFilter === 'All' || emp.status === statusFilter;
    return nameMatches && deptMatches && statusMatches;
  });

  const uniqueDepts = Array.from(new Set(employees.map(e => e.department)));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold tracking-wider uppercase">HR Operations</p>
          <h2 className="text-2xl font-bold font-heading">Employee Registry</h2>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-violet-600 hover:bg-violet-750 transition-colors shadow-sm"
        >
          <Plus size={14} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 inset-y-0 my-auto text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
          />
        </div>
        
        {/* Department Filter */}
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs bg-slate-50 dark:bg-zinc-950 focus:outline-none"
        >
          <option value="All">All Departments</option>
          {uniqueDepts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs bg-slate-50 dark:bg-zinc-950 focus:outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="On Leave">On Leave</option>
        </select>
      </div>

      {/* Employee List Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 tracking-wider">
              <th className="px-6 py-4">Employee Details</th>
              <th className="px-6 py-4">Department & Position</th>
              <th className="px-6 py-4">Start Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">AI Copilot Actions</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-zinc-800 text-sm">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-zinc-850 rounded w-28"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-zinc-850 rounded w-24"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-zinc-850 rounded w-20"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-zinc-850 rounded w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-zinc-850 rounded w-32"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-zinc-850 rounded w-12 ml-auto"></div></td>
                </tr>
              ))
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 dark:text-zinc-500">
                  No employee records matched your search parameters.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-violet-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-violet-700 dark:text-zinc-300">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold">{emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-slate-400 dark:text-zinc-500">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-700 dark:text-zinc-300">{emp.position}</p>
                    <p className="text-xs text-slate-450 dark:text-zinc-400">{emp.department}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 dark:text-zinc-450">{emp.startDate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      emp.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900/30'
                        : emp.status === 'On Leave'
                        ? 'bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-900/30'
                        : 'bg-slate-50 text-slate-650 border-slate-200/50 dark:bg-zinc-800/40 dark:text-zinc-400 dark:border-zinc-700/30'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => triggerAiEvaluation(emp, 'perf')}
                        className="flex items-center gap-1.5 px-2 py-1 rounded bg-violet-50 hover:bg-violet-100 text-violet-750 dark:bg-violet-950/30 dark:hover:bg-violet-950/60 dark:text-violet-400 border border-violet-100/50 dark:border-violet-900/20 text-xs font-semibold transition-all duration-200"
                        title="Evaluate Performance"
                      >
                        <Brain size={12} />
                        <span>AI Review</span>
                      </button>
                      <button
                        onClick={() => triggerAiEvaluation(emp, 'attendance')}
                        className="flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-750 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/20 text-xs font-semibold transition-all duration-200"
                        title="Check Risk"
                      >
                        <Sparkles size={12} />
                        <span>Check Risk</span>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(emp)}
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(emp.id)}
                        className="p-1.5 rounded hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 text-slate-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Form Modal */}
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
              className="relative w-full max-w-lg p-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl z-10"
            >
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500"
              >
                <X size={18} />
              </button>
              <h3 className="text-lg font-bold font-heading mb-6">
                {formMode === 'add' ? 'Add Employee Record' : 'Edit Employee Record'}
              </h3>
              
              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1.5 uppercase">First Name</label>
                    <input
                      type="text"
                      {...register('firstName')}
                      className={`w-full px-3 py-2 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-violet-500 ${errors.firstName ? 'border-red-500' : 'border-slate-250 dark:border-zinc-800'}`}
                    />
                    {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1.5 uppercase">Last Name</label>
                    <input
                      type="text"
                      {...register('lastName')}
                      className={`w-full px-3 py-2 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-violet-500 ${errors.lastName ? 'border-red-500' : 'border-slate-250 dark:border-zinc-800'}`}
                    />
                    {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1.5 uppercase">Email Address</label>
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full px-3 py-2 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-violet-500 ${errors.email ? 'border-red-500' : 'border-slate-250 dark:border-zinc-800'}`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1.5 uppercase">Phone Number</label>
                  <input
                    type="text"
                    {...register('phone')}
                    placeholder="+1 555-0199"
                    className="w-full px-3 py-2 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 border-slate-250 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1.5 uppercase">Department</label>
                    <input
                      type="text"
                      {...register('department')}
                      className={`w-full px-3 py-2 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-violet-500 ${errors.department ? 'border-red-500' : 'border-slate-250 dark:border-zinc-800'}`}
                    />
                    {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1.5 uppercase">Position</label>
                    <input
                      type="text"
                      {...register('position')}
                      className={`w-full px-3 py-2 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-violet-500 ${errors.position ? 'border-red-500' : 'border-slate-250 dark:border-zinc-800'}`}
                    />
                    {errors.position && <p className="text-xs text-red-500 mt-1">{errors.position.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1.5 uppercase">Start Date</label>
                    <input
                      type="date"
                      {...register('startDate')}
                      className="w-full px-3 py-2 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 border-slate-250 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1.5 uppercase">Status</label>
                    <select
                      {...register('status')}
                      className="w-full px-3 py-2 rounded-lg border text-sm bg-slate-50 dark:bg-zinc-950 border-slate-250 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-zinc-800 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Evaluation Drawer Panel */}
      <AnimatePresence>
        {isAiEvalOpen && (
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="h-16 border-b border-slate-200 dark:border-zinc-800 px-6 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-inner">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm font-heading">
                    {aiEvalMode === 'perf' ? 'AI Performance Appraisal' : 'AI Attendance Pattern Analysis'}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">Employee: {selectedEmployee?.firstName} {selectedEmployee?.lastName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiEvalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-855 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
                  <div className="h-10 w-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-500 animate-pulse">Running cognitive models...</p>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-zinc-950 p-6 rounded-xl border border-slate-250/60 dark:border-zinc-850/60 text-sm leading-relaxed prose dark:prose-invert max-w-none whitespace-pre-line font-mono text-xs">
                  {aiReport}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-zinc-800 text-center text-xs text-slate-400 dark:text-zinc-500 shrink-0 bg-slate-50/50 dark:bg-zinc-900/50">
              Analysis generated with Llama-3.3 on Groq Cloud via Spring AI integration.
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeeDirectory;
