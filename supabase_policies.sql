-- ============================================
-- O MEU GUIA DO CABELEIREIRO - SUPABASE SQL
-- Versão corrigida para pais verem dados dos filhos
-- ============================================

-- Tabela de perfis
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('parent', 'child')),
  avatar TEXT,
  child_profile JSONB,
  parent_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de logs de visitas
CREATE TABLE IF NOT EXISTS visit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES profiles(id) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL,
  max_stress INTEGER NOT NULL,
  avg_stress INTEGER NOT NULL,
  pauses INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de leituras BITalino
CREATE TABLE IF NOT EXISTS bitalino_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES profiles(id) NOT NULL,
  timestamp BIGINT NOT NULL,
  heart_rate INTEGER NOT NULL,
  eda REAL NOT NULL,
  stress_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bitalino_readings ENABLE ROW LEVEL SECURITY;

-- DROP POLICIES existentes para recriar
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Parents can view child profiles" ON profiles;
DROP POLICY IF EXISTS "Parents can view child logs" ON visit_logs;
DROP POLICY IF EXISTS "Children can insert own logs" ON visit_logs;
DROP POLICY IF EXISTS "Children can view own logs" ON visit_logs;
DROP POLICY IF EXISTS "Parents can view child readings" ON bitalino_readings;
DROP POLICY IF EXISTS "Children can insert own readings" ON bitalino_readings;

-- ============================================
-- PROFILES TABLE POLICIES
-- ============================================

-- Crianças e pais podem ver o seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Crianças e pais podem inserir o seu próprio perfil
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Crianças e pais podem atualizar o seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Pais podem ver perfis dos filhos (via parent_email)
CREATE POLICY "Parents can view child profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    role = 'child' AND
    parent_email = LOWER((auth.jwt() ->> 'email'))
  );

-- ============================================
-- VISIT_LOGS TABLE POLICIES
-- ============================================

-- Pais podem ver logs dos filhos (via parent_email em profiles)
CREATE POLICY "Parents can view child logs"
  ON visit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = visit_logs.child_id
      AND profiles.role = 'child'
      AND LOWER(profiles.parent_email) = LOWER((auth.jwt() ->> 'email'))
    )
  );

-- Crianças podem inserir os seus próprios logs
CREATE POLICY "Children can insert own logs"
  ON visit_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = child_id
      AND profiles.id = auth.uid()
      AND profiles.role = 'child'
    )
  );

-- Crianças podem ver os seus próprios logs
CREATE POLICY "Children can view own logs"
  ON visit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = child_id
      AND profiles.id = auth.uid()
      AND profiles.role = 'child'
    )
  );

-- ============================================
-- BITALINO_READINGS TABLE POLICIES
-- ============================================

-- Pais podem ver leituras dos filhos
CREATE POLICY "Parents can view child readings"
  ON bitalino_readings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = bitalino_readings.child_id
      AND profiles.role = 'child'
      AND LOWER(profiles.parent_email) = LOWER((auth.jwt() ->> 'email'))
    )
  );

-- Crianças podem inserir as suas próprias leituras
CREATE POLICY "Children can insert own readings"
  ON bitalino_readings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = child_id
      AND profiles.id = auth.uid()
      AND profiles.role = 'child'
    )
  );

-- ============================================
-- FUNÇÕES AUXILIARES (opcional mas recomendado)
-- ============================================

-- Função para verificar se um utilizador é pai de uma criança
CREATE OR REPLACE FUNCTION is_parent_of(child_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = child_uuid
    AND profiles.role = 'child'
    AND LOWER(profiles.parent_email) = LOWER((auth.jwt() ->> 'email'))
  );
END;
$$;

-- Função para listar filhos de um pai
CREATE OR REPLACE FUNCTION get_children()
RETURNS TABLE(id UUID, name TEXT, email TEXT, age INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.email,
    (p.child_profile ->> 'age')::INTEGER as age
  FROM profiles p
  WHERE p.role = 'child'
  AND LOWER(p.parent_email) = LOWER((auth.jwt() ->> 'email'));
END;
$$;

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_parent_email ON profiles(parent_email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_visit_logs_child_id ON visit_logs(child_id);
CREATE INDEX IF NOT EXISTS idx_visit_logs_date ON visit_logs(date);
CREATE INDEX IF NOT EXISTS idx_bitalino_readings_child_id ON bitalino_readings(child_id);
CREATE INDEX IF NOT EXISTS idx_bitalino_readings_timestamp ON bitalino_readings(timestamp);
