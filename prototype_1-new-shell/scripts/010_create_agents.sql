-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agents_name ON agents(name);

-- RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "agents_select" ON agents FOR SELECT TO authenticated USING (true);
CREATE POLICY "agents_insert" ON agents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "agents_update" ON agents FOR UPDATE TO authenticated USING (true);
CREATE POLICY "agents_delete" ON agents FOR DELETE TO authenticated USING (true);

-- Anon policies (matching pattern from 004_add_anon_policies.sql)
CREATE POLICY "agents_anon_select" ON agents FOR SELECT TO anon USING (true);
CREATE POLICY "agents_anon_insert" ON agents FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "agents_anon_update" ON agents FOR UPDATE TO anon USING (true);
CREATE POLICY "agents_anon_delete" ON agents FOR DELETE TO anon USING (true);

-- Trigger
DROP TRIGGER IF EXISTS agents_updated_at ON agents;
CREATE TRIGGER agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add agent_id to athletes table
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES agents(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_athletes_agent_id ON athletes(agent_id);
