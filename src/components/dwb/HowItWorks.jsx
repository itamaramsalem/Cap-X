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

<<<<<<< HEAD
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
=======
  // ── Tuning constants ────────────────────────────────────────────────────────
  const V_START      =  410;  // px  rocket y-offset at scroll 0 (nose at container bottom)
  const V_END        = -960;  // px  rocket y-offset at scroll 1 (well above section)
  const DRIFT_AMP    =   24;  // px  max horizontal sine drift (keep modest for elegance)
  const DRIFT_START  = 0.14;  // scroll progress where horizontal drift begins
  const DRIFT_SPAN   = 0.58;  // scroll progress duration of one drift arc
  // ────────────────────────────────────────────────────────────────────────────

  // Vertical — ease-in acceleration: slow nose reveal → faster than scroll mid-section
  // Breakpoints are chosen so peak speed (~progress 0.45-0.70) is ≈1.3× actual scroll speed.
  const rocketY = useTransform(
    scrollYProgress,
    [0,     0.10,   0.25,   0.45,   0.70,   1.0],
    [V_START, V_START - 40, V_START - 210, -120, -620, V_END]
  );

  // Horizontal — single smooth sine arc, no ping-pong.
  // useTransform with a function maps the live MotionValue through Math.sin cleanly.
  const rocketX = useTransform(scrollYProgress, (p) => {
    const t = Math.max(0, Math.min(1, (p - DRIFT_START) / DRIFT_SPAN));
    // sin(t·π) produces one arch: 0 → peak → 0, so the rocket drifts right and returns.
    // The ×0.25 offset gives it a very subtle residual left lean on exit.
    return Math.sin(t * Math.PI) * DRIFT_AMP - t * DRIFT_AMP * 0.25;
  });

  // Smoke plume — attached to rocket nozzle, grows as rocket ascends
  const plumeScale   = useTransform(scrollYProgress, [0.08, 0.68], [0, 1]);
  const plumeOpacity = useTransform(scrollYProgress, [0.07, 0.20], [0, 1]);

  // Caption fades as rocket begins to move
  const textOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  return (
    <div className="flex flex-col items-center gap-4 w-full select-none">

      {/* Clipping boundary — overflow-hidden hides the rocket when it travels beyond the container */}
      <div className="relative w-full overflow-hidden" style={{ height: 520 }}>

        {/* ── Rocket + plume move together ── */}
        <motion.div
          className="absolute"
          style={{ y: rocketY, x: rocketX, top: '110px', left: '50%', marginLeft: '-75px' }}
        >
          {/* ── Smoke plume — rendered before rocket so rocket sits on top ──
              top: 204px aligns with the nozzle bottom (y=136 in SVG × 1.5 scale).
              left: -45px centres the 240px-wide plume on the 150px-wide rocket (75 − 120 = −45).
              CSS blur merges the borderless ellipses into one soft cloud blob.
              originX/Y: 0.5/0 scales outward from the nozzle exit point. */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              scale: plumeScale,
              opacity: plumeOpacity,
              originX: 0.5,
              originY: 0,
              top: '204px',
              left: '-45px',
            }}
          >
            <svg
              width="240"
              height="300"
              viewBox="0 0 240 300"
              fill="none"
              style={{ filter: 'blur(8px)' }}
            >
              <g fill="#b6c2d2" fillOpacity="0.78">
                {/* Nozzle exit — tiny wisp */}
                <ellipse cx="120" cy="11"  rx="13" ry="11"/>
                {/* Small puffs just below nozzle */}
                <ellipse cx="105" cy="40"  rx="22" ry="22"/>
                <ellipse cx="135" cy="40"  rx="22" ry="22"/>
                <ellipse cx="120" cy="50"  rx="20" ry="18"/>
                {/* Upper cloud */}
                <ellipse cx="82"  cy="96"  rx="36" ry="40"/>
                <ellipse cx="158" cy="96"  rx="36" ry="40"/>
                <ellipse cx="120" cy="86"  rx="44" ry="40"/>
                {/* Mid cloud */}
                <ellipse cx="64"  cy="170" rx="54" ry="56"/>
                <ellipse cx="176" cy="170" rx="54" ry="56"/>
                <ellipse cx="120" cy="156" rx="62" ry="58"/>
                {/* Base spread */}
                <ellipse cx="44"  cy="248" rx="68" ry="52"/>
                <ellipse cx="196" cy="248" rx="68" ry="52"/>
                <ellipse cx="120" cy="264" rx="95" ry="44"/>
                {/* Far outer wisps */}
                <ellipse cx="12"  cy="240" rx="36" ry="32"/>
                <ellipse cx="228" cy="240" rx="36" ry="32"/>
              </g>
            </svg>
          </motion.div>

          {/* ── Rocket SVG ── */}
>>>>>>> danrosenboim
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

<<<<<<< HEAD
          {/* Rocket — fills the right grid column */}
=======
          {/* Rocket — right grid column, self-contained with its own clipping container */}
>>>>>>> danrosenboim
          <div className="hidden md:flex justify-center items-center w-full">
            <Rocket sectionRef={sectionRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
