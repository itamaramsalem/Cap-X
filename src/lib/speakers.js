// Populate with real speaker objects when available.
// Shape: { id, event_id, name, title, sector, date, location, capacity, bio, photo, takeaways[] }

// This UUID must match the row inserted into club_events in Supabase.
// Run seed-event.sql in the Supabase SQL Editor to create the matching event.
export const SESSION_01_EVENT_ID = 'c9d8e7f6-a5b4-4c3d-8291-0f1e2d3c4b5a';

export const SPEAKERS = [
  {
    id: 'session-01',
    event_id: SESSION_01_EVENT_ID,
    name: 'Marcus Rivera',
    title: 'Vice President · Goldman Sachs',
    sector: 'Finance & Trading',
    date: '2025-05-01',
    location: 'Rutgers Business School, Room 204',
    capacity: 50,
    bio: "Marcus Rivera is a Vice President in Goldman Sachs' Investment Banking Division, where he leads M&A advisory mandates across the industrials and consumer sectors. A first-generation college graduate, Marcus built his career through persistence, strategic networking, and a relentless focus on the fundamentals. He'll speak candidly about breaking into Wall Street, navigating the culture, and the decisions that shaped his trajectory.",
    takeaways: [
      'How to recruit for investment banking from a non-target school',
      'What Goldman Sachs actually looks for in entry-level candidates',
      'Navigating your first year on Wall Street',
      'Building a network from scratch when you don\'t have one',
    ],
    photo: null,
  },
];

export const PAST_SPEAKERS = [];
