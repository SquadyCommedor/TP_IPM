import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, CheckCircle } from 'lucide-react';
import type { BreathingExercise } from '../types';

interface BreathingExerciseProps {
  exercise: BreathingExercise;
  onComplete: () => void;
  onCancel: () => void;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'idle';

export function BreathingExerciseView({ exercise, onComplete, onCancel }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [cycleCount, setCycleCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const targetCycles = 3;

  const runCycle = useCallback(async () => {
    // Inhale
    setPhase('inhale');
    setProgress(0);
    await animateProgress(exercise.inhaleTime);

    if (exercise.holdTime > 0) {
      setPhase('hold');
      setProgress(0);
      await animateProgress(exercise.holdTime);
    }

    // Exhale
    setPhase('exhale');
    setProgress(0);
    await animateProgress(exercise.exhaleTime);

    setCycleCount((prev) => {
      const next = prev + 1;
      if (next >= targetCycles) {
        setCompleted(true);
        setTimeout(onComplete, 1500);
      } else {
        runCycle();
      }
      return next;
    });
  }, [exercise, onComplete]);

  const animateProgress = (duration: number): Promise<void> => {
    return new Promise((resolve) => {
      const start = Date.now();
      const interval = setInterval(() => {
        const elapsed = (Date.now() - start) / 1000;
        const pct = Math.min(100, (elapsed / duration) * 100);
        setProgress(pct);
        if (pct >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => runCycle(), 500);
    return () => clearTimeout(timer);
  }, []);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Inspira...';
      case 'hold': return 'Segura...';
      case 'exhale': return 'Expira...';
      default: return 'Prepara-te';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'bg-accent';
      case 'hold': return 'bg-secondary';
      case 'exhale': return 'bg-primary';
      default: return 'bg-gray-300';
    }
  };

  const getVisualScale = () => {
    switch (phase) {
      case 'inhale': return 1.5;
      case 'hold': return 1.5;
      case 'exhale': return 0.6;
      default: return 0.8;
    }
  };

  const renderVisual = () => {
    const commonProps = {
      animate: { scale: getVisualScale() },
      transition: { 
        duration: phase === 'idle' ? 0.5 : 
          phase === 'inhale' ? exercise.inhaleTime :
          phase === 'hold' ? 0.3 :
          exercise.exhaleTime,
        ease: 'easeInOut'
      }
    };

    switch (exercise.visual) {
      case 'balloon':
        return (
          <motion.div {...commonProps} className="w-32 h-40 mx-auto">
            <div 
              className="w-full h-full rounded-full border-4 border-dashed"
              style={{ 
                backgroundColor: exercise.color + '40',
                borderColor: exercise.color,
                boxShadow: `0 0 40px ${exercise.color}40`
              }}
            >
              <div className="flex items-center justify-center h-full">
                <span className="text-4xl">🎈</span>
              </div>
            </div>
            <div className="w-1 h-8 bg-gray-400 mx-auto" />
          </motion.div>
        );
      case 'candle':
        return (
          <motion.div {...commonProps} className="w-24 h-32 mx-auto relative">
            <div className="absolute bottom-0 w-full h-20 bg-amber-100 rounded-lg border-2 border-amber-300" />
            <motion.div 
              className="absolute -top-4 left-1/2 -translate-x-1/2"
              animate={{ 
                scaleY: phase === 'exhale' ? 0.3 : 1,
                opacity: phase === 'exhale' ? 0.3 : 1
              }}
              transition={{ duration: exercise.exhaleTime }}
            >
              <div 
                className="w-6 h-10 rounded-full"
                style={{ 
                  background: `linear-gradient(to top, ${exercise.color}, #FFD700)`,
                  filter: 'blur(2px)'
                }}
              />
            </motion.div>
          </motion.div>
        );
      case 'flower':
        return (
          <motion.div {...commonProps} className="w-32 h-32 mx-auto relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl">🌸</span>
            </div>
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: exercise.color + '20' }}
              animate={{ scale: getVisualScale() * 1.2, opacity: 0 }}
              transition={{ duration: phase === 'inhale' ? exercise.inhaleTime : exercise.exhaleTime, repeat: Infinity }}
            />
          </motion.div>
        );
      case 'star':
        return (
          <motion.div {...commonProps} className="w-32 h-32 mx-auto">
            <div className="flex items-center justify-center h-full">
              <motion.div
                animate={{ rotate: phase === 'inhale' ? 360 : 0 }}
                transition={{ duration: exercise.inhaleTime }}
              >
                <span className="text-7xl">⭐</span>
              </motion.div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
      >
        <AnimatePresence mode="wait">
          {completed ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Muito bem!</h3>
              <p className="text-gray-600">Já estás mais calmo. Vamos continuar?</p>
            </motion.div>
          ) : (
            <motion.div key="exercising" className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Wind className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-gray-800">{exercise.name}</h3>
              </div>

              <p className="text-sm text-gray-500 mb-6">{exercise.description}</p>

              <div className="mb-8">
                {renderVisual()}
              </div>

              <div className="mb-4">
                <motion.span 
                  key={phase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-primary"
                >
                  {getPhaseText()}
                </motion.span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                <motion.div 
                  className={`h-full ${getPhaseColor()}`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: targetCycles }).map((_, i) => (
                  <div 
                    key={i}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i < cycleCount ? 'bg-accent' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={onCancel}
                className="text-sm text-gray-400 hover:text-gray-600 underline"
              >
                Saltar exercício
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
