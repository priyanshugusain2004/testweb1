export const MOCK_PROFILE = {
  id: 'demo-participant-1',
  auth_user_id: 'demo-user-1',
  display_name: 'Alex Rivera',
  employee_id: 'EMP-0042',
  email: 'alex.rivera@bluepond.com',
  department: 'Engineering',
  team: 'Platform',
  height_cm: 172,
  weight_kg: 70,
  bmi: 23.7,
  blood_group: 'O+',
  shift_type: 'Day',
  role: 'Participant',
  status: 'Active',
  current_streak: 9,
  longest_streak: 21,
  consent_accepted: true,
  onboarding_complete: true,
}

export const MOCK_SESSION = {
  user: { id: 'demo-user-1', email: 'alex.rivera@bluepond.com' }
}

export const ACTIVE_CHALLENGE = {
  id: 'challenge-1',
  name: 'Summer Vitality Sprint',
  description: 'A 90-day company-wide challenge to build lasting healthy habits.',
  start_date: '2026-04-01',
  end_date: '2026-06-30',
  is_active: true,
  include_steps: true,
  include_water: true,
  include_yoga: true,
  include_workout: true,
  include_sugar_free: true,
}

export const TODAY_LOG = null

export const WEEKLY_LOGS = (() => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const pts =  [42,   38,   55,   61,   47,   70,   58]
  const today = new Date()
  return days.map((name, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    return {
      name,
      activity_date: d.toISOString().split('T')[0],
      points_earned: pts[i],
    }
  })
})()

export const SCORING_CONFIGS = [
  { id: 'sc-1', challenge_id: 'challenge-1', activity_type: 'steps',      points_per_unit: 1,  unit_threshold: 1000, daily_max_points: 10, bonus_threshold: 10000, bonus_points: 5,  is_active: true },
  { id: 'sc-2', challenge_id: 'challenge-1', activity_type: 'water',      points_per_unit: 5,  unit_threshold: 1,    daily_max_points: 20, bonus_threshold: 3,     bonus_points: 5,  is_active: true },
  { id: 'sc-3', challenge_id: 'challenge-1', activity_type: 'yoga',       points_per_unit: 2,  unit_threshold: 10,   daily_max_points: 20, bonus_threshold: 60,    bonus_points: 10, is_active: true },
  { id: 'sc-4', challenge_id: 'challenge-1', activity_type: 'workout',    points_per_unit: 2,  unit_threshold: 10,   daily_max_points: 20, bonus_threshold: 45,    bonus_points: 10, is_active: true },
  { id: 'sc-5', challenge_id: 'challenge-1', activity_type: 'sugar_free', points_per_unit: 15, unit_threshold: 1,    daily_max_points: 15, bonus_threshold: 0,     bonus_points: 0,  is_active: true },
]

export const LEADERBOARD = [
  { id: 'l-1',  participant_id: 'p-5',              display_name: 'Priya Nair',       department: 'HR',          team: 'People Ops',  total_points: 1840, rank: 1,  current_streak: 22, leaderboard_type: 'all_time' },
  { id: 'l-2',  participant_id: 'p-12',             display_name: 'James Okafor',     department: 'Sales',       team: 'Enterprise',  total_points: 1795, rank: 2,  current_streak: 15, leaderboard_type: 'all_time' },
  { id: 'l-3',  participant_id: 'p-8',              display_name: 'Chen Wei',         department: 'Finance',     team: 'FP&A',        total_points: 1730, rank: 3,  current_streak: 18, leaderboard_type: 'all_time' },
  { id: 'l-4',  participant_id: 'demo-participant-1', display_name: 'Alex Rivera',    department: 'Engineering', team: 'Platform',    total_points: 1612, rank: 4,  current_streak: 9,  leaderboard_type: 'all_time' },
  { id: 'l-5',  participant_id: 'p-3',              display_name: 'Fatima Al-Hassan', department: 'Design',      team: 'Product',     total_points: 1588, rank: 5,  current_streak: 12, leaderboard_type: 'all_time' },
  { id: 'l-6',  participant_id: 'p-19',             display_name: 'Marcus Reid',      department: 'Engineering', team: 'Platform',    total_points: 1540, rank: 6,  current_streak: 7,  leaderboard_type: 'all_time' },
  { id: 'l-7',  participant_id: 'p-7',              display_name: 'Soo-Jin Park',     department: 'Legal',       team: 'Compliance',  total_points: 1490, rank: 7,  current_streak: 3,  leaderboard_type: 'all_time' },
  { id: 'l-8',  participant_id: 'p-22',             display_name: 'Diego Morales',    department: 'Sales',       team: 'SMB',         total_points: 1410, rank: 8,  current_streak: 5,  leaderboard_type: 'all_time' },
  { id: 'l-9',  participant_id: 'p-14',             display_name: 'Aisha Osei',       department: 'HR',          team: 'Talent',      total_points: 1380, rank: 9,  current_streak: 0,  leaderboard_type: 'all_time' },
  { id: 'l-10', participant_id: 'p-31',             display_name: 'Tom Belanger',     department: 'Engineering', team: 'Backend',     total_points: 1340, rank: 10, current_streak: 6,  leaderboard_type: 'all_time' },
  { id: 'l-11', participant_id: 'p-25',             display_name: 'Nina Johansson',   department: 'Finance',     team: 'Accounting',  total_points: 1290, rank: 11, current_streak: 2,  leaderboard_type: 'all_time' },
  { id: 'l-12', participant_id: 'p-17',             display_name: 'Ravi Kumar',       department: 'Engineering', team: 'Platform',    total_points: 1245, rank: 12, current_streak: 4,  leaderboard_type: 'all_time' },
]

export const MY_SNAPSHOT = {
  total_points: 1612,
  rank: 4,
}

export const FAQS = [
  { id: 'faq-1', question: 'How are points calculated?', answer: 'Points are calculated based on your daily activity logs. Steps, water intake, yoga, workout minutes, and sugar-free days each have their own scoring rules configured per challenge. Hitting bonus thresholds earns you extra points.', sort_order: 1 },
  { id: 'faq-2', question: 'What is a streak?', answer: 'A streak counts how many consecutive days you have submitted an activity log. Streaks of 7+ days and 30+ days unlock bonus multipliers on your daily points.', sort_order: 2 },
  { id: 'faq-3', question: 'Can I edit a submitted log?', answer: 'Yes. Resubmitting your log for the same day will overwrite the previous entry. The updated points will be reflected on the leaderboard within a few minutes.', sort_order: 3 },
  { id: 'faq-4', question: 'How is the leaderboard updated?', answer: 'The leaderboard refreshes automatically after each submission. Weekly and monthly snapshots are captured at midnight UTC on Sunday and the last day of each month respectively.', sort_order: 4 },
  { id: 'faq-5', question: 'Is my health data shared with my manager?', answer: 'No. Individual health metrics such as weight and BMI are strictly private. Only your display name, department, team, and total points appear on the company leaderboard.', sort_order: 5 },
  { id: 'faq-6', question: 'What if I forget to log one day?', answer: 'You can log activities for the current day only. Missed days cannot be backdated. However, a single missed day will reset your streak, so try to log daily.', sort_order: 6 },
]
