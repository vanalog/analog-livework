-- Create contracts and related tables for contract persistence and cap tracking

-- Main contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contract metadata
  athlete_name TEXT NOT NULL,
  athlete_id TEXT,
  team TEXT NOT NULL CHECK (team IN ('mens-basketball', 'womens-basketball')),
  counterparty_name TEXT NOT NULL,
  counterparty_id TEXT,
  
  -- Contract details
  contract_type TEXT NOT NULL DEFAULT 'revenue-share',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  
  -- Date range
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Payment configuration
  payment_frequency TEXT NOT NULL CHECK (payment_frequency IN ('bi-weekly', 'monthly', 'quarterly')),
  total_value DECIMAL(15, 2) NOT NULL DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contract payments (the generated schedule)
CREATE TABLE IF NOT EXISTS contract_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  
  payment_date DATE NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  payment_type TEXT NOT NULL DEFAULT 'License Fee',
  cap_period TEXT NOT NULL,
  fiscal_year TEXT NOT NULL,
  cap_applicable BOOLEAN NOT NULL DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contract cap period allocations (links contracts to budget periods for committed tracking)
CREATE TABLE IF NOT EXISTS contract_cap_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  budget_period_id UUID NOT NULL REFERENCES budget_periods(id) ON DELETE CASCADE,
  allocated_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(contract_id, budget_period_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contracts_team ON contracts(team);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contract_payments_contract_id ON contract_payments(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_cap_allocations_contract_id ON contract_cap_allocations(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_cap_allocations_budget_period_id ON contract_cap_allocations(budget_period_id);

-- Enable RLS (allow all for now - can be restricted later)
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_cap_allocations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on contracts" ON contracts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on contract_payments" ON contract_payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on contract_cap_allocations" ON contract_cap_allocations FOR ALL USING (true) WITH CHECK (true);

-- Triggers for updated_at (reuse existing function from budgets)
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contract_payments_updated_at BEFORE UPDATE ON contract_payments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contract_cap_allocations_updated_at BEFORE UPDATE ON contract_cap_allocations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
