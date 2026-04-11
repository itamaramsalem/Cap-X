import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center text-center px-6">
      <div>
        <p className="font-playfair text-gold text-6xl font-bold mb-4">404</p>
        <p className="text-white/50 font-dm-sans mb-8">Page not found.</p>
        <Link to="/" className="text-xs uppercase tracking-widest font-dm-sans text-gold hover:text-gold-dark transition-colors">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
