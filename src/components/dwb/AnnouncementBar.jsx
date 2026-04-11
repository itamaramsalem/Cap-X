import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const BAR_H = 40; // px — keep in sync with h-10 (Tailwind)

export default function AnnouncementBar() {
  useLayoutEffect(() => {
    document.documentElement.style.setProperty('--bar-h', `${BAR_H}px`);
  }, []);

  return (
    <div
      className="fixed left-0 right-0 z-[60] bg-gold flex items-center px-4 md:px-8"
      style={{ top: 0, height: BAR_H }}
    >
      <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
        <span className="font-dm-sans text-navy text-xs font-medium text-center leading-none">
          First session coming Fall 2026. Pre-registration is now open — seats are limited.
        </span>
        <Link
          to="/join"
          className="hidden sm:flex items-center gap-0.5 font-dm-sans text-navy text-xs font-bold hover:opacity-70 transition-opacity whitespace-nowrap shrink-0"
        >
          Pre-Register <ChevronRight size={12} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}
