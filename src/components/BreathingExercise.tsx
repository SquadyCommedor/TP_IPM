import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { BreathingExercise as BreathingExerciseType } from '../types';

interface BreathingExerciseProps {
  exercise: BreathingExerciseType;
  onComplete: () => void;
}

export function BreathingExercise({ exercise, onComplete }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
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
          <motion.div {...commonProps} className="w-32 h-40 rounded-full bg-yellow-400 border-4 border-yellow-500" />
        );
      case 'candle':
        return (
          <div className="flex flex-col items-center">
            <motion.div {...commonProps} className="w-4 h-12 bg-orange-400 rounded-t-full" />
            <div className="w-8 h-12 bg-red-200 rounded-sm mt-1" />
          </div>
        );
      case 'flower':
        return (
          <motion.div {...commonProps} className="text-6xl">
            🌸
          </motion.div>
        );
      case 'star':
        return (
          <motion.div {...commonProps} className="text-6xl">
            ⭐
          </motion.div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {completed ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-green-600">Muito bem!</h3>
          <p className="text-gray-600 mt-2">Já estás mais calmo. Vamos continuar?</p>
        </motion.div>
      ) : (
        <>
          <h3 className="text-xl font-bold">{exercise.name}</h3>
          <p className="text-sm text-gray-600 text-center">{exercise.description}</p>

          <div className="h-40 flex items-center justify-center">
            {renderVisual()}
          </div>

          <div className="w-full max-w-xs">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${getPhaseColor()}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center mt-2 font-medium">{getPhaseText()}</p>
          </div>

          <div className="flex gap-2">
            {Array.from({ length: targetCycles }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < cycleCount ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
