import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { base44, integrations } from '../../api/apiClient';
import { useToast } from '../ui/use-toast';
import { format, parseISO } from 'date-fns';

function rsvpConfirmationEmail({ name, email, speaker }) {
  const firstName = name.split(' ')[0];
  const dateStr = speaker.date ? format(parseISO(speaker.date), 'EEEE, MMMM d, yyyy') : null;

  const sessionRows = [
    ['Speaker', speaker.name],
    speaker.title && ['Title', speaker.title],
    speaker.sector && ['Sector', speaker.sector],
    dateStr && ['Date', dateStr],
    ['Registered As', `${name} &middot; ${email}`],
  ].filter(Boolean);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RSVP Confirmed — Cap-X</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

          <!-- Logo header -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#0a0f1e;padding:14px 28px;">
                    <p style="margin:0;font-size:20px;font-weight:800;color:#c9a84c;letter-spacing:0.12em;text-transform:uppercase;">CAP&#8209;X</p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:8px;">
                    <p style="margin:0;font-size:10px;color:#6b7280;letter-spacing:0.18em;text-transform:uppercase;">Rutgers University</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero banner -->
          <tr>
            <td style="background:#0a0f1e;padding:48px 48px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-left:3px solid #c9a84c;padding-left:20px;padding-bottom:40px;">
                    <p style="margin:0 0 6px;font-size:11px;color:#c9a84c;letter-spacing:0.22em;text-transform:uppercase;">RSVP Confirmed</p>
                    <p style="margin:0;font-size:32px;font-weight:700;color:#ffffff;line-height:1.2;">See you there, ${firstName}.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Gold divider -->
          <tr>
            <td style="background:#0a0f1e;padding:0 48px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="height:1px;background:#c9a84c;opacity:0.3;"></td></tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#0a0f1e;padding:36px 48px 48px;">
              <p style="margin:0 0 32px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.8;">
                Your spot is reserved for the upcoming Cap-X session. We'll follow up
                with location details and any additional information closer to the date.
              </p>

              <!-- Session details box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;background:#111827;border:1px solid rgba(255,255,255,0.08);">
                <tr>
                  <td style="padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.08);">
                    <p style="margin:0;font-size:9px;font-weight:700;color:#c9a84c;letter-spacing:0.25em;text-transform:uppercase;">Session Details</p>
                  </td>
                </tr>
                ${sessionRows.map(([label, value], i) => `
                <tr>
                  <td style="padding:13px 24px;${i < sessionRows.length - 1 ? 'border-bottom:1px solid rgba(255,255,255,0.05);' : ''}width:38%;">
                    <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:0.12em;text-transform:uppercase;">${label}</p>
                  </td>
                  <td style="padding:13px 24px;${i < sessionRows.length - 1 ? 'border-bottom:1px solid rgba(255,255,255,0.05);' : ''}">
                    <p style="margin:0;font-size:13px;font-weight:500;color:#ffffff;">${value}</p>
                  </td>
                </tr>`).join('')}
              </table>

              <!-- Good to know -->
              <p style="margin:0 0 16px;font-size:9px;font-weight:700;color:#c9a84c;letter-spacing:0.25em;text-transform:uppercase;">Good to Know</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
                ${[
                  ['Your seat is reserved', 'Seats are limited and yours is confirmed — no further action needed.'],
                  ['Location coming soon', 'Full venue and timing details will be sent before the session.'],
                  ['Questions?', 'Reply to this email or contact us at team@capxrutgers.com.'],
                ].map(([title, desc]) => `
                <tr>
                  <td valign="top" width="20" style="padding:10px 0;">
                    <table cellpadding="0" cellspacing="0"><tr><td style="width:6px;height:6px;background:#c9a84c;border-radius:50%;margin-top:5px;"></td></tr></table>
                  </td>
                  <td style="padding:10px 0 10px 12px;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <p style="margin:0 0 2px;font-size:13px;font-weight:600;color:#ffffff;">${title}</p>
                    <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.45);line-height:1.6;">${desc}</p>
                  </td>
                </tr>`).join('')}
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#c9a84c;">
                    <a href="https://capxrutgers.com" style="display:inline-block;padding:14px 32px;font-size:10px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:#0a0f1e;text-decoration:none;">
                      Visit Cap-X &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#070c18;padding:24px 48px;" align="center">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <p style="margin:0;font-size:16px;font-weight:800;color:#c9a84c;letter-spacing:0.12em;">CAP&#8209;X</p>
                    <p style="margin:2px 0 0;font-size:9px;color:rgba(255,255,255,0.25);letter-spacing:0.15em;text-transform:uppercase;">Rutgers University</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-top:1px solid rgba(255,255,255,0.07);" align="center">
                    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);">
                      Questions? Reply to this email or reach us at
                      <a href="mailto:team@capxrutgers.com" style="color:#c9a84c;text-decoration:none;">team@capxrutgers.com</a>
                    </p>
                  </td>
                </tr>
              </table>
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
