import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import MobileLayout from './components/MobileLayout';
import DesktopLayout from './components/DesktopLayout';
import LoginPage from './pages/LoginPage';
import ChildDashboard from './pages/ChildDashboard';
import HomeModePage from './pages/HomeModePage';
import SalonModePage from './pages/SalonModePage';
import CharacterPage from './pages/CharacterPage';
import ParentDashboard from './pages/ParentDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useMediaQuery } from './hooks/useMediaQuery';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function AppContent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const Layout = isMobile ? MobileLayout : DesktopLayout;

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rotas Criança */}
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

        {/* Rotas Pais */}
        <Route path="/parent" element={
          <ProtectedRoute allowedRole="parent">
            <ParentDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: 'Nunito, sans-serif',
                borderRadius: '16px',
                padding: '16px 24px',
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
