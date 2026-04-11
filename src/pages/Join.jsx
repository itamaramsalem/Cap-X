import { useState } from 'react';
import Navbar from '../components/dwb/Navbar';
import Footer from '../components/dwb/Footer';
import FadeIn from '../components/dwb/FadeIn';
import { base44 } from '../api/apiClient';
import { useToast } from '../components/ui/use-toast';
import { CheckCircle } from 'lucide-react';

const GRADUATION_YEARS = ['2025', '2026', '2027', '2028', '2029', '2030'];

export default function Join() {
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
