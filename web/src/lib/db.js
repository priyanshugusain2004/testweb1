import { supabase, isConfigured } from './supabase'
import * as mock from './mockData'

export async function getActiveChallenge() {
  if (!isConfigured) return mock.ACTIVE_CHALLENGE
  const { data } = await supabase
    .from('challenges').select('*').eq('is_active', true).single()
  return data
}

export async function getTodayLog(participantId, challengeId) {
  if (!isConfigured) return mock.TODAY_LOG
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('activity_logs').select('*')
    .eq('participant_id', participantId)
    .eq('challenge_id', challengeId)
    .eq('activity_date', today)
    .single()
  return data
}

export async function getWeeklyLogs(participantId, challengeId) {
  if (!isConfigured) return mock.WEEKLY_LOGS
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 7)
  const { data } = await supabase
    .from('activity_logs')
    .select('activity_date, points_earned')
    .eq('participant_id', participantId)
    .eq('challenge_id', challengeId)
    .gte('activity_date', cutoff.toISOString().split('T')[0])
    .order('activity_date', { ascending: true })
  return data || []
}

export async function getScoringConfigs(challengeId) {
  if (!isConfigured) return mock.SCORING_CONFIGS
  const { data } = await supabase
    .from('scoring_config').select('*')
    .eq('challenge_id', challengeId).eq('is_active', true)
  return data || []
}

export async function getLeaderboard(type, team) {
  if (!isConfigured) {
    if (team) return mock.LEADERBOARD.filter(r => r.team === team)
    return mock.LEADERBOARD
  }
  let query = supabase
    .from('leaderboard_snapshots').select('*')
    .eq('leaderboard_type', type)
    .order('rank', { ascending: true })
    .limit(50)
  if (team) query = query.eq('team', team)
  const { data } = await query
  return data || []
}

export async function getMySnapshot(participantId) {
  if (!isConfigured) return mock.MY_SNAPSHOT
  const { data } = await supabase
    .from('leaderboard_snapshots')
    .select('total_points, rank')
    .eq('participant_id', participantId)
    .eq('leaderboard_type', 'all_time')
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single()
  return data
}

export async function getFaqs() {
  if (!isConfigured) return mock.FAQS
  const { data } = await supabase
    .from('faqs').select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
  return data || []
}

export async function upsertActivityLog(payload) {
  if (!isConfigured) return { error: null }
  return supabase
    .from('activity_logs')
    .upsert(payload, { onConflict: 'participant_id, challenge_id, activity_date' })
}

export async function updateProfile(id, updates) {
  if (!isConfigured) return { error: null }
  return supabase.from('participants').update(updates).eq('id', id)
}
