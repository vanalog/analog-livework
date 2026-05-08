-- Seed data for NIL Management Platform
-- Run after 001_create_schema.sql

-- Insert Athletes
INSERT INTO athletes (id, first_name, last_name, email, phone, sport, position, jersey_number, class_year, university, status, notes) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Marcus', 'Johnson', 'marcus.johnson@university.edu', '555-0101', 'football', 'Quarterback', '12', 'Junior', 'State University', 'active', 'Team captain, high NIL potential'),
  ('a1000000-0000-0000-0000-000000000002', 'Sarah', 'Williams', 'sarah.williams@university.edu', '555-0102', 'basketball', 'Point Guard', '3', 'Senior', 'State University', 'active', 'All-conference selection'),
  ('a1000000-0000-0000-0000-000000000003', 'James', 'Rodriguez', 'james.rodriguez@university.edu', '555-0103', 'baseball', 'Pitcher', '21', 'Sophomore', 'State University', 'active', 'Top prospect'),
  ('a1000000-0000-0000-0000-000000000004', 'Emily', 'Chen', 'emily.chen@university.edu', '555-0104', 'soccer', 'Forward', '10', 'Junior', 'State University', 'active', 'National team camp invitee'),
  ('a1000000-0000-0000-0000-000000000005', 'David', 'Thompson', 'david.thompson@university.edu', '555-0105', 'football', 'Wide Receiver', '88', 'Senior', 'State University', 'active', 'Speed demon, social media presence'),
  ('a1000000-0000-0000-0000-000000000006', 'Ashley', 'Martinez', 'ashley.martinez@university.edu', '555-0106', 'volleyball', 'Outside Hitter', '7', 'Junior', 'State University', 'active', 'Rising star'),
  ('a1000000-0000-0000-0000-000000000007', 'Michael', 'Brown', 'michael.brown@university.edu', '555-0107', 'basketball', 'Center', '34', 'Sophomore', 'State University', 'active', 'Strong rebounder'),
  ('a1000000-0000-0000-0000-000000000008', 'Jessica', 'Davis', 'jessica.davis@university.edu', '555-0108', 'softball', 'Catcher', '22', 'Senior', 'State University', 'inactive', 'Currently injured'),
  ('a1000000-0000-0000-0000-000000000009', 'Tyler', 'Wilson', 'tyler.wilson@university.edu', '555-0109', 'football', 'Running Back', '5', 'Junior', 'State University', 'active', 'Explosive playmaker'),
  ('a1000000-0000-0000-0000-000000000010', 'Olivia', 'Taylor', 'olivia.taylor@university.edu', '555-0110', 'swimming', 'Freestyle', NULL, 'Junior', 'State University', 'active', 'Conference record holder');

-- Insert Sponsors
INSERT INTO sponsors (id, name, industry, contact_name, contact_email, contact_phone, website, status, notes) VALUES
  ('b2000000-0000-0000-0000-000000000001', 'SportZone Athletics', 'retail', 'John Smith', 'john@sportzone.com', '555-1001', 'https://sportzone.com', 'active', 'Major regional sports retailer'),
  ('b2000000-0000-0000-0000-000000000002', 'First National Bank', 'financial_services', 'Mary Johnson', 'mary.johnson@fnb.com', '555-1002', 'https://fnb.com', 'active', 'Long-term university partner'),
  ('b2000000-0000-0000-0000-000000000003', 'Peak Performance Nutrition', 'food_beverage', 'Tom Wilson', 'tom@peaknutrition.com', '555-1003', 'https://peaknutrition.com', 'active', 'Sports nutrition focus'),
  ('b2000000-0000-0000-0000-000000000004', 'AutoMax Dealers', 'automotive', 'Lisa Chen', 'lisa@automax.com', '555-1004', 'https://automax.com', 'active', 'Regional auto dealer group'),
  ('b2000000-0000-0000-0000-000000000005', 'TechStart Inc', 'technology', 'Kevin Park', 'kevin@techstart.io', '555-1005', 'https://techstart.io', 'active', 'Tech startup, social media campaigns'),
  ('b2000000-0000-0000-0000-000000000006', 'Hometown Insurance', 'financial_services', 'Nancy Brown', 'nancy@hometownins.com', '555-1006', 'https://hometownins.com', 'prospect', 'New potential partner'),
  ('b2000000-0000-0000-0000-000000000007', 'GameDay Apparel', 'retail', 'Chris Martinez', 'chris@gamedayapparel.com', '555-1007', 'https://gamedayapparel.com', 'active', 'Licensed apparel manufacturer');

