import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { motion } from 'framer-motion';
import {
  Scissors,
  Home,
  Store,
  Sparkles,
  Star,
  Trophy,
  Heart,
  ArrowRight,
  Zap,
  Calendar,
} from 'lucide-react';
import RewardBadge from '../components/RewardBadge';

const quickActions = [
  {
    title: 'Modo Casa',
    description: 'Pratica em casa com a história animada',
    icon: Home,
    path: '/child/home-mode',
    color: 'from-secondary to-secondary-dark',
    bgColor: 'bg-secondary/10',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=300&fit=crop',
  },
  {
    title: 'Modo Salão',
    description: 'Acompanha a visita ao cabeleireiro',
    icon: Store,
    path: '/child/salon-mode',
    color: 'from-purple to-pink-500',
    bgColor: 'bg-purple/10',
    image: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=400&h=300&fit=crop',
  },
  {
    title: 'O Meu Avatar',
    description: 'Personaliza o teu personagem',
    icon: Sparkles,
    path: '/child/character',
    color: 'from-accent to-accent-dark',
    bgColor: 'bg-accent/10',
    image: 'https://images.unsplash.com/photo-1515041219749-89347f83291a?w=400&h=300&fit=crop',
  },
];

const recentRewards = [
  { type: 'star' as const, label: 'Primeira Cena', count: 3 },
  { type: 'award' as const, label: 'Corajoso', count: 1 },
  { type: 'trophy' as const, label: 'Visitante', count: 2 },
];

export default function ChildDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg"
          >
            <Scissors size={28} className="text-white" />
          </motion.div>
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-text">
              Olá, {profile?.name || 'Amigo'}! 👋
            </h1>
            <p className="text-text-light text-sm md:text-base">
              Pronto para uma nova aventura no cabeleireiro?
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { icon: Star, label: 'Estrelas', value: '12', color: 'text-yellow-500', bg: 'bg-yellow-50' },
          { icon: Trophy, label: 'Visitas', value: '3', color: 'text-primary', bg: 'bg-orange-50' },
          { icon: Zap, label: 'Cenas', value: '5/7', color: 'text-secondary', bg: 'bg-teal-50' },
          { icon: Calendar, label: 'Dias', value: '7', color: 'text-purple', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${stat.bg} rounded-2xl p-4 text-center`}
          >
            <stat.icon size={24} className={`mx-auto mb-2 ${stat.color}`} />
            <p className="font-black text-2xl text-text">{stat.value}</p>
            <p className="text-xs text-text-light font-semibold">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="font-display font-bold text-xl text-text mb-4 flex items-center gap-2">
          <Sparkles size={20} className="text-primary" />
          O que queres fazer?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.path}
              onClick={() => navigate(action.path)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden rounded-2xl bg-white shadow-lg text-left group"
            >
              {/* Imagem de fundo */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={action.image}
                  alt={action.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${action.color} opacity-60`} />
                <div className="absolute bottom-3 left-4 right-4">
                  <div className={`w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2`}>
                    <action.icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white">{action.title}</h3>
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm text-text-light mb-3">{action.description}</p>
                <div className="flex items-center gap-1 text-primary font-semibold text-sm">
                  Começar
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recompensas Recentes */}
      <div className="mb-8">
        <h2 className="font-display font-bold text-xl text-text mb-4 flex items-center gap-2">
          <Trophy size={20} className="text-accent-dark" />
          As Tuas Recompensas
        </h2>

        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {recentRewards.map((reward, i) => (
              <RewardBadge
                key={reward.label}
                type={reward.type}
                label={reward.label}
                count={reward.count}
                index={i}
              />
            ))}

            {/* Placeholder para mais recompensas */}
            <div className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-gray-50 min-w-[80px]">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <Heart size={20} className="text-gray-300" />
              </div>
              <span className="text-xs text-gray-400 font-semibold text-center">Mais em breve</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dica do dia */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-secondary/10 to-blue-50 rounded-2xl p-5 border border-secondary/20"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-text mb-1">Dica do Dia 💡</h3>
            <p className="text-sm text-text-light">
              Antes de ir ao cabeleireiro, pede aos teus pais para te mostrarem fotos de cortes de cabelo 
              que gostes. Assim, o cabeleireiro sabe exatamente o que queres!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
