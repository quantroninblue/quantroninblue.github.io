import type { CalendarDay, CommitActivity } from './types.ts'

const DAY = 86_400_000
export function dateKey(date: Date) { return date.toISOString().slice(0, 10) }
export function yearRange(now = new Date()) {
  const to = new Date(`${dateKey(now)}T00:00:00Z`)
  return { from: dateKey(new Date(to.getTime() - 364 * DAY)), to: dateKey(to) }
}

export function calendarDays(activity: CommitActivity, period: 30 | 365): CalendarDay[] {
  const end = new Date(`${activity.to}T00:00:00Z`).getTime()
  const counts = new Map<string, number>()
  for (const commit of activity.commits) {
    const key = dateKey(new Date(commit.date))
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return Array.from({ length: period }, (_, index) => {
    const date = dateKey(new Date(end - (period - 1 - index) * DAY))
    const count = counts.get(date) ?? 0
    return { date, count, level: count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4 }
  })
}

export function activitySummary(days: CalendarDay[]) {
  const total = days.reduce((sum, day) => sum + day.count, 0)
  const activeDays = days.filter(day => day.count > 0).length
  const lastWeek = days.slice(-7).reduce((sum, day) => sum + day.count, 0)
  const previousWeek = days.slice(-14, -7).reduce((sum, day) => sum + day.count, 0)
  return { total, activeDays, lastWeek, difference: lastWeek - previousWeek }
}
