import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { base44, integrations } from '../../api/apiClient';
import { useToast } from '../ui/use-toast';
import { format, parseISO } from 'date-fns';

function rsvpConfirmationEmail({ name, email, speaker }) {
  const firstName = name.split(' ')[0];
  const dateStr = speaker.date ? format(parseISO(speaker.date), 'EEEE, MMMM d, yyyy') : null;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RSVP Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;" align="center">
              <p style="margin:0;font-size:22px;font-weight:700;color:#c9a84c;letter-spacing:0.08em;">CAP-X</p>
              <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:0.2em;text-transform:uppercase;">Rutgers University</p>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#111827;border:1px solid rgba(255,255,255,0.1);padding:48px 40px;">

              <!-- Gold rule -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr><td style="height:2px;background:#c9a84c;width:40px;"></td></tr>
              </table>

              <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#ffffff;">You're confirmed, ${firstName}.</p>
              <p style="margin:0 0 32px;font-size:15px;color:rgba(255,255,255,0.55);line-height:1.7;">
                Your RSVP for the upcoming Cap-X session has been received. We'll send you
                a reminder with full details as the date approaches.
              </p>

              <!-- Session details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;border:1px solid rgba(255,255,255,0.08);">
                <tr>
                  <td colspan="2" style="padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.08);">
                    <p style="margin:0;font-size:10px;color:#c9a84c;letter-spacing:0.2em;text-transform:uppercase;">Session Details</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.06);width:40%;">
                    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:0.1em;text-transform:uppercase;">Speaker</p>
                  </td>
                  <td style="padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <p style="margin:0;font-size:13px;color:#ffffff;">${speaker.name}</p>
                  </td>
                </tr>
                ${speaker.title ? `
                <tr>
                  <td style="padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:0.1em;text-transform:uppercase;">Title</p>
                  </td>
                  <td style="padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <p style="margin:0;font-size:13px;color:#ffffff;">${speaker.title}</p>
                  </td>
                </tr>` : ''}
                ${dateStr ? `
                <tr>
                  <td style="padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:0.1em;text-transform:uppercase;">Date</p>
                  </td>
                  <td style="padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <p style="margin:0;font-size:13px;color:#ffffff;">${dateStr}</p>
                  </td>
                </tr>` : ''}
                <tr>
                  <td style="padding:12px 20px;">
                    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:0.1em;text-transform:uppercase;">Registered As</p>
                  </td>
                  <td style="padding:12px 20px;">
                    <p style="margin:0;font-size:13px;color:#ffffff;">${name} · ${email}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px;font-size:11px;color:#c9a84c;letter-spacing:0.2em;text-transform:uppercase;">Good to Know</p>
              ${[
                'Seats are limited — your spot is reserved',
                'Location details will be sent closer to the date',
                'Reach out to team@capxrutgers.com with any questions',
              ].map(item => `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                <tr>
                  <td width="16" valign="top">
                    <div style="width:4px;height:4px;background:#c9a84c;border-radius:50%;margin-top:6px;"></div>
                  </td>
                  <td style="padding-left:10px;">
                    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.55);line-height:1.6;">${item}</p>
                  </td>
                </tr>
              </table>`).join('')}

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:36px;">
                <tr>
                  <td>
                    <a href="https://capxrutgers.com" style="display:inline-block;background:#c9a84c;color:#0a0f1e;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;padding:14px 28px;">
                      Visit Cap-X
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 0;" align="center">
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);">
                Cap-X · Rutgers University · <a href="mailto:team@capxrutgers.com" style="color:rgba(255,255,255,0.25);text-decoration:none;">team@capxrutgers.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default function RsvpModal({ speaker, onClose }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.entities.Rsvp.create({ ...form, speaker_id: speaker.id });
      integrations.Core.SendEmail({
        to: form.email,
        subject: `RSVP Confirmed — ${speaker.name} at Cap-X`,
        from_name: 'Cap-X Rutgers',
        html: rsvpConfirmationEmail({ name: form.name, email: form.email, speaker }),
      }).catch(() => {});
      setDone(true);
      toast({ title: 'RSVP confirmed!', description: `See you at the ${speaker.name} event.` });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl w-full max-w-md p-8 z-50">
          <div className="flex items-start justify-between mb-6">
            <div>
              <Dialog.Title className="font-playfair text-navy text-2xl font-bold">
                RSVP
              </Dialog.Title>
              <p className="font-dm-sans text-muted-text text-sm mt-1">
                {speaker.name}
                {speaker.date && ` · ${format(parseISO(speaker.date), 'MMM d, yyyy')}`}
              </p>
            </div>
            <button onClick={onClose} className="text-muted-text hover:text-navy transition-colors">
              <X size={20} />
            </button>
          </div>

          {done ? (
            <div className="text-center py-6">
              <p className="font-playfair text-navy text-xl font-bold mb-2">You're confirmed.</p>
              <p className="font-dm-sans text-muted-text text-sm">We'll send details to your email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-dm-sans text-navy text-sm font-medium block mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-input rounded px-4 py-3 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="font-dm-sans text-navy text-sm font-medium block mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-input rounded px-4 py-3 font-dm-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold text-navy font-dm-sans font-semibold text-sm uppercase tracking-wider py-4 hover:bg-gold-dark transition-colors disabled:opacity-60"
              >
                {loading ? 'Confirming…' : 'Confirm RSVP'}
              </button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
