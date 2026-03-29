import { createContext, useContext, useEffect, useState } from 'react';
import { adminLogin } from '../../api/auth.api';
import { hasSupabase, supabase } from '../../config/supabase';

const AuthContext = createContext(null);

function persistUser(userData) {
  sessionStorage.setItem('cms_user', JSON.stringify(userData));
}

function clearUser() {
  sessionStorage.removeItem('cms_user');
}

function mapSupabaseUser(supabaseUser, accessToken) {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name:
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.user_metadata?.name ||
      supabaseUser.email?.split('@')[0] ||
      'User',
    avatar: supabaseUser.user_metadata?.avatar_url || '',
    provider: supabaseUser.app_metadata?.provider || 'email',
    role: 'Administrator',
    accessToken,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('cms_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrapAuth() {
      if (!hasSupabase || !supabase) {
        setLoading(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user) {
        const nextUser = mapSupabaseUser(session.user, session.access_token);
        setUser(nextUser);
        persistUser(nextUser);
      } else {
        setUser(null);
        clearUser();
      }
      setLoading(false);
    }

    bootstrapAuth();

    let subscription;
    if (hasSupabase && supabase) {
      const listener = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const nextUser = mapSupabaseUser(session.user, session.access_token);
          setUser(nextUser);
          persistUser(nextUser);
        } else {
          setUser(null);
          clearUser();
        }
      });
      subscription = listener.data.subscription;
    }

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  async function loginWithEmail(email, password) {
    const profile = await adminLogin({ email, password });
    const nextUser = {
      id: profile.id || `admin:${profile.email}`,
      email: profile.email,
      name: profile.name || 'Administrator',
      role: profile.role || 'Administrator',
      avatar: profile.avatar || '',
      provider: 'email',
    };

    setUser(nextUser);
    persistUser(nextUser);
    return { success: true, user: nextUser };
  }

  async function signInWithProvider(provider) {
    if (!['google', 'github'].includes(provider)) {
      return { success: false, error: 'Provider khong duoc ho tro.' };
    }

    if (!hasSupabase || !supabase) {
      const providerUser = {
        id: `demo:${provider}`,
        email: `demo-${provider}@devcms.io`,
        name: provider === 'github' ? 'GitHub Demo' : 'Google Demo',
        role: 'Administrator',
        avatar: null,
        provider,
      };

      setUser(providerUser);
      persistUser(providerUser);
      return { success: true, demo: true };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  async function logout() {
    if (hasSupabase && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    clearUser();
  }

  function updateUser(nextUser) {
    setUser(nextUser);
    persistUser(nextUser);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithEmail,
        signInWithProvider,
        logout,
        updateUser,
        isLoggedIn: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
