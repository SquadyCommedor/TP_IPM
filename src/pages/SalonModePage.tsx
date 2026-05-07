import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Square, Award } from 'lucide-react';
import { useStore } from '../store';
import { useTimer } from '../hooks/useTimer';
import { useBitalino } from '../hooks/useBitalino';
import { HAIRCUT_SCENES } from '../data';
import { StressMonitor } from '../components/StressMonitor';
import { BreathingExercise } from '../components/BreathingExercise';
import { SceneCard } from '../components/SceneCard';
import { ProgressBar } from '../components/ProgressBar';
import type { VisitLog } from '../types';

export default function SalonModePage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const addVisitLog = useStore((s) => s.addVisitLog);
  const updateChildProfile = useStore((s) => s.updateChildProfile);
  const addStars = useStore((s) => s.addStars);

  const [activeScene, setActiveScene] = useState<number | null>(null);
  const [completedScenes, setCompletedScenes] = useState<string[]>([]);
  const [showBreathing, setShowBreathing] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [visitStartTime, setVisitStartTime] = useState<number | null>(null);
  const [stressReadings, setStressReadings] = useState<number[]>([]);
  const [pauseCount, setPauseCount] = useState(0);

  const timer = useTimer();
  const bitalino = useBitalino();

  useEffect(() => {
    // Start visit tracking
    setVisitStartTime(Date.now());

    return () => {
      // Cleanup
      if (bitalino.connected) {
        bitalino.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Track stress readings
    if (bitalino.connected && bitalino.stressLevel > 0) {
      setStressReadings(prev => [...prev, bitalino.stressLevel]);
    }
  }, [bitalino.stressLevel, bitalino.connected]);

  const handleSceneClick = (index: number) => {
    if (activeScene === index) return;
    setActiveScene(index);
    timer.stop();
  };

  const handleStartTimer = () => {
    if (activeScene === null) return;
    timer.start(HAIRCUT_SCENES[activeScene].duration);

    // Connect BITalino if not connected
    if (!bitalino.connected) {
      bitalino.connect();
    }
  };

  const handlePause = () => {
    timer.pause();
    setPauseCount(prev => prev + 1);
  };

  const handleCompleteScene = () => {
    if (activeScene === null) return;

    const sceneId = HAIRCUT_SCENES[activeScene].id;

    if (!completedScenes.includes(sceneId)) {
      setCompletedScenes(prev => [...prev, sceneId]);
    }

    timer.stop();

    // Check if all scenes completed
    if (completedScenes.length + 1 >= HAIRCUT_SCENES.length) {
      handleCompleteVisit();
    } else {
      if (activeScene < HAIRCUT_SCENES.length - 1) {
        setActiveScene(activeScene + 1);
      }
    }
  };

  const handleCompleteVisit = async () => {
    if (!visitStartTime) return;

    const duration = Math.floor((Date.now() - visitStartTime) / 1000);
    const maxStress = stressReadings.length > 0 ? Math.max(...stressReadings) : 0;
    const avgStress = stressReadings.length > 0 
      ? Math.round(stressReadings.reduce((a, b) => a + b, 0) / stressReadings.length) 
      : 0;

    const visitLog: VisitLog = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      duration,
      maxStress,
      avgStress,
      pauses: pauseCount,
      completed: true,
      notes: `Visita ao cabeleireiro - ${completedScenes.length + 1} cenas completadas`,
    };

    // Save to Supabase
    await addVisitLog(visitLog);

    // Update profile
    const newVisits = (user?.childProfile?.completedVisits || 0) + 1;
    await updateChildProfile({
      completedVisits: newVisits,
      diplomaEarned: newVisits >= 3,
    });

    // Add stars
    await addStars(HAIRCUT_SCENES.length);

    // Disconnect BITalino
    bitalino.disconnect();

    setShowCompletion(true);
  };

  const handleHighStress = useCallback(() => {
    setShowBreathing(true);
    timer.pause();
  }, [timer]);

  const handleBreathingComplete = () => {
    setShowBreathing(false);
    timer.resume();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => {
              bitalino.disconnect();
              navigate('/child');
            }}
            className="p-2 bg-white rounded-xl border-2 border-gray-200 hover:border-primary transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Modo Salão</h1>
            <p className="text-sm text-gray-500">Visita real ao cabeleireiro</p>
          </div>
        </div>

        {/* Stress Monitor */}
        <div className="mb-4">
          <StressMonitor onHighStress={handleHighStress} />
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso da visita</span>
            <span>{completedScenes.length}/{HAIRCUT_SCENES.length} cenas</span>
          </div>
          <ProgressBar 
            progress={(completedScenes.length / HAIRCUT_SCENES.length) * 100} 
            color="bg-secondary"
          />
        </div>

        {/* Scene List */}
        <div className="space-y-2 mb-4">
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

        {/* Active Scene Actions */}
        <AnimatePresence>
          {activeScene !== null && !showBreathing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-4 border-2 border-gray-100"
            >
              <h3 className="font-bold text-gray-800 mb-3">
                {HAIRCUT_SCENES[activeScene].title}
              </h3>

              {timer.isRunning && (
                <div className="mb-3 p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Tempo restante</span>
                    <span className="text-lg font-bold text-secondary">
                      {Math.floor(timer.timeRemaining / 60)}:{(timer.timeRemaining % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <ProgressBar progress={timer.progress} color="bg-secondary" height={4} />
                </div>
              )}

              <div className="flex gap-2">
                {!timer.isRunning && timer.timeRemaining === 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartTimer}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-secondary text-white rounded-xl font-bold"
                  >
                    <Play size={18} />
                    Iniciar
                  </motion.button>
                )}

                {timer.isRunning && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePause}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-yellow-500 text-white rounded-xl font-bold"
                  >
                    <Square size={18} />
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
                  onClick={handleCompleteScene}
                  className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl text-sm font-bold"
                >
                  <Award size={16} />
                  Concluir
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Breathing Exercise Modal */}
        <AnimatePresence>
          {showBreathing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full"
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Vamos respirar juntos?</h3>
                  <p className="text-sm text-gray-500">O teu stress está um pouco alto</p>
                </div>
                <BreathingExercise
                  exercise={{
                    id: 'balloon',
                    name: 'Encher o Balão',
                    description: 'Imagina que estás a encher um balão colorido',
                    inhaleTime: 4,
                    holdTime: 2,
                    exhaleTime: 6,
                    visual: 'balloon',
                    color: '#F59E0B'
                  }}
                  onComplete={handleBreathingComplete}
                />
              </motion.div>
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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Visita Completa!</h2>
                <p className="text-gray-600 mb-2">
                  Parabéns por completares a visita ao cabeleireiro!
                </p>
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Estatísticas:</strong><br/>
                    Duração: {visitStartTime ? Math.floor((Date.now() - visitStartTime) / 60000) : 0} min<br/>
                    Stress máximo: {stressReadings.length > 0 ? Math.max(...stressReadings) : 0}%<br/>
                    Pausas: {pauseCount}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/child')}
                  className="w-full py-3 bg-primary text-white rounded-xl font-bold"
                >
                  Voltar ao Dashboard
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
