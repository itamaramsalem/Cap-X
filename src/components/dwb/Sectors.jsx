import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FadeIn from './FadeIn';
import Marquee from './Marquee';

const ROW_1 = [
  'Finance & Trading',
  'Consulting',
  'Entrepreneurship',
  'Technology & AI',
  'Marketing & Brand',
];

const ROW_2 = [
  'Wealth Management',
  'Private Equity',
  'Real Estate',
  'Startups & Venture',
  'Operations & Supply Chain',
];

function SectorPill({ label }) {
  return (
    <span className="font-dm-sans text-white text-sm border border-white/20 px-6 py-2.5 mx-2 whitespace-nowrap hover:border-gold/60 hover:text-gold transition-colors duration-200 cursor-default">
      {label}
    </span>
  );
}

export default function Sectors() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // Headline drifts left as section enters, rows drift opposite directions
  const headlineX = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const row1X     = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const row2X     = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section id="sectors" ref={ref} className="bg-navy py-28 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-8 md:px-16 mb-14">
        <FadeIn direction="left">
          <motion.h2
            className="font-playfair text-white text-3xl md:text-5xl font-bold max-w-3xl leading-tight"
            style={{ x: headlineX }}
          >
            Every sector of the business world —{' '}
            <em className="text-gold" style={{ fontStyle: 'italic' }}>
              one conversation at a time.
            </em>
          </motion.h2>
        </FadeIn>
      </div>

      {/* Marquee rows — drift subtly on scroll */}
      <div className="space-y-4">
        <motion.div style={{ x: row1X }}>
          <Marquee
            items={ROW_1.map((s) => <SectorPill key={s} label={s} />)}
            speed={28}
            reverse={false}
          />
        </motion.div>
        <motion.div style={{ x: row2X }}>
          <Marquee
            items={ROW_2.map((s) => <SectorPill key={s} label={s} />)}
            speed={22}
            reverse={true}
          />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-navy to-transparent hidden md:block" />
      <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-navy to-transparent hidden md:block" />
    </section>
  );
}
