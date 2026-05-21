import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';

const AdminProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    const loginPath = import.meta.env.VITE_ADMIN_LOGIN_PATH || "/admin-a8f4c2e9";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;