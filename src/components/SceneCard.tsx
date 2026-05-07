import { motion } from 'framer-motion';
import type { Scene } from '../types';

interface SceneCardProps {
  scene: Scene;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

export function SceneCard({ scene, isActive, isCompleted, onClick }: SceneCardProps) {
  const getIcon = () => {
    switch (scene.icon) {
      case 'DoorOpen': return '🚪';
      case 'Shirt': return '🦸';
      case 'Droplets': return '💧';
      case 'Scissors': return '✂️';
      case 'Wind': return '💨';
      case 'Sparkles': return '✨';
      case 'Mirror': return '🪞';
      default: return '⭐';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full p-4 rounded-2xl border-2 text-left transition-colors ${
        isActive 
          ? 'border-primary bg-primary/5' 
          : isCompleted 
            ? 'border-green-300 bg-green-50' 
            : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{getIcon()}</span>
        <div className="flex-1">
          <h3 className={`font-bold ${isCompleted ? 'text-green-700' : 'text-gray-800'}`}>
            {scene.title}
            {isCompleted && <span className="ml-2 text-green-500">✓</span>}
          </h3>
          <p className="text-sm text-gray-500">{Math.floor(scene.duration / 60)} min</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${
          isActive ? 'bg-primary' : isCompleted ? 'bg-green-400' : 'bg-gray-300'
        }`} />
      </div>
    </motion.button>
  );
}
