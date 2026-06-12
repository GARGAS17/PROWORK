import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, type Role } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirige al login si no está autenticado, guardando la URL a la que intentaba acceder
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Si está autenticado pero no tiene el rol necesario, redirige a su panel correspondiente
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'freelancer') return <Navigate to="/feed" replace />;
    if (role === 'empresa') return <Navigate to="/mis-proyectos" replace />;
  }

  // Si todo está bien y tiene los permisos, renderiza las subrutas
  return <Outlet />;
};
