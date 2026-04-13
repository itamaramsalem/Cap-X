import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/apiClient';
import { SPEAKERS } from '../lib/speakers';
import {
  LogOut, Users, CalendarCheck, ClipboardList, ChevronDown, ChevronUp,
  Trash2, Plus, X, Archive, Download, RefreshCw, Image,
} from 'lucide-react';

// ──────────────────────────────────────────────
// CSV export helper
// ──────────────────────────────────────────────
function downloadCSV(headers, rows, filename) {
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map(r => r.map(escape).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ──────────────────────────────────────────────
// Stat card
// ──────────────────────────────────────────────
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

// ──────────────────────────────────────────────
// Members table (delete + CSV export)
// ──────────────────────────────────────────────
function MembersTable({ members, onDelete }) {
  const [query, setQuery] = useState('');
  const [confirming, setConfirming] = useState(null);

  const filtered = members.filter((m) =>
    `${m.first_name} ${m.last_name} ${m.email} ${m.netid} ${m.major}`.toLowerCase().includes(query.toLowerCase())
  );

  const exportCSV = () => {
    downloadCSV(
      ['First Name', 'Last Name', 'Email', 'NetID', 'Major', 'Grad Year', 'Joined'],
      filtered.map(m => [
        m.first_name, m.last_name, m.email, m.netid,
        m.major, m.graduation_year,
        new Date(m.created_at).toLocaleDateString('en-US'),
      ]),
      `cap-x-members-${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="font-playfair text-white text-2xl font-bold">
          Members <span className="text-white/30 text-lg font-normal">({members.length})</span>
        </h2>
        <div className="flex items-center gap-3">
          <input
            type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="bg-navy border border-white/15 text-white placeholder-white/30 font-dm-sans text-sm px-4 py-2 focus:outline-none focus:border-gold transition-colors w-44"
          />
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 border border-white/20 text-white/60 font-dm-sans text-xs uppercase tracking-[0.1em] px-3 py-2 hover:border-gold hover:text-gold transition-colors"
            title="Export to CSV"
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
                  <td className="py-3 pr-2">
                    {confirming === m.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { onDelete(m.id); setConfirming(null); }}
                          className="font-dm-sans text-red-400 text-xs hover:text-red-300 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirming(null)}
                          className="font-dm-sans text-white/30 text-xs hover:text-white/60 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirming(m.id)}
                        className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete member"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
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

// ──────────────────────────────────────────────
// Events manager
// ──────────────────────────────────────────────
const SECTORS = ['Finance & Trading', 'Technology & AI', 'Consulting', 'Entrepreneurship', 'Other'];

function EventsManager({ events, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [confirming, setConfirming] = useState(null);
  const [form, setForm] = useState({
    title: '', speaker: '', date: '', location: '', sector: '', capacity: '', description: '',
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await onAdd({
        title: form.title,
        speaker: form.speaker || null,
        date: form.date || null,
        location: form.location || null,
        sector: form.sector || null,
        capacity: form.capacity ? parseInt(form.capacity) : null,
        description: form.description || null,
      });
      setForm({ title: '', speaker: '', date: '', location: '', sector: '', capacity: '', description: '' });
      setShowForm(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-playfair text-white text-2xl font-bold">
          Events <span className="text-white/30 text-lg font-normal">({events.length})</span>
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.12em] px-4 py-2 hover:bg-gold-dark transition-colors"
        >
          {showForm ? <X size={13} /> : <Plus size={13} />}
          {showForm ? 'Cancel' : 'Add Event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-navy border border-white/10 p-6 mb-6 space-y-4">
          <p className="font-dm-sans text-white/40 text-xs uppercase tracking-[0.15em]">New Event</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-dm-sans text-white/50 text-xs uppercase tracking-[0.12em] block mb-1.5">Title *</label>
              <input required value={form.title} onChange={set('title')} className="w-full bg-navy-light border border-white/15 text-white font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="font-dm-sans text-white/50 text-xs uppercase tracking-[0.12em] block mb-1.5">Speaker Name</label>
              <input value={form.speaker} onChange={set('speaker')} placeholder="e.g. Marcus Rivera" className="w-full bg-navy-light border border-white/15 text-white placeholder-white/25 font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="font-dm-sans text-white/50 text-xs uppercase tracking-[0.12em] block mb-1.5">Date</label>
              <input type="date" value={form.date} onChange={set('date')} className="w-full bg-navy-light border border-white/15 text-white font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="font-dm-sans text-white/50 text-xs uppercase tracking-[0.12em] block mb-1.5">Location</label>
              <input value={form.location} onChange={set('location')} placeholder="e.g. RBS Room 204" className="w-full bg-navy-light border border-white/15 text-white placeholder-white/25 font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="font-dm-sans text-white/50 text-xs uppercase tracking-[0.12em] block mb-1.5">Sector</label>
              <select value={form.sector} onChange={set('sector')} className="w-full bg-navy-light border border-white/15 text-white font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors">
                <option value="">Select sector</option>
                {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="font-dm-sans text-white/50 text-xs uppercase tracking-[0.12em] block mb-1.5">Capacity</label>
              <input type="number" min="1" value={form.capacity} onChange={set('capacity')} placeholder="e.g. 50" className="w-full bg-navy-light border border-white/15 text-white placeholder-white/25 font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors" />
            </div>
          </div>
          <div>
            <label className="font-dm-sans text-white/50 text-xs uppercase tracking-[0.12em] block mb-1.5">Description</label>
            <textarea value={form.description} onChange={set('description')} rows={2} className="w-full bg-navy-light border border-white/15 text-white font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors resize-none" />
          </div>
          {formError && <p className="font-dm-sans text-red-400 text-xs">{formError}</p>}
          <button type="submit" disabled={saving} className="bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.12em] px-6 py-2.5 hover:bg-gold-dark transition-colors disabled:opacity-60">
            {saving ? 'Saving…' : 'Create Event'}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {events.length === 0 ? (
          <p className="font-dm-sans text-white/30 text-sm">No events yet.</p>
        ) : events.map((ev) => (
          <div key={ev.id} className="border border-white/10 px-5 py-4 flex items-center justify-between gap-4 group">
            <div>
              <p className="font-dm-sans text-white text-sm font-medium">{ev.title}</p>
              <p className="font-dm-sans text-white/40 text-xs mt-0.5">
                {ev.date ? new Date(ev.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Date TBD'}
                {ev.speaker ? ` · ${ev.speaker}` : ''}{ev.sector ? ` · ${ev.sector}` : ''}{ev.capacity ? ` · ${ev.capacity} seats` : ''}
              </p>
            </div>
            {confirming === ev.id ? (
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => { onDelete(ev.id); setConfirming(null); }} className="font-dm-sans text-red-400 text-xs hover:text-red-300 transition-colors">Confirm</button>
                <button onClick={() => setConfirming(null)} className="font-dm-sans text-white/30 text-xs hover:text-white/60 transition-colors">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirming(ev.id)} className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0" title="Delete event">
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Event RSVPs accordion (with CSV export)
// ──────────────────────────────────────────────
function EventRsvpsTable({ eventRsvps, events }) {
  const [openEvent, setOpenEvent] = useState(null);

  const grouped = events.map((ev) => ({
    event: ev,
    rsvps: eventRsvps.filter((r) => r.event_id === ev.id),
  }));

  const exportCSV = () => {
    downloadCSV(
      ['Event', 'First Name', 'Last Name', 'Email', 'NetID', 'Signed Up'],
      eventRsvps.map(r => {
        const ev = events.find(e => e.id === r.event_id);
        return [ev?.title ?? r.event_id, r.first_name, r.last_name, r.email, r.netid,
          new Date(r.created_at).toLocaleDateString('en-US')];
      }),
      `cap-x-rsvps-${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="font-playfair text-white text-2xl font-bold">
          Event RSVPs <span className="text-white/30 text-lg font-normal">({eventRsvps.length} total)</span>
        </h2>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 border border-white/20 text-white/60 font-dm-sans text-xs uppercase tracking-[0.1em] px-3 py-2 hover:border-gold hover:text-gold transition-colors"
        >
          <Download size={13} />
          Export CSV
        </button>
      </div>

      {grouped.length === 0 && (
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
                          <th key={h} className="font-dm-sans text-white/40 text-xs uppercase tracking-[0.12em] pb-3 pr-6">{h}</th>
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

// ──────────────────────────────────────────────
// Speaker photos (upcoming speakers)
// ──────────────────────────────────────────────
function SpeakerPhotosSection({ overrides, onSave }) {
  const [urls, setUrls] = useState({});
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    const init = {};
    SPEAKERS.forEach(s => { init[s.id] = overrides[s.id] ?? ''; });
    setUrls(init);
  }, [overrides]);

  const handleSave = async (speakerId) => {
    setSaving(speakerId);
    try {
      await onSave(speakerId, urls[speakerId]);
      setSaved(speakerId);
      setTimeout(() => setSaved(null), 2000);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Image size={18} className="text-gold" />
        <h2 className="font-playfair text-white text-2xl font-bold">Upcoming Speaker Photos</h2>
      </div>
      <p className="font-dm-sans text-white/40 text-xs mb-5">Paste a public image URL to set a speaker's photo. Leave blank to use initials.</p>

      <div className="space-y-3">
        {SPEAKERS.map(s => (
          <div key={s.id} className="border border-white/10 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="shrink-0 w-40">
              <p className="font-dm-sans text-white text-sm font-medium">{s.name}</p>
              <p className="font-dm-sans text-white/40 text-xs">{s.title}</p>
            </div>
            <input
              value={urls[s.id] ?? ''}
              onChange={e => setUrls(u => ({ ...u, [s.id]: e.target.value }))}
              placeholder="https://..."
              className="flex-1 bg-navy border border-white/15 text-white placeholder-white/25 font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors"
            />
            <button
              onClick={() => handleSave(s.id)}
              disabled={saving === s.id}
              className="shrink-0 bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.1em] px-4 py-2 hover:bg-gold-dark transition-colors disabled:opacity-60"
            >
              {saving === s.id ? 'Saving…' : saved === s.id ? 'Saved ✓' : 'Save'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Archive speakers section
// ──────────────────────────────────────────────
function ArchiveSpeakersSection({ speakers, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [confirming, setConfirming] = useState(null);
  const [form, setForm] = useState({
    name: '', title: '', company: '', sector: '', event_date: '', bio: '', linkedin: '', photo_url: '',
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await onAdd({
        name: form.name,
        title: form.title || null,
        company: form.company || null,
        sector: form.sector || null,
        event_date: form.event_date || null,
        bio: form.bio || null,
        linkedin: form.linkedin || null,
        photo_url: form.photo_url || null,
      });
      setForm({ name: '', title: '', company: '', sector: '', event_date: '', bio: '', linkedin: '', photo_url: '' });
      setShowForm(false);
    } catch (err) {
      const msg = err.message ?? '';
      if (msg.includes('past_speakers') || msg.includes('schema cache')) {
        setFormError('Table not found. Please run fix-schema.sql in your Supabase SQL Editor first, then reload this page.');
      } else {
        setFormError(msg || 'Something went wrong.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-playfair text-white text-2xl font-bold">
          Archive Speakers <span className="text-white/30 text-lg font-normal">({speakers.length})</span>
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.12em] px-4 py-2 hover:bg-gold-dark transition-colors"
        >
          {showForm ? <X size={13} /> : <Plus size={13} />}
          {showForm ? 'Cancel' : 'Add Speaker'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-navy border border-white/10 p-6 mb-6 space-y-4">
          <p className="font-dm-sans text-white/40 text-xs uppercase tracking-[0.15em]">Add Past Speaker</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-dm-sans text-white/50 text-xs uppercase tracking-[0.12em] block mb-1.5">Name *</label>
              <input required value={form.name} onChange={set('name')} className="w-full bg-navy-light border border-white/15 text-white font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="font-dm-sans text-white/50 text-xs uppercase tracking-[0.12em] block mb-1.5">Title</label>
              <input value={form.title} onChange={set('title')} placeholder="e.g. Vice President" className="w-full bg-navy-light border border-white/15 text-white placeholder-white/25 font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="font-dm-sans text-white/50 text-xs uppercase tracking-[0.12em] block mb-1.5">Company</label>
              <input value={form.company} onChange={set('company')} placeholder="e.g. Goldman Sachs" className="w-full bg-navy-light border border-white/15 text-white placeholder-white/25 font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="font-dm-sans text-white/50 text-xs uppercase tracking-[0.12em] block mb-1.5">Sector</label>
              <select value={form.sector} onChange={set('sector')} className="w-full bg-navy-light border border-white/15 text-white font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors">
                <option value="">Select sector</option>
                {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="font-dm-sans text-white/50 text-xs uppercase tracking-[0.12em] block mb-1.5">Event Date</label>
              <input type="date" value={form.event_date} onChange={set('event_date')} className="w-full bg-navy-light border border-white/15 text-white font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="font-dm-sans text-white/50 text-xs uppercase tracking-[0.12em] block mb-1.5">LinkedIn URL</label>
              <input value={form.linkedin} onChange={set('linkedin')} placeholder="linkedin.com/in/..." className="w-full bg-navy-light border border-white/15 text-white placeholder-white/25 font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors" />
            </div>
          </div>
          <div>
            <label className="font-dm-sans text-white/50 text-xs uppercase tracking-[0.12em] block mb-1.5">Photo URL</label>
            <input value={form.photo_url} onChange={set('photo_url')} placeholder="https://..." className="w-full bg-navy-light border border-white/15 text-white placeholder-white/25 font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors" />
          </div>
          <div>
            <label className="font-dm-sans text-white/50 text-xs uppercase tracking-[0.12em] block mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={set('bio')} rows={3} className="w-full bg-navy-light border border-white/15 text-white font-dm-sans text-sm px-3 py-2 focus:outline-none focus:border-gold transition-colors resize-none" />
          </div>
          {formError && <p className="font-dm-sans text-red-400 text-xs leading-relaxed">{formError}</p>}
          <button type="submit" disabled={saving} className="bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.12em] px-6 py-2.5 hover:bg-gold-dark transition-colors disabled:opacity-60">
            {saving ? 'Saving…' : 'Add to Archive'}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {speakers.length === 0 ? (
          <p className="font-dm-sans text-white/30 text-sm">No archive speakers yet.</p>
        ) : speakers.map((s) => (
          <div key={s.id} className="border border-white/10 px-5 py-4 flex items-center justify-between gap-4 group">
            <div className="flex items-center gap-4">
              {s.photo_url ? (
                <img src={s.photo_url} alt={s.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="font-playfair text-white text-sm font-bold">{s.name.charAt(0)}</span>
                </div>
              )}
              <div>
                <p className="font-dm-sans text-white text-sm font-medium">{s.name}</p>
                <p className="font-dm-sans text-white/40 text-xs mt-0.5">
                  {[s.title, s.company, s.sector].filter(Boolean).join(' · ')}
                  {s.event_date ? ` · ${new Date(s.event_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}
                </p>
              </div>
            </div>
            {confirming === s.id ? (
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => { onDelete(s.id); setConfirming(null); }} className="font-dm-sans text-red-400 text-xs hover:text-red-300 transition-colors">Confirm</button>
                <button onClick={() => setConfirming(null)} className="font-dm-sans text-white/30 text-xs hover:text-white/60 transition-colors">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirming(s.id)} className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0" title="Remove">
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Admin main
// ──────────────────────────────────────────────
export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventRsvps, setEventRsvps] = useState([]);
  const [pastSpeakers, setPastSpeakers] = useState([]);
  const [photoOverrides, setPhotoOverrides] = useState({});

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }, [navigate]);

  // ── Session timeout: auto-logout after 30 min of inactivity ──
  useEffect(() => {
    const TIMEOUT = 30 * 60 * 1000;
    let timer = setTimeout(handleLogout, TIMEOUT);
    const reset = () => { clearTimeout(timer); timer = setTimeout(handleLogout, TIMEOUT); };
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(ev => window.addEventListener(ev, reset));
    return () => { clearTimeout(timer); events.forEach(ev => window.removeEventListener(ev, reset)); };
  }, [handleLogout]);

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

    // These tables may not exist yet (run fix-schema.sql) — handle gracefully
    const [speakersRes, photosRes] = await Promise.all([
      supabase.from('past_speakers').select('*').order('event_date', { ascending: false }),
      supabase.from('speaker_photos').select('*'),
    ]);
    setPastSpeakers(speakersRes.data ?? []);
    setPhotoOverrides(Object.fromEntries((photosRes.data ?? []).map(p => [p.speaker_id, p.photo_url])));
    setLastRefreshed(new Date());
    setLoading(false);
  };

  const deleteMember = async (id) => {
    await supabase.from('members').delete().eq('id', id);
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const addEvent = async (payload) => {
    const { data, error } = await supabase.from('club_events').insert(payload).select().single();
    if (error) throw error;
    setEvents(prev => [...prev, data].sort((a, b) => (a.date ?? '').localeCompare(b.date ?? '')));
  };

  const deleteEvent = async (id) => {
    await supabase.from('club_events').delete().eq('id', id);
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const addArchiveSpeaker = async (payload) => {
    const { data, error } = await supabase.from('past_speakers').insert(payload).select().single();
    if (error) throw error;
    setPastSpeakers(prev => [data, ...prev]);
  };

  const deleteArchiveSpeaker = async (id) => {
    await supabase.from('past_speakers').delete().eq('id', id);
    setPastSpeakers(prev => prev.filter(s => s.id !== id));
  };

  const savePhotoOverride = async (speakerId, photoUrl) => {
    const { error } = await supabase.from('speaker_photos').upsert({
      speaker_id: speakerId,
      photo_url: photoUrl || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'speaker_id' });
    if (error) throw error;
    setPhotoOverrides(prev => ({ ...prev, [speakerId]: photoUrl }));
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
            {lastRefreshed && (
              <span className="font-dm-sans text-white/25 text-xs hidden sm:block">
                Refreshed {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              onClick={fetchData}
              className="flex items-center gap-1.5 font-dm-sans text-white/40 text-xs uppercase tracking-[0.12em] hover:text-gold transition-colors"
              title="Refresh data"
            >
              <RefreshCw size={13} />
            </button>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Club Members" value={members.length} icon={Users} />
            <StatCard label="Event RSVPs" value={eventRsvps.length} icon={CalendarCheck} />
            <StatCard label="Upcoming Events" value={events.length} icon={ClipboardList} />
            <StatCard label="Archive Speakers" value={pastSpeakers.length} icon={Archive} />
          </div>
        </div>

        {/* Members */}
        <div className="border-t border-white/10 pt-12">
          <MembersTable members={members} onDelete={deleteMember} />
        </div>

        {/* Events */}
        <div className="border-t border-white/10 pt-12">
          <EventsManager events={events} onAdd={addEvent} onDelete={deleteEvent} />
        </div>

        {/* Event RSVPs */}
        <div className="border-t border-white/10 pt-12">
          <EventRsvpsTable eventRsvps={eventRsvps} events={events} />
        </div>

        {/* Upcoming Speaker Photos */}
        <div className="border-t border-white/10 pt-12">
          <SpeakerPhotosSection overrides={photoOverrides} onSave={savePhotoOverride} />
        </div>

        {/* Archive Speakers */}
        <div className="border-t border-white/10 pt-12">
          <ArchiveSpeakersSection speakers={pastSpeakers} onAdd={addArchiveSpeaker} onDelete={deleteArchiveSpeaker} />
        </div>
      </div>
    </div>
  );
}
