-- Add budget_cents column to sponsors table
ALTER TABLE public.sponsors 
ADD COLUMN IF NOT EXISTS budget_cents bigint DEFAULT NULL;

-- Add a comment explaining the column
COMMENT ON COLUMN public.sponsors.budget_cents IS 'Total budget in cents for this sponsor relationship. NULL means no budget limit.';
