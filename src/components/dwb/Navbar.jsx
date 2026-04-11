import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

function NavLink({ to, label, anchor, onClick }) {
  const location = useLocation();
  const navigate = useNavigate();

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

  const isActive = !anchor && location.pathname === to;

  return (
    <a
      href={to}
      onClick={handleClick}
      className={`font-sans text-[11px] font-semibold tracking-[0.12em] transition-colors cursor-pointer ${
        isActive ? 'text-black' : 'text-black/40 hover:text-black'
      }`}
    >
      {label}
    </a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 flex items-center h-14">
        {/* Logo */}
        <Link to="/" className="font-sans text-black text-base font-black tracking-[0.05em] uppercase mr-10">
          CAP-X
        </Link>

        {/* Left links */}
        <div className="hidden md:flex items-center gap-7">
          {LEFT_LINKS.map(link => (
            <NavLink key={link.label} {...link} />
          ))}
        </div>

        <div className="flex-1" />

        {/* Right links */}
        <div className="hidden md:flex items-center gap-7">
          {RIGHT_LINKS.map(link => (
            <NavLink key={link.label} {...link} />
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-black/60 hover:text-black ml-auto"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-black/10 px-6 py-5 flex flex-col gap-4">
          {[...LEFT_LINKS, ...RIGHT_LINKS].map(link => (
            <NavLink key={link.label} {...link} onClick={() => setOpen(false)} />
          ))}
        </div>
      )}
    </nav>
  );
}
