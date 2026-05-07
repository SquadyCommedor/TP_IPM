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
          child_profile: Json | null;
          parent_email: string | null;
          created_at: string;
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
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'parent' | 'child';
          avatar?: string | null;
          child_profile?: Json | null;
          parent_email?: string | null;
          created_at?: string;
        };
      };
      visit_logs: {
        Row: {
          id: string;
          child_id: string;
          date: string;
          duration: number;
          max_stress: number;
          avg_stress: number;
          pauses: number;
          completed: boolean;
          notes: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          date: string;
          duration: number;
          max_stress: number;
          avg_stress: number;
          pauses: number;
          completed: boolean;
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          child_id?: string;
          date?: string;
          duration?: number;
          max_stress?: number;
          avg_stress?: number;
          pauses?: number;
          completed?: boolean;
          notes?: string;
          created_at?: string;
        };
      };
      bitalino_readings: {
        Row: {
          id: string;
          child_id: string;
          timestamp: number;
          heart_rate: number;
          eda: number;
          stress_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          timestamp: number;
          heart_rate: number;
          eda: number;
          stress_index: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          child_id?: string;
          timestamp?: number;
          heart_rate?: number;
          eda?: number;
          stress_index?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
