import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authState } = useAuth();

  if (authState.isLoading) {
    return null; // or a spinner component
  }

  if (!authState.user) {
    return <Navigate to='/login' replace />;
  }

  // Redirect admin to admin dashboard, regular users to home
  if (authState.user.is_admin) {
    return <Navigate to='/admin/dashboard' replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
