import { supabase } from '../api/apiClient';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  async function handleMagicLink(e) {
    e.preventDefault();
    const next = new URLSearchParams(window.location.search).get('next') ?? '/Home';
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}${next}` },
    });
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="font-playfair text-white text-4xl font-bold mb-8">Sign in to Cap-X</h1>
        {sent ? (
          <p className="text-white/50 font-dm-sans">Check your email for a magic link.</p>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded font-dm-sans text-sm focus:outline-none focus:border-gold/60"
            />
            <button
              type="submit"
              className="w-full bg-gold text-navy font-dm-sans font-semibold text-sm uppercase tracking-wider py-4"
            >
              Send Magic Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
