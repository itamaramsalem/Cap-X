import { Link } from 'react-router-dom';

export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="font-playfair text-navy text-3xl font-bold mb-4">Not Registered</p>
        <p className="font-dm-sans text-muted-text mb-8 leading-relaxed">
          You haven't registered for Cap-X yet. Submit the registration form to gain access to
          events and member features.
        </p>
        <Link
          to="/register"
          className="inline-block bg-gold text-navy font-dm-sans font-semibold text-sm uppercase tracking-wider px-8 py-4 hover:bg-gold-dark transition-colors"
        >
          Register Now
        </Link>
      </div>
    </div>
  );
}
