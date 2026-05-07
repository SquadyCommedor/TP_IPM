import { motion } from 'framer-motion';
import { Heart, Activity, AlertTriangle } from 'lucide-react';
import { useBitalino } from '../hooks/useBitalino';

interface StressMonitorProps {
  childId: string;
  onHighStress?: () => void;
  threshold?: number;
}

export default function StressMonitor({ childId, onHighStress, threshold = 70 }: StressMonitorProps) {
  const { reading, isConnected, connect, error } = useBitalino(childId);

  const stressLevel = reading?.stressIndex ?? 0;
  const isHighStress = stressLevel > threshold;

  if (isHighStress && onHighStress) {
    onHighStress();
  }

  const getStressColor = (level: number) => {
    if (level < 30) return 'text-green-500';
    if (level < 50) return 'text-yellow-500';
    if (level < 70) return 'text-orange-500';
    return 'text-red-500';
  };

  const getStressBg = (level: number) => {
    if (level < 30) return 'from-green-400 to-green-500';
    if (level < 50) return 'from-yellow-400 to-yellow-500';
    if (level < 70) return 'from-orange-400 to-orange-500';
    return 'from-red-400 to-red-500';
  };

  const getStressLabel = (level: number) => {
    if (level < 30) return 'Muito Calmo';
    if (level < 50) return 'Calmo';
    if (level < 70) return 'Ansioso';
    return 'Muito Ansioso';
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getStressBg(stressLevel)} flex items-center justify-center`}>
            <Activity size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-text">Monitor de Stress</h3>
            <p className="text-xs text-text-light">BITalino em tempo real</p>
          </div>
        </div>

        {!isConnected ? (
          <motion.button
            onClick={connect}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Ligar
          </motion.button>
        ) : (
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-2.5 h-2.5 bg-green-500 rounded-full"
            />
            <span className="text-xs text-green-600 font-semibold">Ligado</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-2 text-sm text-yellow-700">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {reading && (
        <div className="space-y-4">
          {/* Gauge de stress */}
          <div className="relative">
            <div className="flex justify-between items-end mb-2">
              <span className={`text-3xl font-black ${getStressColor(stressLevel)}`}>
                {stressLevel}%
              </span>
              <span className="text-sm font-semibold text-text-light">
                {getStressLabel(stressLevel)}
              </span>
            </div>

            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${getStressBg(stressLevel)}`}
                initial={{ width: 0 }}
                animate={{ width: `${stressLevel}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Marcadores */}
            <div className="flex justify-between mt-1 text-[10px] text-text-light">
              <span>Calmo</span>
              <span>Moderado</span>
              <span>Ansioso</span>
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
              <Heart size={18} className="text-red-400" />
              <div>
                <p className="text-xs text-text-light">Batimento</p>
                <p className="font-bold text-text">{reading.heartRate} BPM</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
              <Activity size={18} className="text-secondary" />
              <div>
                <p className="text-xs text-text-light">EDA</p>
                <p className="font-bold text-text">{reading.eda.toFixed(2)} μS</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!reading && isConnected && (
        <div className="text-center py-8 text-text-light">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="mx-auto mb-3"
          >
            <Activity size={32} className="text-primary" />
          </motion.div>
          <p className="font-semibold">A receber dados...</p>
        </div>
      )}
    </div>
  );
}
