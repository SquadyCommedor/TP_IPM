export interface User {
  id: string;
  email: string;
  name: string;
  role: 'parent' | 'child';
  avatar?: string;
}

export interface Scene {
  id: number;
  title: string;
  description: string;
  image: string;
  tip: string;
  duration: number;
}

export interface VisitLog {
  id: string;
  childId: string;
  date: string;
  duration: number;
  maxStress: number;
  avgStress: number;
  pauses: number;
  completed: boolean;
  notes?: string;
}

export interface BitalinoReading {
  childId: string;
  timestamp: number;
  heartRate: number;
  eda: number;
  stressIndex: number;
}

export interface Character {
  id: number;
  name: string;
  image: string;
  color: string;
}

export interface Reward {
  id: string;
  type: 'star' | 'award' | 'trophy' | 'medal';
  label: string;
  earnedAt: string;
}
