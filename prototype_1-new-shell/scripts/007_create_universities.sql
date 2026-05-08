-- Universities table
CREATE TABLE IF NOT EXISTS universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  abbreviation TEXT,
  location TEXT,
  conference TEXT,
  logo_url TEXT,
  primary_color TEXT,
  website TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_universities_name ON universities(name);
CREATE INDEX IF NOT EXISTS idx_universities_conference ON universities(conference);

-- RLS
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "universities_select" ON universities FOR SELECT TO authenticated USING (true);
CREATE POLICY "universities_insert" ON universities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "universities_update" ON universities FOR UPDATE TO authenticated USING (true);
CREATE POLICY "universities_delete" ON universities FOR DELETE TO authenticated USING (true);

-- Anon policies (matching pattern from 004_add_anon_policies.sql)
CREATE POLICY "universities_anon_select" ON universities FOR SELECT TO anon USING (true);
CREATE POLICY "universities_anon_insert" ON universities FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "universities_anon_update" ON universities FOR UPDATE TO anon USING (true);
CREATE POLICY "universities_anon_delete" ON universities FOR DELETE TO anon USING (true);

-- Trigger
DROP TRIGGER IF EXISTS universities_updated_at ON universities;
CREATE TRIGGER universities_updated_at BEFORE UPDATE ON universities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
