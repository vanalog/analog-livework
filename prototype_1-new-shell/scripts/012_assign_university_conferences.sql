-- Assign conferences to universities based on current (2024-2026) alignment.
-- Idempotent: only updates rows where conference is NULL or empty, so running
-- it again won't clobber manual edits made via the admin UI.

-- Ensure "West Coast" conference exists for Gonzaga (not in the original seed).
INSERT INTO conferences (name, sort_order)
VALUES ('West Coast', 16)
ON CONFLICT (name) DO NOTHING;

-- SEC
UPDATE universities SET conference = 'SEC'
WHERE (conference IS NULL OR conference = '')
  AND name IN (
    'University of Alabama',
    'University of Georgia',
    'University of Florida',
    'University of Kentucky',
    'University of South Carolina',
    'University of Arkansas',
    'Vanderbilt University',
    'Texas A&M University',
    'University of Texas',
    'University of Oklahoma'
  );

-- Big Ten
UPDATE universities SET conference = 'Big Ten'
WHERE (conference IS NULL OR conference = '')
  AND name IN (
    'Ohio State University',
    'University of Michigan',
    'Penn State University',
    'University of Oregon',
    'University of Iowa',
    'University of Maryland',
    'University of Nebraska',
    'University of Wisconsin'
  );

-- ACC
UPDATE universities SET conference = 'ACC'
WHERE (conference IS NULL OR conference = '')
  AND name IN (
    'Clemson University',
    'Duke University',
    'University of North Carolina',
    'Stanford University'
  );

-- Big 12
UPDATE universities SET conference = 'Big 12'
WHERE (conference IS NULL OR conference = '')
  AND name IN (
    'University of Kansas',
    'University of Arizona',
    'Baylor University'
  );

-- Big East
UPDATE universities SET conference = 'Big East'
WHERE (conference IS NULL OR conference = '')
  AND name IN (
    'Villanova University',
    'University of Connecticut'
  );

-- West Coast Conference
UPDATE universities SET conference = 'West Coast'
WHERE (conference IS NULL OR conference = '')
  AND name = 'Gonzaga University';

-- Generic/test fixtures: fall back to "Other" for any remaining unmatched rows.
UPDATE universities SET conference = 'Other'
WHERE conference IS NULL OR conference = '';
