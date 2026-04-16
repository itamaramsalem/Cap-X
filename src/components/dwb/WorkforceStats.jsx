import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

function CountUp({ target, duration = 1400, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const STATS = [
  {
    display: null, numericTarget: 11, suffix: '%',
    label: 'of college students feel "very prepared" to enter the workforce',
    source: 'Salesforce Connected Student Report',
  },
  {
    display: '~Half',
    label: "of graduates don't feel prepared enough to apply for an entry-level job in their own field",
    source: 'Cengage Group, 2025',
  },
  {
    display: null, numericTarget: 88, suffix: '%',
    label: "of freshmen say getting a good job is why they go to college — yet only a third strongly agree they're getting the skills they need",
    source: 'Gallup / Strada',
  },
  {
    display: null, numericTarget: 84, suffix: '%',
    label: 'of job seekers say networking is key to getting a foot in the door — yet 51% of Gen Z feel underprepared to do it',
    source: 'Express Employment / Harris Poll, 2026',
  },
  {
    display: '1 in 5',
    label: 'college students know zero people working in their desired field',
    source: 'WGU Report, 2025',
  },
  {
    display: '~Half',
    label: 'of internships and jobs come through personal connections — networking is the skill students feel least confident in',
    source: 'Gallup / Strada',
  },
];

const GROUP_LABELS = ['On Feeling Unprepared', 'On Networking'];

// Each stat slide receives global scrollYProgress + its own [start, end] range
function StatSlide({ stat, scrollYProgress, start, end }) {
  const opacity = useTransform(scrollYProgress, [start, start + 0.08, end - 0.08, end], [0, 1, 1, 0]);
  const y       = useTransform(scrollYProgress, [start, start + 0.12], [50, 0]);

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 flex flex-col justify-center px-8 md:px-20">
      <p className="font-playfair text-gold text-6xl md:text-8xl font-bold leading-none mb-6">
        {stat.numericTarget != null
          ? <CountUp target={stat.numericTarget} suffix={stat.suffix} />
          : stat.display}
      </p>
      <p className="font-dm-sans text-white/70 text-base md:text-xl leading-relaxed max-w-xl mb-3">
        {stat.label}
      </p>
      <p className="font-dm-sans text-white/30 text-sm tracking-wide">— {stat.source}</p>
    </motion.div>
  );
}

function DotIndicator({ scrollYProgress, start, end }) {
  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    [0.2, 1, 1, 0.2]
  );
  return <motion.div className="w-1.5 h-1.5 rounded-full bg-gold" style={{ opacity }} />;
}

function GroupLabel({ scrollYProgress, fadeIn, fadeOut, label }) {
  const opacity = useTransform(scrollYProgress, [fadeIn, fadeIn + 0.05, fadeOut - 0.05, fadeOut], [0, 1, 1, 0]);
  return (
    <motion.p style={{ opacity }} className="absolute font-dm-sans text-white/35 text-xs uppercase tracking-[0.18em]">
      {label}
    </motion.p>
  );
}

const SEG = 1 / STATS.length;

export default function WorkforceStats() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const barWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={containerRef} style={{ height: `${STATS.length * 110}vh` }}>
      <div className="sticky top-0 h-screen bg-navy overflow-hidden border-t border-white/8 flex flex-col">

        {/* Progress bar */}
        <div className="h-px bg-white/8 w-full shrink-0">
          <motion.div className="h-full bg-gold" style={{ width: barWidth }} />
        </div>

        <div className="flex-1 flex flex-col relative">

          {/* Header */}
          <div className="px-8 md:px-20 pt-14 pb-6 shrink-0">
            <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-3">The Gap Is Real</p>
            <h2 className="font-playfair text-white text-3xl md:text-5xl font-bold leading-tight">
              The data on where students actually stand.
            </h2>
          </div>

          {/* Group label */}
          <div className="px-8 md:px-20 pb-2 shrink-0 h-8 relative">
            <GroupLabel scrollYProgress={scrollYProgress} fadeIn={0}   fadeOut={0.5} label={GROUP_LABELS[0]} />
            <GroupLabel scrollYProgress={scrollYProgress} fadeIn={0.5} fadeOut={1.0} label={GROUP_LABELS[1]} />
          </div>

          {/* Stat slides */}
          <div className="flex-1 relative">
            {STATS.map((stat, i) => (
              <StatSlide
                key={i}
                stat={stat}
                scrollYProgress={scrollYProgress}
                start={i * SEG}
                end={(i + 1) * SEG}
              />
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-2 px-8 md:px-20 pb-10 shrink-0">
            {STATS.map((_, i) => (
              <DotIndicator
                key={i}
                scrollYProgress={scrollYProgress}
                start={i * SEG}
                end={(i + 1) * SEG}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
