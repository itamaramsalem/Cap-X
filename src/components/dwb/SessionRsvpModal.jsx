import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Users } from 'lucide-react';
import { supabase, integrations } from '../../api/apiClient';
import { format, parseISO } from 'date-fns';

function rsvpConfirmationEmail({ first_name, speaker }) {
  const sessionDate = speaker.date
    ? format(parseISO(speaker.date), 'MMMM d, yyyy')
    : 'Date TBD';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>RSVP Confirmed — Cap-X</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:48px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

        <!-- Logo -->
        <tr><td align="center" style="padding-bottom:28px;">
          <table cellpadding="0" cellspacing="0">
            <tr><td style="background:#0a0f1e;padding:14px 28px;">
              <p style="margin:0;font-size:20px;font-weight:800;color:#c9a84c;letter-spacing:0.12em;text-transform:uppercase;">CAP&#8209;X</p>
            </td></tr>
            <tr><td align="center" style="padding-top:8px;">
              <p style="margin:0;font-size:10px;color:#6b7280;letter-spacing:0.18em;text-transform:uppercase;">Rutgers University</p>
            </td></tr>
          </table>
        </td></tr>

        <!-- Hero -->
        <tr><td style="background:#0a0f1e;padding:48px 48px 0;">
          <div style="border-left:3px solid #c9a84c;padding-left:20px;padding-bottom:40px;">
            <p style="margin:0 0 6px;font-size:11px;color:#c9a84c;letter-spacing:0.22em;text-transform:uppercase;">Session RSVP Confirmed</p>
            <p style="margin:0;font-size:32px;font-weight:700;color:#ffffff;line-height:1.2;">You're in, ${first_name}!</p>
          </div>
        </td></tr>

        <!-- Divider -->
        <tr><td style="background:#0a0f1e;padding:0 48px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="height:1px;background:#c9a84c;opacity:0.3;"></td></tr>
          </table>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#0a0f1e;padding:36px 48px 48px;">
          <p style="margin:0 0 28px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.8;">
            Your seat is reserved for the upcoming Cap-X session. We'll send any updates directly to this email.
          </p>

          <!-- Session box -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;background:#111827;border:1px solid rgba(255,255,255,0.08);">
            <tr><td style="padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.08);">
              <p style="margin:0;font-size:9px;font-weight:700;color:#c9a84c;letter-spacing:0.25em;text-transform:uppercase;">Session Details</p>
            </td></tr>
            <tr>
              <td style="padding:13px 24px;border-bottom:1px solid rgba(255,255,255,0.05);width:35%;">
                <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:0.12em;text-transform:uppercase;">Speaker</p>
              </td>
              <td style="padding:13px 24px;border-bottom:1px solid rgba(255,255,255,0.05);">
                <p style="margin:0;font-size:13px;font-weight:500;color:#ffffff;">${speaker.name}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:13px 24px;border-bottom:1px solid rgba(255,255,255,0.05);">
                <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:0.12em;text-transform:uppercase;">Title</p>
              </td>
              <td style="padding:13px 24px;border-bottom:1px solid rgba(255,255,255,0.05);">
                <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.75);">${speaker.title ?? ''}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:13px 24px;border-bottom:1px solid rgba(255,255,255,0.05);">
                <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:0.12em;text-transform:uppercase;">Date</p>
              </td>
              <td style="padding:13px 24px;border-bottom:1px solid rgba(255,255,255,0.05);">
                <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.75);">${sessionDate}</p>
              </td>
            </tr>
            ${speaker.location ? `<tr>
              <td style="padding:13px 24px;">
                <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:0.12em;text-transform:uppercase;">Location</p>
              </td>
              <td style="padding:13px 24px;">
                <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.75);">${speaker.location}</p>
              </td>
            </tr>` : ''}
          </table>

          <!-- CTA -->
          <table cellpadding="0" cellspacing="0">
            <tr><td style="background:#c9a84c;">
              <a href="https://capxrutgers.com" style="display:inline-block;padding:14px 32px;font-size:10px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:#0a0f1e;text-decoration:none;">
                Visit Cap-X &rarr;
              </a>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#070c18;padding:24px 48px;" align="center">
          <p style="margin:0;font-size:16px;font-weight:800;color:#c9a84c;letter-spacing:0.12em;">CAP&#8209;X</p>
          <p style="margin:2px 0 0;font-size:9px;color:rgba(255,255,255,0.25);letter-spacing:0.15em;text-transform:uppercase;">Rutgers University</p>
          <p style="margin:12px 0 0;font-size:11px;color:rgba(255,255,255,0.2);">
            Questions? Reach us at
            <a href="mailto:team@capxrutgers.com" style="color:#c9a84c;text-decoration:none;">team@capxrutgers.com</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

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

    const email = form.email.trim().toLowerCase();

    // Members-only check
    const { data: member } = await supabase
      .from('members')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (!member) {
      setError(
        'Only registered Cap-X members can RSVP. Please join first at /join — it only takes a minute.'
      );
      setLoading(false);
      return;
    }

    const { error: err } = await supabase.from('event_rsvps').insert({
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email,
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

    // Confirmation email — non-blocking
    integrations.Core.SendEmail({
      to: email,
      subject: `You're confirmed — ${speaker.name} · Cap-X`,
      from_name: 'Cap-X Rutgers',
      html: rsvpConfirmationEmail({ first_name: form.first_name.trim(), speaker }),
    }).catch(() => {});

    setRsvpCount((c) => (c ?? 0) + 1);
    setDone(true);
  };

  const isFull = seatsLeft === 0;

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl w-full max-w-md z-50 max-h-[90vh] flex flex-col overflow-hidden">

          {/* Scrollable form area */}
          <div className="overflow-y-auto flex-1 p-8">
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
                  A confirmation email is on its way. We'll send details before the session.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-dm-sans text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text" required value={form.first_name}
                      onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                      className="w-full border border-input rounded px-3 py-2.5 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="font-dm-sans text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text" required value={form.last_name}
                      onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                      className="w-full border border-input rounded px-3 py-2.5 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-dm-sans text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">
                    Scarlet Mail
                  </label>
                  <input
                    type="email" required value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="netid@scarletmail.rutgers.edu"
                    className="w-full border border-input rounded px-3 py-2.5 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="font-dm-sans text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">
                    NetID
                  </label>
                  <input
                    type="text" required value={form.netid}
                    onChange={e => setForm(f => ({ ...f, netid: e.target.value }))}
                    placeholder="e.g. abc123"
                    className="w-full border border-input rounded px-3 py-2.5 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded px-4 py-3">
                    <p className="font-dm-sans text-red-600 text-xs leading-relaxed">{error}</p>
                    {error.includes('join first') && (
                      <a href="/join" className="font-dm-sans text-red-600 text-xs underline mt-1 inline-block">
                        Join Cap-X →
                      </a>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || isFull}
                  className="w-full bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.15em] py-4 hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? 'Confirming…' : isFull ? 'Session Full' : 'Confirm RSVP'}
                </button>

                <p className="font-dm-sans text-muted-text text-xs text-center leading-relaxed">
                  Must be a registered Cap-X member to RSVP.{' '}
                  <a href="/join" className="text-navy underline hover:text-gold transition-colors">
                    Join here
                  </a>{' '}if you haven't yet.
                </p>
              </form>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
