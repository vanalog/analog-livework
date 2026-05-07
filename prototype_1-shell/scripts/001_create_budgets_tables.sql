-- Budget Types Table
-- Stores the 4 budget categories: MBB Cap, WBB Cap, MBB NIL, WBB NIL
CREATE TABLE IF NOT EXISTS budget_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sport TEXT NOT NULL CHECK (sport IN ('MBB', 'WBB')),
  category TEXT NOT NULL CHECK (category IN ('REVENUE_SHARE', 'NIL_MARKETING')),
  fiscal_year_start_month INTEGER NOT NULL CHECK (fiscal_year_start_month BETWEEN 1 AND 12),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budget Periods Table
-- Stores budget amounts for each fiscal year period
CREATE TABLE IF NOT EXISTS budget_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_type_id UUID NOT NULL REFERENCES budget_types(id) ON DELETE CASCADE,
  fiscal_year_label TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  rollover_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  committed_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(budget_type_id, fiscal_year_label)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_budget_periods_type_id ON budget_periods(budget_type_id);
CREATE INDEX IF NOT EXISTS idx_budget_periods_dates ON budget_periods(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_budget_types_sport ON budget_types(sport);
CREATE INDEX IF NOT EXISTS idx_budget_types_category ON budget_types(category);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to both tables
DROP TRIGGER IF EXISTS update_budget_types_updated_at ON budget_types;
CREATE TRIGGER update_budget_types_updated_at
  BEFORE UPDATE ON budget_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_budget_periods_updated_at ON budget_periods;
CREATE TRIGGER update_budget_periods_updated_at
  BEFORE UPDATE ON budget_periods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Disable RLS for now (internal tool, no auth yet)
ALTER TABLE budget_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_periods ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (no auth)
CREATE POLICY "Allow all on budget_types" ON budget_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on budget_periods" ON budget_periods FOR ALL USING (true) WITH CHECK (true);
