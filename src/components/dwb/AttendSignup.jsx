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
    <section id="attend" className="bg-white border-t border-black/10">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left */}
        <div className="px-8 md:px-16 py-20 border-b md:border-b-0 md:border-r border-black/10">
          <FadeIn>
            <p className="font-sans text-black/35 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">Reserve Your Seat</p>
            <h2 className="font-sans font-black text-black text-3xl md:text-4xl uppercase tracking-tight leading-tight mb-6">
              Attend a Session
            </h2>
            <p className="font-sans text-black/45 text-sm leading-relaxed">
              Free and open to all students. No application, no interview. Just show up.
            </p>
          </FadeIn>
        </div>

        {/* Right — form */}
        <div className="px-8 md:px-16 py-20 flex items-center">
          {done ? (
            <FadeIn>
              <p className="font-sans font-black text-black text-2xl uppercase tracking-tight">You're in.</p>
              <p className="font-sans text-black/40 text-sm mt-2">We'll be in touch with upcoming session details.</p>
            </FadeIn>
          ) : (
            <FadeIn className="w-full max-w-sm">
              <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
                <div>
                  <label className="font-sans text-black/40 text-[10px] font-semibold uppercase tracking-[0.15em] block mb-2">
                    Scarlet Mail Address
                  </label>
                  <input
                    type="email"
                    required
                    value={form.scarlet_mail}
                    onChange={e => setForm(f => ({ ...f, scarlet_mail: e.target.value }))}
                    placeholder="netid@scarletmail.rutgers.edu"
                    className="w-full border border-black/20 bg-white text-black placeholder-black/25 font-sans text-sm px-4 py-3 focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="font-sans text-black/40 text-[10px] font-semibold uppercase tracking-[0.15em] block mb-2">
                    NetID
                  </label>
                  <input
                    type="text"
                    required
                    value={form.netid}
                    onChange={e => setForm(f => ({ ...f, netid: e.target.value }))}
                    placeholder="e.g. abc123"
                    className="w-full border border-black/20 bg-white text-black placeholder-black/25 font-sans text-sm px-4 py-3 focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white font-sans font-bold text-[10px] uppercase tracking-[0.15em] py-4 hover:bg-black/80 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Signing up…' : 'Sign Me Up'}
                </button>
                <p className="font-sans text-black/25 text-[10px] text-center uppercase tracking-wider">
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
