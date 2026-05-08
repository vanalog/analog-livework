-- Migrate existing athlete university text values to universities table

-- Step 1: Insert distinct universities from athletes table
INSERT INTO universities (name)
SELECT DISTINCT university 
FROM athletes 
WHERE university IS NOT NULL AND university != ''
ON CONFLICT (name) DO NOTHING;

-- Step 2: Add university_id column to athletes table
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS university_id UUID REFERENCES universities(id) ON DELETE SET NULL;

-- Step 3: Create index for the new foreign key
CREATE INDEX IF NOT EXISTS idx_athletes_university_id ON athletes(university_id);

-- Step 4: Update athletes with their university_id based on existing text values
UPDATE athletes a
SET university_id = u.id
FROM universities u
WHERE a.university = u.name AND a.university_id IS NULL;
