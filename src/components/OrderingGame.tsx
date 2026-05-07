import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  CheckCircle2, 
  Star, 
  Trophy, 
  RotateCcw, 
  ArrowRight,
  Sparkles,
  Heart,
  Volume2,
} from 'lucide-react';
import { storyScenes } from './AnimatedStory';

interface OrderingGameProps {
  onComplete: (score: number, stars: number) => void;
  onRetry: () => void;
}

export default function OrderingGame({ onComplete, onRetry }: OrderingGameProps) {
  const [shuffledScenes, setShuffledScenes] = useState(() => {
    // Criar cópia embaralhada das cenas (apenas título e imagem)
    const scenes = storyScenes.map(s => ({ 
      id: s.id, 
      title: s.title, 
      image: s.image,
      correctOrder: s.id 
    }));
    return [...scenes].sort(() => Math.random() - 0.5);
  });

  const [isCorrect, setIsCorrect] = useState<boolean[]>(new Array(9).fill(false));
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const checkOrder = () => {
    const newIsCorrect = shuffledScenes.map((scene, index) => scene.correctOrder === index + 1);
    setIsCorrect(newIsCorrect);

    const correctCount = newIsCorrect.filter(Boolean).length;
    const newScore = Math.round((correctCount / 9) * 100);
    setScore(newScore);
    setAttempts(a => a + 1);

    if (correctCount === 9) {
      const stars = attempts === 0 ? 3 : attempts === 1 ? 2 : 1;
      setTimeout(() => {
        setShowResult(true);
        onComplete(newScore, stars);
      }, 1500);
    }
  };

  const handleReorder = (newOrder: typeof shuffledScenes) => {
    setShuffledScenes(newOrder);
    setIsCorrect(new Array(9).fill(false));
  };

  const getStars = () => {
    if (attempts === 0) return 3;
    if (attempts === 1) return 2;
    return 1;
  };

  if (showResult) {
    const stars = getStars();
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-kid-lg text-center border-4 border-mint-100"
        >
          <motion.div
            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 bg-gradient-to-br from-mint-400 to-sky-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-kid-lg"
          >
            <Trophy size={48} className="text-white" />
          </motion.div>

          <h2 className="font-comic font-bold text-3xl text-text mb-2">
            Consegui!
          </h2>
          <p className="text-text-light font-comic mb-6">
            Ordenaste todas as cenas corretamente!
          </p>

          {/* Estrelas */}
          <div className="flex justify-center gap-3 mb-6">
            {[1, 2, 3].map((star) => (
              <motion.div
                key={star}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: star * 0.3, type: 'spring' }}
              >
                <Star
                  size={48}
                  className={`${
                    star <= stars 
                      ? 'text-peach-400 fill-peach-400' 
                      : 'text-gray-200'
                  }`}
                />
              </motion.div>
            ))}
          </div>

          <div className="bg-sky-50 rounded-2xl p-4 mb-6">
            <p className="font-comic font-bold text-sky-500 text-lg">
              {score}% Correto
            </p>
            <p className="text-sm text-text-light font-comic">
              Tentativas: {attempts}
            </p>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={onRetry}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3 bg-sky-50 rounded-2xl font-comic font-bold text-text border-2 border-sky-100 flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Jogar Outra Vez
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-kid mb-4">
          <Sparkles size={18} className="text-peach-400" />
          <span className="font-comic font-bold text-sm text-text">Jogo de Ordenação</span>
        </div>
        <h1 className="font-comic font-bold text-2xl md:text-3xl text-text mb-2">
          Ordena a História!
        </h1>
        <p className="text-text-light font-comic">
          Arrasta as cenas para a ordem correta. Qual vem primeiro?
        </p>
      </motion.div>

      {/* Área de Jogo */}
      <div className="max-w-2xl mx-auto">
        <Reorder.Group
          axis="y"
          values={shuffledScenes}
          onReorder={handleReorder}
          className="space-y-3"
        >
          {shuffledScenes.map((scene, index) => (
            <Reorder.Item
              key={scene.id}
              value={scene}
              onDragStart={() => setDraggingId(scene.id)}
              onDragEnd={() => setDraggingId(null)}
              whileDrag={{ scale: 1.05, zIndex: 10 }}
              className={`relative rounded-2xl overflow-hidden transition-all ${
                draggingId === scene.id 
                  ? 'shadow-kid-lg ring-4 ring-sky-200' 
                  : 'shadow-kid'
              } ${
                isCorrect[index] 
                  ? 'ring-4 ring-mint-300' 
                  : isCorrect[index] === false && attempts > 0 
                    ? 'ring-4 ring-coral-200' 
                    : ''
              }`}
            >
              <div className="bg-white p-4 flex items-center gap-4">
                {/* Número da ordem */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-comic font-bold text-lg flex-shrink-0 ${
                  isCorrect[index] 
                    ? 'bg-mint-100 text-mint-500' 
                    : isCorrect[index] === false && attempts > 0
                      ? 'bg-coral-100 text-coral-500'
                      : 'bg-sky-50 text-sky-400'
                }`}>
                  {isCorrect[index] ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Imagem miniatura */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={scene.image}
                    alt={scene.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Título */}
                <div className="flex-1">
                  <h3 className="font-comic font-bold text-text">{scene.title}</h3>
                  {isCorrect[index] && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-mint-500 font-comic"
                    >
                      Correto! ⭐
                    </motion.p>
                  )}
                  {isCorrect[index] === false && attempts > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-coral-500 font-comic"
                    >
                      Ainda não... tenta outro lugar!
                    </motion.p>
                  )}
                </div>

                {/* Handle de drag */}
                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-300">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="4" cy="4" r="2" />
                    <circle cx="12" cy="4" r="2" />
                    <circle cx="4" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {/* Botões de ação */}
        <div className="flex gap-3 mt-6">
          <motion.button
            onClick={checkOrder}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-4 bg-mint-400 text-white rounded-2xl font-comic font-bold text-lg shadow-kid hover:bg-mint-500 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={24} />
            Verificar Ordem
          </motion.button>

          <motion.button
            onClick={() => {
              setShuffledScenes([...storyScenes.map(s => ({ 
                id: s.id, 
                title: s.title, 
                image: s.image,
                correctOrder: s.id 
              }))].sort(() => Math.random() - 0.5));
              setIsCorrect(new Array(9).fill(false));
              setAttempts(0);
            }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-4 bg-sky-50 rounded-2xl font-comic font-bold text-sky-400 border-2 border-sky-100 flex items-center gap-2"
          >
            <RotateCcw size={20} />
            <span className="hidden sm:inline">Recomeçar</span>
          </motion.button>
        </div>

        {/* Tentativas */}
        <p className="text-center text-sm text-text-light font-comic mt-4">
          Tentativas: {attempts}
        </p>
      </div>
    </div>
  );
}
