import { useState, useLayoutEffect } from 'react';
import { ChevronRight, X } from 'lucide-react';

const STORAGE_KEY = 'capx_ann_v1';
const BAR_H = 40; // px — keep in sync with h-10 (Tailwind)

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  // useLayoutEffect runs synchronously before paint → no layout flash
  useLayoutEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY) === '1';
    if (!dismissed) {
      setVisible(true);
      document.documentElement.style.setProperty('--bar-h', `${BAR_H}px`);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    document.documentElement.style.setProperty('--bar-h', '0px');
    setVisible(false);
  };

  const handleAttend = (e) => {
    e.preventDefault();
    document.getElementById('attend')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <div
      className="fixed left-0 right-0 z-[60] bg-gold flex items-center px-4 md:px-8"
      style={{ top: 0, height: BAR_H }}
    >
      {/* Centred text + CTA */}
      <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
        <span className="font-dm-sans text-navy text-xs font-medium text-center leading-none">
          First session coming Fall 2025. Pre-registration is now open — seats are limited.
        </span>
        <a
          href="/#attend"
          onClick={handleAttend}
          className="hidden sm:flex items-center gap-0.5 font-dm-sans text-navy text-xs font-bold hover:opacity-70 transition-opacity whitespace-nowrap shrink-0"
        >
          Sign up <ChevronRight size={12} strokeWidth={2.5} />
        </a>
      </div>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        className="shrink-0 ml-3 text-navy/50 hover:text-navy transition-colors"
        aria-label="Dismiss announcement"
      >
        <X size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}
