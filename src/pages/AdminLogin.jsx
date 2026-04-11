import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/apiClient';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (authError) {
      setError('Invalid email or password.');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Lock size={28} className="text-gold mx-auto mb-4" />
          <h1 className="font-playfair text-white text-3xl font-bold">Admin Access</h1>
          <p className="font-dm-sans text-white/40 text-sm mt-2">Cap-X internal dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-dm-sans text-white/60 text-xs uppercase tracking-[0.15em] block mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="your@scarletmail.rutgers.edu"
              className="w-full bg-navy-light border border-white/15 text-white placeholder-white/25 font-dm-sans text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="font-dm-sans text-white/60 text-xs uppercase tracking-[0.15em] block mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full bg-navy-light border border-white/15 text-white placeholder-white/25 font-dm-sans text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          {error && (
            <p className="font-dm-sans text-red-400 text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-navy font-dm-sans font-semibold text-xs uppercase tracking-[0.15em] py-4 hover:bg-gold-dark transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
