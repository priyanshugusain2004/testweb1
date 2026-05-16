import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getActiveChallenge, getTodayLog, getWeeklyLogs } from '../lib/db';
import { Activity, Droplet, Flame, Footprints } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
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
        <div className="stat-card">
          <div className="stat-icon"><Footprints size={22} /></div>
          <div className="stat-content">
            <h3>Steps</h3>
            <p>{(todayLog?.steps_count || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--accent-600)', background: 'var(--brand-50)' }}><Droplet size={22} /></div>
          <div className="stat-content">
            <h3>Water (L)</h3>
            <p>{todayLog?.water_intake_liters || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#7c3aed', background: '#f5f3ff' }}><Activity size={22} /></div>
          <div className="stat-content">
            <h3>Active Min</h3>
            <p>{(todayLog?.yoga_minutes || 0) + (todayLog?.workout_minutes || 0)}</p>
          </div>
        </div>
      </div>

      <div className="card mt-8">
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Weekly Points</h2>
        <div style={{ height: 280, width: '100%' }}>
          {weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barSize={32}>
                <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} width={36} />
                <Tooltip
                  cursor={{ fill: 'var(--bg-base)' }}
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', fontSize: 13 }}
                />
                <Bar dataKey="points" fill="var(--brand-500)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full" style={{ color: 'var(--text-tertiary)' }}>
              No activity logged in the past 7 days.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
