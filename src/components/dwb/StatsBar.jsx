import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

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
  { value: 'Bi-Weekly', label: 'Session Frequency', isNumber: false },
  { value: 'Open', label: 'No Application · Any Major', isNumber: false },
  { numericTarget: 7, suffix: '+', label: 'Business Sectors', isNumber: true },
  { value: 'Coming Soon', label: 'Workshops & Skill Sessions', isNumber: false },
];

export default function StatsBar() {
  return (
    <section className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {STATS.map(({ value, label, isNumber, numericTarget, suffix }) => (
            <div key={label} className="px-8 py-8">
              <p className="font-sans text-white font-black text-xl md:text-2xl uppercase tracking-tight leading-none mb-2">
                {isNumber ? <CountUp target={numericTarget} suffix={suffix} /> : value}
              </p>
              <p className="font-sans text-white/30 text-[10px] uppercase tracking-[0.15em]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
