import { useState } from 'react';
import FadeIn from './FadeIn';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <section className="bg-black border-t border-white/10 py-16 px-8 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <FadeIn>
          <p className="font-sans text-white/30 text-[10px] font-semibold uppercase tracking-[0.2em] mb-3">Newsletter</p>
          <h3 className="font-sans font-black text-white text-2xl uppercase tracking-tight mb-2">Stay in the loop.</h3>
          <p className="font-sans text-white/40 text-sm leading-relaxed">
            Get speaker announcements, session recaps, and event reminders — straight to your inbox.
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          {done ? (
            <p className="font-sans text-white font-bold uppercase tracking-wide text-sm">Thanks — you're subscribed.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-0">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 border border-white/20 bg-transparent text-white placeholder-white/25 font-sans text-sm px-4 py-3 focus:outline-none focus:border-white/50 transition-colors"
              />
              <button
                type="submit"
                className="bg-white text-black font-sans font-bold text-[10px] uppercase tracking-[0.15em] px-6 py-3 hover:bg-white/90 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
