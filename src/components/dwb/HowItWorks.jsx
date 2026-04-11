import { motion } from 'framer-motion';
import FadeIn from './FadeIn';

const TIMELINE = [
  { tag: 'Pre-Event', label: 'Speaker Profile Released' },
  { tag: '0–5 Min', label: 'Welcome & Introduction' },
  { tag: '5–35 Min', label: 'Moderated Interview' },
  { tag: '35–50 Min', label: 'Open Q&A' },
  { tag: '50–70 Min', label: 'Networking Window*' },
];

export default function HowItWorks() {
  return (
    <section id="format" className="bg-cream py-24 px-8 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

        {/* Left column */}
        <FadeIn>
          <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-5">How It Works</p>
          <h2 className="font-playfair text-navy text-4xl md:text-5xl font-bold mb-6 leading-tight">
            A real conversation.<br />Not a presentation.
          </h2>
          <p className="font-dm-sans text-muted-text leading-relaxed mb-4">
            Sessions are moderated interview-style, not keynotes. No slides, no
            scripts — just a real conversation between the host and someone who's
            been in the trenches.
          </p>
          <p className="font-dm-sans text-muted-text leading-relaxed mb-4">
            A speaker profile is released 5–7 days before each session so students
            know who's coming and can come prepared with thoughtful questions.
          </p>
          <p className="font-dm-sans text-muted-text leading-relaxed mb-6">
            The host runs the interview: their journey, the decisions they made, the
            mistakes, and the lessons. It's candid, not curated.
          </p>
          <p className="font-dm-sans text-muted-text leading-relaxed mb-6">
            Q&A follows, then for select speakers, a structured networking window
            gives students direct access.
          </p>
          <blockquote className="border-l-2 border-gold/40 pl-5">
            <p className="font-playfair text-navy/70 text-lg italic leading-relaxed">
              "The most valuable things in business can't be taught from a lecture.
              They come from the person who made the call and lived with the outcome."
            </p>
          </blockquote>
        </FadeIn>

        {/* Right column — animated timeline */}
        <div className="space-y-0">
          {TIMELINE.map(({ tag, label }, i) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.1 }}
              className="flex items-start gap-5 py-5 border-b border-navy/10 last:border-0 group"
            >
              <span className="font-dm-sans text-xs font-semibold uppercase tracking-widest bg-navy text-white px-3 py-1 rounded whitespace-nowrap mt-0.5 group-hover:bg-gold group-hover:text-navy transition-colors duration-200">
                {tag}
              </span>
              <p className="font-dm-sans text-navy text-sm font-medium leading-snug pt-1">{label}</p>
            </motion.div>
          ))}
          <p className="font-dm-sans text-muted-text text-xs mt-3">*Applies to select speakers only</p>
        </div>

      </div>
    </section>
  );
}
