-- Drop existing tables and recreate with clean schema
DROP TABLE IF EXISTS contract_cap_allocations CASCADE;
DROP TABLE IF EXISTS contract_payments CASCADE;
DROP TABLE IF EXISTS contracts CASCADE;

-- Create contracts table (no foreign keys to non-existent tables)
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_name TEXT NOT NULL,
  counterparty_name TEXT NOT NULL,
  team TEXT NOT NULL CHECK (team IN ('MBB', 'WBB')),
  contract_type TEXT NOT NULL DEFAULT 'revenue-share',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_frequency TEXT NOT NULL CHECK (payment_frequency IN ('bi-weekly', 'monthly', 'quarterly')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create contract_payments table
CREATE TABLE contract_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  payment_date DATE NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  cap_period TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create contract_cap_allocations table
CREATE TABLE contract_cap_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  budget_period_id UUID NOT NULL REFERENCES budget_periods(id) ON DELETE CASCADE,
  allocated_amount NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contract_id, budget_period_id)
);

-- Create indexes
CREATE INDEX idx_contracts_team ON contracts(team);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contract_payments_contract_id ON contract_payments(contract_id);
CREATE INDEX idx_contract_cap_allocations_contract_id ON contract_cap_allocations(contract_id);
CREATE INDEX idx_contract_cap_allocations_budget_period_id ON contract_cap_allocations(budget_period_id);

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
