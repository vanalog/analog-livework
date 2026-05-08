-- =====================================================================
-- NIL Go submission status for sponsorship agreements
--
-- Adds:
--   1. agreements.nil_go_status         denormalized current status
--   2. nil_go_status_events             append-only history log
--
-- Status values: pending | submitted | resubmitted | rejected | approved
--
-- Revenue share agreements keep nil_go_status = NULL (they don't go through
-- the NCAA NIL Go clearinghouse). Sponsorship agreements default to
-- 'pending'. Existing sponsorships are randomly backfilled with a realistic
-- status + matching event chain so the timeline UI has data to render.
-- =====================================================================

-- 1. Add the denormalized current-status column on agreements ----------
ALTER TABLE public.agreements
  ADD COLUMN IF NOT EXISTS nil_go_status text;

-- 2. Append-only history table -----------------------------------------
CREATE TABLE IF NOT EXISTS public.nil_go_status_events (
  id           uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id uuid          NOT NULL REFERENCES public.agreements(id) ON DELETE CASCADE,
  status       text          NOT NULL CHECK (status IN ('pending','submitted','resubmitted','rejected','approved')),
  note         text,
  created_at   timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS nil_go_status_events_agreement_idx
  ON public.nil_go_status_events (agreement_id, created_at DESC);

-- 3. Backfill existing sponsorship agreements --------------------------
DO $$
DECLARE
  rec          record;
  picked       text;
  base_ts      timestamptz;
  rnd          double precision;
BEGIN
  FOR rec IN
    SELECT id, created_at
    FROM public.agreements
    WHERE type = 'sponsorship' AND nil_go_status IS NULL
  LOOP
    rnd := random();
    -- 30% pending, 20% submitted, 10% resubmitted, 10% rejected, 30% approved
    picked := CASE
      WHEN rnd < 0.30 THEN 'pending'
      WHEN rnd < 0.50 THEN 'submitted'
      WHEN rnd < 0.60 THEN 'resubmitted'
      WHEN rnd < 0.70 THEN 'rejected'
      ELSE 'approved'
    END;

    base_ts := COALESCE(rec.created_at, now() - interval '30 days');

    -- Always log the initial pending event at the agreement's creation time.
    INSERT INTO public.nil_go_status_events (agreement_id, status, created_at, note)
    VALUES (rec.id, 'pending', base_ts, 'Auto-created: agreement opened.');

    -- Add follow-up events to build a realistic timeline.
    IF picked = 'submitted' THEN
      INSERT INTO public.nil_go_status_events (agreement_id, status, created_at)
      VALUES (rec.id, 'submitted', base_ts + interval '2 days');
    ELSIF picked = 'resubmitted' THEN
      INSERT INTO public.nil_go_status_events (agreement_id, status, created_at)
      VALUES (rec.id, 'submitted', base_ts + interval '2 days');
      INSERT INTO public.nil_go_status_events (agreement_id, status, created_at, note)
      VALUES (rec.id, 'resubmitted', base_ts + interval '6 days', 'Updated documentation and re-submitted.');
    ELSIF picked = 'rejected' THEN
      INSERT INTO public.nil_go_status_events (agreement_id, status, created_at)
      VALUES (rec.id, 'submitted', base_ts + interval '2 days');
      INSERT INTO public.nil_go_status_events (agreement_id, status, created_at, note)
      VALUES (rec.id, 'rejected', base_ts + interval '5 days', 'Insufficient fair-market-value justification.');
    ELSIF picked = 'approved' THEN
      INSERT INTO public.nil_go_status_events (agreement_id, status, created_at)
      VALUES (rec.id, 'submitted', base_ts + interval '2 days');
      INSERT INTO public.nil_go_status_events (agreement_id, status, created_at)
      VALUES (rec.id, 'approved', base_ts + interval '5 days');
    END IF;

    UPDATE public.agreements SET nil_go_status = picked WHERE id = rec.id;
  END LOOP;
END $$;

-- 4. Make sure revenue share rows are NULL (not 'pending'). ------------
UPDATE public.agreements SET nil_go_status = NULL WHERE type = 'revenue_share';
