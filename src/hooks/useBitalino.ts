import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface BitalinoReading {
  heartRate: number;
  eda: number;
  stressIndex: number;
  timestamp: number;
}

interface UseBitalinoReturn {
  isConnected: boolean;
  isSimulating: boolean;
  reading: BitalinoReading | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  error: string | null;
}

export function useBitalino(childId?: string): UseBitalinoReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [reading, setReading] = useState<BitalinoReading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const simInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateSimulatedReading = (): BitalinoReading => {
    const baseStress = Math.random() * 100;
    return {
      heartRate: Math.floor(60 + Math.random() * 40 + (baseStress > 70 ? 20 : 0)),
      eda: parseFloat((0.5 + Math.random() * 2).toFixed(2)),
      stressIndex: Math.floor(baseStress),
      timestamp: Date.now(),
    };
  };

  const saveReading = useCallback(async (r: BitalinoReading) => {
    if (!childId) return;
    try {
      await supabase.from('bitalino_readings').insert({
        child_id: childId,
        timestamp: r.timestamp,
        heart_rate: r.heartRate,
        eda: r.eda,
        stress_index: r.stressIndex,
      });
    } catch (e) {
      console.error('Erro ao guardar leitura:', e);
    }
  }, [childId]);

  const connect = useCallback(async () => {
    setError(null);
    try {
      // Para integração real com Web Bluetooth:
      // const device = await navigator.bluetooth.requestDevice({...})
      // Por agora, iniciamos simulação automaticamente
      startSimulation();
      setIsConnected(true);
    } catch (e) {
      setError('Não foi possível conectar à pulseira. A usar modo simulação.');
      startSimulation();
    }
  }, []);

  const disconnect = useCallback(() => {
    stopSimulation();
    setIsConnected(false);
  }, []);

  const startSimulation = useCallback(() => {
    setIsSimulating(true);
    simInterval.current = setInterval(() => {
      const r = generateSimulatedReading();
      setReading(r);
      saveReading(r);
    }, 2000);
  }, [saveReading]);

  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
    if (simInterval.current) {
      clearInterval(simInterval.current);
      simInterval.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (simInterval.current) clearInterval(simInterval.current);
    };
  }, []);

  return {
    isConnected,
    isSimulating,
    reading,
    connect,
    disconnect,
    startSimulation,
    stopSimulation,
    error,
  };
}
