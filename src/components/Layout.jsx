import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, PlusCircle, Trophy, BarChart3, User, Info } from 'lucide-react';

export default function Layout() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !session) {
      navigate('/login');
    }
  }, [session, loading, navigate]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Wellness Platform...</p>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Home' },
    { to: '/log', icon: PlusCircle, label: 'Log' },
    { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { to: '/progress', icon: BarChart3, label: 'Progress' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/info', icon: Info, label: 'Info' },
  ];

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="mb-8 flex items-center gap-2">
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand-600)' }} />
          <h2 style={{ margin: 0, fontSize: 20, color: 'var(--brand-800)' }}>BluePond</h2>
        </div>
        
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive && location.pathname === item.to ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav" style={{ display: 'none' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive && location.pathname === item.to ? 'active' : ''}`}
            title={item.label}
          >
            <item.icon size={24} aria-label={item.label} />
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .bottom-nav {
            display: flex !important;
          }
        }
        
        @media (max-width: 480px) {
          .bottom-nav {
            padding: 6px 8px;
          }
          .bottom-nav .nav-item {
            padding: 6px 4px;
            font-size: 9px;
            gap: 2px;
          }
          .bottom-nav .nav-item svg {
            width: 20px;
            height: 20px;
          }
        }
        
        @media (max-width: 375px) {
          .bottom-nav .nav-label {
            display: none;
          }
          .bottom-nav .nav-item {
            padding: 8px;
            font-size: 0;
          }
          .bottom-nav .nav-item svg {
            width: 24px;
            height: 24px;
          }
        }
      `}} />
    </div>
  );
}
