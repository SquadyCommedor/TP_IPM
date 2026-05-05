import { supabase } from './supabase';
import type { User, UserRole } from '../types';

export async function signUpParent(email: string, password: string, name: string) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role: 'parent' as UserRole,
      },
    },
  });

  if (authError) throw authError;

  // Create parent profile
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        name,
        email,
        role: 'parent',
      });

    if (profileError) throw profileError;
  }

  return authData;
}

export async function signUpChild(
  email: string, 
  password: string, 
  name: string, 
  nickname: string, 
  age: number,
  parentEmail?: string
) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        nickname,
        age,
        role: 'child' as UserRole,
      },
    },
  });

  if (authError) throw authError;

  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        name,
        email,
        role: 'child',
        child_profile: {
          nickname,
          age,
          hair_color: 'brown',
          character_skin: 'neutral1',
          stars: 0,
          completed_scenes: [],
          completed_visits: 0,
          diploma_earned: false,
        },
        parent_email: parentEmail || null,
      });

    if (profileError) throw profileError;
  }

  return authData;
}

export async function signIn(email: string, password: string, role: UserRole) {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) throw authError;

  // Verify role matches
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile) throw new Error('Perfil não encontrado');
  if (profile.role !== role) throw new Error('Tipo de utilizador incorreto');

  return { user: mapProfileToUser(profile), session: authData.session };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  return profile ? mapProfileToUser(profile) : null;
}

export async function updateProfile(userId: string, updates: Partial<User>) {
  const { error } = await supabase
    .from('profiles')
    .update({
      child_profile: updates.childProfile,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw error;
}

export async function addVisitLog(userId: string, log: any) {
  const { error } = await supabase
    .from('visit_logs')
    .insert({
      user_id: userId,
      ...log,
    });

  if (error) throw error;
}

export async function getVisitLogs(userId: string) {
  const { data, error } = await supabase
    .from('visit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

function mapProfileToUser(profile: any): User {
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
}
