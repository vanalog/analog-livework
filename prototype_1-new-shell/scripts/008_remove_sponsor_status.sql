-- Remove the status column from sponsors entirely.
-- The active/inactive/prospect concept is not in use and needs more design work
-- before being reintroduced. Dropping the column (and its CHECK constraint)
-- simplifies the schema and the UI until then.

ALTER TABLE sponsors
  DROP CONSTRAINT IF EXISTS sponsors_status_check;

ALTER TABLE sponsors
  DROP COLUMN IF EXISTS status;
