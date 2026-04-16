import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import FadeIn from './FadeIn';

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

const GROUPS = [
  {
    label: 'On Feeling Unprepared',
    stats: [
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
        label: 'of freshmen say getting a good job is why they go to college — yet only a third strongly agree they\'re getting the skills they need',
        source: 'Gallup / Strada',
      },
    ],
  },
  {
    label: 'On Networking',
    stats: [
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
    ],
  },
];

function StatItem({ stat }) {
  const isNumeric = stat.numericTarget != null;
  return (
    <div className="py-6 border-b border-white/8 last:border-0">
      <p className="font-playfair text-gold text-4xl md:text-5xl font-bold leading-none mb-3">
        {isNumeric ? (
          <CountUp target={stat.numericTarget} suffix={stat.suffix} />
        ) : (
          stat.display
        )}
      </p>
      <p className="font-dm-sans text-white/70 text-sm leading-relaxed mb-1.5">
        {stat.label}
      </p>
      <p className="font-dm-sans text-white/30 text-xs tracking-wide">
        — {stat.source}
      </p>
    </div>
  );
}

export default function WorkforceStats() {
  return (
    <section className="bg-navy py-24 px-8 md:px-16 border-t border-white/8">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <p className="font-dm-sans text-gold text-xs uppercase tracking-[0.2em] mb-4">The Gap Is Real</p>
          <h2 className="font-playfair text-white text-3xl md:text-5xl font-bold leading-tight mb-16 max-w-3xl">
            The data on where students actually stand.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          {GROUPS.map((group) => (
            <FadeIn key={group.label}>
              <p className="font-dm-sans text-white/35 text-xs uppercase tracking-[0.18em] mb-6 pb-3 border-b border-white/10">
                {group.label}
              </p>
              <div>
                {group.stats.map((stat) => (
                  <StatItem key={stat.source + stat.label} stat={stat} />
                ))}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
