import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './lib/supabase';
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
  addVisitLog: (log: VisitLog) => Promise<void>;
  addBitalinoReading: (reading: BitalinoReading) => void;
  updateChildProfile: (profile: Partial<NonNullable<User['childProfile']>>) => Promise<void>;
  addStars: (amount: number) => Promise<void>;
  setVisitLogs: (logs: VisitLog[]) => void;
  syncVisitLogs: () => Promise<void>;
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

      addVisitLog: async (log) => {
        set((prev) => ({
          visitLogs: [log, ...prev.visitLogs]
        }));

        // Sync to Supabase if authenticated
        const user = get().user;
        if (user?.role === 'child') {
          try {
            await supabase.from('visit_logs').insert({
              child_id: user.id,
              date: log.date,
              duration: log.duration,
              max_stress: log.maxStress,
              avg_stress: log.avgStress,
              pauses: log.pauses,
              completed: log.completed,
              notes: log.notes,
            });
          } catch (err) {
            console.error('Failed to sync visit log:', err);
          }
        }
      },

      setVisitLogs: (logs) => set({ visitLogs: logs }),

      syncVisitLogs: async () => {
        const user = get().user;
        if (!user || user.role !== 'child') return;

        try {
          const { data, error } = await supabase
            .from('visit_logs')
            .select('*')
            .eq('child_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          if (data) {
            const logs: VisitLog[] = data.map((row) => ({
              id: row.id,
              date: row.date,
              duration: row.duration,
              maxStress: row.max_stress,
              avgStress: row.avg_stress,
              pauses: row.pauses,
              completed: row.completed,
              notes: row.notes,
            }));
            set({ visitLogs: logs });
          }
        } catch (err) {
          console.error('Failed to sync visit logs:', err);
        }
      },

      addBitalinoReading: (reading) => set((prev) => ({
        bitalinoHistory: [...prev.bitalinoHistory.slice(-100), reading]
      })),

      updateChildProfile: async (profile) => {
        const user = get().user;
        if (!user || !user.childProfile) return;

        const updatedProfile = { ...user.childProfile, ...profile };

        set((prev) => ({
          user: prev.user ? {
            ...prev.user,
            childProfile: updatedProfile
          } : null
        }));

        // Sync to Supabase
        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              child_profile: {
                nickname: updatedProfile.nickname,
                age: updatedProfile.age,
                hair_color: updatedProfile.hairColor,
                character_skin: updatedProfile.characterSkin,
                stars: updatedProfile.stars,
                completed_scenes: updatedProfile.completedScenes,
                completed_visits: updatedProfile.completedVisits,
                diploma_earned: updatedProfile.diplomaEarned,
              }
            })
            .eq('id', user.id);

          if (error) throw error;
        } catch (err) {
          console.error('Failed to sync child profile:', err);
        }
      },

      addStars: async (amount) => {
        const user = get().user;
        if (!user || !user.childProfile) return;

        const newStars = (user.childProfile.stars || 0) + amount;

        set((prev) => ({
          user: prev.user ? {
            ...prev.user,
            childProfile: prev.user.childProfile
              ? { ...prev.user.childProfile, stars: newStars }
              : undefined
          } : null
        }));

        // Sync to Supabase
        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              child_profile: {
                ...user.childProfile,
                stars: newStars,
              }
            })
            .eq('id', user.id);

          if (error) throw error;
        } catch (err) {
          console.error('Failed to sync stars:', err);
        }
      },
    }),
    {
      name: 'meu-guia-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        gameState: state.gameState,
        visitLogs: state.visitLogs,
      }),
    }
  )
);
