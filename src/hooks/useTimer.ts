import { useEffect, useRef, useState, useCallback } from 'react';

interface UseTimerReturn {
  timeRemaining: number;
  isRunning: boolean;
  progress: number;
  start: (seconds: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export function useTimer(): UseTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback((seconds: number) => {
    setTotalTime(seconds);
    setTimeRemaining(seconds);
    setIsRunning(true);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const resume = useCallback(() => {
    if (timeRemaining > 0 && !isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [timeRemaining, isRunning]);

  const stop = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(0);
    setTotalTime(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const progress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;

  return { timeRemaining, isRunning, progress, start, pause, resume, stop };
}
