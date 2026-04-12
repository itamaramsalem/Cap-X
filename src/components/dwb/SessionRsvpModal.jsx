import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Users } from 'lucide-react';
import { supabase } from '../../api/apiClient';
import { format, parseISO } from 'date-fns';

export default function SessionRsvpModal({ speaker, onClose }) {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', netid: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [rsvpCount, setRsvpCount] = useState(null);

  useEffect(() => {
    if (!speaker.event_id) return;
    supabase
      .from('event_rsvps')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', speaker.event_id)
      .then(({ count }) => setRsvpCount(count ?? 0));
  }, [speaker.event_id]);

  const seatsLeft =
    speaker.capacity != null && rsvpCount !== null
      ? Math.max(0, speaker.capacity - rsvpCount)
      : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.from('event_rsvps').insert({
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim().toLowerCase(),
      netid: form.netid.trim(),
      event_id: speaker.event_id,
    });
    setLoading(false);
    if (err) {
      if (err.code === '23505') {
        setError("You've already reserved a seat for this session.");
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
      return;
    }
    setRsvpCount((c) => (c ?? 0) + 1);
    setDone(true);
  };

  const isFull = seatsLeft === 0;

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl w-full max-w-md p-8 z-50 max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 pr-4">
              <Dialog.Title className="font-playfair text-navy text-2xl font-bold">
                Reserve Your Seat
              </Dialog.Title>
              <p className="font-dm-sans text-muted-text text-sm mt-1">
                {speaker.name}
                {speaker.date && ` · ${format(parseISO(speaker.date), 'MMMM d, yyyy')}`}
              </p>
              {speaker.location && (
                <p className="font-dm-sans text-muted-text text-xs mt-0.5">{speaker.location}</p>
              )}
              {seatsLeft !== null && (
                <p className={`font-dm-sans text-xs font-semibold mt-2 flex items-center gap-1.5 ${
                  seatsLeft <= 10 ? 'text-red-500' : 'text-emerald-600'
                }`}>
                  <Users size={12} />
                  {seatsLeft} seat{seatsLeft !== 1 ? 's' : ''} remaining
                </p>
              )}
            </div>
            <button onClick={onClose} className="text-muted-text hover:text-navy transition-colors shrink-0 mt-1">
              <X size={20} />
            </button>
          </div>

          {done ? (
            <div className="text-center py-8">
              <p className="font-playfair text-navy text-xl font-bold mb-2">You're confirmed.</p>
              <p className="font-dm-sans text-muted-text text-sm leading-relaxed">
                We'll send details to your email before the session.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-dm-sans text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.first_name}
                    onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                    className="w-full border border-input rounded px-3 py-2.5 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="font-dm-sans text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.last_name}
                    onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                    className="w-full border border-input rounded px-3 py-2.5 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="font-dm-sans text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-input rounded px-3 py-2.5 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* NetID — required */}
              <div>
                <label className="font-dm-sans text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">
                  NetID
                </label>
                <input
                  type="text"
                  required
                  value={form.netid}
                  onChange={e => setForm(f => ({ ...f, netid: e.target.value }))}
                  placeholder="e.g. abc123"
                  className="w-full border border-input rounded px-3 py-2.5 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {error && (
                <p className="font-dm-sans text-red-500 text-xs">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || isFull}
                className="w-full bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.15em] py-4 hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? 'Confirming…' : isFull ? 'Session Full' : 'Confirm RSVP'}
              </button>

              <p className="font-dm-sans text-muted-text text-xs text-center leading-relaxed">
                This reserves a seat for this session only — not club membership.{' '}
                To join Cap-X, use the{' '}
                <a href="/join" className="text-navy underline hover:text-gold transition-colors">
                  Join page
                </a>.
              </p>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
