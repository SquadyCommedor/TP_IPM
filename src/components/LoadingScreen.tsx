import { motion } from 'framer-motion';
import { Scissors, Heart, Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  submessage?: string;
}

export function LoadingScreen({ message = 'A carregar...', submessage }: LoadingScreenProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="text-primary"
        >
          <Scissors size={48} />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute -top-1 -right-1 text-red-400"
        >
          <Heart size={20} fill="currentColor" />
        </motion.div>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">{message}</h2>
        {submessage && (
          <p className="text-sm text-gray-500 mt-1">{submessage}</p>
        )}
      </div>
      <Loader2 className="animate-spin text-primary" size={24} />
    </div>
  );
}

export function InlineLoading({ message = 'A carregar...' }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <Loader2 className="animate-spin" size={16} />
      <span className="text-sm">{message}</span>
    </div>
  );
}
