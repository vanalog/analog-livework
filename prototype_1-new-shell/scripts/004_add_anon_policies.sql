-- Add RLS policies for anon users (development/demo mode)
-- This allows unauthenticated access for testing

-- Athletes
DROP POLICY IF EXISTS "athletes_anon_select" ON athletes;
DROP POLICY IF EXISTS "athletes_anon_insert" ON athletes;
DROP POLICY IF EXISTS "athletes_anon_update" ON athletes;
DROP POLICY IF EXISTS "athletes_anon_delete" ON athletes;

CREATE POLICY "athletes_anon_select" ON athletes FOR SELECT TO anon USING (true);
CREATE POLICY "athletes_anon_insert" ON athletes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "athletes_anon_update" ON athletes FOR UPDATE TO anon USING (true);
CREATE POLICY "athletes_anon_delete" ON athletes FOR DELETE TO anon USING (true);

-- Sponsors
DROP POLICY IF EXISTS "sponsors_anon_select" ON sponsors;
DROP POLICY IF EXISTS "sponsors_anon_insert" ON sponsors;
DROP POLICY IF EXISTS "sponsors_anon_update" ON sponsors;
DROP POLICY IF EXISTS "sponsors_anon_delete" ON sponsors;

CREATE POLICY "sponsors_anon_select" ON sponsors FOR SELECT TO anon USING (true);
CREATE POLICY "sponsors_anon_insert" ON sponsors FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "sponsors_anon_update" ON sponsors FOR UPDATE TO anon USING (true);
CREATE POLICY "sponsors_anon_delete" ON sponsors FOR DELETE TO anon USING (true);

-- Campaigns
DROP POLICY IF EXISTS "campaigns_anon_select" ON campaigns;
DROP POLICY IF EXISTS "campaigns_anon_insert" ON campaigns;
DROP POLICY IF EXISTS "campaigns_anon_update" ON campaigns;
DROP POLICY IF EXISTS "campaigns_anon_delete" ON campaigns;

CREATE POLICY "campaigns_anon_select" ON campaigns FOR SELECT TO anon USING (true);
CREATE POLICY "campaigns_anon_insert" ON campaigns FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "campaigns_anon_update" ON campaigns FOR UPDATE TO anon USING (true);
CREATE POLICY "campaigns_anon_delete" ON campaigns FOR DELETE TO anon USING (true);

-- Agreements
DROP POLICY IF EXISTS "agreements_anon_select" ON agreements;
DROP POLICY IF EXISTS "agreements_anon_insert" ON agreements;
DROP POLICY IF EXISTS "agreements_anon_update" ON agreements;
DROP POLICY IF EXISTS "agreements_anon_delete" ON agreements;

CREATE POLICY "agreements_anon_select" ON agreements FOR SELECT TO anon USING (true);
CREATE POLICY "agreements_anon_insert" ON agreements FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "agreements_anon_update" ON agreements FOR UPDATE TO anon USING (true);
CREATE POLICY "agreements_anon_delete" ON agreements FOR DELETE TO anon USING (true);

-- Athlete Budgets
DROP POLICY IF EXISTS "athlete_budgets_anon_select" ON athlete_budgets;
DROP POLICY IF EXISTS "athlete_budgets_anon_insert" ON athlete_budgets;
DROP POLICY IF EXISTS "athlete_budgets_anon_update" ON athlete_budgets;
DROP POLICY IF EXISTS "athlete_budgets_anon_delete" ON athlete_budgets;

CREATE POLICY "athlete_budgets_anon_select" ON athlete_budgets FOR SELECT TO anon USING (true);
CREATE POLICY "athlete_budgets_anon_insert" ON athlete_budgets FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "athlete_budgets_anon_update" ON athlete_budgets FOR UPDATE TO anon USING (true);
CREATE POLICY "athlete_budgets_anon_delete" ON athlete_budgets FOR DELETE TO anon USING (true);
