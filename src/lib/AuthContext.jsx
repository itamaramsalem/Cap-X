// Replaces the Base44-specific AuthContext with a Supabase-backed one.
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]                           = useState(null);
  const [isAuthenticated, setIsAuthenticated]     = useState(false);
  const [isLoadingAuth, setIsLoadingAuth]         = useState(true);
  const [isLoadingPublicSettings]                 = useState(false); // no-op in self-hosted
  const [authError, setAuthError]                 = useState(null);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapUser(session.user));
        setIsAuthenticated(true);
      }
      setIsLoadingAuth(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapUser(session.user));
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  function mapUser(supabaseUser) {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      full_name: supabaseUser.user_metadata?.full_name ?? supabaseUser.email,
      role: supabaseUser.user_metadata?.role ?? 'user',
    };
  }

  const logout = async (redirectUrl) => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = redirectUrl ?? '/';
  };

  const navigateToLogin = () => {
    window.location.href = `/login?next=${encodeURIComponent(window.location.href)}`;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      logout,
      navigateToLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
