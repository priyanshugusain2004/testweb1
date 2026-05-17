import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { MOCK_SESSION, MOCK_PROFILE } from '../lib/mockData';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(isConfigured ? null : MOCK_SESSION);
  const [profile, setProfile] = useState(isConfigured ? null : MOCK_PROFILE);
  const [loading, setLoading] = useState(isConfigured);

  useEffect(() => {
    if (!isConfigured) return;

    let mounted = true;
    // Handle OAuth redirect URL (parses tokens in URL hash) before regular session
    async function initAuth() {
      try {
        // If the user was redirected back from an OAuth provider, this
        // will parse the URL fragment and return a session.
        const { data: { session: redirectedSession } = {}, error: urlError } =
          await supabase.auth.getSessionFromUrl();

        if (redirectedSession && mounted) {
          setSession(redirectedSession);
          if (redirectedSession.user) await fetchProfile(redirectedSession.user.id);
          return;
        }

        // Fallback: check existing session normally
        const { data: { session } = {} } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          if (session?.user) await fetchProfile(session.user.id);
        }
        if (urlError) console.warn('getSessionFromUrl warning:', urlError.message || urlError);
      } catch (err) {
        console.error('Error getting session:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        setSession(session);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('auth_user_id', userId)
        .single();
      if (!error && data) setProfile(data);
    } catch (err) {
      console.error('Error in fetchProfile:', err);
    }
  }

  const value = {
    session,
    profile,
    loading,
    isConfigured,
    signOut: () => isConfigured ? supabase.auth.signOut() : Promise.resolve(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
