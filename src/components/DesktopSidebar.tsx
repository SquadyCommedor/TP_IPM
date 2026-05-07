import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { motion } from 'framer-motion';
import {
  Home,
  Scissors,
  Store,
  Sparkles,
  Heart,
  LogOut,
  Star,
  Shield,
} from 'lucide-react';

export default function DesktopSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();

  if (!user || !profile) return null;

  const isParent = profile.role === 'parent';

  const navItems = isParent
    ? [
        { path: '/parent', icon: Heart, label: 'Dashboard', color: 'text-lavender-400' },
      ]
    : [
        { path: '/child', icon: Home, label: 'Início', color: 'text-sky-400' },
        { path: '/child/home-mode', icon: Scissors, label: 'Modo Casa', color: 'text-mint-400' },
        { path: '/child/salon-mode', icon: Store, label: 'Modo Salão', color: 'text-lavender-400' },
        { path: '/child/character', icon: Sparkles, label: 'O Meu Avatar', color: 'text-peach-400' },
      ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-white border-r-2 border-sky-100 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b-2 border-sky-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-mint-400 rounded-2xl flex items-center justify-center shadow-kid">
            <Scissors className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-comic font-bold text-lg text-text leading-tight">
              O Meu Guia
            </h1>
            <p className="text-xs text-text-light font-comic">do Cabeleireiro</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 mx-4 mt-4 bg-gradient-to-r from-sky-50 to-mint-50 rounded-2xl border-2 border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Star size={18} className="text-sky-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-comic font-bold text-sm truncate">{profile.name}</p>
            <div className="flex items-center gap-1">
              <Shield size={12} className={isParent ? 'text-lavender-400' : 'text-mint-400'} />
              <span className="text-xs text-text-light font-comic">
                {isParent ? 'Pai/Mãe' : 'Criança'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all font-comic ${
                isActive
                  ? 'bg-sky-400 text-white shadow-kid'
                  : 'text-text-light hover:bg-sky-50'
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={20} />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="desktopNavIndicator"
                  className="ml-auto w-2 h-2 bg-white rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t-2 border-sky-50">
        <motion.button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-coral-400 hover:bg-coral-50 transition-colors font-comic"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={20} />
          Terminar Sessão
        </motion.button>
      </div>
    </aside>
  );
}
