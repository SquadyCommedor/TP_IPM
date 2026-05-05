import { motion } from 'framer-motion';
import type { CharacterSkin, HairColor } from '../types';
import { HAIR_COLORS } from '../data';

interface CharacterAvatarProps {
  skin: CharacterSkin;
  hairColor: HairColor;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
}

const skinEmojis: Record<CharacterSkin, string> = {
  boy1: '👦',
  boy2: '🧒',
  girl1: '👧',
  girl2: '🧒',
  neutral1: '🙂',
  neutral2: '🤗',
};

const sizeClasses = {
  sm: 'text-4xl',
  md: 'text-6xl',
  lg: 'text-8xl',
  xl: 'text-9xl',
};

export function CharacterAvatar({ skin, hairColor, size = 'md', animate = true, className = '' }: CharacterAvatarProps) {
  const hairColorObj = HAIR_COLORS.find(h => h.id === hairColor) || HAIR_COLORS[0];

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      animate={animate ? {
        y: [0, -8, 0],
        rotate: [0, 2, -2, 0],
      } : {}}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Hair color indicator */}
      <div 
        className="absolute -top-2 -left-2 w-6 h-6 rounded-full border-2 border-white shadow-md"
        style={{ backgroundColor: hairColorObj.color }}
        title={hairColorObj.name}
      />

      <span className={`${sizeClasses[size]} select-none`}>
        {skinEmojis[skin]}
      </span>

      {/* Sparkle effects */}
      {animate && (
        <>
          <motion.div
            className="absolute -top-1 -right-1 text-yellow-400"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          >
            ✨
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -left-2 text-yellow-400"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            ✨
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
