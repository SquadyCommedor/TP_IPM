import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  height?: number;
  showPercentage?: boolean;
}

export default function ProgressBar({ 
  progress, 
  color = 'bg-primary', 
  height = 12,
  showPercentage = true 
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      <div 
        className="w-full bg-gray-100 rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-text-light font-medium">0%</span>
          <motion.span 
            className="text-xs font-bold text-primary"
            key={clampedProgress}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
          >
            {Math.round(clampedProgress)}%
          </motion.span>
        </div>
      )}
    </div>
  );
}
