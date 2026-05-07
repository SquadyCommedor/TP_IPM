import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, X } from 'lucide-react';

interface BreathingExerciseProps {
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export default function BreathingExercise({ isOpen, onClose, duration = 60 }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const phases: Array<'inhale' | 'hold' | 'exhale' | 'rest'> = ['inhale', 'hold', 'exhale', 'rest'];
    let currentPhase = 0;

    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          onClose();
          return 0;
        }
        return t - 1;
      });

      currentPhase = (currentPhase + 1) % 4;
      setPhase(phases[currentPhase]);
      if (currentPhase === 0) setCycleCount(c => c + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, duration, onClose]);

  const phaseConfig = {
    inhale: { text: 'Inspira...', scale: 1.5, color: 'from-secondary to-secondary-dark' },
    hold: { text: 'Segura...', scale: 1.5, color: 'from-accent to-accent-dark' },
    exhale: { text: 'Expira...', scale: 1, color: 'from-primary to-primary-dark' },
    rest: { text: 'Descansa...', scale: 1, color: 'from-blue to-secondary' },
  };

  const config = phaseConfig[phase];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <Wind className="mx-auto mb-3 text-secondary" size={32} />
              <h2 className="font-display font-bold text-2xl text-text">Exercício de Respiração</h2>
              <p className="text-text-light text-sm mt-1">Segue o círculo para te acalmares</p>
            </div>

            {/* Círculo animado */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ scale: config.scale }}
                transition={{ duration: 4, ease: 'easeInOut' }}
                className={`w-40 h-40 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center shadow-xl`}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="w-32 h-32 rounded-full border-4 border-white/30"
                />
              </motion.div>
            </div>

            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center font-bold text-xl text-text mb-4"
            >
              {config.text}
            </motion.p>

            <div className="flex justify-between text-sm text-text-light">
              <span>Ciclos: {cycleCount}</span>
              <span>{timeLeft}s restantes</span>
            </div>

            <div className="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-secondary rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: `${(timeLeft / duration) * 100}%` }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
