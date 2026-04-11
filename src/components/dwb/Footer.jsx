import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-white/8 py-10 px-8 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/" className="font-playfair text-gold text-xl font-bold tracking-wide">
          Cap-X
        </Link>
        <div className="flex gap-8 flex-wrap justify-center">
          <Link to="/contact" className="font-dm-sans text-white/35 text-xs uppercase tracking-wider hover:text-white/60 transition-colors">
            Contact
          </Link>
          <Link to="/archive" className="font-dm-sans text-white/35 text-xs uppercase tracking-wider hover:text-white/60 transition-colors">
            Archive
          </Link>
        </div>
        <p className="font-dm-sans text-white/20 text-xs">
          © {new Date().getFullYear()} Cap-X Rutgers
        </p>
      </div>
    </footer>
  );
}
