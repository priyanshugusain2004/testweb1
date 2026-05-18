import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getActiveChallenge, getScoringConfigs, getTodayLog, upsertActivityLog } from '../lib/db';
import { calculatePoints } from '../lib/scoring';
import { Check } from 'lucide-react';

export default function LogActivity() {
  const { profile, isConfigured } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [activeChallenge, setActiveChallenge] = useState(null);
  const [scoringConfigs, setScoringConfigs] = useState([]);

  const [formData, setFormData] = useState({
    steps_count: '',
    water_intake_liters: '',
    yoga_minutes: '',
    workout_minutes: '',
    no_added_sugar_day: false,
  });

  // Use useMemo to avoid triggering effect updates when calculated value changes
  const estimatedPoints = useMemo(() => {
    if (activeChallenge && scoringConfigs.length > 0) {
      const draft = {
        steps_count: Number(formData.steps_count) || 0,
        water_intake_liters: Number(formData.water_intake_liters) || 0,
        yoga_minutes: Number(formData.yoga_minutes) || 0,
        workout_minutes: Number(formData.workout_minutes) || 0,
        no_added_sugar_day: formData.no_added_sugar_day,
      };
      return calculatePoints(draft, scoringConfigs, activeChallenge);
    }
    return 0;
  }, [formData, activeChallenge, scoringConfigs]);

  useEffect(() => {
    async function fetchData() {
      try {
        const challenge = await getActiveChallenge();
        setActiveChallenge(challenge);

        if (challenge && profile?.id) {
          const configs = await getScoringConfigs(challenge.id);
          setScoringConfigs(configs);

          const log = await getTodayLog(profile?.id, challenge.id);
          if (log) {
            setFormData({
              steps_count: log.steps_count || '',
              water_intake_liters: log.water_intake_liters || '',
              yoga_minutes: log.yoga_minutes || '',
              workout_minutes: log.workout_minutes || '',
              no_added_sugar_day: log.no_added_sugar_day || false,
            });
          }
        }
      } catch (err) {
        console.error('Error fetching config:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      if (!profile?.id) {
        setMessage('Your profile is still loading. Please wait a moment and try again.');
        setSubmitting(false);
        return;
      }

      if (!isConfigured) {
        await new Promise(r => setTimeout(r, 600));
        setMessage('Log submitted! (Demo mode — no data was saved)');
        setSubmitting(false);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const payload = {
        participant_id: profile.id,
        challenge_id: activeChallenge.id,
        activity_date: today,
        steps_count: Number(formData.steps_count) || 0,
        water_intake_liters: Number(formData.water_intake_liters) || 0,
        yoga_minutes: Number(formData.yoga_minutes) || 0,
        workout_minutes: Number(formData.workout_minutes) || 0,
        no_added_sugar_day: formData.no_added_sugar_day,
        points_earned: estimatedPoints,
        status: 'Submitted',
        last_modified_at: new Date().toISOString(),
      };

      const { error } = await upsertActivityLog(payload);
      if (error) throw error;
      setMessage('Log successfully submitted! Points updated.');
    } catch (err) {
      console.error(err);
      setMessage('Failed to submit log: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  if (!activeChallenge) {
    return (
      <div className="card">
        <h2>No Active Challenge</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>There is currently no active challenge to log activities for.</p>
      </div>
    );
  }

  const isSuccess = message && !message.startsWith('Failed');

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', width: '100%' }}>
      <h1 className="page-title">Log Today's Activity</h1>

      {message && (
        <div style={{ padding: '14px 16px', background: isSuccess ? 'var(--success)' : 'var(--danger)', color: 'white', borderRadius: 10, marginBottom: 24, display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, fontWeight: 600 }}>
          {isSuccess && <Check size={18} />}
          {message}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          {activeChallenge.include_steps && (
            <div className="form-group">
              <label className="form-label">Steps Count</label>
              <input type="number" name="steps_count" className="form-input" value={formData.steps_count} onChange={handleChange} min="0" placeholder="e.g. 10000" />
            </div>
          )}
          {activeChallenge.include_water && (
            <div className="form-group">
              <label className="form-label">Water Intake (Liters)</label>
              <input type="number" step="0.1" name="water_intake_liters" className="form-input" value={formData.water_intake_liters} onChange={handleChange} min="0" placeholder="e.g. 2.5" />
            </div>
          )}
          {activeChallenge.include_yoga && (
            <div className="form-group">
              <label className="form-label">Yoga (Minutes)</label>
              <input type="number" name="yoga_minutes" className="form-input" value={formData.yoga_minutes} onChange={handleChange} min="0" placeholder="e.g. 30" />
            </div>
          )}
          {activeChallenge.include_workout && (
            <div className="form-group">
              <label className="form-label">Workout (Minutes)</label>
              <input type="number" name="workout_minutes" className="form-input" value={formData.workout_minutes} onChange={handleChange} min="0" placeholder="e.g. 45" />
            </div>
          )}
          {activeChallenge.include_sugar_free && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
              <input type="checkbox" name="no_added_sugar_day" id="sugar" checked={formData.no_added_sugar_day} onChange={handleChange} style={{ width: 22, height: 22, accentColor: 'var(--brand-600)', cursor: 'pointer' }} />
              <label htmlFor="sugar" className="form-label" style={{ margin: 0, cursor: 'pointer', fontSize: 15 }}>No Added Sugar Day</label>
            </div>
          )}

          <div style={{ marginTop: 32, padding: '20px 24px', background: 'var(--brand-50)', borderRadius: 12, border: '1px solid var(--brand-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--brand-800)', fontSize: 14 }}>Estimated Points</p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 12, marginTop: 2 }}>Based on current scoring rules</p>
            </div>
            <span style={{ fontSize: 40, fontWeight: 800, color: 'var(--brand-600)', lineHeight: 1 }}>{estimatedPoints}</span>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-8" disabled={submitting} style={{ marginTop: 24 }}>
            {submitting ? 'Submitting...' : 'Submit Log'}
          </button>
        </form>
      </div>
    </div>
  );
}
