import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { motion } from 'framer-motion';
import {
  Home,
  Scissors,
  Store,
  User,
  Heart,
  LogOut,
  Sparkles,
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
        { path: '/parent', icon: Heart, label: 'Dashboard', color: 'text-pink-500' },
        { path: '/parent/profile', icon: User, label: 'Perfil da Criança', color: 'text-blue-500' },
      ]
    : [
        { path: '/child', icon: Home, label: 'Início', color: 'text-primary' },
        { path: '/child/home-mode', icon: Scissors, label: 'Modo Casa', color: 'text-secondary' },
        { path: '/child/salon-mode', icon: Store, label: 'Modo Salão', color: 'text-purple' },
        { path: '/child/character', icon: Sparkles, label: 'O Meu Avatar', color: 'text-accent-dark' },
      ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-100 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <Scissors className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-text leading-tight">
              O Meu Guia
            </h1>
            <p className="text-xs text-text-light">do Cabeleireiro</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 mx-4 mt-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <User size={18} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{profile.name}</p>
            <div className="flex items-center gap-1">
              <Shield size={12} className={isParent ? 'text-pink-500' : 'text-secondary'} />
              <span className="text-xs text-text-light">
                {isParent ? 'Pai/Mãe' : 'Criança'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-text-light hover:bg-gray-50'
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={18} />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="desktopNavIndicator"
                  className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-50">
        <motion.button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-50 transition-colors"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={18} />
          Terminar Sessão
        </motion.button>
      </div>
    </aside>
  );
}
