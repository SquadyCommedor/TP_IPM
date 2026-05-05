import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Scissors, Star, Settings, LogOut, Play, Trophy,
  Sparkles, Heart, Volume2, VolumeX, ChevronRight
} from 'lucide-react';
import { useStore } from '../store';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { RewardBadge } from '../components/RewardBadge';

export default function ChildDashboard() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showRewards, setShowRewards] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const profile = user.childProfile;
  const stars = profile?.stars || 0;
  const completedVisits = profile?.completedVisits || 0;
  const hasDiploma = profile?.diplomaEarned || false;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-kid-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CharacterAvatar 
              skin={profile?.characterSkin || 'neutral1'} 
              hairColor={profile?.hairColor || 'brown'}
              size="sm"
              animate={false}
            />
            <div>
              <h1 className="font-bold text-gray-800 text-sm">Olá, {profile?.nickname || user.name}!</h1>
              <div className="flex items-center gap-1 text-xs text-secondary">
                <Star className="w-3 h-3 fill-current" />
                <span className="font-bold">{stars}</span>
                <span>estrelas</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-gray-600" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-6 text-center border-2 border-primary/20"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-4"
          >
            <CharacterAvatar 
              skin={profile?.characterSkin || 'neutral1'} 
              hairColor={profile?.hairColor || 'brown'}
              size="lg"
            />
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
            Pronto para o cabeleireiro?
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Vamos aprender tudo sobre ir ao cabeleireiro de forma divertida!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/child/home-mode')}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl transition-shadow"
            >
              <Home className="w-5 h-5" />
              Modo Casa
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Preparar</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/child/salon-mode')}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-secondary text-white rounded-2xl font-bold shadow-lg shadow-secondary/30 hover:shadow-xl transition-shadow"
            >
              <Scissors className="w-5 h-5" />
              Modo Salão
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Ir agora</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 text-center border-2 border-yellow-200 shadow-sm"
          >
            <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-800">{stars}</p>
            <p className="text-xs text-gray-500">Estrelas</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 text-center border-2 border-primary/20 shadow-sm"
          >
            <Scissors className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-800">{completedVisits}</p>
            <p className="text-xs text-gray-500">Visitas</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl p-4 text-center border-2 shadow-sm ${
              hasDiploma ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <Trophy className={`w-6 h-6 mx-auto mb-1 ${hasDiploma ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="text-2xl font-bold text-gray-800">{hasDiploma ? '✅' : '🔒'}</p>
            <p className="text-xs text-gray-500">Diploma</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-secondary" />
            O que queres fazer?
          </h3>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowRewards(!showRewards)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-gray-200 hover:border-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800 text-sm">As Minhas Recompensas</p>
                <p className="text-xs text-gray-500">Ver estrelas e conquistas</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/child/character')}
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-gray-200 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800 text-sm">O Meu Personagem</p>
                <p className="text-xs text-gray-500">Mudar aspeto e cor do cabelo</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.button>
        </div>

        {/* Rewards Panel */}
        <AnimatePresence>
          {showRewards && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl border-2 border-yellow-200 p-4 overflow-hidden"
            >
              <h4 className="font-bold text-gray-800 mb-3">As Minhas Conquistas</h4>
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: Math.max(5, stars) }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col items-center"
                  >
                    <Star className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    <span className="text-xs text-gray-500 mt-1">{i + 1}</span>
                  </motion.div>
                ))}
              </div>

              {hasDiploma && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200 text-center"
                >
                  <Trophy className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="font-bold text-blue-800">Diploma do Cabeleireiro!</p>
                  <p className="text-xs text-blue-600">Parabéns, és um verdadeiro campeão!</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
