
-- Tabela de recompensas
CREATE TABLE IF NOT EXISTS rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES profiles(id) NOT NULL,
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  stars INTEGER NOT NULL DEFAULT 1,
  score INTEGER,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas RLS para rewards
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Children can view own rewards" ON rewards;
DROP POLICY IF EXISTS "Children can insert own rewards" ON rewards;
DROP POLICY IF EXISTS "Parents can view child rewards" ON rewards;

CREATE POLICY "Children can view own rewards"
  ON rewards FOR SELECT
  TO authenticated
  USING (child_id = auth.uid());

CREATE POLICY "Children can insert own rewards"
  ON rewards FOR INSERT
  TO authenticated
  WITH CHECK (child_id = auth.uid());

CREATE POLICY "Parents can view child rewards"
  ON rewards FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = rewards.child_id
      AND profiles.role = 'child'
      AND LOWER(profiles.parent_email) = LOWER((auth.jwt() ->> 'email'))
    )
  );

CREATE INDEX IF NOT EXISTS idx_rewards_child_id ON rewards(child_id);
CREATE INDEX IF NOT EXISTS idx_rewards_earned_at ON rewards(earned_at);
