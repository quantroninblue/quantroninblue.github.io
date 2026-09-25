import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { activitySummary, calendarDays } from '../calendar.ts'
import type { CommitActivity } from '../types.ts'

const fullDate = new Intl.DateTimeFormat('en', { dateStyle: 'full', timeZone: 'UTC' })
const shortDate = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', timeZone: 'UTC' })

export function CommitCalendar({ activity }: { activity: CommitActivity }) {
  const [period, setPeriod] = useState<30 | 365>(365)
  const [selected, setSelected] = useState<string | null>(null)
  const scroll = useRef<HTMLDivElement>(null)
  const days = useMemo(() => calendarDays(activity, period), [activity, period])
  const summary = activitySummary(days)
  const offset = new Date(`${days[0].date}T00:00:00Z`).getUTCDay()
  const columns = Math.ceil((days.length + offset) / 7)
  const selectedIndex = days.findIndex(day => day.date === selected)
  const focusedIndex = selectedIndex < 0 ? days.length - 1 : selectedIndex
  const current = days[focusedIndex]
  const prefix = activity.complete ? '' : 'At least '
  useEffect(() => {
    // Start at the most recent weeks on narrow screens.
    if (scroll.current) scroll.current.scrollLeft = scroll.current.scrollWidth
  }, [period, activity.to])

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const moves: Record<string, number> = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7, Home: -days.length, End: days.length }
    if (!(event.key in moves)) return
    event.preventDefault()
    const next = Math.max(0, Math.min(days.length - 1, index + moves[event.key]))
    setSelected(days[next].date)
    event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`[data-day="${days[next].date}"]`)?.focus()
  }

  function describe(index: number) {
    const day = days[index]
    const date = fullDate.format(new Date(`${day.date}T00:00:00Z`))
    if (!activity.complete && day.count === 0) return `${date}: activity unavailable in partial results`
    return `${date}: ${prefix}${day.count} public ${day.count === 1 ? 'commit' : 'commits'}`
  }

  return (
    <div className="commit-calendar">
      <div className="github-section-heading">
        <div><p className="mono github-eyebrow">01 / DEVELOPMENT RHYTHM</p><h2 id="activity-title">Public commit activity<span className="accent">.</span></h2></div>
        <div className="period-picker" role="group" aria-label="Activity period">
          <button type="button" aria-pressed={period === 30} onClick={() => setPeriod(30)}>30 days</button>
          <button type="button" aria-pressed={period === 365} onClick={() => setPeriod(365)}>365 days</button>
        </div>
      </div>
      <div className="activity-metrics">
        <div><strong>{!activity.complete && <span>≥ </span>}{summary.total.toLocaleString()}</strong><span>{activity.complete ? 'Indexed public commits' : 'Public commits found'}</span></div>
        <div><strong>{!activity.complete && <span>≥ </span>}{summary.activeDays}<small> / {period}</small></strong><span>Days with commits</span></div>
        <div><strong>{!activity.complete && <span>≥ </span>}{summary.lastWeek}<small> last 7 days</small></strong><span>{activity.complete ? `${summary.difference > 0 ? '+' : ''}${summary.difference} vs. previous 7 days` : 'Trend unavailable — partial results'}</span></div>
      </div>
      {!activity.complete && <p className="github-notice" role="status">Partial results. GitHub search can return at most 1,000 matches and may time out. Counts are lower bounds; unfilled days mean unavailable data, not zero activity.</p>}
      <div ref={scroll} className={`calendar-scroll ${period === 30 ? 'calendar-month' : ''}`} role="region" aria-label="Scrollable commit calendar" tabIndex={0}>
        <div className="calendar-grid" role="group" aria-label="Daily public commits" aria-describedby="calendar-instructions" style={{ gridTemplateColumns: `repeat(${columns}, 24px)` }}>
          {days.map((day, index) => (
            <button type="button" key={day.date} data-day={day.date} data-level={day.level} data-unknown={!activity.complete && day.count === 0 || undefined}
              style={{ gridColumn: Math.floor((index + offset) / 7) + 1, gridRow: ((index + offset) % 7) + 2 }}
              className="calendar-cell" tabIndex={index === focusedIndex ? 0 : -1} aria-label={describe(index)} title={describe(index)}
              onMouseEnter={() => setSelected(day.date)} onFocus={() => setSelected(day.date)} onClick={() => setSelected(day.date)} onKeyDown={event => navigate(event, index)}>
              <span aria-hidden="true" />
            </button>
          ))}
          {days.map((day, index) => (day.date.endsWith('-01') || (index === 0 && Number(day.date.slice(-2)) < 24)) && (
            <span key={`month-${day.date}`} className="calendar-month-label mono" aria-hidden="true" style={{ gridColumn: Math.floor((index + offset) / 7) + 1, gridRow: 1 }}>
              {new Date(`${day.date}T00:00:00Z`).toLocaleDateString('en', { month: 'short', timeZone: 'UTC' })}
            </span>
          ))}
        </div>
      </div>
      <div className="calendar-meta">
        <p className="calendar-readout" aria-live="polite" aria-atomic="true"><span className="mono">{shortDate.format(new Date(`${current.date}T00:00:00Z`))}</span>{!activity.complete && current.count === 0 ? 'Activity unavailable' : `${prefix}${current.count} public ${current.count === 1 ? 'commit' : 'commits'}`}</p>
        <div className="calendar-legend" aria-label="Commit intensity: 0, 1 to 2, 3 to 5, 6 to 9, 10 or more commits"><span className="mono">{activity.complete ? '0' : '?'}</span>{[0, 1, 2, 3, 4].map(level => <span className="legend-cell" data-level={level} key={level} title={['0', '1–2', '3–5', '6–9', '10+'][level]} aria-hidden="true" />)}<span className="mono">10+</span></div>
      </div>
      <p className="github-caption" id="calendar-instructions">{days[0].date} — {days.at(-1)!.date} · UTC · Sunday–Saturday, top to bottom. Hover, tap, or use arrow keys to explore; scroll to see earlier weeks.</p>
      <p className="github-caption calendar-scope">Commits indexed by GitHub search, attributed to this account. Shared commit hashes count once. This calendar excludes issues and reviews and is not GitHub’s full contribution total.</p>
      {summary.total === 0 && activity.complete && <p className="github-empty">No indexed public commits found in this period.</p>}
    </div>
  )
}
