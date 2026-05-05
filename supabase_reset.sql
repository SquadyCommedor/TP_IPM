-- ============================================
-- RESET COMPLETO - Apaga TUDO e recria do zero
-- ⚠️ CUIDADO: Isto apaga TODOS os dados!
-- ============================================

-- 1. APAGAR TODOS OS DADOS DAS TABELAS
TRUNCATE TABLE public.bitalino_readings CASCADE;
TRUNCATE TABLE public.visit_logs CASCADE;
TRUNCATE TABLE public.profiles CASCADE;

-- 2. APAGAR TODOS OS USERS DO AUTH (exceto o service role)
-- Nota: Isto apaga os users da autenticação do Supabase
DELETE FROM auth.users WHERE email != '';

-- 3. APAGAR AS POLICIES RLS
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Parents can read child profiles" ON public.profiles;

DROP POLICY IF EXISTS "Users can read own visit logs" ON public.visit_logs;
DROP POLICY IF EXISTS "Parents can read child visit logs" ON public.visit_logs;
DROP POLICY IF EXISTS "Users can insert own visit logs" ON public.visit_logs;

DROP POLICY IF EXISTS "Users can read own readings" ON public.bitalino_readings;
DROP POLICY IF EXISTS "Users can insert own readings" ON public.bitalino_readings;

-- 4. APAGAR AS TABELAS
DROP TABLE IF EXISTS public.bitalino_readings CASCADE;
DROP TABLE IF EXISTS public.visit_logs CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 5. APAGAR FUNÇÕES E TRIGGERS
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

-- 6. RECRIAR TUDO DO ZERO (copia do schema original)
-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('parent', 'child')),
  avatar TEXT,
  child_profile JSONB DEFAULT NULL,
  parent_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Parents can read child profiles"
  ON public.profiles FOR SELECT USING (
    auth.uid() = id OR (
      EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'parent')
      AND parent_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    )
  );

-- ============================================
-- VISIT LOGS TABLE
-- ============================================
CREATE TABLE public.visit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMPTZ DEFAULT NOW(),
  duration INTEGER NOT NULL,
  max_stress INTEGER NOT NULL,
  avg_stress INTEGER NOT NULL,
  pauses INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.visit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own visit logs"
  ON public.visit_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Parents can read child visit logs"
  ON public.visit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'parent')
    AND user_id IN (SELECT id FROM public.profiles WHERE parent_email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
  );

CREATE POLICY "Users can insert own visit logs"
  ON public.visit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- BITALINO READINGS TABLE
-- ============================================
CREATE TABLE public.bitalino_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visit_id UUID REFERENCES public.visit_logs(id) ON DELETE CASCADE,
  timestamp BIGINT NOT NULL,
  heart_rate INTEGER NOT NULL,
  eda NUMERIC(5,3) NOT NULL,
  stress_index INTEGER NOT NULL CHECK (stress_index >= 0 AND stress_index <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bitalino_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own readings"
  ON public.bitalino_readings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own readings"
  ON public.bitalino_readings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_visit_logs_user_id ON public.visit_logs(user_id);
CREATE INDEX idx_visit_logs_date ON public.visit_logs(date);
CREATE INDEX idx_bitalino_user_id ON public.bitalino_readings(user_id);
CREATE INDEX idx_bitalino_visit_id ON public.bitalino_readings(visit_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_parent_email ON public.profiles(parent_email);

-- ============================================
-- CONFIRMAÇÃO
-- ============================================
SELECT 'Reset completo! Tabelas recriadas:' AS status;
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
