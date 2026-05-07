import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, Check, Lightbulb } from 'lucide-react';
import { useStore } from '../store';
import { useTimer } from '../hooks/useTimer';
import { HAIRCUT_SCENES } from '../data';
import { SceneCard } from '../components/SceneCard';
import { ProgressBar } from '../components/ProgressBar';

export default function HomeModePage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const updateChildProfile = useStore((s) => s.updateChildProfile);
  const addStars = useStore((s) => s.addStars);

  const [activeScene, setActiveScene] = useState<number | null>(null);
  const [completedScenes, setCompletedScenes] = useState<string[]>(
    user?.childProfile?.completedScenes || []
  );
  const [showTips, setShowTips] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  const timer = useTimer();

  const handleSceneClick = (index: number) => {
    if (activeScene === index) return;
    setActiveScene(index);
    setShowTips(false);
    timer.stop();
  };

  const handleStartTimer = () => {
    if (activeScene === null) return;
    timer.start(HAIRCUT_SCENES[activeScene].duration);
  };

  const handleCompleteScene = async () => {
    if (activeScene === null) return;

    const sceneId = HAIRCUT_SCENES[activeScene].id;

    if (!completedScenes.includes(sceneId)) {
      const newCompleted = [...completedScenes, sceneId];
      setCompletedScenes(newCompleted);

      // Update in Supabase
      await updateChildProfile({
        completedScenes: newCompleted,
      });

      // Add stars
      await addStars(1);
    }

    timer.stop();

    // Check if all scenes completed
    if (completedScenes.length + 1 >= HAIRCUT_SCENES.length) {
      setShowCompletion(true);
    } else {
      // Move to next scene
      if (activeScene < HAIRCUT_SCENES.length - 1) {
        setActiveScene(activeScene + 1);
      }
    }
  };

  const handleCompletionClose = async () => {
    setShowCompletion(false);

    // Update completed visits
    const newVisits = (user?.childProfile?.completedVisits || 0) + 1;
    await updateChildProfile({
      completedVisits: newVisits,
      diplomaEarned: newVisits >= 3,
    });

    navigate('/child');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/child')}
            className="p-2 bg-white rounded-xl border-2 border-gray-200 hover:border-primary transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Modo Casa</h1>
            <p className="text-sm text-gray-500">Aprender em casa</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso</span>
            <span>{completedScenes.length}/{HAIRCUT_SCENES.length} cenas</span>
          </div>
          <ProgressBar 
            progress={(completedScenes.length / HAIRCUT_SCENES.length) * 100} 
            color="bg-primary"
          />
        </div>

        {/* Scene List */}
        <div className="space-y-2 mb-6">
          {HAIRCUT_SCENES.map((scene, index) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              isActive={activeScene === index}
              isCompleted={completedScenes.includes(scene.id)}
              onClick={() => handleSceneClick(index)}
            />
          ))}
        </div>

        {/* Active Scene Detail */}
        <AnimatePresence>
          {activeScene !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl p-6 border-2 border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">
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
                  <p className="text-sm text-gray-500">
                    {Math.floor(HAIRCUT_SCENES[activeScene].duration / 60)} min
                  </p>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{HAIRCUT_SCENES[activeScene].description}</p>

              {/* Timer */}
              {timer.isRunning && (
                <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Tempo restante</span>
                    <span className="text-lg font-bold text-primary">
                      {Math.floor(timer.timeRemaining / 60)}:{(timer.timeRemaining % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <ProgressBar progress={timer.progress} color="bg-blue-500" height={4} />
                </div>
              )}

              {/* Tips */}
              <AnimatePresence>
                {showTips && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 bg-yellow-50 rounded-xl border-2 border-yellow-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb size={16} className="text-yellow-600" />
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
              <div className="flex gap-2">
                {!timer.isRunning && timer.timeRemaining === 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartTimer}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-bold"
                  >
                    <Play size={18} />
                    Iniciar timer
                  </motion.button>
                )}

                {timer.isRunning && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={timer.pause}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-yellow-500 text-white rounded-xl font-bold"
                  >
                    <Pause size={18} />
                    Pausar
                  </motion.button>
                )}

                {!timer.isRunning && timer.timeRemaining > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={timer.resume}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-bold"
                  >
                    <Play size={18} />
                    Continuar
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTips(!showTips)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold ${
                    showTips ? 'bg-yellow-200 text-yellow-800' : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  <Lightbulb size={16} />
                  {showTips ? 'Esconder dicas' : 'Ver dicas'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCompleteScene}
                  className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl text-sm font-bold"
                >
                  <Check size={16} />
                  Concluir
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion Modal */}
        <AnimatePresence>
          {showCompletion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-3xl p-8 text-center max-w-sm w-full"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Parabéns!</h2>
                <p className="text-gray-600 mb-6">
                  Completaste todas as cenas! Ganhas-te {HAIRCUT_SCENES.length} estrelas!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCompletionClose}
                  className="w-full py-3 bg-primary text-white rounded-xl font-bold"
                >
                  Continuar
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
