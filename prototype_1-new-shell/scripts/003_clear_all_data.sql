-- Clear all data from tables (in order respecting foreign keys)
-- Agreements references athletes, sponsors, campaigns
-- Campaigns references sponsors
-- Athlete_budgets references athletes

TRUNCATE TABLE agreements CASCADE;
TRUNCATE TABLE campaigns CASCADE;
TRUNCATE TABLE athlete_budgets CASCADE;
TRUNCATE TABLE athletes CASCADE;
TRUNCATE TABLE sponsors CASCADE;
