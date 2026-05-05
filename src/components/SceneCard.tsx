import { motion } from 'framer-motion';
import { Clock, Volume2, Lightbulb, CheckCircle, Circle } from 'lucide-react';
import type { Scene } from '../types';
import { useStore } from '../store';

interface SceneCardProps {
  scene: Scene;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

export function SceneCard({ scene, index, isActive, isCompleted, onClick }: SceneCardProps) {
  const completedScenes = useStore((s) => s.user?.childProfile?.completedScenes || []);

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
        isActive 
          ? 'border-primary bg-primary/5 shadow-lg' 
          : isCompleted
            ? 'border-accent/50 bg-accent/5'
            : 'border-gray-200 bg-white hover:border-primary/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
          isActive ? 'bg-primary text-white' : isCompleted ? 'bg-accent text-white' : 'bg-gray-100 text-gray-500'
        }`}>
          {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 text-sm mb-1">{scene.title}</h3>
          <p className="text-xs text-gray-500 line-clamp-2 mb-2">{scene.description}</p>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {Math.floor(scene.duration / 60)}:{(scene.duration % 60).toString().padStart(2, '0')}
            </span>
            <span className="flex items-center gap-1">
              <Volume2 className="w-3 h-3" />
              {scene.sounds.length}
            </span>
            <span className="flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              {scene.tips.length}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0">
          {isCompleted ? (
            <CheckCircle className="w-5 h-5 text-accent" />
          ) : (
            <Circle className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-300'}`} />
          )}
        </div>
      </div>
    </motion.button>
  );
}
