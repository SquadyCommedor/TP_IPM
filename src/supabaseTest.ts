import { supabase } from './lib/supabase';

// Função para debug da conexão e RLS
export async function testSupabaseConnection() {
  console.log('=== TESTE SUPABASE ===');

  // 1. Verificar sessão
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Sessão:', session ? 'Ativa' : 'Inativa');
  if (session) {
    console.log('User ID:', session.user.id);
    console.log('Email:', session.user.email);
  }

  // 2. Verificar perfil
  if (session) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    console.log('Perfil:', profile);
    console.log('Erro perfil:', profileError);
  }

  // 3. Testar RLS - tentar ver todos os perfis
  const { data: allProfiles, error: allError } = await supabase
    .from('profiles')
    .select('*');

  console.log('Todos os perfis (deve respeitar RLS):', allProfiles);
  console.log('Erro:', allError);

  // 4. Testar visit_logs
  const { data: visits, error: visitsError } = await supabase
    .from('visit_logs')
    .select('*');

  console.log('Visitas:', visits);
  console.log('Erro visitas:', visitsError);

  // 5. Testar JWT
  const { data: jwt } = await supabase.rpc('auth.jwt');
  console.log('JWT claims:', jwt);

  console.log('=== FIM TESTE ===');
}

// Função para verificar se um pai consegue ver filhos
export async function testParentChildView(parentEmail: string) {
  console.log('=== TESTE PAI -> FILHOS ===');
  console.log('Email do pai:', parentEmail);

  // Tentar ver filhos
  const { data: children, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'child')
    .ilike('parent_email', parentEmail);

  console.log('Filhos encontrados:', children);
  console.log('Erro:', error);

  if (children && children.length > 0) {
    // Tentar ver visitas dos filhos
    const childIds = children.map(c => c.id);
    const { data: visits, error: visitsError } = await supabase
      .from('visit_logs')
      .select('*')
      .in('child_id', childIds);

    console.log('Visitas dos filhos:', visits);
    console.log('Erro visitas:', visitsError);
  }

  console.log('=== FIM TESTE ===');
}
