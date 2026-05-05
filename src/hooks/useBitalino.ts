import { useEffect, useRef, useCallback, useState } from 'react';
import { useStore } from '../store';
import { STRESS_THRESHOLD, STRESS_WARNING } from '../data';

interface UseBitalinoReturn {
  connected: boolean;
  heartRate: number;
  stressLevel: number;
  isHighStress: boolean;
  isWarning: boolean;
  connect: () => void;
  disconnect: () => void;
  simulate: (scenario: 'normal' | 'anxious' | 'calm') => void;
}

export function useBitalino(): UseBitalinoReturn {
  const [connected, setConnected] = useState(false);
  const [heartRate, setHeartRate] = useState(80);
  const [stressLevel, setStressLevel] = useState(20);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const updateGameState = useStore((s) => s.updateGameState);
  const addBitalinoReading = useStore((s) => s.addBitalinoReading);

  const generateReading = useCallback((baseHR: number, variance: number) => {
    const hr = Math.round(baseHR + (Math.random() - 0.5) * variance);
    const eda = Math.random() * 0.5 + 0.1;
    const stressIndex = Math.min(100, Math.max(0, 
      ((hr - 60) / 100) * 60 + (eda / 0.6) * 40
    ));

    setHeartRate(hr);
    setStressLevel(Math.round(stressIndex));

    addBitalinoReading({
      timestamp: Date.now(),
      heartRate: hr,
      eda,
      stressIndex,
    });

    updateGameState({ heartRate: hr, stressLevel: Math.round(stressIndex) });
  }, [updateGameState, addBitalinoReading]);

  const connect = useCallback(() => {
    setConnected(true);
    updateGameState({ bitalinoConnected: true });

    intervalRef.current = setInterval(() => {
      generateReading(85, 10);
    }, 2000);
  }, [generateReading, updateGameState]);

  const disconnect = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setConnected(false);
    updateGameState({ bitalinoConnected: false, stressLevel: 0, heartRate: 80 });
  }, [updateGameState]);

  const simulate = useCallback((scenario: 'normal' | 'anxious' | 'calm') => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const configs = {
      normal: { baseHR: 85, variance: 15 },
      anxious: { baseHR: 120, variance: 25 },
      calm: { baseHR: 65, variance: 5 },
    };

    const config = configs[scenario];
    intervalRef.current = setInterval(() => {
      generateReading(config.baseHR, config.variance);
    }, 1500);
  }, [generateReading]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    connected,
    heartRate,
    stressLevel,
    isHighStress: stressLevel >= STRESS_THRESHOLD,
    isWarning: stressLevel >= STRESS_WARNING && stressLevel < STRESS_THRESHOLD,
    connect,
    disconnect,
    simulate,
  };
}
