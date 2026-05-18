import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { MOCK_SESSION, MOCK_PROFILE } from '../lib/mockData';
import { upsertParticipantFromAuthUser } from '../lib/db';

const AuthContext = createContext({});

function buildFallbackProfile(user) {
  const metadata = user?.user_metadata || {}
  const displayName = metadata.full_name || metadata.name || [metadata.first_name, metadata.last_name].filter(Boolean).join(' ') || user?.email?.split('@')[0] || 'Wellness Champion'

  return {
    id: user?.id,
    auth_user_id: user?.id,
    display_name: displayName,
    email: user?.email || metadata.email || '',
  }
}

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(isConfigured ? null : MOCK_SESSION);
  const [profile, setProfile] = useState(isConfigured ? null : MOCK_PROFILE);
  const [loading, setLoading] = useState(isConfigured);

  async function syncProfile(user) {
    try {
      const { data, error } = await upsertParticipantFromAuthUser(user);
      if (error) {
        console.error('Error in syncProfile:', error);
        if (user) setProfile(buildFallbackProfile(user));
        return;
      }
      if (data) {
        setProfile(data);
      } else if (user) {
        setProfile(buildFallbackProfile(user));
      }
    } catch (err) {
      console.error('Error in syncProfile:', err);
      if (user) setProfile(buildFallbackProfile(user));
    }
  }

  useEffect(() => {
    if (!isConfigured) return;

    let mounted = true;
    // Supabase JS v2 keeps OAuth session handling in the regular session APIs.
    async function initAuth() {
      try {
        const { data: { session } = {} } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          if (session?.user) {
            await syncProfile(session.user);
          } else {
            setProfile(null);
          }
        }
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
          await syncProfile(session.user);
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
