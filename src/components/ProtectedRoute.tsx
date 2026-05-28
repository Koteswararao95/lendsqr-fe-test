import React from 'react';
import { Navigate } from 'react-router-dom';
import storageService from '../services/storage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route component that requires authentication
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = storageService.getAuthState();

  if (!auth || !auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
