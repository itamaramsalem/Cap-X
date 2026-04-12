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

  // Phase 1 (0–0.18): rocket fades in and floats up to resting position
  // Phase 2 (0.18–0.32): rocket holds perfectly still
  // Phase 3 (0.32–0.82): rocket launches upward and exits
  const rocketY       = useTransform(scrollYProgress, [0, 0.18, 0.32, 0.82], [60, 0, 0, -480]);
  const rocketOpacity = useTransform(scrollYProgress, [0, 0.13, 0.68, 0.82], [0, 1, 1, 0]);

  // Cloud: anchored at nozzle height (top: 305px), grows downward as rocket launches
  const cloudOpacity  = useTransform(scrollYProgress, [0, 0.30, 0.42, 0.88], [0, 0, 1, 0.35]);
  const cloudScale    = useTransform(scrollYProgress, [0.30, 0.82], [0.05, 1.1]);

  // Caption fades as rocket departs
  const textOpacity   = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

  return (
    <div className="flex flex-col items-center gap-6 select-none w-full">

      {/* w-full so the rocket never clips horizontally; overflow-hidden clips rocket at top */}
      <div className="relative overflow-hidden w-full" style={{ height: 560 }}>

        {/* ── Smoke cloud ──
            top is pinned to the nozzle's resting y-position (≈305 px).
            origin-top means it scales downward from the nozzle, not upward. */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 origin-top"
          style={{ top: '305px', opacity: cloudOpacity, scale: cloudScale }}
        >
          <svg
            viewBox="0 0 220 220"
            width="220"
            height="220"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="text-navy"
          >
            {/* Narrow tip — sits right at nozzle exit */}
            <circle cx="110" cy="16"  r="12" />
            {/* Row 2 */}
            <circle cx="89"  cy="46"  r="18" />
            <circle cx="131" cy="46"  r="18" />
            {/* Row 3 */}
            <circle cx="68"  cy="80"  r="22" />
            <circle cx="110" cy="76"  r="21" />
            <circle cx="152" cy="80"  r="22" />
            {/* Row 4 */}
            <circle cx="54"  cy="116" r="25" />
            <circle cx="96"  cy="112" r="23" />
            <circle cx="130" cy="112" r="23" />
            <circle cx="166" cy="116" r="25" />
            {/* Row 5 — widest */}
            <circle cx="47"  cy="154" r="26" />
            <circle cx="88"  cy="150" r="25" />
            <circle cx="128" cy="150" r="25" />
            <circle cx="169" cy="154" r="26" />
            {/* Base ellipse */}
            <ellipse cx="110" cy="198" rx="62" ry="21" />
          </svg>
        </motion.div>

        {/* ── Rocket ──
            Centered with left-1/2 / -translate-x-1/2 so it never clips horizontally.
            bottom-[150px] puts the full 320 px SVG well inside the 560 px container. */}
        <motion.div
          className="absolute bottom-[150px] left-1/2 -translate-x-1/2"
          style={{ y: rocketY, opacity: rocketOpacity }}
        >
          <svg
            viewBox="0 0 100 200"
            width="160"
            height="320"
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

          {/* Rocket — fills the right grid column */}
          <div className="hidden md:flex justify-center items-center w-full">
            <Rocket sectionRef={sectionRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
