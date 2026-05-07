-- Create the contract_conditional_payments table for storing conditional/bonus payments
CREATE TABLE IF NOT EXISTS contract_conditional_payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id uuid NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  payment_date date NOT NULL,
  amount numeric NOT NULL,
  payment_type text NOT NULL,
  cap_period text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create index for faster lookups by contract_id
CREATE INDEX IF NOT EXISTS idx_contract_conditional_payments_contract_id 
  ON contract_conditional_payments(contract_id);
