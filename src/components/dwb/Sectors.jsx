import FadeIn from './FadeIn';

const SECTORS = [
  'Finance & Trading',
  'Consulting',
  'Entrepreneurship',
  'Technology & AI',
  'Marketing & Brand',
  'Wealth Management',
  'Private Equity',
  'Real Estate',
  'Startups & Venture',
  'Operations & Supply Chain',
];

export default function Sectors() {
  return (
    <section id="sectors" className="bg-white border-t border-black/10 py-24 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <p className="font-sans text-black/35 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5">Sectors</p>
          <h2 className="font-sans font-black text-black text-3xl md:text-4xl uppercase tracking-tight leading-tight mb-14 max-w-2xl">
            Every sector of the business world — one conversation at a time.
          </h2>
          <div className="flex flex-wrap gap-2">
            {SECTORS.map((sector) => (
              <span
                key={sector}
                className="font-sans text-black text-xs font-semibold uppercase tracking-[0.1em] border border-black/20 px-5 py-2.5 hover:bg-black hover:text-white transition-colors cursor-default"
              >
                {sector}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
