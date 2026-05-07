import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import LoadingScreen from './LoadingScreen';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole: 'parent' | 'child';
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!profile) return <LoadingScreen message="A carregar perfil..." />;
  if (profile.role !== allowedRole) {
    return <Navigate to={profile.role === 'parent' ? '/parent' : '/child'} replace />;
  }

  return <>{children}</>;
}
