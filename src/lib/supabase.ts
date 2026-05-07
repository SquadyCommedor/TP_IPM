import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERRO: Variáveis de ambiente do Supabase não definidas!');
  console.error('Cria um ficheiro .env na raiz do projeto com:');
  console.error('  VITE_SUPABASE_URL=https://teu-projeto.supabase.co');
  console.error('  VITE_SUPABASE_ANON_KEY=eyJhbG...');
  console.error('Depois reinicia o servidor: npm run dev');
}

export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Helper para verificar se o utilizador é admin/pai
export async function isParent(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  return data?.role === 'parent';
}

// Helper para verificar se o utilizador é criança
export async function isChild(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  return data?.role === 'child';
}
