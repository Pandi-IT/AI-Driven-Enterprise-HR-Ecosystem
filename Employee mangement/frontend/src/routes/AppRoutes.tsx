import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardHome from '../pages/DashboardHome';
import EmployeeDirectory from '../pages/EmployeeDirectory';
import Attendance from '../pages/Attendance';
import Leaves from '../pages/Leaves';
import Recruitment from '../pages/Recruitment';
import AiChatbot from '../pages/AiChatbot';
import Reports from '../pages/Reports';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/landing" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="" element={<Navigate to="home" replace />} />
        <Route path="home" element={<DashboardHome />} />
        <Route path="employees" element={<EmployeeDirectory />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leaves" element={<Leaves />} />
        
        {/* HR/Admin Restricted Routes */}
        <Route
          path="recruitment"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_HR']}>
              <Recruitment />
            </ProtectedRoute>
          }
        />
        <Route
          path="reports"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_HR']}>
              <Reports />
            </ProtectedRoute>
          }
        />
        
        <Route path="chatbot" element={<AiChatbot />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
