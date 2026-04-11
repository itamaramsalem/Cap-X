import FadeIn from './FadeIn';

const STATS = [
  { value: 'Bi-Weekly', label: 'Session Frequency' },
  { value: 'Open', label: 'No Application, Any Major' },
  { value: '7+', label: 'Business Sectors Covered' },
  { value: 'Workshops & Skill Sessions', label: 'Coming Soon' },
];

export default function StatsBar() {
  return (
    <section className="bg-gold py-5">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label} className="py-2">
                <p className="font-playfair text-navy text-lg md:text-xl font-bold leading-tight">{value}</p>
                <p className="font-dm-sans text-navy/60 text-xs mt-1 uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
