import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/** Counts from 0 up to `target` over `duration` ms (ease-out cubic). */
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

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const STATS = [
  { numericTarget: 50, suffix: '', label: 'Seats Per Session', isNumber: true },
  { value: 'Free', label: 'Always · No Exceptions', isNumber: false },
  { value: 'Open', label: 'No Application · Any Major', isNumber: false },
  { value: 'Bi-Weekly', label: 'Sessions Per Semester', isNumber: false },
];

export default function StatsBar() {
  return (
    <section className="bg-gold border-y border-gold-dark/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-navy/15">
          {STATS.map(({ value, label, isNumber, numericTarget, suffix }) => (
            <div key={label} className="text-center px-4 py-6 md:py-7">
              <p className="font-playfair text-navy text-2xl md:text-3xl font-bold leading-none mb-1.5">
                {isNumber ? (
                  <CountUp target={numericTarget} suffix={suffix} />
                ) : (
                  value
                )}
              </p>
              <p className="font-dm-sans text-navy/55 text-[10px] uppercase tracking-widest leading-snug">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
