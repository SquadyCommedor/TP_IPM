import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, GameState, VisitLog, BitalinoReading } from './types';

interface AppState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  gameState: GameState;
  visitLogs: VisitLog[];
  bitalinoHistory: BitalinoReading[];

  setUser: (user: User | null, token: string | null) => void;
  logout: () => void;
  updateGameState: (state: Partial<GameState>) => void;
  resetGameState: () => void;
  addVisitLog: (log: VisitLog) => void;
  addBitalinoReading: (reading: BitalinoReading) => void;
  updateChildProfile: (profile: Partial<User['childProfile']>) => void;
  addStars: (amount: number) => void;
  setVisitLogs: (logs: VisitLog[]) => void;
}

const initialGameState: GameState = {
  mode: null,
  currentScene: 0,
  isPaused: false,
  stressLevel: 0,
  heartRate: 80,
  bitalinoConnected: false,
  timerRemaining: 0,
  rewards: [],
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      gameState: initialGameState,
      visitLogs: [],
      bitalinoHistory: [],

      setUser: (user, token) => set({ user, token, isAuthenticated: !!user }),

      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        gameState: initialGameState,
        visitLogs: [],
      }),

      updateGameState: (state) => set((prev) => ({
        gameState: { ...prev.gameState, ...state }
      })),

      resetGameState: () => set({ gameState: initialGameState }),

      addVisitLog: (log) => set((prev) => ({
        visitLogs: [log, ...prev.visitLogs]
      })),

      setVisitLogs: (logs) => set({ visitLogs: logs }),

      addBitalinoReading: (reading) => set((prev) => ({
        bitalinoHistory: [...prev.bitalinoHistory.slice(-100), reading]
      })),

      updateChildProfile: (profile) => set((prev) => ({
        user: prev.user ? {
          ...prev.user,
          childProfile: prev.user.childProfile 
            ? { ...prev.user.childProfile, ...profile }
            : undefined
        } : null
      })),

      addStars: (amount) => set((prev) => ({
        user: prev.user ? {
          ...prev.user,
          childProfile: prev.user.childProfile 
            ? { ...prev.user.childProfile, stars: (prev.user.childProfile.stars || 0) + amount }
            : undefined
        } : null
      })),
    }),
    {
      name: 'meu-guia-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
      }),
    }
  )
);
