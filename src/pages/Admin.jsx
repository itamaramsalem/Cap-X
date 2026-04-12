import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/apiClient';
import { LogOut, Users, CalendarCheck, ClipboardList, ChevronDown, ChevronUp, Trash2, Download, Plus, X } from 'lucide-react';

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

function MembersTable({ members, onDelete }) {
  const [query, setQuery] = useState('');
  const [deleting, setDeleting] = useState(null);

  const filtered = members.filter((m) =>
    `${m.first_name} ${m.last_name} ${m.email} ${m.netid} ${m.major}`.toLowerCase().includes(query.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'NetID', 'Major', 'Grad Year', 'Joined'];
    const rows = filtered.map((m) => [
      m.first_name, m.last_name, m.email, m.netid, m.major || '', m.graduation_year || '',
      new Date(m.created_at).toLocaleDateString('en-US'),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `capx-members-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (m) => {
    if (!window.confirm(`Remove ${m.first_name} ${m.last_name} from the member list?`)) return;
    setDeleting(m.id);
    await supabase.from('members').delete().eq('id', m.id);
    onDelete(m.id);
    setDeleting(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="font-playfair text-white text-2xl font-bold">
          Members <span className="text-white/30 text-lg font-normal">({members.length})</span>
        </h2>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="bg-navy border border-white/15 text-white placeholder-white/30 font-dm-sans text-sm px-4 py-2 focus:outline-none focus:border-gold transition-colors w-56"
          />
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 bg-navy border border-white/15 text-white/60 hover:text-white font-dm-sans text-xs uppercase tracking-[0.12em] px-4 py-2 hover:border-white/30 transition-colors"
          >
            <Download size={13} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              {['Name', 'Email', 'NetID', 'Major', 'Grad Year', 'Joined', ''].map((h) => (
                <th key={h} className="font-dm-sans text-white/40 text-xs uppercase tracking-[0.12em] pb-3 pr-6 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="font-dm-sans text-white/30 text-sm pt-6 text-center">
                  No results.
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
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
                  <td className="py-3">
                    <button
                      onClick={() => handleDelete(m)}
                      disabled={deleting === m.id}
                      className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all disabled:opacity-30"
                    >
                      <Trash2 size={14} />
                    </button>
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

function CreateEventForm({ onCreated }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', speaker: '', date: '', total_seats: '' });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      speaker: form.speaker || null,
      date: form.date || null,
      total_seats: form.total_seats ? parseInt(form.total_seats) : null,
    };
    const { data } = await supabase.from('club_events').insert(payload).select().single();
    if (data) onCreated(data);
    setForm({ title: '', speaker: '', date: '', total_seats: '' });
    setOpen(false);
    setSaving(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.12em] px-4 py-2 hover:bg-gold-dark transition-colors"
      >
        <Plus size={13} />
        New Event
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-white/15 bg-navy-light p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <p className="font-dm-sans text-white text-sm font-semibold uppercase tracking-[0.12em]">New Event</p>
        <button type="button" onClick={() => setOpen(false)} className="text-white/30 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="font-dm-sans text-white/40 text-xs uppercase tracking-[0.12em] block mb-1.5">Title *</label>
          <input required value={form.title} onChange={set('title')} className="w-full bg-navy border border-white/15 text-white font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors" />
        </div>
        <div>
          <label className="font-dm-sans text-white/40 text-xs uppercase tracking-[0.12em] block mb-1.5">Speaker</label>
          <input value={form.speaker} onChange={set('speaker')} className="w-full bg-navy border border-white/15 text-white font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors" />
        </div>
        <div>
          <label className="font-dm-sans text-white/40 text-xs uppercase tracking-[0.12em] block mb-1.5">Date</label>
          <input type="date" value={form.date} onChange={set('date')} className="w-full bg-navy border border-white/15 text-white font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors" />
        </div>
        <div>
          <label className="font-dm-sans text-white/40 text-xs uppercase tracking-[0.12em] block mb-1.5">Seat Limit</label>
          <input type="number" min="1" value={form.total_seats} onChange={set('total_seats')} placeholder="Unlimited" className="w-full bg-navy border border-white/15 text-white placeholder-white/20 font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors" />
        </div>
      </div>
      <button type="submit" disabled={saving} className="bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.12em] px-5 py-2 hover:bg-gold-dark transition-colors disabled:opacity-60">
        {saving ? 'Saving…' : 'Create Event'}
      </button>
    </form>
  );
}

function EventRsvpsTable({ eventRsvps, events, onDeleteEvent }) {
  const [openEvent, setOpenEvent] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const grouped = events.map((ev) => ({
    event: ev,
    rsvps: eventRsvps.filter((r) => r.event_id === ev.id),
  }));

  const handleDeleteEvent = async (event) => {
    if (!window.confirm(`Delete "${event.title}" and all its RSVPs?`)) return;
    setDeleting(event.id);
    await supabase.from('event_rsvps').delete().eq('event_id', event.id);
    await supabase.from('club_events').delete().eq('id', event.id);
    onDeleteEvent(event.id);
    setDeleting(null);
  };

  return (
    <div>
      <h2 className="font-playfair text-white text-2xl font-bold mb-4">
        Event RSVPs <span className="text-white/30 text-lg font-normal">({eventRsvps.length} total)</span>
      </h2>

      {grouped.length === 0 && (
        <p className="font-dm-sans text-white/30 text-sm">No events yet — create one above.</p>
      )}

      <div className="space-y-3">
        {grouped.map(({ event, rsvps }) => (
          <div key={event.id} className="border border-white/10">
            <div className="flex items-center">
              <button
                onClick={() => setOpenEvent(openEvent === event.id ? null : event.id)}
                className="flex-1 flex items-center justify-between px-5 py-4 hover:bg-white/[0.03] transition-colors text-left"
              >
                <div>
                  <p className="font-dm-sans text-white text-sm font-medium">{event.title}</p>
                  <p className="font-dm-sans text-white/40 text-xs mt-0.5">
                    {event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Date TBD'}
                    {event.speaker ? ` · ${event.speaker}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <span className="font-dm-sans text-gold text-sm font-semibold">
                    {rsvps.length}{event.total_seats ? ` / ${event.total_seats}` : ''} RSVPs
                  </span>
                  {openEvent === event.id ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
                </div>
              </button>
              <button
                onClick={() => handleDeleteEvent(event)}
                disabled={deleting === event.id}
                className="px-4 text-white/20 hover:text-red-400 transition-colors disabled:opacity-30"
              >
                <Trash2 size={14} />
              </button>
            </div>

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
          <MembersTable
            members={members}
            onDelete={(id) => setMembers((prev) => prev.filter((m) => m.id !== id))}
          />
        </div>

        {/* Events + RSVPs */}
        <div className="border-t border-white/10 pt-12">
          <div className="flex items-center justify-between mb-6">
            <div />
            <CreateEventForm
              onCreated={(ev) => setEvents((prev) => [...prev, ev].sort((a, b) => new Date(a.date) - new Date(b.date)))}
            />
          </div>
          <EventRsvpsTable
            eventRsvps={eventRsvps}
            events={events}
            onDeleteEvent={(id) => {
              setEvents((prev) => prev.filter((e) => e.id !== id));
              setEventRsvps((prev) => prev.filter((r) => r.event_id !== id));
            }}
          />
        </div>
      </div>
    </div>
  );
}
