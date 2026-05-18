import { useEffect, useState, memo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getActiveChallenge, getTodayLog, getWeeklyLogs } from '../lib/db';
import { Activity, Droplet, Flame, Footprints } from 'lucide-react';
// Lightweight fallback: use simple HTML/CSS bars instead of recharts

const StatCard = memo(({ icon: Icon, color, bgColor, label, value }) => (
  <div className="stat-card">
    <div className="stat-icon" style={color ? { color, background: bgColor } : {}}>
      <Icon size={22} />
    </div>
    <div className="stat-content">
      <h3>{label}</h3>
      <p>{value}</p>
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

export default memo(function Home() {
  const { profile } = useAuth();
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [todayLog, setTodayLog] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    async function fetchDashboardData() {
      try {
        setLoading(true);
        const challenge = await getActiveChallenge();
        setActiveChallenge(challenge);

        if (challenge) {
          const log = await getTodayLog(profile.id, challenge.id);
          setTodayLog(log);

          const logs = await getWeeklyLogs(profile.id, challenge.id);
          setWeeklyData(logs.map(l => ({
            name: new Date(l.activity_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
            points: l.points_earned || 0,
          })));
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [profile]);

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  return (
    <div className="fade-in">
      <h1 className="page-title">Welcome back, {profile?.display_name || 'Wellness Champion'}</h1>

      {activeChallenge ? (
        <div className="card mb-8" style={{ background: 'linear-gradient(135deg, var(--brand-700), var(--brand-900))', color: 'white', border: 'none' }}>
          <div className="flex justify-between items-center">
            <div>
              <p style={{ color: 'var(--brand-200)', fontWeight: 600, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Active Challenge</p>
              <h2 style={{ color: 'white', margin: '0 0 6px', fontSize: 22 }}>{activeChallenge.name}</h2>
              <p style={{ color: 'var(--brand-200)', fontSize: 13 }}>
                Ends {new Date(activeChallenge.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'var(--brand-200)', fontSize: 13, marginBottom: 6 }}>Current Streak</p>
              <div className="flex items-center gap-2" style={{ justifyContent: 'flex-end', color: 'white' }}>
                <Flame size={24} color="#fbbf24" />
                <span style={{ fontSize: 36, fontWeight: 800, lineHeight: 1 }}>{profile?.current_streak || 0}</span>
                <span style={{ fontSize: 14, color: 'var(--brand-200)', alignSelf: 'flex-end', paddingBottom: 4 }}>days</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card mb-8">
          <p style={{ color: 'var(--text-secondary)' }}>No active challenges at the moment. Keep staying healthy!</p>
        </div>
      )}

      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)' }}>Today's Progress</h2>
      <div className="stat-grid">
        <StatCard
          icon={Footprints}
          label="Steps"
          value={(todayLog?.steps_count || 0).toLocaleString()}
        />
        <StatCard
          icon={Droplet}
          color="var(--accent-600)"
          bgColor="var(--brand-50)"
          label="Water (L)"
          value={todayLog?.water_intake_liters || 0}
        />
        <StatCard
          icon={Activity}
          color="#7c3aed"
          bgColor="#f5f3ff"
          label="Active Min"
          value={(todayLog?.yoga_minutes || 0) + (todayLog?.workout_minutes || 0)}
        />
      </div>

      <div className="card mt-8">
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Weekly Points</h2>
        <div style={{ height: 280, width: '100%', display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          {weeklyData.length > 0 ? (
            weeklyData.map((d, i) => {
              const max = Math.max(...weeklyData.map(x => x.points), 1);
              const height = Math.round((d.points / max) * 220);
              return (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ height: 220, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <div style={{ width: 32, height: height, background: 'var(--brand-500)', borderRadius: 6, margin: '0 auto' }} title={`${d.points} points`} />
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-tertiary)' }}>{d.name}</div>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full" style={{ color: 'var(--text-tertiary)' }}>
              No activity logged in the past 7 days.
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
