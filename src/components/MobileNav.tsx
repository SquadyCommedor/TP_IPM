import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { motion } from 'framer-motion';
import { 
  Home, 
  BookOpen,
  Store, 
  Sparkles, 
  LogOut,
} from 'lucide-react';

export default function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  const navItems = [
    { path: '/child', icon: Home, label: 'Início' },
    { path: '/child/story-game', icon: BookOpen, label: 'História' },
    { path: '/child/salon-mode', icon: Store, label: 'Salão' },
    { path: '/child/character', icon: Sparkles, label: 'Eu' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t-2 border-sky-100 z-50 safe-bottom bg-white/95">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-colors ${
                isActive ? 'text-sky-500' : 'text-text-light'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span className="text-[11px] font-bold font-comic">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute -top-1 w-8 h-1.5 bg-sky-400 rounded-full"
                />
              )}
            </motion.button>
          );
        })}

        <motion.button
          onClick={() => { /* logout logic */ }}
          className="flex flex-col items-center gap-1 px-3 py-2 text-coral-400"
          whileTap={{ scale: 0.9 }}
        >
          <LogOut size={24} />
          <span className="text-[11px] font-bold font-comic">Sair</span>
        </motion.button>
      </div>
    </nav>
  );
}
