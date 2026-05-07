import { ReactNode } from 'react';
import { useAuth } from '../AuthContext';
import MobileNav from './MobileNav';

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const { user } = useAuth();
  const isAuthPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <main className="flex-1 overflow-y-auto safe-bottom pb-20">
        {children}
      </main>
      {user && !isAuthPage && <MobileNav />}
    </div>
  );
}
