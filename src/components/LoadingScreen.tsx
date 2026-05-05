import { motion } from 'framer-motion';
import { Scissors, Heart, Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  submessage?: string;
}

export function LoadingScreen({ message = 'A carregar...', submessage }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-kid-bg flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Scissors className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>
          {message}
        </h2>
        {submessage && (
          <p className="text-sm text-gray-500">{submessage}</p>
        )}

        <div className="mt-6 flex justify-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 bg-primary rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 bg-secondary rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 bg-accent rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}

export function InlineLoading({ message = 'A carregar...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4 text-gray-500">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
