import FadeIn from './FadeIn';
import Marquee from './Marquee';

// Split into two rows for the double-marquee effect
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
  return (
    <section id="sectors" className="bg-navy py-28 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-8 md:px-16 mb-14">
        <FadeIn>
          <h2 className="font-playfair text-white text-3xl md:text-5xl font-bold max-w-3xl leading-tight">
            Every sector of the business world —{' '}
            <em className="text-gold" style={{ fontStyle: 'italic' }}>
              one conversation at a time.
            </em>
          </h2>
        </FadeIn>
      </div>

      {/* Marquee rows */}
      <div className="space-y-4">
        {/* Row 1 — scrolls left */}
        <Marquee
          items={ROW_1.map((s) => <SectorPill key={s} label={s} />)}
          speed={28}
          reverse={false}
        />

        {/* Row 2 — scrolls right (opposite direction) */}
        <Marquee
          items={ROW_2.map((s) => <SectorPill key={s} label={s} />)}
          speed={22}
          reverse={true}
        />
      </div>

      {/* Fade edges — section is relative so these clip correctly */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-navy to-transparent hidden md:block" />
      <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-navy to-transparent hidden md:block" />
    </section>
  );
}
