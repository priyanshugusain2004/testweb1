import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import LogActivity from './pages/LogActivity';
import Leaderboard from './pages/Leaderboard';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Info from './pages/Info';
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

function DemoBanner() {
  return (
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
}

function AppRoutes() {
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
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="progress" element={<Progress />} />
            <Route path="profile" element={<Profile />} />
            <Route path="info" element={<Info />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
