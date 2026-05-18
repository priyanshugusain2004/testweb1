import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../lib/db';
import { LogOut, User } from 'lucide-react';

export default function Profile() {
  const { profile, signOut, isConfigured } = useAuth();
  const [formData, setFormData] = useState({
    display_name: '',
    department: '',
    team: '',
    height_cm: '',
    weight_kg: '',
    shift_type: 'Day',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || '',
        department: profile.department || '',
        team: profile.team || '',
        height_cm: profile.height_cm || '',
        weight_kg: profile.weight_kg || '',
        shift_type: profile.shift_type || 'Day',
      });
    }
  }, [profile]);

  const bmi = formData.height_cm && formData.weight_kg
    ? (Number(formData.weight_kg) / Math.pow(Number(formData.height_cm) / 100, 2)).toFixed(1)
    : null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      if (!isConfigured) {
        await new Promise(r => setTimeout(r, 500));
        setMessage('Profile saved. (Demo mode — no data was persisted)');
        setSaving(false);
        return;
      }
      const h = Number(formData.height_cm);
      const w = Number(formData.weight_kg);
      const { error } = await updateProfile(profile.id, {
        display_name: formData.display_name,
        department: formData.department,
        team: formData.team,
        height_cm: h || null,
        weight_kg: w || null,
        bmi: h > 0 && w > 0 ? w / Math.pow(h / 100, 2) : null,
        shift_type: formData.shift_type,
      });
      if (error) throw error;
      setMessage('Profile updated successfully.');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', width: '100%' }}>
      <h1 className="page-title">Profile</h1>

      <div className="card mb-6 profile-card">
        <div className="profile-header">
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--brand-100)', color: 'var(--brand-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={32} />
          </div>
          <div className="user-info">
            <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{profile?.display_name}</p>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 2 }}>{profile?.email}</p>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{profile?.department} · {profile?.team}</p>
          </div>
          {bmi && (
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--brand-600)', lineHeight: 1 }}>{bmi}</p>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>BMI</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSave}>
          {message && (
            <div style={{ padding: 12, background: message.includes('Failed') ? 'var(--danger)' : 'var(--success)', color: 'white', borderRadius: 8, marginBottom: 20, fontSize: 14, fontWeight: 600 }}>
              {message}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input type="text" name="display_name" className="form-input" value={formData.display_name} onChange={handleChange} required />
          </div>

          <div className="flex gap-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Department</label>
              <input type="text" name="department" className="form-input" value={formData.department} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Team</label>
              <input type="text" name="team" className="form-input" value={formData.team} onChange={handleChange} />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Height (cm)</label>
              <input type="number" name="height_cm" className="form-input" value={formData.height_cm} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Weight (kg)</label>
              <input type="number" name="weight_kg" className="form-input" value={formData.weight_kg} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Shift Type</label>
            <select name="shift_type" className="form-input" value={formData.shift_type} onChange={handleChange}>
              <option value="Day">Day Shift</option>
              <option value="Night">Night Shift</option>
              <option value="Rotating">Rotating</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={saving} style={{ marginTop: 8 }}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      <button
        onClick={signOut}
        className="btn btn-secondary w-full"
        style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' }}
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  );
}
