-- Drop the unused is_active flag from taxonomy tables.
-- The UI was letting users toggle sports/conferences between "Active" and
-- "Hidden", but nothing in the app actually reads that flag to change
-- behavior, so the column is noise. Remove it from both tables.

ALTER TABLE public.sports DROP COLUMN IF EXISTS is_active;
ALTER TABLE public.conferences DROP COLUMN IF EXISTS is_active;
