-- ─────────────────────────────────────────────────────────────────
--  Cap-X — Fix event_rsvps schema
--
--  Run this in: Supabase Dashboard → SQL Editor → New Query
--
--  The event_rsvps table is missing first_name / last_name columns.
--  This script adds them safely without breaking existing data.
-- ─────────────────────────────────────────────────────────────────

-- Add first_name if missing
ALTER TABLE event_rsvps
  ADD COLUMN IF NOT EXISTS first_name text;

-- Add last_name if missing
ALTER TABLE event_rsvps
  ADD COLUMN IF NOT EXISTS last_name text;

-- Add netid if missing
ALTER TABLE event_rsvps
  ADD COLUMN IF NOT EXISTS netid text;

-- Add event_id if missing (foreign key to club_events)
ALTER TABLE event_rsvps
  ADD COLUMN IF NOT EXISTS event_id uuid REFERENCES club_events(id) ON DELETE CASCADE;

-- Backfill first_name from name column if it exists (safe no-op if column absent)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'event_rsvps' AND column_name = 'name'
  ) THEN
    UPDATE event_rsvps SET first_name = name WHERE first_name IS NULL;
  END IF;
END $$;

-- Ensure unique constraint on (email, event_id) exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'event_rsvps_email_event_id_key'
  ) THEN
    ALTER TABLE event_rsvps ADD CONSTRAINT event_rsvps_email_event_id_key UNIQUE (email, event_id);
  END IF;
END $$;

-- RLS policies (safe if already exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_rsvps' AND policyname='Anyone can RSVP to a session') THEN
    CREATE POLICY "Anyone can RSVP to a session" ON event_rsvps FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='event_rsvps' AND policyname='Anyone can read event RSVPs') THEN
    CREATE POLICY "Anyone can read event RSVPs" ON event_rsvps FOR SELECT USING (true);
  END IF;
END $$;
