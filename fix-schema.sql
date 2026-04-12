-- ─────────────────────────────────────────────────────────────────
--  Cap-X — Fix schema & seed data
--
--  Run this in: Supabase Dashboard → SQL Editor → New Query
--  Safe to run multiple times (all statements are idempotent).
-- ─────────────────────────────────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════
--  1. FIX event_rsvps — add missing columns
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS last_name  text;
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS netid      text;
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS event_id   uuid REFERENCES club_events(id) ON DELETE CASCADE;

-- Backfill first_name from legacy `name` column (no-op if column absent)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'event_rsvps' AND column_name = 'name'
  ) THEN
    UPDATE event_rsvps SET first_name = name WHERE first_name IS NULL;
  END IF;
END $$;

-- Unique constraint: one RSVP per email per event
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'event_rsvps_email_event_id_key'
  ) THEN
    ALTER TABLE event_rsvps ADD CONSTRAINT event_rsvps_email_event_id_key UNIQUE (email, event_id);
  END IF;
END $$;

-- RLS for event_rsvps
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_rsvps' AND policyname='Anyone can RSVP to a session') THEN
    CREATE POLICY "Anyone can RSVP to a session" ON event_rsvps FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_rsvps' AND policyname='Anyone can read event RSVPs') THEN
    CREATE POLICY "Anyone can read event RSVPs" ON event_rsvps FOR SELECT USING (true);
  END IF;
END $$;


-- ═══════════════════════════════════════════════════════════════
--  2. FIX club_events — add optional columns used by admin panel
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE club_events ADD COLUMN IF NOT EXISTS speaker     text;
ALTER TABLE club_events ADD COLUMN IF NOT EXISTS location    text;
ALTER TABLE club_events ADD COLUMN IF NOT EXISTS capacity    integer;
ALTER TABLE club_events ADD COLUMN IF NOT EXISTS description text;

-- RLS for club_events
ALTER TABLE club_events ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='club_events' AND policyname='Public can read events') THEN
    CREATE POLICY "Public can read events" ON club_events FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='club_events' AND policyname='Admins can insert events') THEN
    CREATE POLICY "Admins can insert events" ON club_events FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='club_events' AND policyname='Admins can delete events') THEN
    CREATE POLICY "Admins can delete events" ON club_events FOR DELETE TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='club_events' AND policyname='Admins can update events') THEN
    CREATE POLICY "Admins can update events" ON club_events FOR UPDATE TO authenticated USING (true);
  END IF;
END $$;


-- ═══════════════════════════════════════════════════════════════
--  3. FIX members — allow admins to delete members
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE members ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='members' AND policyname='Admins can delete members') THEN
    CREATE POLICY "Admins can delete members" ON members FOR DELETE TO authenticated USING (true);
  END IF;
END $$;


-- ═══════════════════════════════════════════════════════════════
--  4. CREATE past_speakers table (for the Archive page)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS past_speakers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  title       text,
  company     text,
  sector      text,
  event_date  date,
  bio         text,
  linkedin    text,
  photo_url   text,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE past_speakers ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='past_speakers' AND policyname='Public can read past speakers') THEN
    CREATE POLICY "Public can read past speakers" ON past_speakers FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='past_speakers' AND policyname='Admins can manage past speakers') THEN
    CREATE POLICY "Admins can manage past speakers" ON past_speakers FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;


-- ═══════════════════════════════════════════════════════════════
--  5. SEED Session 01 event into club_events
--     UUID must match SESSION_01_EVENT_ID in src/lib/speakers.js
-- ═══════════════════════════════════════════════════════════════

INSERT INTO club_events (id, title, speaker, date, location, sector, capacity)
VALUES (
  'c9d8e7f6-a5b4-4c3d-8291-0f1e2d3c4b5a',
  'Session 01 — Marcus Rivera · Goldman Sachs',
  'Marcus Rivera',
  '2025-05-01',
  'Rutgers Business School, Room 204',
  'Finance & Trading',
  50
)
ON CONFLICT (id) DO NOTHING;
