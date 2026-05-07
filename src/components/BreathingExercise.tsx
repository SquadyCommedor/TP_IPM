import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, X, Heart } from 'lucide-react';

interface BreathingExerciseProps {
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export default function BreathingExercise({ isOpen, onClose, duration = 60 }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const phases: Array<'inhale' | 'hold' | 'exhale'> = ['inhale', 'hold', 'exhale'];
    let currentPhase = 0;

    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          onClose();
          return 0;
        }
        return t - 1;
      });

      currentPhase = (currentPhase + 1) % 3;
      setPhase(phases[currentPhase]);
      if (currentPhase === 0) setCycleCount(c => c + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, duration, onClose]);

  const phaseConfig = {
    inhale: { 
      text: 'Inspira pelo nariz...', 
      subtext: 'O ar entra devagar',
      scale: 1.6, 
      color: 'from-sky-300 to-sky-400',
      emoji: '🌬️'
    },
    hold: { 
      text: 'Segura...', 
      subtext: 'Conta até 4',
      scale: 1.6, 
      color: 'from-mint-300 to-mint-400',
      emoji: '✋'
    },
    exhale: { 
      text: 'Expira pela boca...', 
      subtext: 'Como se soprasse uma vela',
      scale: 1, 
      color: 'from-lavender-300 to-lavender-400',
      emoji: '🎈'
    },
  };

  const config = phaseConfig[phase];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-sky-900/40 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative border-4 border-sky-100"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center hover:bg-sky-100 transition-colors"
            >
              <X size={20} className="text-sky-400" />
            </button>

            <div className="text-center mb-6">
              <div className="text-4xl mb-2">{config.emoji}</div>
              <h2 className="font-comic font-bold text-2xl text-text">Respira Comigo</h2>
              <p className="text-text-light text-sm font-comic mt-1">Vamos acalmar juntos</p>
            </div>

            {/* Círculo animado - visual simples */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ scale: config.scale }}
                transition={{ duration: 4, ease: 'easeInOut' }}
                className={`w-48 h-48 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center shadow-kid-lg`}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  className="w-40 h-40 rounded-full border-4 border-white/30 flex items-center justify-center"
                >
                  <Heart size={40} className="text-white/80" />
                </motion.div>
              </motion.div>
            </div>

            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center font-comic font-bold text-xl text-text mb-1"
            >
              {config.text}
            </motion.p>
            <motion.p
              key={phase + 'sub'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-text-light font-comic mb-4"
            >
              {config.subtext}
            </motion.p>

            <div className="flex justify-between text-sm text-text-light font-comic">
              <span>Ciclos: {cycleCount}</span>
              <span>{timeLeft}s</span>
            </div>

            <div className="mt-4 h-3 bg-sky-50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-mint-400 rounded-full"
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
