import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = () => {
  const { token } = useAuth();
  const hasToken = token || localStorage.getItem('token');

  return hasToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
