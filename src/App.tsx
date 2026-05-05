import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAuth } from './AuthContext';
import { useStore } from './store';
import { LoadingScreen } from './components/LoadingScreen';

// Lazy load pages for better performance
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ChildDashboard = lazy(() => import('./pages/ChildDashboard'));
const HomeModePage = lazy(() => import('./pages/HomeModePage'));
const SalonModePage = lazy(() => import('./pages/SalonModePage'));
const CharacterPage = lazy(() => import('./pages/CharacterPage'));
const ParentDashboard = lazy(() => import('./pages/ParentDashboard'));

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'parent' | 'child' }) {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const user = useStore((s) => s.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={user?.role === 'parent' ? '/parent' : '/child'} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isInitializing } = useAuth();
  const location = useLocation();

  // Show loading screen during initialization
  if (isInitializing) {
    return (
      <LoadingScreen 
        message="A preparar..." 
        submessage="A verificar a tua sessão"
      />
    );
  }

  return (
    <Suspense 
      fallback={
        <LoadingScreen 
          message="A carregar página..." 
          submessage={location.pathname}
        />
      }
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/child" element={
          <ProtectedRoute allowedRole="child">
            <ChildDashboard />
          </ProtectedRoute>
        } />
        <Route path="/child/home-mode" element={
          <ProtectedRoute allowedRole="child">
            <HomeModePage />
          </ProtectedRoute>
        } />
        <Route path="/child/salon-mode" element={
          <ProtectedRoute allowedRole="child">
            <SalonModePage />
          </ProtectedRoute>
        } />
        <Route path="/child/character" element={
          <ProtectedRoute allowedRole="child">
            <CharacterPage />
          </ProtectedRoute>
        } />

        <Route path="/parent" element={
          <ProtectedRoute allowedRole="parent">
            <ParentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
