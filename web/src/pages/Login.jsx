import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isConfigured } from '../lib/supabase';
import { Activity } from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle OAuth redirect
    const handleAuthCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    if (!isConfigured) {
      setError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="flex items-center gap-4 mb-8" style={{ justifyContent: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Activity size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: 28, margin: 0, color: 'var(--brand-900)' }}>BluePond</h1>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>Wellness Platform</p>
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          {error && (
            <div style={{ padding: 12, background: 'var(--danger)', color: 'white', borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
              {error}
            </div>
          )}

          {!isConfigured ? (
            <div style={{ padding: 16, background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 8, marginBottom: 20, fontSize: 14, color: '#78350f' }}>
              <strong>Demo Mode:</strong> Supabase not configured. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to enable Google login.
            </div>
          ) : null}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 8,
              border: '1px solid #d1d5db',
              background: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <text x="0" y="0" fontSize="0">Google</text>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </svg>
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-tertiary)' }}>
            Sign in with your Google account to access the wellness platform
          </p>
        </div>
      </div>
    </div>
  );
}
