import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Home, Sparkles, Star, Trophy } from 'lucide-react';
import AnimatedStory from '../components/AnimatedStory';
import OrderingGame from '../components/OrderingGame';
import { supabase } from '../lib/supabase';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

type Stage = 'story' | 'game' | 'reward';

export default function StoryGamePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stage, setStage] = useState<Stage>('story');
  const [gameScore, setGameScore] = useState(0);
  const [gameStars, setGameStars] = useState(0);
  const [showReward, setShowReward] = useState(false);

  const handleStoryComplete = () => {
    setStage('game');
    toast.success('História completa! Agora vamos jogar!', { icon: '🎮' });
  };

  const handleGameComplete = async (score: number, stars: number) => {
    setGameScore(score);
    setGameStars(stars);

    // Guardar recompensa no Supabase
    if (user) {
      try {
        await supabase.from('rewards').insert({
          child_id: user.id,
          type: 'story_game',
          label: 'Mestre da História',
          stars: stars,
          score: score,
          earned_at: new Date().toISOString(),
        });
      } catch (e) {
        console.error('Erro ao guardar recompensa:', e);
      }
    }

    setShowReward(true);
    setTimeout(() => setStage('reward'), 500);
  };

  const handleRetry = () => {
    setStage('story');
    setGameScore(0);
    setGameStars(0);
    setShowReward(false);
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Barra de progresso do fluxo */}
      <div className="glass border-b-2 border-sky-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <motion.button
              onClick={() => navigate('/child')}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 text-text-light hover:text-sky-500 font-comic font-bold"
            >
              <Home size={20} />
              <span className="hidden sm:inline">Início</span>
            </motion.button>

            <div className="flex items-center gap-2">
              {(['story', 'game', 'reward'] as Stage[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-comic font-bold text-sm transition-all ${
                    stage === s 
                      ? 'bg-sky-400 text-white shadow-kid' 
                      : stage === 'reward' && s === 'game'
                        ? 'bg-mint-400 text-white'
                        : stage === 'reward' && s === 'story'
                          ? 'bg-mint-400 text-white'
                          : 'bg-sky-100 text-sky-300'
                  }`}>
                    {s === 'story' && <Sparkles size={14} />}
                    {s === 'game' && <Star size={14} />}
                    {s === 'reward' && <Trophy size={14} />}
                  </div>
                  <span className={`text-xs font-comic font-bold hidden sm:inline ${
                    stage === s ? 'text-sky-500' : 'text-text-light'
                  }`}>
                    {s === 'story' && 'História'}
                    {s === 'game' && 'Jogo'}
                    {s === 'reward' && 'Prémio'}
                  </span>
                  {i < 2 && <div className="w-6 h-0.5 bg-sky-100" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {stage === 'story' && (
          <motion.div
            key="story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnimatedStory 
              onComplete={handleStoryComplete} 
              onExit={() => navigate('/child')}
            />
          </motion.div>
        )}

        {stage === 'game' && (
          <motion.div
            key="game"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <OrderingGame 
              onComplete={handleGameComplete}
              onRetry={handleRetry}
            />
          </motion.div>
        )}

        {stage === 'reward' && (
          <motion.div
            key="reward"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen bg-bg flex items-center justify-center p-4"
          >
            <RewardScreen 
              stars={gameStars}
              score={gameScore}
              onRetry={handleRetry}
              onHome={() => navigate('/child')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Tela de Recompensa
function RewardScreen({ stars, score, onRetry, onHome }: { 
  stars: number; 
  score: number; 
  onRetry: () => void; 
  onHome: () => void;
}) {
  const rewards = [
    { stars: 1, title: 'Bom Trabalho!', message: 'Conseguiste ordenar a história!', color: 'from-sky-400 to-sky-300' },
    { stars: 2, title: 'Muito Bem!', message: 'Fizeste muito bem no jogo!', color: 'from-mint-400 to-sky-400' },
    { stars: 3, title: 'Campeão/ã!', message: 'És um mestre da história do cabeleireiro!', color: 'from-peach-400 to-mint-400' },
  ];

  const reward = rewards[stars - 1] || rewards[0];

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', duration: 0.8 }}
      className="bg-white rounded-3xl p-8 max-w-md w-full shadow-kid-lg text-center border-4 border-mint-100"
    >
      {/* Confete animado */}
      <div className="relative mb-6">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className={`w-28 h-28 bg-gradient-to-br ${reward.color} rounded-full flex items-center justify-center mx-auto shadow-kid-lg`}
        >
          <Trophy size={56} className="text-white" />
        </motion.div>

        {/* Partículas */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              backgroundColor: ['#F8C471', '#58D68D', '#5DADE2', '#BB8FCE'][i % 4],
              top: '50%',
              left: '50%',
            }}
            animate={{
              x: [0, (i % 2 === 0 ? 1 : -1) * (60 + i * 20)],
              y: [0, -40 - i * 15],
              opacity: [1, 0],
              scale: [1, 0],
            }}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-comic font-bold text-3xl text-text mb-2"
      >
        {reward.title}
      </motion.h2>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-text-light font-comic mb-6"
      >
        {reward.message}
      </motion.p>

      {/* Estrelas */}
      <div className="flex justify-center gap-4 mb-6">
        {[1, 2, 3].map((star) => (
          <motion.div
            key={star}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.7 + star * 0.2, type: 'spring' }}
          >
            <Star
              size={56}
              className={`${
                star <= stars 
                  ? 'text-peach-400 fill-peach-400 drop-shadow-lg' 
                  : 'text-gray-200'
              }`}
            />
          </motion.div>
        ))}
      </div>

      {/* Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: 'spring' }}
        className="bg-gradient-to-r from-sky-50 to-mint-50 rounded-2xl p-4 mb-6 border-2 border-sky-100"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles size={20} className="text-sky-400" />
          <span className="font-comic font-bold text-sky-500">Novo Badge Desbloqueado!</span>
        </div>
        <p className="font-comic font-bold text-lg text-text">
          Mestre da História do Cabeleireiro
        </p>
        <p className="text-sm text-text-light font-comic">
          Pontuação: {score}%
        </p>
      </motion.div>

      {/* Botões */}
      <div className="space-y-3">
        <motion.button
          onClick={onRetry}
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 bg-sky-400 text-white rounded-2xl font-comic font-bold text-lg shadow-kid hover:bg-sky-500 transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles size={20} />
          Jogar Outra Vez
        </motion.button>

        <motion.button
          onClick={onHome}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-sky-50 text-text rounded-2xl font-comic font-bold border-2 border-sky-100 hover:bg-sky-100 transition-colors"
        >
          Voltar ao Início
        </motion.button>
      </div>
    </motion.div>
  );
}
