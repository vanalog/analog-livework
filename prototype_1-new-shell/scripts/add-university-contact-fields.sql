-- Add contact fields to universities table
ALTER TABLE universities
ADD COLUMN IF NOT EXISTS contact_name TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Update existing universities with sample contact data
UPDATE universities SET 
  contact_name = 'Athletic Director',
  contact_email = LOWER(REPLACE(name, ' ', '')) || '@edu.com',
  contact_phone = '(555) 000-0000'
WHERE contact_name IS NULL;
