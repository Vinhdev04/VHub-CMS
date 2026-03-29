import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, hasSupabase } from '../config/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Initialize: check for existing session ───────────────
  useEffect(() => {
    if (!hasSupabase) {
      // Fallback: use sessionStorage for demo mode
      try {
        const stored = sessionStorage.getItem('cms_user');
        if (stored) setUser(JSON.parse(stored));
      } catch { /* ignore */ }
      setLoading(false);
      return;
    }

    // Get current Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userData = mapSupabaseUser(session.user, session.access_token);
        setUser(userData);
      }
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const userData = mapSupabaseUser(session.user, session.access_token);
          setUser(userData);
        } else {
          setUser(null);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  // ─── Map Supabase user to app user shape ──────────────────
  function mapSupabaseUser(supaUser, accessToken) {
    return {
      id: supaUser.id,
      email: supaUser.email,
      name:
        supaUser.user_metadata?.full_name ||
        supaUser.user_metadata?.name ||
        supaUser.email?.split('@')[0] ||
        'User',
      avatar: supaUser.user_metadata?.avatar_url || null,
      provider: supaUser.app_metadata?.provider || 'email',
      role: 'Administrator',
      accessToken,
    };
  }

  // ─── OAuth Sign In ────────────────────────────────────────
  async function signInWithProvider(provider) {
    if (!hasSupabase) {
      // Demo mode fallback
      const demo = {
        email: 'demo@devcms.io',
        name: 'Demo User',
        role: 'Administrator',
        avatar: null,
        provider,
      };
      setUser(demo);
      sessionStorage.setItem('cms_user', JSON.stringify(demo));
      return { success: true };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  // ─── Email/Password Sign In (demo fallback) ───────────────
  async function loginWithEmail(email, password) {
    if (!hasSupabase) {
      const demo = {
        email,
        name: email.split('@')[0],
        role: 'Administrator',
        avatar: null,
        provider: 'email',
      };
      setUser(demo);
      sessionStorage.setItem('cms_user', JSON.stringify(demo));
      return { success: true };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { success: false, error: error.message };

    const userData = mapSupabaseUser(data.user, data.session.access_token);
    setUser(userData);
    return { success: true };
  }

  // ─── Logout ───────────────────────────────────────────────
  async function logout() {
    if (hasSupabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    sessionStorage.removeItem('cms_user');
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn: Boolean(user),
        loginWithEmail,
        signInWithProvider,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
