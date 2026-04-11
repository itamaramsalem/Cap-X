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
    <span className="font-sans text-black text-xs font-semibold uppercase tracking-[0.1em] border border-black/15 px-6 py-2.5 mx-2 whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-default">
      {label}
    </span>
  );
}

export default function Sectors() {
  return (
    <section id="sectors" className="bg-white border-t border-black/10 py-24 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-8 md:px-16 mb-14">
        <FadeIn>
          <p className="font-sans text-black/30 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">
            Sectors
          </p>
          <h2 className="font-sans font-black text-black text-3xl md:text-4xl uppercase tracking-tight leading-tight max-w-2xl">
            Every sector of the business world —{' '}
            <span className="text-black/25">one conversation at a time.</span>
          </h2>
        </FadeIn>
      </div>

      {/* Dual marquee */}
      <div className="space-y-3">
        <Marquee
          items={ROW_1.map((s) => <SectorPill key={s} label={s} />)}
          speed={30}
          reverse={false}
        />
        <Marquee
          items={ROW_2.map((s) => <SectorPill key={s} label={s} />)}
          speed={24}
          reverse={true}
        />
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white to-transparent hidden md:block" />
      <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white to-transparent hidden md:block" />
    </section>
  );
}
