import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/apiClient';
import { LogOut, Users, CalendarCheck, ClipboardList, ChevronDown, ChevronUp } from 'lucide-react';

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-navy-light border border-white/10 p-6 flex items-center gap-5">
      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-gold" />
      </div>
      <div>
        <p className="font-dm-sans text-white/40 text-xs uppercase tracking-[0.15em] mb-0.5">{label}</p>
        <p className="font-playfair text-white text-3xl font-bold leading-none">{value ?? '—'}</p>
      </div>
    </div>
  );
}

function MembersTable({ members }) {
  const [query, setQuery] = useState('');
  const filtered = members.filter((m) =>
    `${m.first_name} ${m.last_name} ${m.email} ${m.netid} ${m.major}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="font-playfair text-white text-2xl font-bold">
          Members <span className="text-white/30 text-lg font-normal">({members.length})</span>
        </h2>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className="bg-navy border border-white/15 text-white placeholder-white/30 font-dm-sans text-sm px-4 py-2 focus:outline-none focus:border-gold transition-colors w-56"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              {['Name', 'Email', 'NetID', 'Major', 'Grad Year', 'Joined'].map((h) => (
                <th key={h} className="font-dm-sans text-white/40 text-xs uppercase tracking-[0.12em] pb-3 pr-6 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="font-dm-sans text-white/30 text-sm pt-6 text-center">
                  No results.
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="font-dm-sans text-white text-sm py-3 pr-6 whitespace-nowrap">
                    {m.first_name} {m.last_name}
                  </td>
                  <td className="font-dm-sans text-white/60 text-sm py-3 pr-6">{m.email}</td>
                  <td className="font-dm-sans text-white/60 text-sm py-3 pr-6">{m.netid}</td>
                  <td className="font-dm-sans text-white/60 text-sm py-3 pr-6">{m.major || '—'}</td>
                  <td className="font-dm-sans text-white/60 text-sm py-3 pr-6">{m.graduation_year || '—'}</td>
                  <td className="font-dm-sans text-white/40 text-xs py-3 pr-6 whitespace-nowrap">
                    {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EventRsvpsTable({ eventRsvps, events }) {
  const [openEvent, setOpenEvent] = useState(null);

  // Group RSVPs by event_id
  const grouped = events.map((ev) => ({
    event: ev,
    rsvps: eventRsvps.filter((r) => r.event_id === ev.id),
  }));

  // Also catch RSVPs with no matching event
  const orphans = eventRsvps.filter((r) => !events.find((e) => e.id === r.event_id));

  return (
    <div>
      <h2 className="font-playfair text-white text-2xl font-bold mb-4">
        Event RSVPs <span className="text-white/30 text-lg font-normal">({eventRsvps.length} total)</span>
      </h2>

      {grouped.length === 0 && orphans.length === 0 && (
        <p className="font-dm-sans text-white/30 text-sm">No events or RSVPs yet.</p>
      )}

      <div className="space-y-3">
        {grouped.map(({ event, rsvps }) => (
          <div key={event.id} className="border border-white/10">
            <button
              onClick={() => setOpenEvent(openEvent === event.id ? null : event.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.03] transition-colors"
            >
              <div className="text-left">
                <p className="font-dm-sans text-white text-sm font-medium">{event.title}</p>
                <p className="font-dm-sans text-white/40 text-xs mt-0.5">
                  {event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Date TBD'}
                  {event.speaker ? ` · ${event.speaker}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-4">
                <span className="font-dm-sans text-gold text-sm font-semibold">{rsvps.length} RSVPs</span>
                {openEvent === event.id ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
              </div>
            </button>

            {openEvent === event.id && (
              <div className="border-t border-white/10 px-5 py-4">
                {rsvps.length === 0 ? (
                  <p className="font-dm-sans text-white/30 text-sm">No RSVPs yet.</p>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10">
                        {['Name', 'Email', 'NetID', 'Signed Up'].map((h) => (
                          <th key={h} className="font-dm-sans text-white/40 text-xs uppercase tracking-[0.12em] pb-3 pr-6">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rsvps.map((r) => (
                        <tr key={r.id} className="border-b border-white/5">
                          <td className="font-dm-sans text-white text-sm py-2.5 pr-6">{r.first_name} {r.last_name}</td>
                          <td className="font-dm-sans text-white/60 text-sm py-2.5 pr-6">{r.email}</td>
                          <td className="font-dm-sans text-white/60 text-sm py-2.5 pr-6">{r.netid || '—'}</td>
                          <td className="font-dm-sans text-white/40 text-xs py-2.5 pr-6 whitespace-nowrap">
                            {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventRsvps, setEventRsvps] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/admin/login');
      } else {
        setUser(session.user);
        fetchData();
      }
    });
  }, []);

  const fetchData = async () => {
    const [membersRes, eventsRes, rsvpsRes] = await Promise.all([
      supabase.from('members').select('*').order('created_at', { ascending: false }),
      supabase.from('club_events').select('*').order('date', { ascending: true }),
      supabase.from('event_rsvps').select('*').order('created_at', { ascending: false }),
    ]);
    setMembers(membersRes.data ?? []);
    setEvents(eventsRes.data ?? []);
    setEventRsvps(rsvpsRes.data ?? []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <p className="font-dm-sans text-white/40 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <div className="border-b border-white/10 bg-navy/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-playfair text-gold text-lg font-bold">Cap-X</span>
            <span className="font-dm-sans text-white/30 text-xs uppercase tracking-[0.15em]">Admin</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="font-dm-sans text-white/40 text-xs hidden sm:block">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 font-dm-sans text-white/50 text-xs uppercase tracking-[0.12em] hover:text-white transition-colors"
            >
              <LogOut size={13} />
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-14">
        {/* Stats */}
        <div>
          <p className="font-dm-sans text-white/40 text-xs uppercase tracking-[0.2em] mb-5">Overview</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Club Members" value={members.length} icon={Users} />
            <StatCard label="Event RSVPs" value={eventRsvps.length} icon={CalendarCheck} />
            <StatCard label="Upcoming Events" value={events.length} icon={ClipboardList} />
          </div>
        </div>

        {/* Members */}
        <div className="border-t border-white/10 pt-12">
          <MembersTable members={members} />
        </div>

        {/* Event RSVPs */}
        <div className="border-t border-white/10 pt-12">
          <EventRsvpsTable eventRsvps={eventRsvps} events={events} />
        </div>
      </div>
    </div>
  );
}
