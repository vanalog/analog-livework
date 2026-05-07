-- Add rollover_enabled column to budget_periods table
-- When true, the Available amount from this period will automatically become
-- the Rollover amount for the next period in sequence

ALTER TABLE budget_periods
ADD COLUMN IF NOT EXISTS rollover_enabled boolean DEFAULT false;

-- Add a comment for documentation
COMMENT ON COLUMN budget_periods.rollover_enabled IS 'When true, the Available amount from this period automatically rolls over to the next period';
