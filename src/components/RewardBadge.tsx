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
    <div className="flex flex-col items-center">
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`${sizeClasses[size]} ${config.bg} ${config.border} border-2 rounded-full flex items-center justify-center`}
      >
        <Icon className={config.color} size={size === 'lg' ? 32 : size === 'md' ? 24 : 16} />
      </motion.div>
      {showDetails && (
        <div className="text-center mt-2">
          <p className="font-bold text-sm">{reward.title}</p>
          <p className="text-xs text-gray-500">{reward.description}</p>
        </div>
      )}
    </div>
  );
}
