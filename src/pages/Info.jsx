import { useState, useEffect } from 'react';
import { getFaqs } from '../lib/db';

const TABS = ['FAQs', 'Challenge Rules', 'Privacy Policy'];

export default function Info() {
  const [faqs, setFaqs] = useState([]);
  const [activeTab, setActiveTab] = useState('FAQs');
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    getFaqs().then(data => {
      setFaqs(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
      <h1 className="page-title">Information</h1>

      <div className="flex gap-0 mb-8" style={{ borderBottom: '2px solid var(--border-color)' }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: '12px 20px',
              fontWeight: 600,
              fontSize: 14,
              color: activeTab === t ? 'var(--brand-600)' : 'var(--text-tertiary)',
              borderBottom: activeTab === t ? '2px solid var(--brand-600)' : '2px solid transparent',
              marginBottom: -2,
              background: 'none',
              transition: 'color 0.15s',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="card">
        {activeTab === 'FAQs' && (
          loading ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading...</div>
          ) : faqs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {faqs.map((faq, i) => (
                <div
                  key={faq.id}
                  style={{ borderBottom: i < faqs.length - 1 ? '1px solid var(--border-color)' : 'none', padding: '20px 0' }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{faq.question}</span>
                    <span style={{ color: 'var(--brand-500)', fontSize: 20, flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === faq.id ? 'rotate(45deg)' : 'none' }}>+</span>
                  </button>
                  {openFaq === faq.id && (
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: 12, fontSize: 15 }}>{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-tertiary)' }}>No FAQs available.</p>
          )
        )}

        {activeTab === 'Challenge Rules' && (
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 15 }}>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: 20, fontSize: 20 }}>How Points are Earned</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                ['Steps', 'Hit your daily step goal. Points are earned per 1,000 steps, with a bonus for reaching 10,000.'],
                ['Water', 'Log your daily water intake in liters. Drinking 3+ liters earns a bonus.'],
                ['Yoga / Workout', 'Every 10 minutes of yoga or workout earns points, up to a daily cap. Exceeding 45 minutes earns a bonus.'],
                ['Sugar-Free Day', 'Check the box if you consumed zero added sugars today. This earns a flat points bonus.'],
              ].map(([title, desc]) => (
                <div key={title} style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 8, flexShrink: 0, marginTop: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-400)' }} />
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>{title}:</strong> {desc}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 28, padding: 20, background: 'var(--brand-50)', borderRadius: 12, border: '1px solid var(--brand-100)' }}>
              <p style={{ color: 'var(--brand-800)', fontWeight: 600, marginBottom: 6 }}>Streak Bonuses</p>
              <p>Maintain a 7-day streak for a 10% bonus multiplier. Hit 30 consecutive days for a 25% multiplier applied to all daily earnings.</p>
            </div>
          </div>
        )}

        {activeTab === 'Privacy Policy' && (
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 15, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p>Your health data is private and secure. BluePond Wellness complies with enterprise data protection regulations.</p>
            <p>The information you provide is used solely to calculate leaderboard points and measure organisational wellness engagement. Individual granular metrics — such as weight and BMI — are <strong style={{ color: 'var(--text-primary)' }}>never</strong> shared with your employer or colleagues without explicit consent.</p>
            <p>Only your display name, department, team, and total points appear on the company leaderboard. All other data is visible to you alone.</p>
            <p>You may request deletion of your personal data at any time by contacting your Wellness Coordinator.</p>
          </div>
        )}
      </div>
    </div>
  );
}
