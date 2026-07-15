import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useTheme } from '../store/ThemeContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  Briefcase,
  FileText,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  User as UserIcon,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard/home', icon: LayoutDashboard, roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_EMPLOYEE'] },
    { name: 'Employees', path: '/dashboard/employees', icon: Users, roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_EMPLOYEE'] },
    { name: 'Attendance', path: '/dashboard/attendance', icon: CalendarCheck, roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_EMPLOYEE'] },
    { name: 'Leaves', path: '/dashboard/leaves', icon: CalendarDays, roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_EMPLOYEE'] },
    { name: 'Recruitment', path: '/dashboard/recruitment', icon: Briefcase, roles: ['ROLE_ADMIN', 'ROLE_HR'] },
    { name: 'AI Chatbot', path: '/dashboard/chatbot', icon: Bot, roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_EMPLOYEE'] },
    { name: 'Reports', path: '/dashboard/reports', icon: FileText, roles: ['ROLE_ADMIN', 'ROLE_HR'] },
  ];

  const filteredNavigation = navigationItems.filter(
    (item) => !user || item.roles.includes(user.role)
  );

  const getPageTitle = () => {
    const current = navigationItems.find(item => location.pathname.startsWith(item.path));
    return current ? current.name : 'System';
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ROLE_ADMIN': return 'Administrator';
      case 'ROLE_HR': return 'HR Manager';
      case 'ROLE_EMPLOYEE': return 'Employee';
      default: return 'User';
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors duration-300">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 h-screen z-20">
        {/* Brand Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-zinc-800">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Bot size={20} className="animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent font-heading">
              AuraHR
            </span>
            <span className="text-[10px] block font-medium text-violet-500 uppercase tracking-widest -mt-1">
              AI Powered
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 border border-violet-100/50 dark:border-violet-900/30'
                      : 'text-slate-500 hover:text-slate-950 hover:bg-slate-100/70 dark:text-zinc-400 dark:hover:text-zinc-150 dark:hover:bg-zinc-800/40'
                  }`
                }
              >
                <Icon size={18} className="transition-transform group-hover:scale-105" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User profile section & logout */}
        <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-violet-700 dark:text-zinc-300 font-semibold shadow-inner">
              <UserIcon size={18} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{getRoleLabel(user?.role || '')}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-900/30 transition-all duration-200"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Navbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-850"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold text-slate-800 dark:text-zinc-150 font-heading">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-850 transition-colors duration-200"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Profile pill */}
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs font-medium">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-slate-600 dark:text-zinc-400 truncate max-w-[120px]">
                {user?.email}
              </span>
            </div>
          </div>
        </header>

        {/* Nested Page Content with framer motion fade-in */}
        <main className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Drawer Navigation (Side Menu) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-30 md:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-105%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 z-40 md:hidden flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-zinc-800">
                <span className="font-bold text-lg font-heading text-slate-800 dark:text-zinc-150">AuraHR</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {filteredNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 border border-violet-100/50 dark:border-violet-900/30'
                            : 'text-slate-500 hover:text-slate-950 hover:bg-slate-100/70 dark:text-zinc-400 dark:hover:text-zinc-150 dark:hover:bg-zinc-800/40'
                        }`
                      }
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-zinc-850 flex items-center justify-center text-violet-700 dark:text-zinc-300 font-semibold shadow-inner">
                    <UserIcon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">{getRoleLabel(user?.role || '')}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-900/30 transition-all duration-200"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
