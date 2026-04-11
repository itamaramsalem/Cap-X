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
    <section id="sectors" className="bg-navy py-28 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <h2 className="font-playfair text-white text-3xl md:text-5xl font-bold mb-14 max-w-3xl leading-tight">
            Every sector of the business world — one conversation at a time.
          </h2>
          <div className="flex flex-wrap gap-3">
            {SECTORS.map((sector) => (
              <span
                key={sector}
                className="font-dm-sans text-white text-sm border border-white/25 rounded-full px-5 py-2 hover:border-white/60 transition-colors"
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
