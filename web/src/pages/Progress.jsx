import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMySnapshot, getWeeklyLogs } from '../lib/db';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, Flame, Star } from 'lucide-react';

export default function Progress() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ totalPoints: 0, currentRank: '-', currentStreak: 0, bestStreak: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      try {
        setLoading(true);
        const snap = await getMySnapshot(profile?.id);
        setStats({
          totalPoints: snap?.total_points || 0,
          currentRank: snap?.rank || '-',
          currentStreak: profile?.current_streak || 0,
          bestStreak: profile?.longest_streak || 0,
        });

        const logs = await getWeeklyLogs(profile?.id, null);
        setChartData(logs.map(l => ({
          name: new Date(l.activity_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
          points: l.points_earned || 0,
        })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, [profile]);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  const statCards = [
    { label: 'Total Points', value: stats.totalPoints.toLocaleString(), icon: <Star size={22} />, color: 'var(--brand-500)', bg: 'var(--brand-50)' },
    { label: 'Current Rank', value: `#${stats.currentRank}`, icon: <Award size={22} />, color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Current Streak', value: `${stats.currentStreak}d`, icon: <Flame size={22} />, color: '#d97706', bg: '#fffbeb' },
    { label: 'Best Streak', value: `${stats.bestStreak}d`, icon: <TrendingUp size={22} />, color: 'var(--accent-600)', bg: '#f0fdfa' },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
      <h1 className="page-title">My Progress</h1>

      <div className="stat-grid mb-8">
        {statCards.map(s => (
          <div key={s.label} className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12, padding: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {s.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{s.label}</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Points — Last 7 Days</h2>
        <div style={{ height: 320, width: '100%' }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={36}>
                <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} width={36} />
                <Tooltip
                  cursor={{ fill: 'var(--bg-base)' }}
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', fontSize: 13 }}
                />
                <Bar dataKey="points" fill="var(--accent-500)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full" style={{ color: 'var(--text-tertiary)' }}>
              No data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
