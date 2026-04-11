// ─────────────────────────────────────────────────────────────────
//  Self-hosted API client — replaces @base44/sdk
//  Uses Supabase for DB + auth, Resend for email.
//  Install: npm install @supabase/supabase-js
// ─────────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─────────────────────────────────────────────────────────────────
//  Generic entity helpers — mirrors base44.entities.X.method()
// ─────────────────────────────────────────────────────────────────
function entity(tableName) {
  return {
    async list(orderBy = 'created_at', limit = 50) {
      const col = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
      const asc = !orderBy.startsWith('-');
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order(col, { ascending: asc })
        .limit(limit);
      if (error) throw error;
      return data;
    },

    async filter(filters = {}, orderBy = 'created_at', limit = 50) {
      const col = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
      const asc = !orderBy.startsWith('-');
      let query = supabase.from(tableName).select('*');
      Object.entries(filters).forEach(([k, v]) => { query = query.eq(k, v); });
      const { data, error } = await query.order(col, { ascending: asc }).limit(limit);
      if (error) throw error;
      return data;
    },

    async create(payload) {
      const { data, error } = await supabase.from(tableName).insert(payload).select().single();
      if (error) throw error;
      return data;
    },

    async update(id, payload) {
      const { data, error } = await supabase.from(tableName).update(payload).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },

    async delete(id) {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
    },
  };
}

// ─────────────────────────────────────────────────────────────────
//  Auth helpers — mirrors base44.auth.*
// ─────────────────────────────────────────────────────────────────
export const auth = {
  async me() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw error || new Error('Not authenticated');
    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name ?? user.email,
      role: user.user_metadata?.role ?? 'user',
    };
  },

  async isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  async logout(redirectUrl) {
    await supabase.auth.signOut();
    window.location.href = redirectUrl ?? '/';
  },

  redirectToLogin(nextUrl) {
    window.location.href = `/login?next=${encodeURIComponent(nextUrl ?? window.location.href)}`;
  },

  async updateMe(data) {
    const { error } = await supabase.auth.updateUser({ data });
    if (error) throw error;
  },
};

// ─────────────────────────────────────────────────────────────────
//  Email — replaces base44.integrations.Core.SendEmail
//  Calls a Vercel/Netlify serverless function that uses Resend.
// ─────────────────────────────────────────────────────────────────
export const integrations = {
  Core: {
    async SendEmail({ to, subject, body, from_name }) {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, body, from_name }),
      });
      if (!res.ok) throw new Error('Failed to send email');
      return res.json();
    },
  },
};

// ─────────────────────────────────────────────────────────────────
//  Named exports matching the old import pattern:
//  import { base44 } from '@/api/base44Client'  →
//  import { base44 } from '@/api/apiClient'
// ─────────────────────────────────────────────────────────────────
export const base44 = {
  entities: {
    Member:     entity('members'),      // club pre-registration
    EventRSVP:  entity('event_rsvps'), // RSVP to a specific session
    ClubEvent:  entity('club_events'),
    Rsvp:       entity('rsvps'),
    User:       entity('users'),
  },
  auth,
  integrations,
};
