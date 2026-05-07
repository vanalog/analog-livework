-- Drop and recreate contracts table to fix schema cache issue
-- This will clear the stale 'notes' column from the PostgREST cache

-- First drop dependent tables
DROP TABLE IF EXISTS contract_cap_allocations CASCADE;
DROP TABLE IF EXISTS contract_payments CASCADE;
DROP TABLE IF EXISTS contracts CASCADE;

-- Recreate contracts table (without notes column)
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_name TEXT NOT NULL,
  athlete_id UUID REFERENCES athletes(id) ON DELETE SET NULL,
  team TEXT NOT NULL CHECK (team IN ('MBB', 'WBB')),
  counterparty_name TEXT NOT NULL,
  counterparty_id UUID,
  contract_type TEXT NOT NULL DEFAULT 'revenue-share',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  payment_frequency TEXT NOT NULL CHECK (payment_frequency IN ('bi-weekly', 'monthly', 'quarterly')),
  total_value NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recreate contract_payments table
CREATE TABLE contract_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  payment_date DATE NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  cap_period TEXT,
  fiscal_year TEXT,
  payment_type TEXT DEFAULT 'scheduled',
  cap_applicable BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recreate contract_cap_allocations table
CREATE TABLE contract_cap_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  budget_period_id UUID NOT NULL REFERENCES budget_periods(id) ON DELETE CASCADE,
  allocated_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contract_id, budget_period_id)
);

-- Create indexes
CREATE INDEX idx_contracts_team ON contracts(team);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_athlete ON contracts(athlete_name);
CREATE INDEX idx_contract_payments_contract ON contract_payments(contract_id);
CREATE INDEX idx_contract_payments_date ON contract_payments(payment_date);
CREATE INDEX idx_contract_cap_allocations_contract ON contract_cap_allocations(contract_id);
CREATE INDEX idx_contract_cap_allocations_period ON contract_cap_allocations(budget_period_id);

-- Force schema cache refresh
NOTIFY pgrst, 'reload schema';
