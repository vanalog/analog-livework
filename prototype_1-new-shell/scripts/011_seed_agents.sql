-- Seed demo agents
INSERT INTO agents (name, email, phone) VALUES
  ('Marcus Thompson', 'marcus.thompson@elitesportsgroup.com', '(312) 555-0147'),
  ('Sarah Chen', 'sarah.chen@proathlete.agency', '(213) 555-0283'),
  ('David Rodriguez', 'david@rodriguezathletics.com', '(305) 555-0391'),
  ('Jennifer Walsh', 'jwalsh@premiersportsmanagement.com', '(404) 555-0512'),
  ('Michael Brooks', 'mbrooks@athletefirst.io', '(212) 555-0634'),
  ('Amanda Foster', 'amanda.foster@nextgenagency.com', '(415) 555-0758')
ON CONFLICT DO NOTHING;

-- Assign agents to all athletes randomly
-- First, get the agent IDs and distribute them across athletes
WITH agent_ids AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name) as rn
  FROM agents
),
athlete_updates AS (
  SELECT 
    a.id as athlete_id,
    ag.id as agent_id
  FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY last_name, first_name) as rn
    FROM athletes
  ) a
  JOIN agent_ids ag ON ((a.rn - 1) % 6) + 1 = ag.rn
)
UPDATE athletes
SET agent_id = au.agent_id
FROM athlete_updates au
WHERE athletes.id = au.athlete_id;
