-- Add university_id column to agreements table for revenue share agreements
ALTER TABLE agreements ADD COLUMN IF NOT EXISTS university_id uuid REFERENCES universities(id);

-- Update existing revenue share agreements to link to the athlete's university
UPDATE agreements a
SET university_id = ath.university_id
FROM athletes ath
WHERE a.athlete_id = ath.id
  AND a.type = 'revenue_share'
  AND a.university_id IS NULL;
