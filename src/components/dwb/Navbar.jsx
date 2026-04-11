import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const LEFT_LINKS = [
  { to: '/#speakers', label: 'SPEAKERS', anchor: 'speakers' },
  { to: '/archive', label: 'ARCHIVE' },
];

const RIGHT_LINKS = [
  { to: '/contact', label: 'CONTACT' },
  { to: '/#format', label: 'FORMAT', anchor: 'format' },
  { to: '/#why-come', label: 'WHY COME', anchor: 'why-come' },
  { to: '/#sectors', label: 'SECTORS', anchor: 'sectors' },
  { to: '/#attend', label: 'ATTEND', anchor: 'attend' },
];

const ALL_ANCHORS = ['speakers', 'format', 'why-come', 'sectors', 'attend'];

function NavLink({ to, label, anchor, onClick, activeSection, isPathActive }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e) => {
    if (anchor) {
      e.preventDefault();
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    onClick?.();
  };

  const isActive = anchor ? activeSection === anchor : isPathActive;

  return (
    <a
      href={to}
      onClick={handleClick}
      className={`relative font-dm-sans text-xs tracking-[0.15em] transition-colors duration-200 cursor-pointer pb-0.5 ${
        isActive ? 'text-gold' : 'text-white/55 hover:text-white'
      }`}
    >
      {label}
      {/* Sliding underline for active state */}
      {isActive && (
        <motion.span
          layoutId="nav-underline"
          className="absolute bottom-0 left-0 right-0 h-px bg-gold"
          transition={{ type: 'spring', stiffness: 380, damping: 35 }}
        />
      )}
    </a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const location = useLocation();

  // Track active section via IntersectionObserver (home page only)
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection(null);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    ALL_ANCHORS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex items-center h-14">

        {/* Logo */}
        <Link to="/" className="font-playfair text-gold text-xl font-bold tracking-wide mr-8 shrink-0">
          Cap-X
        </Link>

        {/* Left links */}
        <div className="hidden md:flex items-center gap-6">
          {LEFT_LINKS.map((link) => (
            <NavLink
              key={link.label}
              {...link}
              activeSection={activeSection}
              isPathActive={location.pathname === link.to}
            />
          ))}
        </div>

        <div className="flex-1" />

        {/* Right links */}
        <div className="hidden md:flex items-center gap-6">
          {RIGHT_LINKS.map((link) => (
            <NavLink
              key={link.label}
              {...link}
              activeSection={activeSection}
              isPathActive={location.pathname === link.to}
            />
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white/70 hover:text-white ml-auto transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-navy border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {[...LEFT_LINKS, ...RIGHT_LINKS].map((link) => (
                <NavLink
                  key={link.label}
                  {...link}
                  activeSection={activeSection}
                  isPathActive={location.pathname === link.to}
                  onClick={() => setOpen(false)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
