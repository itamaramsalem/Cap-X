import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import FadeIn from './FadeIn';

const TIMELINE = [
  { tag: 'Pre-Event', label: 'Speaker Profile Released', detail: 'A speaker profile drops 2 weeks before the session so you can come prepared with real questions.' },
  { tag: '0–5 Min',  label: 'Welcome & Introduction',  detail: "The host sets the stage and gives context on the speaker's background and career path." },
  { tag: '5–35 Min', label: 'Moderated Interview',     detail: 'A candid, interview-style conversation — their journey, decisions, mistakes, and lessons.' },
  { tag: '35–50 Min',label: 'Open Q&A',                detail: 'Students ask questions directly. No topic is off limits.' },
  { tag: '50–70 Min',label: 'Networking Window*',      detail: 'One-on-one time with the speaker — direct access for those who want it.' },
];

// ─── Tuning constants ────────────────────────────────────────────
const VERTICAL_TRAVEL   = 1100;  // px the rocket rises over the scroll range
const DRIFT_AMPLITUDE   = 22;    // px of horizontal sway (keep modest)
const PLUME_MIN         = 0;     // px plume height at scroll start
const PLUME_MAX         = 620;   // px plume height at scroll end
const INITIAL_Y_OFFSET  = 380;   // px below container — rocket hidden until scrolled to Open Q&A
const SCROLL_START      = 0.28;  // section progress where motion begins (~Open Q&A level)
const SCROLL_END        = 0.95;  // section progress where rocket exits top
// ─────────────────────────────────────────────────────────────────

function Rocket({ sectionRef }) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end start'],
  });

  // Smooth spring so motion feels organic, not mechanical
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.8 });

  // ── Vertical: starts below the clipping container, rises and flies off top ──
  const rocketY = useTransform(smooth, [SCROLL_START, SCROLL_END], [INITIAL_Y_OFFSET, -VERTICAL_TRAVEL]);

  // ── Rocket fades in softly as it first emerges ──
  const rocketOpacity = useTransform(smooth,
    [SCROLL_START, SCROLL_START + 0.07],
    [0, 1],
  );

  // ── Horizontal: single smooth sine-shaped drift, no ping-pong ──
  const rocketX = useTransform(smooth, (p) => {
    const t = Math.max(0, Math.min(1, (p - SCROLL_START) / (SCROLL_END - SCROLL_START)));
    return Math.sin(t * Math.PI * 1.5) * DRIFT_AMPLITUDE;
  });

  // ── Subtle tilt that follows the horizontal drift ──
  const rocketRotate = useTransform(smooth, (p) => {
    const t = Math.max(0, Math.min(1, (p - SCROLL_START) / (SCROLL_END - SCROLL_START)));
    return Math.cos(t * Math.PI * 1.5) * 3.5; // ±3.5° lean
  });

  // ── Plume grows as thrust builds ──
  const plumeH = useTransform(smooth,
    [SCROLL_START, SCROLL_START + 0.06, SCROLL_END],
    [PLUME_MIN, 40, PLUME_MAX],
  );
  const plumeOpacity = useTransform(smooth,
    [SCROLL_START, SCROLL_START + 0.08, SCROLL_END - 0.1, SCROLL_END],
    [0, 1, 0.75, 0],
  );

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {/* Clipping container — overflow-hidden hides rocket below until scroll triggers */}
      <div className="relative overflow-hidden" style={{ width: 320, height: 700 }}>

        {/* ── Plume: anchored at nozzle, grows with scroll ── */}
        <motion.div
          style={{ height: plumeH, opacity: plumeOpacity, x: rocketX }}
          className="absolute bottom-[32px] left-1/2 -translate-x-1/2 overflow-hidden"
        >
          <svg
            width="80"
            height={PLUME_MAX}
            viewBox={`0 0 80 ${PLUME_MAX}`}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            className="text-navy absolute bottom-0 left-0"
          >
            <line x1="40" y1="0" x2="40"  y2={PLUME_MAX} strokeWidth="1.8" strokeOpacity="0.85"/>
            <line x1="40" y1="0" x2="18"  y2={PLUME_MAX} strokeWidth="1.1" strokeOpacity="0.55"/>
            <line x1="40" y1="0" x2="62"  y2={PLUME_MAX} strokeWidth="1.1" strokeOpacity="0.55"/>
            <line x1="40" y1="0" x2="2"   y2={PLUME_MAX} strokeWidth="0.65" strokeOpacity="0.28"/>
            <line x1="40" y1="0" x2="78"  y2={PLUME_MAX} strokeWidth="0.65" strokeOpacity="0.28"/>
            <path d={`M40 0 Q30 ${PLUME_MAX*0.25} 34 ${PLUME_MAX*0.5} Q38 ${PLUME_MAX*0.75} 16 ${PLUME_MAX}`}
              strokeWidth="0.55" strokeOpacity="0.22"/>
            <path d={`M40 0 Q50 ${PLUME_MAX*0.25} 46 ${PLUME_MAX*0.5} Q42 ${PLUME_MAX*0.75} 64 ${PLUME_MAX}`}
              strokeWidth="0.55" strokeOpacity="0.22"/>
          </svg>
        </motion.div>

        {/* ── Rocket body: hidden below container, rises into view on scroll ── */}
        <motion.div
          style={{ y: rocketY, x: rocketX, rotate: rocketRotate, opacity: rocketOpacity }}
          className="absolute bottom-[24px] left-1/2 -translate-x-1/2"
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
            <path d="M 50 4 L 78 62 L 22 62 Z" />
            <rect x="22" y="62" width="56" height="58" />
            <circle cx="50" cy="88" r="11" />
            <path d="M 22 96 L 4  128 L 22 118" />
            <path d="M 78 96 L 96 128 L 78 118" />
            <path d="M 34 120 L 28 136 L 72 136 L 66 120" />
            <motion.g
              animate={{ y: [0, -4, 1, -3, 0], opacity: [1, 0.65, 1, 0.7, 1] }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
            >
              <line x1="37" y1="136" x2="34" y2="158" strokeWidth="1.5"/>
              <line x1="50" y1="136" x2="50" y2="166" strokeWidth="1.5"/>
              <line x1="63" y1="136" x2="66" y2="158" strokeWidth="1.5"/>
            </motion.g>
          </svg>
        </motion.div>
      </div>

      {/* Caption stays visible — rocket launches away, words remain */}
      <p className="font-playfair text-navy text-lg font-bold text-center italic leading-snug">
        Launch your career<br />forward
      </p>
    </div>
  );
}

export default function HowItWorks() {
  const sectionRef = useRef(null);

  return (
    <section id="format" ref={sectionRef} className="bg-cream py-24 px-8 md:px-16 relative">
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

          {/* Right column — empty, rocket sits outside the grid */}
          <div className="hidden md:block" />
        </div>
      </div>

      {/* Rocket — right of center, anchored to section bottom */}
      <div className="hidden md:block absolute bottom-0 left-[62%] -translate-x-1/2 pointer-events-none">
        <Rocket sectionRef={sectionRef} />
      </div>
    </section>
  );
}
