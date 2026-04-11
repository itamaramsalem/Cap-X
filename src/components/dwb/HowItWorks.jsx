import { motion } from 'framer-motion';
import FadeIn from './FadeIn';

const EASE = [0.16, 1, 0.3, 1];

const TIMELINE = [
  { tag: 'Pre-Event', label: 'Speaker Profile Released' },
  { tag: '0–5 Min',  label: 'Welcome & Introduction' },
  { tag: '5–35 Min', label: 'Moderated Interview' },
  { tag: '35–50 Min', label: 'Open Q&A' },
  { tag: '50–70 Min', label: 'Networking Window*' },
];

export default function HowItWorks() {
  return (
    <section id="format" className="bg-white border-t border-black/10 py-24 px-8 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

        {/* Left — copy */}
        <FadeIn>
          <p className="font-sans text-black/30 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">
            How It Works
          </p>
          <h2 className="font-sans font-black text-black text-3xl md:text-4xl uppercase tracking-tight leading-tight mb-6">
            A real conversation.<br />Not a presentation.
          </h2>
          <p className="font-sans text-black/45 text-sm leading-relaxed mb-4">
            Sessions are moderated interview-style, not keynotes. No slides, no
            scripts — just a real conversation between the host and someone who's
            been in the trenches.
          </p>
          <p className="font-sans text-black/45 text-sm leading-relaxed mb-4">
            A speaker profile is released 5–7 days before each session so students
            can come prepared with thoughtful questions.
          </p>
          <p className="font-sans text-black/45 text-sm leading-relaxed mb-8">
            Q&A follows, then for select speakers, a structured networking window
            gives students direct access.
          </p>
          <blockquote className="border-l border-black/15 pl-5">
            <p className="font-sans text-black/35 text-sm italic leading-relaxed">
              "The most valuable things in business can't be taught from a lecture.
              They come from the person who made the call and lived with the outcome."
            </p>
          </blockquote>
        </FadeIn>

        {/* Right — animated timeline */}
        <div>
          {TIMELINE.map(({ tag, label }, i) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, ease: EASE, delay: i * 0.08 }}
              className={`flex items-center gap-5 py-5 group ${
                i < TIMELINE.length - 1 ? 'border-b border-black/8' : ''
              }`}
            >
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] bg-black text-white px-3 py-1.5 whitespace-nowrap group-hover:bg-white group-hover:text-black group-hover:outline group-hover:outline-1 group-hover:outline-black transition-colors duration-150">
                {tag}
              </span>
              <p className="font-sans text-black text-sm font-medium">{label}</p>
            </motion.div>
          ))}
          <p className="font-sans text-black/25 text-[10px] mt-4 uppercase tracking-wider">
            *Applies to select speakers only
          </p>
        </div>

      </div>
    </section>
  );
}
