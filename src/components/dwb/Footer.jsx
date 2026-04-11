import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-10 px-8 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/" className="font-sans text-white font-black text-base uppercase tracking-[0.08em]">
          CAP-X
        </Link>
        <div className="flex gap-8">
          <Link to="/contact" className="font-sans text-white/25 text-[10px] font-semibold uppercase tracking-[0.15em] hover:text-white transition-colors">
            Contact
          </Link>
          <Link to="/archive" className="font-sans text-white/25 text-[10px] font-semibold uppercase tracking-[0.15em] hover:text-white transition-colors">
            Archive
          </Link>
        </div>
        <p className="font-sans text-white/15 text-[10px] uppercase tracking-wider">
          © {new Date().getFullYear()} Cap-X Rutgers
        </p>
      </div>
    </footer>
  );
}
