import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Home from './pages/Home';
import LogActivity from './pages/LogActivity';

// Lazy load heavier components
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Progress = lazy(() => import('./pages/Progress'));
const Profile = lazy(() => import('./pages/Profile'));
const Info = lazy(() => import('./pages/Info'));

import './index.css';

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;
  return children;
};

const DemoBanner = () => (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: 'var(--brand-700)',
    color: 'white',
    textAlign: 'center',
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.01em',
  }}>
    Demo Mode — add <code style={{ background: 'rgba(255,255,255,0.15)', padding: '1px 6px', borderRadius: 4 }}>VITE_SUPABASE_URL</code> and <code style={{ background: 'rgba(255,255,255,0.15)', padding: '1px 6px', borderRadius: 4 }}>VITE_SUPABASE_ANON_KEY</code> as Secrets to connect your real data
  </div>
);

const AppRoutes = () => {
  const { isConfigured } = useAuth();

  return (
    <>
      {!isConfigured && <DemoBanner />}
      <div style={!isConfigured ? { paddingTop: 36 } : {}}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="log" element={<LogActivity />} />
            <Route
              path="leaderboard"
              element={
                <Suspense fallback={<div className="loading-screen"><div className="spinner"></div></div>}>
                  <Leaderboard />
                </Suspense>
              }
            />
            <Route
              path="progress"
              element={
                <Suspense fallback={<div className="loading-screen"><div className="spinner"></div></div>}>
                  <Progress />
                </Suspense>
              }
            />
            <Route
              path="profile"
              element={
                <Suspense fallback={<div className="loading-screen"><div className="spinner"></div></div>}>
                  <Profile />
                </Suspense>
              }
            />
            <Route
              path="info"
              element={
                <Suspense fallback={<div className="loading-screen"><div className="spinner"></div></div>}>
                  <Info />
                </Suspense>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
