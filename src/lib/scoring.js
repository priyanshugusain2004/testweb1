export const ACTIVITY_TYPES = {
  STEPS: 'steps',
  WATER: 'water',
  YOGA: 'yoga',
  WORKOUT: 'workout',
  SUGAR_FREE: 'sugar_free',
}

export function calculatePoints(log, configs, challenge) {
  if (!log || !configs || configs.length === 0 || !challenge) return 0

  let total = 0

  for (const config of configs) {
    if (!config.is_active) continue

    const actType = config.activity_type
    let value = getActivityValue(log, actType, challenge)
    if (value < 0) continue

    const threshold = config.unit_threshold > 0 ? config.unit_threshold : 1
    const units = Math.floor(value / threshold)
    const basePoints = units * config.points_per_unit
    const dailyMax = config.daily_max_points

    const capped = dailyMax > 0 ? Math.min(basePoints, dailyMax) : basePoints
    const bonus =
      config.bonus_threshold > 0 && value >= config.bonus_threshold
        ? config.bonus_points
        : 0
    const contribution =
      dailyMax > 0 ? Math.min(capped + bonus, dailyMax) : capped + bonus

    total += contribution
  }

  return Math.round(total * 100) / 100
}

function getActivityValue(log, actType, challenge) {
  switch (actType?.toLowerCase()) {
    case ACTIVITY_TYPES.STEPS:
      return challenge.include_steps ? log.steps_count : -1
    case ACTIVITY_TYPES.WATER:
      return challenge.include_water ? log.water_intake_liters : -1
    case ACTIVITY_TYPES.YOGA:
      return challenge.include_yoga ? log.yoga_minutes : -1
    case ACTIVITY_TYPES.WORKOUT:
      return challenge.include_workout ? log.workout_minutes : -1
    case ACTIVITY_TYPES.SUGAR_FREE:
      return challenge.include_sugar_free
        ? log.no_added_sugar_day
          ? 1
          : 0
        : -1
    default:
      return -1
  }
}

export function getStreakBonus(streakDays, configMap) {
  if (!configMap || streakDays <= 0) return 0
  if (streakDays >= 30) {
    const cfg = configMap['streak_bonus_30_days']
    return cfg ? parseFloat(cfg.config_value) || 0 : 0
  } else if (streakDays >= 7) {
    const cfg = configMap['streak_bonus_7_days']
    return cfg ? parseFloat(cfg.config_value) || 0 : 0
  }
  return 0
}
