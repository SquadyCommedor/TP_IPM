import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase } from './lib/supabase';
import { useStore } from './store';
import type { User } from './types';

interface AuthContextType {
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  login: (email: string, password: string, role: 'parent' | 'child') => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'parent' | 'child';
  childNickname?: string;
  childAge?: number;
  parentEmail?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setUser = useStore((s) => s.setUser);
  const logoutStore = useStore((s) => s.logout);

  const clearError = useCallback(() => setError(null), []);

  const mapProfileToUser = useCallback((profile: any): User => {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      avatar: profile.avatar,
      childProfile: profile.child_profile ? {
        nickname: profile.child_profile.nickname,
        age: profile.child_profile.age,
        hairColor: profile.child_profile.hair_color,
        characterSkin: profile.child_profile.character_skin,
        stars: profile.child_profile.stars,
        completedScenes: profile.child_profile.completed_scenes,
        completedVisits: profile.child_profile.completed_visits,
        diplomaEarned: profile.child_profile.diploma_earned,
      } : undefined,
      createdAt: profile.created_at,
    };
  }, []);

  const fetchProfile = useCallback(async (userId: string): Promise<User | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        console.warn('Profile fetch error:', error?.message || 'No profile found');
        return null;
      }

      return mapProfileToUser(profile);
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      return null;
    }
  }, [mapProfileToUser]);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        setIsInitializing(true);

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.warn('Session error:', sessionError.message);
          if (mounted) {
            logoutStore();
            setIsInitializing(false);
          }
          return;
        }

        if (!session?.user) {
          if (mounted) {
            logoutStore();
            setIsInitializing(false);
          }
          return;
        }

        const user = await fetchProfile(session.user.id);

        if (mounted) {
          if (user) {
            setUser(user, session.access_token);
          } else {
            console.warn('Auth user exists but no profile - signing out');
            await supabase.auth.signOut();
            logoutStore();
          }
          setIsInitializing(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          logoutStore();
          setIsInitializing(false);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);

        if (!mounted) return;

        if (event === 'SIGNED_OUT' || !session?.user) {
          logoutStore();
          return;
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const user = await fetchProfile(session.user.id);
          if (mounted && user) {
            setUser(user, session.access_token);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, setUser, logoutStore]);

  const login = async (email: string, password: string, role: 'parent' | 'child') => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message === 'Invalid login credentials'
          ? 'Email ou palavra-passe incorretos'
          : authError.message);
      }

      if (!authData.user) {
        throw new Error('Login falhou - utilizador não encontrado');
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        throw new Error('Perfil não encontrado. Contacta o administrador.');
      }

      if (profile.role !== role) {
        await supabase.auth.signOut();
        throw new Error('Tipo de utilizador incorreto. Tenta o outro botão (Pai/Mãe ou Criança).');
      }

      const user = mapProfileToUser(profile);
      setUser(user, authData.session?.access_token || '');

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro no login';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      // For children, verify parent exists first
      if (data.role === 'child' && data.parentEmail) {
        const { data: parentProfile, error: parentError } = await supabase
          .from('profiles')
          .select('id, email, role')
          .eq('email', data.parentEmail)
          .eq('role', 'parent')
          .single();

        if (parentError || !parentProfile) {
          throw new Error('Pai/Mãe não encontrado. O teu pai/mãe precisa de criar conta primeiro com o email: ' + data.parentEmail);
        }
      }

      // Step 1: Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role,
          },
        },
      });

      if (authError) {
        if (authError.message.includes('User already registered')) {
          throw new Error('Este email já está registado. Tenta fazer login.');
        }
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Registo falhou - não foi possível criar utilizador');
      }

      console.log('✅ Auth user created:', authData.user.id);

      // Step 2: Create profile in Supabase database
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: data.name,
          email: data.email,
          role: data.role,
          child_profile: data.role === 'child' ? {
            nickname: data.childNickname || data.name,
            age: data.childAge || 7,
            hair_color: 'brown',
            character_skin: 'neutral1',
            stars: 0,
            completed_scenes: [],
            completed_visits: 0,
            diploma_earned: false,
          } : null,
          parent_email: data.parentEmail || null,
        });

      if (profileError) {
        console.error('Profile creation failed:', profileError);
        await supabase.auth.signOut();
        throw new Error(`Erro ao criar perfil: ${profileError.message}. Verifica se as RLS policies estão configuradas corretamente.`);
      }

      console.log('✅ Profile created successfully');

      // Step 3: Fetch and set user
      const user = await fetchProfile(authData.user.id);
      if (!user) {
        await supabase.auth.signOut();
        throw new Error('Erro ao carregar perfil. Tenta fazer login.');
      }

      setUser(user, authData.session?.access_token || '');

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro no registo';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      logoutStore();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoading, isInitializing, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
