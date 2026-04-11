import FadeIn from './FadeIn';

const STATS = [
  { value: 'Bi-Weekly', label: 'Session Frequency' },
  { value: 'Open', label: 'No Application, Any Major' },
  { value: '7+', label: 'Business Sectors Covered' },
  { value: 'Workshops', label: 'Coming Soon' },
];

export default function StatsBar() {
  return (
    <section className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map(({ value, label }, i) => (
              <div
                key={label}
                className={`px-8 py-8 ${i < STATS.length - 1 ? 'border-r border-white/10' : ''}`}
              >
                <p className="font-sans text-white font-black text-xl md:text-2xl uppercase tracking-tight leading-none mb-2">{value}</p>
                <p className="font-sans text-white/35 text-[10px] uppercase tracking-[0.15em]">{label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
