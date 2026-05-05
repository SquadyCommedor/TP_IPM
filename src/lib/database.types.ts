export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'parent' | 'child';
          avatar: string | null;
          child_profile: {
            nickname: string;
            age: number;
            hair_color: string;
            character_skin: string;
            stars: number;
            completed_scenes: string[];
            completed_visits: number;
            diploma_earned: boolean;
          } | null;
          parent_email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role: 'parent' | 'child';
          avatar?: string | null;
          child_profile?: Json | null;
          parent_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          email?: string;
          avatar?: string | null;
          child_profile?: Json | null;
          parent_email?: string | null;
          updated_at?: string;
        };
      };
      visit_logs: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          duration: number;
          max_stress: number;
          avg_stress: number;
          pauses: number;
          completed: boolean;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          duration: number;
          max_stress: number;
          avg_stress: number;
          pauses: number;
          completed: boolean;
          notes?: string | null;
          created_at?: string;
        };
      };
      bitalino_readings: {
        Row: {
          id: string;
          user_id: string;
          visit_id: string | null;
          timestamp: number;
          heart_rate: number;
          eda: number;
          stress_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          visit_id?: string | null;
          timestamp: number;
          heart_rate: number;
          eda: number;
          stress_index: number;
          created_at?: string;
        };
      };
    };
  };
}
