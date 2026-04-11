import { useState } from 'react';
import FadeIn from './FadeIn';
import { base44 } from '../../api/apiClient';
import { useToast } from '../ui/use-toast';

export default function AttendSignup() {
  const [form, setForm] = useState({ scarlet_mail: '', netid: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.scarlet_mail.endsWith('@scarletmail.rutgers.edu')) {
      toast({ title: 'Invalid email', description: 'Please use your @scarletmail.rutgers.edu address.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await base44.entities.Rsvp.create({ ...form, speaker_id: 'general' });
      setDone(true);
    } catch (err) {
      toast({ title: 'Something went wrong', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="attend" className="bg-navy py-0">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[520px]">
        {/* Left — text */}
        <div className="bg-navy flex items-center px-10 md:px-16 py-20">
          <FadeIn>
            <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-5">Reserve Your Seat</p>
            <h2 className="font-playfair text-white text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Attend a Session
            </h2>
            <p className="font-dm-sans text-white/55 leading-relaxed">
              Free and open to all students. No application, no interview. Just show up.
            </p>
          </FadeIn>
        </div>

        {/* Right — form */}
        <div className="bg-navy-light flex items-center justify-center px-10 md:px-16 py-20">
          {done ? (
            <FadeIn>
              <div className="text-center">
                <p className="font-playfair text-white text-3xl font-bold mb-3">You're in.</p>
                <p className="font-dm-sans text-white/50">We'll be in touch with upcoming session details.</p>
              </div>
            </FadeIn>
          ) : (
            <FadeIn className="w-full max-w-sm">
              <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-sm">
                <div>
                  <label className="font-dm-sans text-white/60 text-xs uppercase tracking-[0.15em] block mb-2">
                    Scarlet Mail Address
                  </label>
                  <input
                    type="email"
                    required
                    value={form.scarlet_mail}
                    onChange={e => setForm(f => ({ ...f, scarlet_mail: e.target.value }))}
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
                    onChange={e => setForm(f => ({ ...f, netid: e.target.value }))}
                    placeholder="e.g. abc123"
                    className="w-full bg-navy border border-white/15 text-white placeholder-white/25 font-dm-sans text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.15em] py-4 hover:bg-gold-dark transition-colors disabled:opacity-60"
                >
                  {loading ? 'Signing up…' : 'Sign Me Up'}
                </button>
                <p className="font-dm-sans text-white/30 text-xs text-center">
                  Rutgers students only · @scarletmail.rutgers.edu required
                </p>
              </form>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}
