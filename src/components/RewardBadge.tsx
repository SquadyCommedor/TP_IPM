import { motion } from 'framer-motion';
import { Star, Award, Sparkles } from 'lucide-react';
import type { Reward } from '../types';

interface RewardBadgeProps {
  reward: Reward;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const typeConfig = {
  star: { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100', border: 'border-yellow-300' },
  character: { icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-100', border: 'border-purple-300' },
  diploma: { icon: Award, color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-300' },
};

export function RewardBadge({ reward, size = 'md', showDetails = false }: RewardBadgeProps) {
  const config = typeConfig[reward.type];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className={`${showDetails ? 'flex flex-col items-center gap-2' : ''}`}
    >
      <div className={`${sizeClasses[size]} ${config.bg} ${config.border} border-2 rounded-full flex items-center justify-center shadow-lg`}>
        <Icon className={`${size === 'lg' ? 'w-10 h-10' : size === 'md' ? 'w-6 h-6' : 'w-4 h-4'} ${config.color}`} />
      </div>
      {showDetails && (
        <div className="text-center">
          <p className="font-bold text-gray-800 text-sm">{reward.title}</p>
          <p className="text-xs text-gray-500">{reward.description}</p>
        </div>
      )}
    </motion.div>
  );
}
