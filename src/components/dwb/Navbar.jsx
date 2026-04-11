import { useState, useEffect, useRef } from 'react';
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
  {
    to: '/#attend', label: 'ATTEND', anchor: 'attend',
    submenu: [
      { label: 'Speaker Schedule', anchor: 'speakers' },
      { label: 'Upcoming Sessions', anchor: 'schedule' },
    ],
  },
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

function AttendDropdown({ link, activeSection }) {
  const [hovering, setHovering] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = (anchor) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isActive = activeSection === link.anchor;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <a
        href={link.to}
        onClick={(e) => { e.preventDefault(); scrollTo(link.anchor); }}
        className={`relative font-dm-sans text-xs tracking-[0.15em] transition-colors duration-200 cursor-pointer pb-0.5 ${
          isActive ? 'text-gold' : 'text-white/55 hover:text-white'
        }`}
      >
        {link.label}
        {isActive && (
          <motion.span
            layoutId="nav-underline"
            className="absolute bottom-0 left-0 right-0 h-px bg-gold"
            transition={{ type: 'spring', stiffness: 380, damping: 35 }}
          />
        )}
      </a>

      <AnimatePresence>
        {hovering && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-3 bg-navy border border-white/15 min-w-[180px] z-50"
          >
            {link.submenu.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.anchor)}
                className="w-full text-left px-4 py-3 font-dm-sans text-xs tracking-[0.1em] text-white/55 hover:text-white hover:bg-white/5 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
    <nav className="fixed left-0 right-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-white/10" style={{ top: 'var(--bar-h, 0px)' }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center h-14">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mr-8 shrink-0">
          <div className="h-7 w-7 rounded-full bg-white overflow-hidden flex items-center justify-center flex-shrink-0">
            <img
              src="/capx-bull.jpg"
              alt="Cap-X"
              className="h-8 w-8 object-cover object-center"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
          <span className="font-playfair text-gold text-xl font-bold tracking-wide">Cap-X</span>
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
          {RIGHT_LINKS.map((link) =>
            link.submenu ? (
              <AttendDropdown
                key={link.label}
                link={link}
                activeSection={activeSection}
              />
            ) : (
              <NavLink
                key={link.label}
                {...link}
                activeSection={activeSection}
                isPathActive={location.pathname === link.to}
              />
            )
          )}
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
              {[...LEFT_LINKS, ...RIGHT_LINKS].flatMap((link) =>
                link.submenu
                  ? link.submenu.map((item) => (
                      <NavLink
                        key={item.label}
                        to={`/#${item.anchor}`}
                        label={item.label}
                        anchor={item.anchor}
                        activeSection={activeSection}
                        isPathActive={false}
                        onClick={() => setOpen(false)}
                      />
                    ))
                  : [
                      <NavLink
                        key={link.label}
                        {...link}
                        activeSection={activeSection}
                        isPathActive={location.pathname === link.to}
                        onClick={() => setOpen(false)}
                      />,
                    ]
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