-- Insert Campaigns
INSERT INTO campaigns (id, sponsor_id, name, description, start_date, end_date, budget_cents, status) VALUES
  ('c3000000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000001', 'Back to School 2024', 'Annual back to school promotion featuring student athletes', '2024-08-01', '2024-09-30', 5000000, 'active'),
  ('c3000000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000002', 'Financial Literacy Program', 'Educational content about financial planning for athletes', '2024-01-01', '2024-12-31', 10000000, 'active'),
  ('c3000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000003', 'Summer Training Fuel', 'Summer campaign promoting sports nutrition products', '2024-06-01', '2024-08-31', 2500000, 'completed'),
  ('c3000000-0000-0000-0000-000000000004', 'b2000000-0000-0000-0000-000000000004', 'Drive to Victory', 'Car dealership promotion tied to football season', '2024-09-01', '2024-12-31', 7500000, 'active'),
  ('c3000000-0000-0000-0000-000000000005', 'b2000000-0000-0000-0000-000000000005', 'Tech Influencer Series', 'Social media campaign featuring tech-savvy athletes', '2024-03-01', '2024-06-30', 3000000, 'completed'),
  ('c3000000-0000-0000-0000-000000000006', 'b2000000-0000-0000-0000-000000000007', 'Championship Collection Launch', 'New apparel line featuring top athletes', '2024-10-01', '2025-01-31', 8000000, 'active');

-- Insert Agreements
INSERT INTO agreements (id, athlete_id, sponsor_id, campaign_id, type, amount_cents, start_date, end_date, status, applies_to_ioi, notes) VALUES
  -- Revenue Share Agreements (no sponsor)
  ('d4000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', NULL, NULL, 'revenue_share', 250000, '2024-01-01', '2024-12-31', 'active', true, 'Merchandise revenue share'),
  ('d4000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', NULL, NULL, 'revenue_share', 150000, '2024-01-01', '2024-12-31', 'active', true, 'Jersey sales revenue share'),
  ('d4000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000005', NULL, NULL, 'revenue_share', 100000, '2024-06-01', '2025-05-31', 'active', true, 'Social media revenue share'),
  
  -- Sponsorship Agreements
  ('d4000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000001', 'c3000000-0000-0000-0000-000000000001', 'sponsorship', 500000, '2024-08-01', '2024-09-30', 'active', false, 'Back to school campaign appearance'),
  ('d4000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000002', 'c3000000-0000-0000-0000-000000000002', 'sponsorship', 750000, '2024-01-01', '2024-12-31', 'active', false, 'Financial literacy spokesperson'),
  ('d4000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000003', 'c3000000-0000-0000-0000-000000000003', 'sponsorship', 200000, '2024-06-01', '2024-08-31', 'completed', false, 'Summer nutrition campaign'),
  ('d4000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000004', 'c3000000-0000-0000-0000-000000000004', 'sponsorship', 1000000, '2024-09-01', '2024-12-31', 'active', false, 'Auto dealership promotion'),
  ('d4000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000005', 'b2000000-0000-0000-0000-000000000005', 'c3000000-0000-0000-0000-000000000005', 'sponsorship', 300000, '2024-03-01', '2024-06-30', 'completed', false, 'Tech influencer content'),
  ('d4000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000004', 'b2000000-0000-0000-0000-000000000007', 'c3000000-0000-0000-0000-000000000006', 'sponsorship', 400000, '2024-10-01', '2025-01-31', 'active', false, 'Apparel collection feature'),
  ('d4000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000009', 'b2000000-0000-0000-0000-000000000001', 'c3000000-0000-0000-0000-000000000001', 'sponsorship', 350000, '2024-08-01', '2024-09-30', 'active', false, 'Back to school campaign - football'),
  ('d4000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000006', 'b2000000-0000-0000-0000-000000000003', NULL, 'sponsorship', 180000, '2024-09-01', '2025-02-28', 'draft', false, 'Nutrition partnership - pending'),
  ('d4000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000007', 'b2000000-0000-0000-0000-000000000002', 'c3000000-0000-0000-0000-000000000002', 'sponsorship', 450000, '2024-06-01', '2024-12-31', 'active', false, 'Financial literacy - basketball');

-- Insert Athlete Budgets
INSERT INTO athlete_budgets (id, athlete_id, fiscal_year, total_budget_cents, spent_cents) VALUES
  ('e5000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', '2024', 200000000, 150000000),
  ('e5000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', '2024', 100000000, 75000000),
  ('e5000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', '2024', 30000000, 20000000),
  ('e5000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000004', '2024', 50000000, 35000000),
  ('e5000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000005', '2024', 80000000, 60000000),
  ('e5000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000006', '2024', 25000000, 10000000),
  ('e5000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000007', '2024', 60000000, 40000000),
  ('e5000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000009', '2024', 70000000, 45000000),
  ('e5000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000010', '2024', 35000000, 15000000);
