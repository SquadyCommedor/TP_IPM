import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { 
  Home, 
  Scissors, 
  Store, 
  User, 
  LogOut,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();

  if (!user || !profile) return null;

  const isParent = profile.role === 'parent';

  const navItems = isParent ? [
    { path: '/parent', icon: Heart, label: 'Dashboard' },
    { path: '/parent/profile', icon: User, label: 'Perfil' },
  ] : [
    { path: '/child', icon: Home, label: 'Início' },
    { path: '/child/home-mode', icon: Scissors, label: 'Casa' },
    { path: '/child/salon-mode', icon: Store, label: 'Salão' },
    { path: '/child/character', icon: User, label: 'Eu' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-gray-100 z-50 safe-bottom">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
                isActive ? 'text-primary' : 'text-text-light'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span className="text-[10px] font-semibold">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute -top-1 w-8 h-1 bg-primary rounded-full"
                />
              )}
            </motion.button>
          );
        })}

        <motion.button
          onClick={logout}
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-red-400"
          whileTap={{ scale: 0.9 }}
        >
          <LogOut size={22} />
          <span className="text-[10px] font-semibold">Sair</span>
        </motion.button>
      </div>
    </nav>
  );
}
