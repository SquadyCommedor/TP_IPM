-- ============================================
-- O Meu Guia do Cabeleireiro - Supabase Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
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

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile (FIXED - this was missing!)
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Parents can read child profiles linked to them
CREATE POLICY "Parents can read child profiles"
  ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = id 
    OR (
      EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() AND p.role = 'parent'
      )
      AND parent_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    )
  );

-- ============================================
-- VISIT LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.visit_logs (
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

-- Enable RLS on visit_logs
ALTER TABLE public.visit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own visit logs
CREATE POLICY "Users can read own visit logs"
  ON public.visit_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Parents can read child visit logs
CREATE POLICY "Parents can read child visit logs"
  ON public.visit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'parent'
    )
    AND user_id IN (
      SELECT id FROM public.profiles 
      WHERE parent_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    )
  );

-- Policy: Users can insert their own visit logs
CREATE POLICY "Users can insert own visit logs"
  ON public.visit_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- BITALINO READINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.bitalino_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visit_id UUID REFERENCES public.visit_logs(id) ON DELETE CASCADE,
  timestamp BIGINT NOT NULL,
  heart_rate INTEGER NOT NULL,
  eda NUMERIC(5,3) NOT NULL,
  stress_index INTEGER NOT NULL CHECK (stress_index >= 0 AND stress_index <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on bitalino_readings
ALTER TABLE public.bitalino_readings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own readings
CREATE POLICY "Users can read own readings"
  ON public.bitalino_readings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own readings
CREATE POLICY "Users can insert own readings"
  ON public.bitalino_readings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTION: Auto-create profile on signup (DISABLED - we handle this in app)
-- ============================================
-- Note: The trigger is disabled because we create profiles manually in the app
-- to have more control over the data. If you want auto-creation, uncomment below:

/*
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'child')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
*/

-- ============================================
-- FUNCTION: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at on profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_visit_logs_user_id ON public.visit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_visit_logs_date ON public.visit_logs(date);
CREATE INDEX IF NOT EXISTS idx_bitalino_user_id ON public.bitalino_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_bitalino_visit_id ON public.bitalino_readings(visit_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_parent_email ON public.profiles(parent_email);
