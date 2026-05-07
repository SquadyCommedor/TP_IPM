import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface CharacterAvatarProps {
  name: string;
  image: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

const colorMap: Record<string, string> = {
  red: 'from-red-400 to-red-500',
  blue: 'from-blue-400 to-blue-500',
  green: 'from-green-400 to-green-500',
  yellow: 'from-yellow-400 to-yellow-500',
  purple: 'from-purple-400 to-purple-500',
  orange: 'from-orange-400 to-orange-500',
  pink: 'from-pink-400 to-pink-500',
  teal: 'from-teal-400 to-teal-500',
};

export default function CharacterAvatar({
  name,
  image,
  color,
  isSelected,
  onClick,
  index,
}: CharacterAvatarProps) {
  const gradient = colorMap[color] || colorMap.blue;

  return (
    <motion.button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
        isSelected 
          ? 'bg-white shadow-xl ring-4 ring-primary/30' 
          : 'bg-white/50 hover:bg-white hover:shadow-lg'
      }`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Avatar */}
      <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${gradient} p-1`}>
        <div className="w-full h-full rounded-full bg-white overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Badge selecionado */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-lg"
          >
            <Check size={14} className="text-white" />
          </motion.div>
        )}
      </div>

      <span className={`font-semibold text-sm ${isSelected ? 'text-primary' : 'text-text'}`}>
        {name}
      </span>
    </motion.button>
  );
}
