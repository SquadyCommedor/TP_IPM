import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, AlertTriangle } from 'lucide-react';
import { useBitalino } from '../hooks/useBitalino';
import { STRESS_THRESHOLD, STRESS_WARNING } from '../data';

interface StressMonitorProps {
  onHighStress?: () => void;
  onWarning?: () => void;
}

export function StressMonitor({ onHighStress, onWarning }: StressMonitorProps) {
  const { connected, heartRate, stressLevel, isHighStress, isWarning } = useBitalino();

  useEffect(() => {
    if (isHighStress && onHighStress) {
      onHighStress();
    } else if (isWarning && onWarning) {
      onWarning();
    }
  }, [isHighStress, isWarning, onHighStress, onWarning]);

  const getStressColor = () => {
    if (stressLevel >= STRESS_THRESHOLD) return 'text-red-500';
    if (stressLevel >= STRESS_WARNING) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStressBg = () => {
    if (stressLevel >= STRESS_THRESHOLD) return 'bg-red-100 border-red-300';
    if (stressLevel >= STRESS_WARNING) return 'bg-yellow-100 border-yellow-300';
    return 'bg-green-100 border-green-300';
  };

  return (
    <div className={`p-4 rounded-2xl border-2 ${getStressBg()} transition-colors`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className={getStressColor()} size={20} />
          <span className="font-bold text-gray-800">Monitor de Stress</span>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
          connected ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-500'
        }`}>
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          {connected ? 'Ligado' : 'Desligado'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Heart className="text-red-400" size={16} />
            <span className="text-2xl font-bold text-gray-800">{heartRate}</span>
          </div>
          <p className="text-xs text-gray-500">BPM</p>
        </div>

        <div className="text-center">
          <motion.div
            animate={{ scale: stressLevel > STRESS_WARNING ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 1, repeat: stressLevel > STRESS_WARNING ? Infinity : 0 }}
          >
            <span className={`text-2xl font-bold ${getStressColor()}`}>{stressLevel}%</span>
          </motion.div>
          <p className="text-xs text-gray-500">Stress</p>
        </div>
      </div>

      {isHighStress && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center gap-2 p-2 bg-red-200 rounded-xl"
        >
          <AlertTriangle className="text-red-600" size={16} />
          <span className="text-sm font-bold text-red-700">Stress elevado! Vamos respirar juntos?</span>
        </motion.div>
      )}

      {isWarning && !isHighStress && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center gap-2 p-2 bg-yellow-200 rounded-xl"
        >
          <AlertTriangle className="text-yellow-600" size={16} />
          <span className="text-sm font-bold text-yellow-700">Atenção: stress a aumentar</span>
        </motion.div>
      )}
    </div>
  );
}
