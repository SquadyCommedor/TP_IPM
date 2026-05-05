import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Play, Pause, RotateCcw, CheckCircle, Volume2,
  Lightbulb, Clock, GripVertical, Sparkles, Star, Trophy
} from 'lucide-react';
import { useStore } from '../store';
import { HAIRCUT_SCENES, BREATHING_EXERCISES } from '../data';
import { SceneCard } from '../components/SceneCard';
import { ProgressBar } from '../components/ProgressBar';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { useTimer } from '../hooks/useTimer';
import type { Scene } from '../types';

export default function HomeModePage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const updateGameState = useStore((s) => s.updateGameState);
  const addStars = useStore((s) => s.addStars);
  const updateChildProfile = useStore((s) => s.updateChildProfile);

  const [activeScene, setActiveScene] = useState<number | null>(null);
  const [completedScenes, setCompletedScenes] = useState<string[]>(user?.childProfile?.completedScenes || []);
  const [showTips, setShowTips] = useState(false);
  const [orderingGame, setOrderingGame] = useState(false);
  const [orderedScenes, setOrderedScenes] = useState<Scene[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showReward, setShowReward] = useState(false);

  const timer = useTimer();

  useEffect(() => {
    updateGameState({ mode: 'home' });
    return () => { updateGameState({ mode: null }); };
  }, []);

  const handleSceneClick = (index: number) => {
    setActiveScene(index);
    setShowTips(false);
    timer.stop();
  };

  const startSceneTimer = () => {
    if (activeScene !== null) {
      timer.start(HAIRCUT_SCENES[activeScene].duration);
    }
  };

  const completeScene = () => {
    if (activeScene === null) return;

    const sceneId = HAIRCUT_SCENES[activeScene].id;
    if (!completedScenes.includes(sceneId)) {
      const newCompleted = [...completedScenes, sceneId];
      setCompletedScenes(newCompleted);
      updateChildProfile({ completedScenes: newCompleted });
      addStars(1);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 2000);
    }
    timer.stop();
  };

  const startOrderingGame = () => {
    const shuffled = [...HAIRCUT_SCENES].sort(() => Math.random() - 0.5);
    setOrderedScenes(shuffled);
    setOrderingGame(true);
    setGameCompleted(false);
  };

  const checkOrder = () => {
    const isCorrect = orderedScenes.every((scene, i) => scene.order === i + 1);
    if (isCorrect) {
      setGameCompleted(true);
      addStars(3);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newOrder = [...orderedScenes];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, removed);
    setOrderedScenes(newOrder);
    setDraggedIndex(index);
  };

  const totalProgress = (completedScenes.length / HAIRCUT_SCENES.length) * 100;

  return (
    <div className="min-h-screen bg-kid-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate('/child')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Voltar</span>
          </button>

          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-gray-800">{user?.childProfile?.stars || 0}</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Title */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-3"
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-family-display)' }}>
            Modo Casa
          </h1>
          <p className="text-gray-500 text-sm mt-1">Prepara-te para o cabeleireiro em casa</p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-100">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso da preparação</span>
            <span className="font-bold">{completedScenes.length}/{HAIRCUT_SCENES.length}</span>
          </div>
          <ProgressBar progress={totalProgress} color="bg-primary" showPercentage />
        </div>

        {/* Active Scene Viewer */}
        <AnimatePresence mode="wait">
          {activeScene !== null && (
            <motion.div
              key={activeScene}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl border-2 border-primary/20 overflow-hidden shadow-lg"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
                    {HAIRCUT_SCENES[activeScene].icon === 'DoorOpen' && '🚪'}
                    {HAIRCUT_SCENES[activeScene].icon === 'Shirt' && '🦸'}
                    {HAIRCUT_SCENES[activeScene].icon === 'Droplets' && '💧'}
                    {HAIRCUT_SCENES[activeScene].icon === 'Scissors' && '✂️'}
                    {HAIRCUT_SCENES[activeScene].icon === 'Wind' && '💨'}
                    {HAIRCUT_SCENES[activeScene].icon === 'Sparkles' && '✨'}
                    {HAIRCUT_SCENES[activeScene].icon === 'Mirror' && '🪞'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{HAIRCUT_SCENES[activeScene].title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{Math.floor(HAIRCUT_SCENES[activeScene].duration / 60)} min</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  {HAIRCUT_SCENES[activeScene].description}
                </p>

                {/* Timer */}
                {timer.isRunning ? (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Tempo restante</span>
                      <span className="text-lg font-bold text-primary">
                        {Math.floor(timer.timeRemaining / 60)}:{(timer.timeRemaining % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <ProgressBar progress={timer.progress} color="bg-primary" height={8} />
                  </div>
                ) : null}

                {/* Tips */}
                <AnimatePresence>
                  {showTips && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 bg-yellow-50 rounded-xl p-4 border border-yellow-200"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-yellow-600" />
                        <span className="font-bold text-yellow-800 text-sm">Dicas importantes:</span>
                      </div>
                      <ul className="space-y-1">
                        {HAIRCUT_SCENES[activeScene].tips.map((tip, i) => (
                          <li key={i} className="text-sm text-yellow-700 flex items-start gap-2">
                            <span className="text-yellow-500 mt-0.5">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {!timer.isRunning && timer.timeRemaining === 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startSceneTimer}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold"
                    >
                      <Play className="w-4 h-4" />
                      Iniciar timer
                    </motion.button>
                  )}

                  {timer.isRunning && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={timer.pause}
                      className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-xl text-sm font-bold"
                    >
                      <Pause className="w-4 h-4" />
                      Pausar
                    </motion.button>
                  )}

                  {!timer.isRunning && timer.timeRemaining > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={timer.resume}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold"
                    >
                      <Play className="w-4 h-4" />
                      Continuar
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowTips(!showTips)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
                      showTips ? 'bg-yellow-200 text-yellow-800' : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    <Lightbulb className="w-4 h-4" />
                    {showTips ? 'Esconder dicas' : 'Ver dicas'}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={completeScene}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl text-sm font-bold"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Concluir
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scene List */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-primary" />
            As cenas do cabeleireiro
          </h3>

          <div className="space-y-2">
            {HAIRCUT_SCENES.map((scene, index) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                index={index}
                isActive={activeScene === index}
                isCompleted={completedScenes.includes(scene.id)}
                onClick={() => handleSceneClick(index)}
              />
            ))}
          </div>
        </div>

        {/* Ordering Game */}
        <div className="bg-white rounded-2xl border-2 border-secondary/20 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-secondary" />
                Jogo de Ordenação
              </h3>
              <p className="text-xs text-gray-500 mt-1">Põe as cenas pela ordem certa!</p>
            </div>
            {!orderingGame && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startOrderingGame}
                className="px-4 py-2 bg-secondary text-white rounded-xl text-sm font-bold"
              >
                Jogar
              </motion.button>
            )}
          </div>

          <AnimatePresence>
            {orderingGame && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                {orderedScenes.map((scene, index) => (
                  <motion.div
                    key={scene.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border-2 border-gray-200 cursor-move hover:border-primary/50 transition-colors"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-700">{index + 1}.</span>
                    <span className="text-sm text-gray-600">{scene.title}</span>
                  </motion.div>
                ))}

                <div className="flex gap-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={checkOrder}
                    className="flex-1 py-2 bg-primary text-white rounded-xl text-sm font-bold"
                  >
                    Verificar ordem
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOrderingGame(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-sm font-bold"
                  >
                    Sair
                  </motion.button>
                </div>

                {gameCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="p-4 bg-accent/10 border border-accent rounded-xl text-center"
                  >
                    <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
                    <p className="font-bold text-accent">Parabéns! Acertaste na ordem!</p>
                    <p className="text-sm text-gray-600">Ganhaste 3 estrelas ⭐⭐⭐</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Reward Toast */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 bg-yellow-400 text-yellow-900 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold"
          >
            <Star className="w-5 h-5 fill-current" />
            +1 Estrela!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
