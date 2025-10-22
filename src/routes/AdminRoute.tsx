import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { authState } = useAuth();

  if (authState.isLoading) {
    return null; // or a spinner component
  }

  if (!authState.user) {
    return <Navigate to='/login' replace />;
  }

  if (!authState.user.is_admin) {
    return <Navigate to='/unauthorized' replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
