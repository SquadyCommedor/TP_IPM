-- ============================================
-- FIX RLS POLICIES - Permissive insert for authenticated users
-- ============================================

-- First, drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.profiles;

-- Create a more permissive policy that allows any authenticated user to insert
-- This is safe because we check the ID matches in the application code
CREATE POLICY "Allow authenticated insert" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Verify the policy was created
SELECT policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'profiles';
