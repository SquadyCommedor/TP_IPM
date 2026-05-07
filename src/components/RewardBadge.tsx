import { motion } from 'framer-motion';
import { Star, Award, Trophy, Medal } from 'lucide-react';

interface RewardBadgeProps {
  type: 'star' | 'award' | 'trophy' | 'medal';
  label: string;
  count?: number;
  isNew?: boolean;
  index?: number;
}

const iconMap = {
  star: Star,
  award: Award,
  trophy: Trophy,
  medal: Medal,
};

const colorMap = {
  star: 'from-yellow-400 to-orange-400 text-yellow-500',
  award: 'from-pink-400 to-purple-400 text-pink-500',
  trophy: 'from-yellow-300 to-yellow-500 text-yellow-600',
  medal: 'from-blue-400 to-secondary text-blue-500',
};

export default function RewardBadge({ type, label, count, isNew, index = 0 }: RewardBadgeProps) {
  const Icon = iconMap[type];
  const colors = colorMap[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay: index * 0.1, type: 'spring' }}
      className={`relative flex flex-col items-center gap-1 p-3 rounded-2xl bg-gradient-to-br ${colors.split(' ').slice(0, 2).join(' ')} bg-opacity-10`}
    >
      <motion.div
        animate={isNew ? { rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5 }}
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.split(' ').slice(0, 2).join(' ')} flex items-center justify-center shadow-lg`}
      >
        <Icon size={24} className="text-white" />
      </motion.div>
      <span className="text-xs font-bold text-text text-center">{label}</span>
      {count !== undefined && (
        <span className="text-[10px] bg-white/80 px-2 py-0.5 rounded-full font-bold text-text">
          x{count}
        </span>
      )}
      {isNew && (
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full"
        >
          NOVO
        </motion.span>
      )}
    </motion.div>
  );
}
