import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Store, User, Star, Award, Gift, Settings } from 'lucide-react';
import { useStore } from '../store';
import { CharacterAvatar } from '../components/CharacterAvatar';

export default function ChildDashboard() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const syncVisitLogs = useStore((s) => s.syncVisitLogs);
  const [showRewards, setShowRewards] = useState(false);

  useEffect(() => {
    // Sync visit logs from Supabase on mount
    syncVisitLogs();
  }, [syncVisitLogs]);

  const profile = user?.childProfile;
  const stars = profile?.stars || 0;
  const completedVisits = profile?.completedVisits || 0;
  const hasDiploma = profile?.diplomaEarned || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CharacterAvatar
              skin={profile?.characterSkin || 'neutral1'}
              hairColor={profile?.hairColor || 'brown'}
              size="sm"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Olá, {profile?.nickname || user?.name}!
              </h1>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={16} fill="currentColor" />
                <span className="text-sm font-bold">{stars}</span>
                <span className="text-xs text-gray-500">estrelas</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/child/character')}
            className="p-2 bg-white rounded-xl border-2 border-gray-200 hover:border-primary transition-colors"
          >
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Welcome Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 mb-6 shadow-sm border-2 border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Pronto para o cabeleireiro?
          </h2>
          <p className="text-gray-600 mb-4">
            Vamos aprender tudo sobre ir ao cabeleireiro de forma divertida!
          </p>

          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/child/home-mode')}
              className="flex items-center justify-center gap-2 px-4 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl transition-shadow"
            >
              <Home size={20} />
              <div className="text-left">
                <div className="text-sm">Modo Casa</div>
                <div className="text-xs opacity-80">Preparar</div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/child/salon-mode')}
              className="flex items-center justify-center gap-2 px-4 py-4 bg-secondary text-white rounded-2xl font-bold shadow-lg shadow-secondary/30 hover:shadow-xl transition-shadow"
            >
              <Store size={20} />
              <div className="text-left">
                <div className="text-sm">Modo Salão</div>
                <div className="text-xs opacity-80">Ir agora</div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center border-2 border-gray-100">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-xl font-bold text-gray-800">{stars}</div>
            <div className="text-xs text-gray-500">Estrelas</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border-2 border-gray-100">
            <div className="text-2xl mb-1">✂️</div>
            <div className="text-xl font-bold text-gray-800">{completedVisits}</div>
            <div className="text-xs text-gray-500">Visitas</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border-2 border-gray-100">
            <div className="text-2xl mb-1">{hasDiploma ? '🎓' : '🔒'}</div>
            <div className="text-xl font-bold text-gray-800">{hasDiploma ? 'Sim' : 'Não'}</div>
            <div className="text-xs text-gray-500">Diploma</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl p-4 border-2 border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3">O que queres fazer?</h3>

          <button
            onClick={() => setShowRewards(!showRewards)}
            className="w-full flex items-center justify-between p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200 hover:border-yellow-300 transition-colors mb-2"
          >
            <div className="flex items-center gap-3">
              <Gift size={24} className="text-yellow-600" />
              <div className="text-left">
                <p className="font-bold text-gray-800">As Minhas Recompensas</p>
                <p className="text-xs text-gray-500">Ver estrelas e conquistas</p>
              </div>
            </div>
            <Star size={20} className="text-yellow-500" />
          </button>

          <button
            onClick={() => navigate('/child/character')}
            className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-2xl border-2 border-purple-200 hover:border-purple-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <User size={24} className="text-purple-600" />
              <div className="text-left">
                <p className="font-bold text-gray-800">O Meu Personagem</p>
                <p className="text-xs text-gray-500">Mudar aspeto e cor do cabelo</p>
              </div>
            </div>
            <Settings size={20} className="text-purple-500" />
          </button>
        </div>

        {/* Rewards Panel */}
        {showRewards && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 bg-white rounded-3xl p-6 border-2 border-yellow-200"
          >
            <h4 className="font-bold text-gray-800 mb-4">As Minhas Conquistas</h4>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: Math.max(5, stars) }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="aspect-square bg-yellow-100 rounded-xl flex items-center justify-center"
                >
                  <Star size={20} className="text-yellow-500" fill="currentColor" />
                </motion.div>
              ))}
            </div>

            {hasDiploma && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-blue-100 rounded-2xl text-center"
              >
                <Award size={32} className="text-blue-600 mx-auto mb-2" />
                <p className="font-bold text-blue-800">Diploma do Cabeleireiro!</p>
                <p className="text-sm text-blue-600">Parabéns, és um verdadeiro campeão!</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
