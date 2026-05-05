import { motion, AnimatePresence } from 'framer-motion';
import { Heart, AlertTriangle, Activity, Bluetooth } from 'lucide-react';
import { useBitalino } from '../hooks/useBitalino';

interface StressMonitorProps {
  compact?: boolean;
}

export function StressMonitor({ compact = false }: StressMonitorProps) {
  const { connected, heartRate, stressLevel, isHighStress, isWarning, connect, disconnect } = useBitalino();

  const getColor = () => {
    if (isHighStress) return 'text-danger';
    if (isWarning) return 'text-secondary';
    return 'text-accent';
  };

  const getBgColor = () => {
    if (isHighStress) return 'bg-danger/10 border-danger/30';
    if (isWarning) return 'bg-secondary/10 border-secondary/30';
    return 'bg-accent/10 border-accent/30';
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getBgColor()}`}>
        {connected ? (
          <>
            <Heart className={`w-4 h-4 ${getColor()} animate-pulse`} />
            <span className={`text-sm font-bold ${getColor()}`}>{heartRate} bpm</span>
            <div className={`w-2 h-2 rounded-full ${isHighStress ? 'bg-danger' : isWarning ? 'bg-secondary' : 'bg-accent'}`} />
          </>
        ) : (
          <button onClick={connect} className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark">
            <Bluetooth className="w-4 h-4" />
            <span>Ligar pulseira</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border-2 p-4 ${getBgColor()}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className={`w-5 h-5 ${getColor()}`} />
          <span className="font-bold text-gray-700">Monitor de Stress</span>
        </div>
        <button
          onClick={connected ? disconnect : connect}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            connected 
              ? 'bg-accent text-white hover:bg-accent/80' 
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          <Bluetooth className="w-3 h-3" />
          {connected ? 'Ligado' : 'Ligar BITalino'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {connected ? (
          <motion.div
            key="connected"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Heart className={`w-5 h-5 ${getColor()} ${heartRate > 100 ? 'animate-pulse' : ''}`} />
                <span className="text-2xl font-bold text-gray-800">{heartRate}</span>
                <span className="text-sm text-gray-500">bpm</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Stress</span>
                  <span className={`font-bold ${getColor()}`}>{stressLevel}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      isHighStress ? 'bg-danger' : isWarning ? 'bg-secondary' : 'bg-accent'
                    }`}
                    animate={{ width: `${stressLevel}%` }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {isHighStress && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2 p-3 bg-danger/20 rounded-xl border border-danger/30"
                >
                  <AlertTriangle className="w-5 h-5 text-danger" />
                  <span className="text-sm font-bold text-danger">
                    Stress elevado detetado! A ativar exercício de respiração...
                  </span>
                </motion.div>
              )}
              {isWarning && !isHighStress && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2 p-3 bg-secondary/20 rounded-xl border border-secondary/30"
                >
                  <AlertTriangle className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-medium text-secondary">
                    Atenção: stress a aumentar
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-4 text-gray-500"
          >
            <Bluetooth className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Pulseira BITalino não ligada</p>
            <p className="text-xs mt-1">Liga para monitorizar o stress em tempo real</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
