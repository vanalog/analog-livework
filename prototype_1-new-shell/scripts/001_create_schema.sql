-- NIL Management Platform Schema
-- Single-tenant, no workspaces

-- Athletes table
CREATE TABLE IF NOT EXISTS athletes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  sport TEXT NOT NULL,
  position TEXT,
  jersey_number TEXT,
  class_year TEXT,
  university TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
  avatar_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  industry TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'prospect')),
  logo_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Campaigns table (sponsor initiatives)
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  budget_cents BIGINT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agreements table (athlete-sponsor deals)
CREATE TABLE IF NOT EXISTS agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  sponsor_id UUID REFERENCES sponsors(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('revenue_share', 'sponsorship')),
  amount_cents BIGINT NOT NULL DEFAULT 0,
  applies_to_ioi BOOLEAN NOT NULL DEFAULT false,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'terminated')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Athlete budgets table (IOI tracking per athlete)
CREATE TABLE IF NOT EXISTS athlete_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  fiscal_year TEXT NOT NULL,
  total_budget_cents BIGINT NOT NULL DEFAULT 0,
  spent_cents BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(athlete_id, fiscal_year)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_athletes_status ON athletes(status);
CREATE INDEX IF NOT EXISTS idx_athletes_sport ON athletes(sport);
CREATE INDEX IF NOT EXISTS idx_sponsors_status ON sponsors(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_sponsor ON campaigns(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_agreements_athlete ON agreements(athlete_id);
CREATE INDEX IF NOT EXISTS idx_agreements_sponsor ON agreements(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_agreements_status ON agreements(status);
CREATE INDEX IF NOT EXISTS idx_agreements_type ON agreements(type);
CREATE INDEX IF NOT EXISTS idx_athlete_budgets_athlete ON athlete_budgets(athlete_id);

-- Enable Row Level Security
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_budgets ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow authenticated users full access (single-tenant admin tool)
-- Athletes
CREATE POLICY "athletes_select" ON athletes FOR SELECT TO authenticated USING (true);
CREATE POLICY "athletes_insert" ON athletes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "athletes_update" ON athletes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "athletes_delete" ON athletes FOR DELETE TO authenticated USING (true);

-- Sponsors
CREATE POLICY "sponsors_select" ON sponsors FOR SELECT TO authenticated USING (true);
CREATE POLICY "sponsors_insert" ON sponsors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "sponsors_update" ON sponsors FOR UPDATE TO authenticated USING (true);
CREATE POLICY "sponsors_delete" ON sponsors FOR DELETE TO authenticated USING (true);

-- Campaigns
CREATE POLICY "campaigns_select" ON campaigns FOR SELECT TO authenticated USING (true);
CREATE POLICY "campaigns_insert" ON campaigns FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "campaigns_update" ON campaigns FOR UPDATE TO authenticated USING (true);
CREATE POLICY "campaigns_delete" ON campaigns FOR DELETE TO authenticated USING (true);

-- Agreements
CREATE POLICY "agreements_select" ON agreements FOR SELECT TO authenticated USING (true);
CREATE POLICY "agreements_insert" ON agreements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "agreements_update" ON agreements FOR UPDATE TO authenticated USING (true);
CREATE POLICY "agreements_delete" ON agreements FOR DELETE TO authenticated USING (true);

-- Athlete Budgets
CREATE POLICY "athlete_budgets_select" ON athlete_budgets FOR SELECT TO authenticated USING (true);
CREATE POLICY "athlete_budgets_insert" ON athlete_budgets FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "athlete_budgets_update" ON athlete_budgets FOR UPDATE TO authenticated USING (true);
CREATE POLICY "athlete_budgets_delete" ON athlete_budgets FOR DELETE TO authenticated USING (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS athletes_updated_at ON athletes;
CREATE TRIGGER athletes_updated_at BEFORE UPDATE ON athletes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS sponsors_updated_at ON sponsors;
CREATE TRIGGER sponsors_updated_at BEFORE UPDATE ON sponsors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS campaigns_updated_at ON campaigns;
CREATE TRIGGER campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS agreements_updated_at ON agreements;
CREATE TRIGGER agreements_updated_at BEFORE UPDATE ON agreements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS athlete_budgets_updated_at ON athlete_budgets;
CREATE TRIGGER athlete_budgets_updated_at BEFORE UPDATE ON athlete_budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
