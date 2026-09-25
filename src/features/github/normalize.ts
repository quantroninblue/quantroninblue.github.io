import { GitHubError } from './types.ts'
import type { CommitActivity, Language, PublicCommit, PublicProfile, Repository } from './types.ts'

export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw invalidData()
  return value as Record<string, unknown>
}
export function invalidData() { return new GitHubError('invalid-data', 'GitHub returned an unexpected response. Please try again later.') }
export function text(value: unknown): string {
  if (typeof value !== 'string') throw invalidData()
  return value
}
export function count(value: unknown): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) throw invalidData()
  return value
}
function optionalText(value: unknown) { return typeof value === 'string' && value.trim() ? value : null }
function date(value: unknown) {
  const result = text(value)
  if (!Number.isFinite(Date.parse(result))) throw invalidData()
  return new Date(result).toISOString()
}

export function safeUrl(value: unknown, githubOnly = false): string | null {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value)
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return null
    if (githubOnly && (url.hostname !== 'github.com' || url.protocol !== 'https:')) return null
    return url.href
  } catch { return null }
}
function githubUrl(value: unknown) {
  const url = safeUrl(value, true)
  if (!url) throw invalidData()
  return url
}

export function normalizeProfile(value: unknown): PublicProfile {
  const raw = record(value)
  return { login: text(raw.login), name: optionalText(raw.name), url: githubUrl(raw.html_url), publicRepositories: count(raw.public_repos), followers: count(raw.followers) }
}

export function normalizeRepository(value: unknown): Repository | null {
  const raw = record(value)
  // Explicit public-only filtering, even if the upstream response is unexpected.
  if (raw.private !== false || (raw.visibility !== undefined && raw.visibility !== 'public')) return null
  return {
    id: count(raw.id), name: text(raw.name), fullName: text(raw.full_name),
    description: optionalText(raw.description), language: optionalText(raw.language),
    stars: count(raw.stargazers_count), forks: count(raw.forks_count),
    openIssuesAndPullRequests: count(raw.open_issues_count), updatedAt: date(raw.updated_at),
    url: githubUrl(raw.html_url), homepage: safeUrl(raw.homepage),
    topics: Array.isArray(raw.topics) ? raw.topics.filter((topic): topic is string => typeof topic === 'string') : [],
    archived: raw.archived === true, fork: raw.fork === true,
  }
}

export function normalizeLanguages(value: unknown): Language[] {
  const pairs = Object.entries(record(value)).map(([name, bytes]) => ({ name, bytes: count(bytes) })).filter(item => item.bytes > 0)
  const total = pairs.reduce((sum, item) => sum + item.bytes, 0)
  return pairs.sort((a, b) => b.bytes - a.bytes).map(item => ({ ...item, percent: item.bytes / total * 100 }))
}

export function normalizeCommit(value: unknown): PublicCommit | null {
  const raw = record(value)
  const repo = record(raw.repository)
  if (repo.private !== false || (repo.visibility !== undefined && repo.visibility !== 'public')) return null
  const commit = record(raw.commit)
  return {
    sha: text(raw.sha), repository: text(repo.full_name), url: githubUrl(raw.html_url),
    message: text(commit.message).split('\n')[0], date: date(record(commit.author).date),
  }
}

// Cache payloads contain normalized public fields only, never raw author emails.
// Validate browser storage before allowing it into rendering or link attributes.
export function validProfile(value: unknown): value is PublicProfile {
  try { const p = record(value); return typeof p.login === 'string' && (p.name === null || typeof p.name === 'string') && !!safeUrl(p.url, true) && count(p.publicRepositories) >= 0 && count(p.followers) >= 0 } catch { return false }
}
export function validRepositories(value: unknown): value is Repository[] {
  try {
    return Array.isArray(value) && value.every(item => {
      const r = record(item)
      return count(r.id) >= 0 && typeof r.name === 'string' && typeof r.fullName === 'string' &&
        (r.description === null || typeof r.description === 'string') && (r.language === null || typeof r.language === 'string') &&
        count(r.stars) >= 0 && count(r.forks) >= 0 && count(r.openIssuesAndPullRequests) >= 0 && !!date(r.updatedAt) &&
        !!safeUrl(r.url, true) && (r.homepage === null || !!safeUrl(r.homepage)) && typeof r.archived === 'boolean' && typeof r.fork === 'boolean' &&
        Array.isArray(r.topics) && r.topics.every(t => typeof t === 'string')
    })
  } catch { return false }
}
export function validActivity(value: unknown): value is CommitActivity {
  try {
    const a = record(value)
    return typeof a.from === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(a.from) && typeof a.to === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(a.to) &&
      !!date(a.from) && !!date(a.to) && typeof a.complete === 'boolean' && count(a.reportedTotal) >= 0 &&
      Array.isArray(a.commits) && a.commits.every(item => {
        const c = record(item)
        return typeof c.sha === 'string' && typeof c.repository === 'string' && typeof c.message === 'string' && !!date(c.date) && !!safeUrl(c.url, true)
      })
  } catch { return false }
}
export function validLanguages(value: unknown): value is Language[] {
  try { return Array.isArray(value) && value.every(item => { const l = record(item); return typeof l.name === 'string' && count(l.bytes) > 0 && typeof l.percent === 'number' && l.percent > 0 && l.percent <= 100 }) } catch { return false }
}
