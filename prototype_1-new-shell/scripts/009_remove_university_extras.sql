-- Remove unused columns from universities table
-- These fields were not being used meaningfully in the product
ALTER TABLE universities
  DROP COLUMN IF EXISTS abbreviation,
  DROP COLUMN IF EXISTS location,
  DROP COLUMN IF EXISTS primary_color,
  DROP COLUMN IF EXISTS notes;
