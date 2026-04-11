import { motion } from 'framer-motion';
import FadeIn from './FadeIn';

const TIMELINE = [
  { tag: 'Pre-Event', label: 'Speaker Profile Released', detail: 'A speaker profile drops 2 weeks before the session so you can come prepared with real questions.' },
  { tag: '0–5 Min', label: 'Welcome & Introduction', detail: 'The host sets the stage and gives context on the speaker\'s background and career path.' },
  { tag: '5–35 Min', label: 'Moderated Interview', detail: 'A candid, interview-style conversation — their journey, decisions, mistakes, and lessons.' },
  { tag: '35–50 Min', label: 'Open Q&A', detail: 'Students ask questions directly. No topic is off limits.' },
  { tag: '50–70 Min', label: 'Networking Window*', detail: 'One-on-one time with the speaker — direct access for those who want it.' },
];

export default function HowItWorks() {
  return (
    <section id="format" className="bg-cream py-24 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-5">How It Works</p>
          <h2 className="font-playfair text-navy text-4xl md:text-5xl font-bold mb-10 leading-tight">
            A real conversation.<br />Not a presentation.
          </h2>
        </FadeIn>

        <div className="space-y-0">
          {TIMELINE.map(({ tag, label, detail }, i) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.1 }}
              className="flex items-start gap-5 py-5 border-b border-navy/10 last:border-0 group cursor-default"
            >
              <span className="font-dm-sans text-xs font-semibold uppercase tracking-widest bg-navy text-white px-3 py-1 rounded whitespace-nowrap mt-0.5 group-hover:bg-gold group-hover:text-navy transition-colors duration-200 shrink-0">
                {tag}
              </span>
              <div>
                <p className="font-dm-sans text-navy text-sm font-medium leading-snug pt-1">{label}</p>
                <p className="font-dm-sans text-muted-text text-xs leading-relaxed overflow-hidden max-h-0 opacity-0 group-hover:max-h-16 group-hover:opacity-100 group-hover:mt-1.5 transition-all duration-700 ease-out">
                  {detail}
                </p>
              </div>
            </motion.div>
          ))}
          <p className="font-dm-sans text-muted-text text-xs mt-3">*Applies to select speakers only</p>
        </div>
      </div>
    </section>
  );
}
