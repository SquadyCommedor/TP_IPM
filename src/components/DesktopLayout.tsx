import { ReactNode } from 'react';
import { useAuth } from '../AuthContext';
import DesktopSidebar from './DesktopSidebar';

interface DesktopLayoutProps {
  children: ReactNode;
}

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  const { user } = useAuth();
  const isAuthPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-bg flex">
      {user && !isAuthPage && <DesktopSidebar />}
      <main className={`flex-1 overflow-y-auto ${user && !isAuthPage ? 'ml-72' : ''}`}>
        <div className="max-w-6xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
