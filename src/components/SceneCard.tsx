import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Play } from 'lucide-react';

interface SceneCardProps {
  title: string;
  description: string;
  image: string;
  isCompleted: boolean;
  isLocked: boolean;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

export default function SceneCard({
  title,
  description,
  image,
  isCompleted,
  isLocked,
  isActive,
  onClick,
  index,
}: SceneCardProps) {
  return (
    <motion.button
      onClick={!isLocked ? onClick : undefined}
      className={`relative w-full text-left rounded-2xl overflow-hidden transition-all ${
        isLocked 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer card-hover'
      } ${isActive ? 'ring-4 ring-primary/30' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={!isLocked ? { scale: 1.02 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
    >
      {/* Imagem */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badge de estado */}
        <div className="absolute top-3 right-3">
          {isCompleted && (
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 size={18} className="text-white" />
            </div>
          )}
          {isLocked && (
            <div className="w-8 h-8 bg-gray-500/80 rounded-full flex items-center justify-center">
              <Lock size={16} className="text-white" />
            </div>
          )}
          {isActive && !isCompleted && (
            <motion.div 
              className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Play size={16} className="text-white ml-0.5" />
            </motion.div>
          )}
        </div>

        {/* Número da cena */}
        <div className="absolute top-3 left-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center font-bold text-sm text-text">
          {index + 1}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4 bg-white">
        <h3 className="font-display font-bold text-lg text-text mb-1">{title}</h3>
        <p className="text-sm text-text-light line-clamp-2">{description}</p>
      </div>
    </motion.button>
  );
}
