import { motion } from 'framer-motion';
import { HAIR_COLORS } from '../data';
import type { CharacterSkin, HairColor } from '../types';

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
    <div className={`relative inline-block ${className}`}>
      {/* Hair color indicator */}
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 rounded-full"
        style={{ backgroundColor: hairColorObj.color }}
      />
      <div className={sizeClasses[size]}>
        {skinEmojis[skin]}
      </div>
      {/* Sparkle effects */}
      {animate && (
        <>
          <motion.div
            animate={{ opacity: [0, 1, 0], y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            className="absolute -top-2 -right-2 text-yellow-400"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{ opacity: [0, 1, 0], y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-2 -left-2 text-yellow-400"
          >
            ✨
          </motion.div>
        </>
      )}
    </div>
  );
}
