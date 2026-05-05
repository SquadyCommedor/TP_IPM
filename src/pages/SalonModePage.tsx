import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Play, Pause, SkipForward, Heart, AlertTriangle,
  Wind, CheckCircle, Star, Trophy, Volume2, VolumeX,
  Scissors, Home, Timer
} from 'lucide-react';
import { useStore } from '../store';
import { HAIRCUT_SCENES, BREATHING_EXERCISES, STRESS_THRESHOLD } from '../data';
import { useBitalino } from '../hooks/useBitalino';
import { useTimer } from '../hooks/useTimer';
import { StressMonitor } from '../components/StressMonitor';
import { BreathingExerciseView } from '../components/BreathingExercise';
import { ProgressBar } from '../components/ProgressBar';
import { CharacterAvatar } from '../components/CharacterAvatar';
import confetti from 'canvas-confetti';
import type { VisitLog } from '../types';

export default function SalonModePage() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const updateGameState = useStore((s) => s.updateGameState);
  const addStars = useStore((s) => s.addStars);
  const addVisitLog = useStore((s) => s.addVisitLog);
  const updateChildProfile = useStore((s) => s.updateChildProfile);

  const bitalino = useBitalino();
  const timer = useTimer();

  const [currentScene, setCurrentScene] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathingExercise, setBreathingExercise] = useState(BREATHING_EXERCISES[0]);
  const [visitStartTime, setVisitStartTime] = useState<number | null>(null);
  const [maxStress, setMaxStress] = useState(0);
  const [pauseCount, setPauseCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showDiploma, setShowDiploma] = useState(false);

  // Auto-pause on high stress
  useEffect(() => {
    if (bitalino.isHighStress && isStarted && !isPaused && !showBreathing) {
      handlePause();
      setBreathingExercise(BREATHING_EXERCISES[Math.floor(Math.random() * BREATHING_EXERCISES.length)]);
      setShowBreathing(true);
      setPauseCount((prev) => prev + 1);
    }
  }, [bitalino.isHighStress, isStarted, isPaused, showBreathing]);

  // Track max stress
  useEffect(() => {
    if (bitalino.stressLevel > maxStress) {
      setMaxStress(bitalino.stressLevel);
    }
  }, [bitalino.stressLevel, maxStress]);

  const handleStart = () => {
    setIsStarted(true);
    setVisitStartTime(Date.now());
    timer.start(HAIRCUT_SCENES[0].duration);
    bitalino.connect();
    updateGameState({ mode: 'salon', currentScene: 0 });
  };

  const handlePause = () => {
    setIsPaused(true);
    timer.pause();
    updateGameState({ isPaused: true });
  };

  const handleResume = () => {
    setIsPaused(false);
    timer.resume();
    updateGameState({ isPaused: false });
  };

  const handleNextScene = () => {
    if (currentScene < HAIRCUT_SCENES.length - 1) {
      const nextScene = currentScene + 1;
      setCurrentScene(nextScene);
      timer.start(HAIRCUT_SCENES[nextScene].duration);
      updateGameState({ currentScene: nextScene });
    } else {
      handleComplete();
    }
  };

  const handleComplete = useCallback(() => {
    timer.stop();
    bitalino.disconnect();
    setShowCompletion(true);

    // Calculate rewards
    const duration = visitStartTime ? Math.floor((Date.now() - visitStartTime) / 1000) : 0;
    const starsEarned = Math.min(5, Math.max(1, 5 - pauseCount));

    addStars(starsEarned);

    // Update profile
    const newVisits = (user?.childProfile?.completedVisits || 0) + 1;
    const newDiploma = newVisits >= 3;
    updateChildProfile({ 
      completedVisits: newVisits,
      diplomaEarned: newDiploma
    });

    // Log visit
    const log: VisitLog = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      duration,
      maxStress,
      avgStress: bitalino.stressLevel,
      pauses: pauseCount,
      completed: true,
      notes: '',
    };
    addVisitLog(log);

    // Confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#4F46E5', '#EC4899']
    });

    if (newDiploma) {
      setTimeout(() => {
        setShowDiploma(true);
        confetti({
          particleCount: 300,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#FFD700', '#FFA500', '#FF6347', '#4169E1']
        });
      }, 1500);
    }
  }, [timer, bitalino, visitStartTime, pauseCount, maxStress, user, addStars, updateChildProfile, addVisitLog]);

  const handleBreathingComplete = () => {
    setShowBreathing(false);
    handleResume();
  };

  const handleManualBreathing = () => {
    handlePause();
    setBreathingExercise(BREATHING_EXERCISES[Math.floor(Math.random() * BREATHING_EXERCISES.length)]);
    setShowBreathing(true);
    setPauseCount((prev) => prev + 1);
  };

  const scene = HAIRCUT_SCENES[currentScene];
  const totalProgress = ((currentScene) / HAIRCUT_SCENES.length) * 100 + 
    (timer.progress / HAIRCUT_SCENES.length);

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-kid-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center border-2 border-primary/20 shadow-xl"
        >
          <div className="mb-6">
            <CharacterAvatar 
              skin={user?.childProfile?.characterSkin || 'neutral1'}
              hairColor={user?.childProfile?.hairColor || 'brown'}
              size="xl"
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
            Modo Salão
          </h1>
          <p className="text-gray-500 mb-6">
            Estás no cabeleireiro! Vou acompanhar-te em cada passo.
          </p>

          <div className="space-y-3 mb-6 text-left bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Heart className="w-4 h-4 text-danger" />
              <span>A pulseira monitoriza o teu stress</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Wind className="w-4 h-4 text-accent" />
              <span>Se sentires ansiedade, faço uma pausa</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Ganhas estrelas ao completar cada cena</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-gray-600" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/30"
          >
            Começar Visita
          </motion.button>

          <button
            onClick={() => navigate('/child')}
            className="mt-4 text-sm text-gray-400 hover:text-gray-600"
          >
            Voltar ao menu
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kid-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={() => { 
                bitalino.disconnect(); 
                timer.stop(); 
                navigate('/child'); 
              }}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs">Sair</span>
            </button>

            <div className="flex items-center gap-3">
              <StressMonitor compact />
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-lg hover:bg-gray-100"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-gray-500" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>

          <ProgressBar progress={totalProgress} color="bg-primary" height={6} />

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Cena {currentScene + 1} de {HAIRCUT_SCENES.length}</span>
            <span>{Math.round(totalProgress)}%</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">
        {/* Scene Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-3xl border-2 border-primary/20 overflow-hidden shadow-lg mb-4"
          >
            {/* Scene Visual */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-6 text-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-3"
              >
                {scene.icon === 'DoorOpen' && '🚪'}
                {scene.icon === 'Shirt' && '🦸'}
                {scene.icon === 'Droplets' && '🚿'}
                {scene.icon === 'Scissors' && '✂️'}
                {scene.icon === 'Wind' && '💨'}
                {scene.icon === 'Sparkles' && '✨'}
                {scene.icon === 'Mirror' && '🪞'}
              </motion.div>
              <h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-family-display)' }}>
                {scene.title}
              </h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4 text-center">
                {scene.description}
              </p>

              {/* Timer Display */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <Timer className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold text-primary">
                  {Math.floor(timer.timeRemaining / 60)}:{(timer.timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <ProgressBar progress={timer.progress} color="bg-primary" height={8} showPercentage />

              {/* Tips */}
              <div className="mt-4 bg-yellow-50 rounded-xl p-3 border border-yellow-200">
                <p className="text-xs font-bold text-yellow-800 mb-1">💡 Dica:</p>
                <p className="text-xs text-yellow-700">{scene.tips[0]}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex gap-2 mb-4">
          {isPaused ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResume}
              className="flex-1 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Continuar
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePause}
              className="flex-1 py-3 bg-secondary text-white rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Pause className="w-5 h-5" />
              Pausar
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleManualBreathing}
            className="px-4 py-3 bg-accent/10 text-accent border-2 border-accent/30 rounded-xl font-bold flex items-center gap-2"
          >
            <Wind className="w-5 h-5" />
            Respirar
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextScene}
            className="px-4 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2"
          >
            <SkipForward className="w-5 h-5" />
            {currentScene < HAIRCUT_SCENES.length - 1 ? 'Próxima' : 'Terminar'}
          </motion.button>
        </div>

        {/* Stress Monitor Full */}
        <StressMonitor />
      </main>

      {/* Breathing Exercise Modal */}
      <AnimatePresence>
        {showBreathing && (
          <BreathingExerciseView
            exercise={breathingExercise}
            onComplete={handleBreathingComplete}
            onCancel={() => { setShowBreathing(false); handleResume(); }}
          />
        )}
      </AnimatePresence>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                Visita Concluída!
              </h2>
              <p className="text-gray-500 mb-6">Fizeste um trabalho fantástico no cabeleireiro!</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-yellow-700">+{Math.min(5, Math.max(1, 5 - pauseCount))}</p>
                  <p className="text-xs text-yellow-600">Estrelas</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                  <Heart className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-blue-700">{maxStress}%</p>
                  <p className="text-xs text-blue-600">Stress máx.</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
                  <Pause className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-purple-700">{pauseCount}</p>
                  <p className="text-xs text-purple-600">Pausas</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                  <Timer className="w-6 h-6 text-green-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-green-700">
                    {visitStartTime ? Math.floor((Date.now() - visitStartTime) / 60 / 1000) : 0}m
                  </p>
                  <p className="text-xs text-green-600">Duração</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/child')}
                className="w-full py-3 bg-primary text-white rounded-xl font-bold"
              >
                Voltar ao Menu
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diploma Modal */}
      <AnimatePresence>
        {showDiploma && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.3, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-8 max-w-md w-full text-center border-4 border-yellow-400 shadow-2xl"
            >
              <Trophy className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-yellow-800 mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                Diploma Oficial
              </h2>
              <p className="text-yellow-700 mb-4">do Cabeleireiro Corajoso</p>

              <div className="bg-white/80 rounded-2xl p-6 mb-6 border-2 border-yellow-300">
                <p className="text-sm text-gray-600 mb-2">É concedido a</p>
                <p className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                  {user?.childProfile?.nickname || user?.name}
                </p>
                <p className="text-sm text-gray-500">
                  por completar {user?.childProfile?.completedVisits || 1} visitas ao cabeleireiro
                </p>
                <p className="text-xs text-gray-400 mt-4">
                  {new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDiploma(false)}
                className="px-8 py-3 bg-yellow-500 text-white rounded-xl font-bold shadow-lg"
              >
                Guardar Diploma ⭐
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
