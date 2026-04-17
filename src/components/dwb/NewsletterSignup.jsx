import { useState } from 'react';
import FadeIn from './FadeIn';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: connect to email list provider (Resend audience, Mailchimp, etc.)
    setDone(true);
  };

  return (
    <section className="bg-cream py-16 px-8 md:px-16 border-t border-navy/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <FadeIn>
          <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-3">Don't Miss Out</p>
          <h3 className="font-playfair text-navy text-3xl font-bold mb-3">Sessions fill fast. Be first.</h3>
          <p className="font-dm-sans text-muted-text text-sm leading-relaxed">
            Get notified the moment a new session drops — before 50 seats are gone.
            Speaker profiles, event details, and early access straight to your inbox.
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          {done ? (
            <p className="font-dm-sans text-navy font-medium">Thanks — you're subscribed.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 border border-navy/20 bg-white text-navy placeholder-muted-text font-dm-sans text-sm px-4 py-3 focus:outline-none focus:border-navy transition-colors"
              />
              <button
                type="submit"
                className="bg-navy text-white font-dm-sans font-semibold text-xs uppercase tracking-[0.15em] px-6 py-3 hover:bg-navy-light transition-colors whitespace-nowrap"
              >
                Notify Me
              </button>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
