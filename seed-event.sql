-- ─────────────────────────────────────────────────────────────────
--  Cap-X — Seed: Session 01
--
--  Run this in: Supabase Dashboard → SQL Editor → New Query
--
--  This inserts the first speaker event so it appears in:
--    • The Speaker Schedule on the website
--    • The Event Calendar (May 2025)
--    • The Admin portal (Event RSVPs section)
--
--  The UUID below MUST match SESSION_01_EVENT_ID in src/lib/speakers.js
-- ─────────────────────────────────────────────────────────────────

INSERT INTO club_events (id, title, speaker, description, date, location, capacity, sector)
VALUES (
  'c9d8e7f6-a5b4-4c3d-8291-0f1e2d3c4b5a',
  'Session 01 — Marcus Rivera, Goldman Sachs',
  'Marcus Rivera',
  'Marcus Rivera is a Vice President in Goldman Sachs'' Investment Banking Division, where he leads M&A advisory mandates across the industrials and consumer sectors. He''ll speak candidly about breaking into Wall Street, recruiting from a non-target school, and the decisions that shaped his career.',
  '2025-05-01',
  'Rutgers Business School, Room 204',
  50,
  'Finance & Trading'
)
ON CONFLICT (id) DO NOTHING;

-- Also add an INSERT policy so the admin portal can create future events
-- (skip if you already have one)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'club_events' AND policyname = 'Admins can insert events'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Admins can insert events"
        ON club_events FOR INSERT
        WITH CHECK (auth.role() = 'authenticated');
    $policy$;
  END IF;
END $$;
