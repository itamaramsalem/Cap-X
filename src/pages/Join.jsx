import { useState, useEffect } from 'react';
import Navbar from '../components/dwb/Navbar';
import Footer from '../components/dwb/Footer';
import FadeIn from '../components/dwb/FadeIn';
import { base44, integrations } from '../api/apiClient';
import { useToast } from '../components/ui/use-toast';
import { CheckCircle } from 'lucide-react';

const GRADUATION_YEARS = ['2025', '2026', '2027', '2028', '2029', '2030'];

function confirmationEmail({ first_name, last_name, email, netid, major, graduation_year }) {
  const details = [
    ['Name', `${first_name} ${last_name}`],
    ['Email', email],
    ['NetID', netid],
    major && ['Major', major],
    graduation_year && ['Graduation Year', graduation_year],
  ].filter(Boolean);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Cap-X</title>
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
                    <p style="margin:0 0 6px;font-size:11px;color:#c9a84c;letter-spacing:0.22em;text-transform:uppercase;">Founding Member</p>
                    <p style="margin:0;font-size:32px;font-weight:700;color:#ffffff;line-height:1.2;">You're in, ${first_name}.</p>
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
                Welcome to Cap-X at Rutgers. You've been pre-registered as a founding member —
                giving you first access to every session, exclusive networking events, and direct
                introductions to industry leaders.
              </p>

              <!-- Details box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;background:#111827;border:1px solid rgba(255,255,255,0.08);">
                <tr>
                  <td style="padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.08);">
                    <p style="margin:0;font-size:9px;font-weight:700;color:#c9a84c;letter-spacing:0.25em;text-transform:uppercase;">Registration Details</p>
                  </td>
                </tr>
                ${details.map(([label, value], i) => `
                <tr>
                  <td style="padding:13px 24px;${i < details.length - 1 ? 'border-bottom:1px solid rgba(255,255,255,0.05);' : ''}width:38%;">
                    <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:0.12em;text-transform:uppercase;">${label}</p>
                  </td>
                  <td style="padding:13px 24px;${i < details.length - 1 ? 'border-bottom:1px solid rgba(255,255,255,0.05);' : ''}">
                    <p style="margin:0;font-size:13px;font-weight:500;color:#ffffff;">${value}</p>
                  </td>
                </tr>`).join('')}
              </table>

              <!-- What to expect -->
              <p style="margin:0 0 16px;font-size:9px;font-weight:700;color:#c9a84c;letter-spacing:0.25em;text-transform:uppercase;">What to Expect</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
                ${[
                  ['Priority invites', 'Session announcements sent directly to this email before anyone else.'],
                  ['Exclusive networking', 'Access to founding member events with speakers and industry professionals.'],
                  ['Early access', 'First to know about new speakers, workshops, and Cap-X updates.'],
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

export default function Join() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    netid: '',
    major: '',
    graduation_year: '',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.endsWith('@scarletmail.rutgers.edu')) {
      toast({
        title: 'Invalid email',
        description: 'Please use your @scarletmail.rutgers.edu address.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      await base44.entities.Member.create(form);
      // Fire confirmation email (non-blocking — don't fail registration if email fails)
      integrations.Core.SendEmail({
        to: form.email,
        subject: 'Welcome to Cap-X — You\'re Pre-Registered',
        from_name: 'Cap-X Rutgers',
        html: confirmationEmail(form),
      }).catch(() => {});
      setDone(true);
    } catch (err) {
      toast({ title: 'Something went wrong', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <div style={{ paddingTop: 'calc(var(--bar-h, 0px) + 56px)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-56px)]">

          {/* Left — text */}
          <div className="bg-navy flex items-center px-10 md:px-16 py-20">
            <FadeIn>
              <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-5">Founding Members</p>
              <h1 className="font-playfair text-white text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Join Cap-X
              </h1>
              <p className="font-dm-sans text-white/55 leading-relaxed max-w-sm mb-10">
                Pre-register as a founding member of Cap-X at Rutgers. Be first in line for every
                session, exclusive networking events, and direct access to industry leaders.
              </p>
              <div className="space-y-3">
                {[
                  'Priority access to all sessions',
                  'Exclusive networking opportunities',
                  'Direct introductions to speakers',
                  'First to know about new events',
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-gold shrink-0" />
                    <p className="font-dm-sans text-white/55 text-sm">{benefit}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right — form */}
          <div className="bg-navy-light flex items-center justify-center px-10 md:px-16 py-20">
            {done ? (
              <FadeIn>
                <div className="text-center">
                  <CheckCircle size={40} className="text-gold mx-auto mb-4" />
                  <p className="font-playfair text-white text-3xl font-bold mb-3">You're in.</p>
                  <p className="font-dm-sans text-white/50 max-w-xs mx-auto">
                    Welcome to Cap-X. We'll be in touch with session details and member updates.
                  </p>
                </div>
              </FadeIn>
            ) : (
              <FadeIn className="w-full max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-dm-sans text-white/60 text-xs uppercase tracking-[0.15em] block mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={form.first_name}
                        onChange={set('first_name')}
                        className="w-full bg-navy border border-white/15 text-white placeholder-white/25 font-dm-sans text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-dm-sans text-white/60 text-xs uppercase tracking-[0.15em] block mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={form.last_name}
                        onChange={set('last_name')}
                        className="w-full bg-navy border border-white/15 text-white placeholder-white/25 font-dm-sans text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-dm-sans text-white/60 text-xs uppercase tracking-[0.15em] block mb-2">
                      Scarlet Mail
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={set('email')}
                      placeholder="netid@scarletmail.rutgers.edu"
                      className="w-full bg-navy border border-white/15 text-white placeholder-white/25 font-dm-sans text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-dm-sans text-white/60 text-xs uppercase tracking-[0.15em] block mb-2">
                      NetID
                    </label>
                    <input
                      type="text"
                      required
                      value={form.netid}
                      onChange={set('netid')}
                      placeholder="e.g. abc123"
                      className="w-full bg-navy border border-white/15 text-white placeholder-white/25 font-dm-sans text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-dm-sans text-white/60 text-xs uppercase tracking-[0.15em] block mb-2">
                      Major{' '}
                      <span className="text-white/30 normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.major}
                      onChange={set('major')}
                      placeholder="e.g. Finance"
                      className="w-full bg-navy border border-white/15 text-white placeholder-white/25 font-dm-sans text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-dm-sans text-white/60 text-xs uppercase tracking-[0.15em] block mb-2">
                      Graduation Year{' '}
                      <span className="text-white/30 normal-case tracking-normal">(optional)</span>
                    </label>
                    <select
                      value={form.graduation_year}
                      onChange={set('graduation_year')}
                      className="w-full bg-navy border border-white/15 text-white font-dm-sans text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                    >
                      <option value="">Select year</option>
                      {GRADUATION_YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.15em] py-4 hover:bg-gold-dark transition-colors disabled:opacity-60 mt-2"
                  >
                    {loading ? 'Submitting…' : 'Pre-Register'}
                  </button>

                  <p className="font-dm-sans text-white/30 text-xs text-center">
                    Rutgers students only · @scarletmail.rutgers.edu required
                  </p>
                </form>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
