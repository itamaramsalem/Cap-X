-- ─────────────────────────────────────────────────────────────────
--  Cap-X — Fix schema, seed data, and storage
--
--  Run this in: Supabase Dashboard → SQL Editor → New Query
--  Safe to run multiple times (all statements are idempotent).
--
--  After running, go to:
--  Settings → API → "Reload schema cache" (if tables still not found)
-- ─────────────────────────────────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════
--  1. CREATE past_speakers table  ← moved to top so it can't be
--     blocked by failures in other sections
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
--  2. CREATE speaker_photos table (photo overrides for upcoming speakers)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS speaker_photos (
  speaker_id  text PRIMARY KEY,
  photo_url   text,
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE speaker_photos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='speaker_photos' AND policyname='Public can read speaker photos') THEN
    CREATE POLICY "Public can read speaker photos" ON speaker_photos FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='speaker_photos' AND policyname='Admins can manage speaker photos') THEN
    CREATE POLICY "Admins can manage speaker photos" ON speaker_photos FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;


-- ═══════════════════════════════════════════════════════════════
--  3. CREATE is_cap_x_member() — SECURITY DEFINER so anon users
--     can check membership without a SELECT policy on members
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION is_cap_x_member(member_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM members WHERE lower(email) = lower(member_email)
  );
$$;

GRANT EXECUTE ON FUNCTION is_cap_x_member TO anon;
GRANT EXECUTE ON FUNCTION is_cap_x_member TO authenticated;


-- ═══════════════════════════════════════════════════════════════
--  4. FIX event_rsvps — add missing columns
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
--  5. FIX club_events — add optional columns
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE club_events ADD COLUMN IF NOT EXISTS speaker     text;
ALTER TABLE club_events ADD COLUMN IF NOT EXISTS location    text;
ALTER TABLE club_events ADD COLUMN IF NOT EXISTS capacity    integer;
ALTER TABLE club_events ADD COLUMN IF NOT EXISTS description text;

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
--  6. FIX members — allow admins to delete
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='members' AND policyname='Admins can delete members') THEN
    CREATE POLICY "Admins can delete members" ON members FOR DELETE TO authenticated USING (true);
  END IF;
END $$;


-- ═══════════════════════════════════════════════════════════════
--  7. STORAGE — create 'photos' bucket for image uploads
-- ═══════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'photos',
  'photos',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read photos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public photo read'
  ) THEN
    CREATE POLICY "Public photo read" ON storage.objects
      FOR SELECT USING (bucket_id = 'photos');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can upload photos'
  ) THEN
    CREATE POLICY "Admins can upload photos" ON storage.objects
      FOR INSERT TO authenticated WITH CHECK (bucket_id = 'photos');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can delete photos'
  ) THEN
    CREATE POLICY "Admins can delete photos" ON storage.objects
      FOR DELETE TO authenticated USING (bucket_id = 'photos');
  END IF;
END $$;


-- ═══════════════════════════════════════════════════════════════
--  8. SEED Session 01 event (date: 2026-05-01)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO club_events (id, title, speaker, date, location, sector, capacity)
VALUES (
  'c9d8e7f6-a5b4-4c3d-8291-0f1e2d3c4b5a',
  'Session 01 — Marcus Rivera · Goldman Sachs',
  'Marcus Rivera',
  '2026-05-01',
  'Rutgers Business School, Room 204',
  'Finance & Trading',
  50
)
ON CONFLICT (id) DO UPDATE SET date = '2026-05-01';
