import FadeIn from './FadeIn';
import { CalendarCheck } from 'lucide-react';

export default function AttendSignup() {
  const scrollToSpeakers = (e) => {
    e.preventDefault();
    document.getElementById('speakers')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="attend" className="bg-navy py-0">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[520px]">
        {/* Left — text */}
        <div className="bg-navy flex items-center px-10 md:px-16 py-20">
          <FadeIn>
            <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-5">Sessions</p>
            <h2 className="font-playfair text-white text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Attend a Session
            </h2>
            <p className="font-dm-sans text-white/55 leading-relaxed">
              Each Cap-X session is free and open to all Rutgers students. Seats are limited —
              RSVP directly on the speaker card once a session is announced. Sessions are added
              on a rolling basis throughout the semester.
            </p>
          </FadeIn>
        </div>

        {/* Right — CTA */}
        <div className="bg-navy-light flex items-center justify-center px-10 md:px-16 py-20">
          <FadeIn>
            <div className="text-center">
              <CalendarCheck size={36} className="text-gold mx-auto mb-5" />
              <p className="font-playfair text-white text-2xl font-bold mb-1">Session 01 — May 1, 2025</p>
              <p className="font-dm-sans text-gold text-sm font-semibold mb-3">Marcus Rivera · Goldman Sachs</p>
              <p className="font-dm-sans text-white/50 text-sm max-w-xs mx-auto mb-8">
                Seats are limited. RSVP now to secure your spot at the first Cap-X session.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#speakers"
                  onClick={scrollToSpeakers}
                  className="w-full sm:w-auto bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.15em] px-7 py-4 hover:bg-gold-dark transition-colors text-center"
                >
                  Reserve My Seat
                </a>
                <a
                  href="#schedule"
                  onClick={(e) => { e.preventDefault(); document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="w-full sm:w-auto border border-white/20 text-white font-dm-sans font-semibold text-xs uppercase tracking-[0.15em] px-7 py-4 hover:border-white/40 transition-colors text-center"
                >
                  View Calendar
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
