-- ─────────────────────────────────────────────────────────────────
--  Cap-X Database Setup
--  Run this in Supabase → SQL Editor
--
--  After running, create admin users in:
--  Supabase Dashboard → Authentication → Users → Add User
--  Create one account per admin using their scarletmail address.
-- ─────────────────────────────────────────────────────────────────

-- ── 1. Members — club pre-registration ───────────────────────────
create table if not exists members (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  first_name      text not null,
  last_name       text not null,
  email           text not null unique,
  netid           text not null,
  major           text,
  graduation_year text
);

alter table members enable row level security;

create policy "Anyone can pre-register as member"
  on members for insert with check (true);

-- Only authenticated admins can read member data
create policy "Admins can read members"
  on members for select using (auth.role() = 'authenticated');


-- ── 2. Club Events — sessions / speakers ─────────────────────────
create table if not exists club_events (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  title       text not null,
  speaker     text,
  description text,
  date        date,
  location    text,
  capacity    int default 50,
  sector      text
);

alter table club_events enable row level security;

create policy "Anyone can view events"
  on club_events for select using (true);


-- ── 3. Event RSVPs — RSVP to a specific session ──────────────────
create table if not exists event_rsvps (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  first_name text not null,
  last_name  text not null,
  email      text not null,
  netid      text,
  event_id   uuid references club_events(id) on delete cascade,
  unique (email, event_id)
);

alter table event_rsvps enable row level security;

create policy "Anyone can RSVP to a session"
  on event_rsvps for insert with check (true);

create policy "Anyone can read event RSVPs"
  on event_rsvps for select using (true);


-- ── 4. RSVPs (legacy general interest table) ─────────────────────
create table if not exists rsvps (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  scarlet_mail text not null unique,
  netid       text not null,
  speaker_id  text
);

alter table rsvps enable row level security;

create policy "Anyone can submit general RSVP"
  on rsvps for insert with check (true);

create policy "Anyone can read RSVP count"
  on rsvps for select using (true);
