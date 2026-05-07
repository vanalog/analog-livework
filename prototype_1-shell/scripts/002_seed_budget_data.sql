-- Seed Budget Types
INSERT INTO budget_types (id, name, sport, category, fiscal_year_start_month, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'MBB Revenue Share Cap', 'MBB', 'REVENUE_SHARE', 7, 'Men''s Basketball NIL Revenue Share Cap (Jul-Jun fiscal year)'),
  ('22222222-2222-2222-2222-222222222222', 'WBB Revenue Share Cap', 'WBB', 'REVENUE_SHARE', 7, 'Women''s Basketball NIL Revenue Share Cap (Jul-Jun fiscal year)'),
  ('33333333-3333-3333-3333-333333333333', 'MBB NIL Marketing', 'MBB', 'NIL_MARKETING', 4, 'Men''s Basketball NIL Marketing Budget (Apr-Apr fiscal year)'),
  ('44444444-4444-4444-4444-444444444444', 'WBB NIL Marketing', 'WBB', 'NIL_MARKETING', 4, 'Women''s Basketball NIL Marketing Budget (Apr-Apr fiscal year)')
ON CONFLICT (id) DO NOTHING;

-- Seed MBB Revenue Share Cap Periods
INSERT INTO budget_periods (budget_type_id, fiscal_year_label, start_date, end_date, budget_amount, rollover_amount, committed_amount, notes) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Jul ''25 - Jun ''26', '2025-07-01', '2026-06-30', 2300000.00, 0.00, 1875000.00, 'Year 1 - Initial cap'),
  ('11111111-1111-1111-1111-111111111111', 'Jul ''26 - Jun ''27', '2026-07-01', '2027-06-30', 3500000.00, 425000.00, 900000.00, 'Year 2 - Rollover from Year 1'),
  ('11111111-1111-1111-1111-111111111111', 'Jul ''27 - Jun ''28', '2027-07-01', '2028-06-30', 3500000.00, 0.00, 0.00, 'Year 3 - Projected')
ON CONFLICT (budget_type_id, fiscal_year_label) DO UPDATE SET
  budget_amount = EXCLUDED.budget_amount,
  rollover_amount = EXCLUDED.rollover_amount,
  committed_amount = EXCLUDED.committed_amount,
  notes = EXCLUDED.notes;

-- Seed WBB Revenue Share Cap Periods
INSERT INTO budget_periods (budget_type_id, fiscal_year_label, start_date, end_date, budget_amount, rollover_amount, committed_amount, notes) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Jul ''25 - Jun ''26', '2025-07-01', '2026-06-30', 1300000.00, 0.00, 1300000.00, 'Year 1 - Fully committed'),
  ('22222222-2222-2222-2222-222222222222', 'Jul ''26 - Jun ''27', '2026-07-01', '2027-06-30', 1300000.00, 0.00, 0.00, 'Year 2'),
  ('22222222-2222-2222-2222-222222222222', 'Jul ''27 - Jun ''28', '2027-07-01', '2028-06-30', 1300000.00, 0.00, 0.00, 'Year 3 - Projected')
ON CONFLICT (budget_type_id, fiscal_year_label) DO UPDATE SET
  budget_amount = EXCLUDED.budget_amount,
  rollover_amount = EXCLUDED.rollover_amount,
  committed_amount = EXCLUDED.committed_amount,
  notes = EXCLUDED.notes;

-- Seed MBB NIL Marketing Periods
INSERT INTO budget_periods (budget_type_id, fiscal_year_label, start_date, end_date, budget_amount, rollover_amount, committed_amount, notes) VALUES
  ('33333333-3333-3333-3333-333333333333', 'Apr ''26 - Apr ''27', '2026-04-01', '2027-03-31', 7000000.00, 0.00, 0.00, 'Up to 12.5MM (planning on using 6.5MM). Portal to portal, sport dependent.')
ON CONFLICT (budget_type_id, fiscal_year_label) DO UPDATE SET
  budget_amount = EXCLUDED.budget_amount,
  rollover_amount = EXCLUDED.rollover_amount,
  committed_amount = EXCLUDED.committed_amount,
  notes = EXCLUDED.notes;

-- Seed WBB NIL Marketing Periods
INSERT INTO budget_periods (budget_type_id, fiscal_year_label, start_date, end_date, budget_amount, rollover_amount, committed_amount, notes) VALUES
  ('44444444-4444-4444-4444-444444444444', 'Apr ''26 - Apr ''27', '2026-04-01', '2027-03-31', 300000.00, 0.00, 50000.00, 'WBB NIL Marketing allocation')
ON CONFLICT (budget_type_id, fiscal_year_label) DO UPDATE SET
  budget_amount = EXCLUDED.budget_amount,
  rollover_amount = EXCLUDED.rollover_amount,
  committed_amount = EXCLUDED.committed_amount,
  notes = EXCLUDED.notes;
