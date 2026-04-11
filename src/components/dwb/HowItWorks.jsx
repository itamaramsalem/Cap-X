import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FadeIn from './FadeIn';

const TIMELINE = [
  { tag: 'Pre-Event', label: 'Speaker Profile Released', detail: 'A speaker profile drops 2 weeks before the session so you can come prepared with real questions.' },
  { tag: '0–5 Min',  label: 'Welcome & Introduction',  detail: "The host sets the stage and gives context on the speaker's background and career path." },
  { tag: '5–35 Min', label: 'Moderated Interview',     detail: 'A candid, interview-style conversation — their journey, decisions, mistakes, and lessons.' },
  { tag: '35–50 Min',label: 'Open Q&A',                detail: 'Students ask questions directly. No topic is off limits.' },
  { tag: '50–70 Min',label: 'Networking Window*',      detail: 'One-on-one time with the speaker — direct access for those who want it.' },
];

function Rocket({ sectionRef }) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Rocket flies up and off the top of the container
  const rocketY    = useTransform(scrollYProgress, [0, 1], [0, -700]);

  // Plume grows upward from the nozzle's starting position
  const plumeH     = useTransform(scrollYProgress, [0, 0.05, 0.9], [0, 30, 560]);
  const plumeOpacity = useTransform(scrollYProgress, [0, 0.06, 0.75, 1], [0, 1, 0.6, 0]);

  // Text fades out as rocket launches
  const textOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {/* Clipping container */}
      <div className="relative overflow-hidden" style={{ width: 180, height: 520 }}>

        {/* ── Plume: anchored at nozzle start, grows upward ── */}
        <motion.div
          style={{ height: plumeH, opacity: plumeOpacity }}
          className="absolute bottom-[28px] left-1/2 -translate-x-1/2 overflow-hidden"
        >
          <svg
            width="80"
            height="560"
            viewBox="0 0 80 560"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            className="text-navy absolute bottom-0 left-0"
          >
            {/* Centre exhaust */}
            <line x1="40" y1="0"  x2="40"  y2="560" strokeWidth="1.8" strokeOpacity="0.9"/>
            {/* Mid diverging lines */}
            <line x1="40" y1="0"  x2="20"  y2="560" strokeWidth="1.2" strokeOpacity="0.6"/>
            <line x1="40" y1="0"  x2="60"  y2="560" strokeWidth="1.2" strokeOpacity="0.6"/>
            {/* Outer wisps */}
            <line x1="40" y1="0"  x2="4"   y2="560" strokeWidth="0.7" strokeOpacity="0.3"/>
            <line x1="40" y1="0"  x2="76"  y2="560" strokeWidth="0.7" strokeOpacity="0.3"/>
            {/* Wavy texture lines */}
            <path d="M40 0 Q28 140 32 280 Q36 420 14 560" strokeWidth="0.6" strokeOpacity="0.25"/>
            <path d="M40 0 Q52 140 48 280 Q44 420 66 560" strokeWidth="0.6" strokeOpacity="0.25"/>
          </svg>
        </motion.div>

        {/* ── Rocket: moves up and off screen ── */}
        <motion.div
          style={{ y: rocketY }}
          className="absolute bottom-[20px] left-1/2 -translate-x-1/2"
        >
          <svg
            viewBox="0 0 100 200"
            width="150"
            height="300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-navy"
          >
            {/* Nose cone */}
            <path d="M 50 4 L 78 62 L 22 62 Z" />
            {/* Body */}
            <rect x="22" y="62" width="56" height="58" />
            {/* Porthole */}
            <circle cx="50" cy="88" r="11" />
            {/* Left fin */}
            <path d="M 22 96  L 4  128 L 22 118" />
            {/* Right fin */}
            <path d="M 78 96  L 96 128 L 78 118" />
            {/* Nozzle skirt */}
            <path d="M 34 120 L 28 136 L 72 136 L 66 120" />
            {/* Flames — flicker */}
            <motion.g
              animate={{ y: [0, -6, 1, -5, 0], opacity: [1, 0.6, 1, 0.7, 1] }}
              transition={{ repeat: Infinity, duration: 0.85, ease: 'easeInOut' }}
            >
              <line x1="37" y1="136" x2="33" y2="162" strokeWidth="1.6"/>
              <line x1="50" y1="136" x2="50" y2="170" strokeWidth="1.6"/>
              <line x1="63" y1="136" x2="67" y2="162" strokeWidth="1.6"/>
            </motion.g>
          </svg>
        </motion.div>
      </div>

      {/* Caption fades as rocket departs */}
      <motion.p
        style={{ opacity: textOpacity }}
        className="font-playfair text-navy text-lg font-bold text-center italic leading-snug"
      >
        Launch your career<br />forward
      </motion.p>
    </div>
  );
}

export default function HowItWorks() {
  const sectionRef = useRef(null);

  return (
    <section id="format" ref={sectionRef} className="bg-cream py-24 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-5">How It Works</p>
          <h2 className="font-playfair text-navy text-4xl md:text-5xl font-bold mb-10 leading-tight">
            A real conversation.<br />Not a presentation.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Timeline */}
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

          {/* Rocket — centred in the right half */}
          <div className="hidden md:flex justify-center items-center">
            <Rocket sectionRef={sectionRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
