import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLeaderboard } from '../lib/db';
import { Trophy, Flame } from 'lucide-react';

const FILTERS = ['This Week', 'This Month', 'All-Time', 'My Team'];

const TYPE_MAP = {
  'This Week': 'weekly',
  'This Month': 'monthly',
  'All-Time': 'all_time',
  'My Team': 'all_time',
};

export default function Leaderboard() {
  const { profile } = useAuth();
  const [filter, setFilter] = useState('All-Time');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const type = TYPE_MAP[filter];
        const team = filter === 'My Team' ? profile?.team : null;
        const rows = await getLeaderboard(type, team);
        setData(rows);
      } catch (err) {
        console.error(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [filter, profile]);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
      <h1 className="page-title">Leaderboard</h1>

      <div className="flex gap-2 mb-8" style={{ overflowX: 'auto', paddingBottom: 4 }}>
        {FILTERS.map(f => (
          <button
            key={f}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 18px', borderRadius: 20, whiteSpace: 'nowrap', fontSize: 14 }}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading rankings...</div>
        ) : data.length > 0 ? (
          data.map((row) => {
            const isMe = row.participant_id === profile?.id;
            return (
              <div
                key={row.id}
                className="leaderboard-row"
                style={{
                  background: isMe ? 'var(--brand-50)' : 'transparent',
                  fontWeight: isMe ? 600 : 400,
                }}
              >
                <div className={`rank-badge ${row.rank <= 3 ? 'rank-' + row.rank : ''}`}>
                  {row.rank <= 3 ? <Trophy size={14} /> : row.rank}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, color: 'var(--text-primary)', fontWeight: isMe ? 700 : 500 }}>
                    {row.display_name}{isMe ? ' (You)' : ''}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    {row.department}{row.team ? ` · ${row.team}` : ''}
                  </div>
                </div>

                {row.current_streak > 2 && (
                  <div className="flex items-center gap-1" style={{ background: '#fef9c3', color: '#854d0e', padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    <Flame size={13} />
                    {row.current_streak}d
                  </div>
                )}

                <div style={{ textAlign: 'right', minWidth: 72 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--brand-600)' }}>
                    {row.total_points.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>pts</div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-tertiary)' }}>
            No ranking data available for this filter.
          </div>
        )}
      </div>
    </div>
  );
}
