export type UserRole = 'parent' | 'child';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  childProfile?: ChildProfile;
  createdAt: string;
}

export interface ChildProfile {
  nickname: string;
  age: number;
  hairColor: HairColor;
  characterSkin: CharacterSkin;
  stars: number;
  completedScenes: string[];
  completedVisits: number;
  diplomaEarned: boolean;
}

export type HairColor = 'dark' | 'brown' | 'blonde' | 'red' | 'black';
export type CharacterSkin = 'boy1' | 'boy2' | 'girl1' | 'girl2' | 'neutral1' | 'neutral2';

export interface Scene {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: number; // seconds
  order: number;
  tips: string[];
  sounds: string[];
  imagePrompt: string;
}

export interface GameState {
  mode: 'home' | 'salon' | null;
  currentScene: number;
  isPaused: boolean;
  stressLevel: number; // 0-100
  heartRate: number;
  bitalinoConnected: boolean;
  timerRemaining: number;
  rewards: Reward[];
}

export interface Reward {
  id: string;
  type: 'star' | 'character' | 'diploma';
  title: string;
  description: string;
  earnedAt: string;
  icon: string;
}

export interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  visual: 'balloon' | 'candle' | 'flower' | 'star';
  color: string;
}

export interface VisitLog {
  id: string;
  date: string;
  duration: number;
  maxStress: number;
  avgStress: number;
  pauses: number;
  completed: boolean;
  notes: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface BitalinoReading {
  timestamp: number;
  heartRate: number;
  eda: number; // electrodermal activity
  stressIndex: number;
}
