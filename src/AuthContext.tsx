import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './lib/supabase';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'parent' | 'child';
  avatar?: string;
  child_profile?: {
    age: number;
    parent_email: string;
  };
  parent_email?: string;
}

interface AuthContextType {
  user: any;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'parent' | 'child';
  age?: number;
  parentEmail?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escutar mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
        // Se o perfil não existir, pode ser porque o trigger ainda não correu
        // Tentar novamente após 1 segundo
        if (error.code === 'PGRST116') {
          setTimeout(() => loadProfile(userId), 1000);
          return;
        }
      }

      if (data) {
        setProfile({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          avatar: data.avatar,
          child_profile: data.child_profile,
          parent_email: data.parent_email,
        });
      }
    } catch (e) {
      console.error('Erro:', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      await loadProfile(data.user.id);

      // Redirecionar baseado no role
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileData?.role === 'parent') {
        window.location.href = '/parent';
      } else {
        window.location.href = '/child';
      }
    }
  };

  const register = async (data: RegisterData) => {
    // 1. Criar conta no Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Erro ao criar conta');

    // 2. Criar perfil com todos os dados necessários
    const profileData: any = {
      id: authData.user.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    if (data.role === 'child') {
      // Guardar parent_email tanto em child_profile como em parent_email (para RLS)
      const parentEmailLower = data.parentEmail?.toLowerCase();
      profileData.child_profile = {
        age: data.age,
        parent_email: parentEmailLower,
      };
      profileData.parent_email = parentEmailLower; // Campo direto para RLS
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert(profileData);

    if (profileError) {
      console.error('Erro ao criar perfil:', profileError);
      // Se falhou, tentar criar perfil mínimo
      const { error: retryError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: data.name,
          email: data.email,
          role: data.role,
        });

      if (retryError) {
        console.error('Erro ao criar perfil mínimo:', retryError);
      }
    }

    // Redirecionar
    if (data.role === 'parent') {
      window.location.href = '/parent';
    } else {
      window.location.href = '/child';
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
