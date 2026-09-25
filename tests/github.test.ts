import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createGitHubService } from '../src/features/github/service.ts'
import { createGitHubClient } from '../src/features/github/client.ts'
import { createResource } from '../src/features/github/resource.ts'
import { normalizeCommit, normalizeLanguages, normalizeRepository, safeUrl } from '../src/features/github/normalize.ts'
import { activitySummary, calendarDays, yearRange } from '../src/features/github/calendar.ts'
import { GitHubError } from '../src/features/github/types.ts'
import type { CommitActivity } from '../src/features/github/types.ts'

const NOW = Date.parse('2026-09-25T12:00:00Z')
function repository(id: number, name = `repo-${id}`) {
  return { id, name, full_name: `test-user/${name}`, private: false, visibility: 'public', html_url: `https://github.com/test-user/${name}`, description: null, language: null, stargazers_count: 0, forks_count: 0, open_issues_count: 0, updated_at: '2026-09-24T12:00:00Z', homepage: null, topics: [], archived: false, fork: false }
}
function commit(sha: string, date = '2026-09-24T12:00:00Z') {
  return { sha, html_url: `https://github.com/test-user/project/commit/${sha}`, repository: { private: false, full_name: 'test-user/project' }, commit: { message: 'A public commit\nExtra detail', author: { date, email: 'not-for-the-dashboard@example.com' } } }
}
function response(data: unknown, status = 200, headers: Record<string, string> = {}) { return new Response(JSON.stringify(data), { status, headers }) }
function memoryStorage() {
  const values = new Map<string, string>()
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) }, removeItem: (key: string) => { values.delete(key) }, values }
}

test('repository pagination replaces the entire snapshot, including rename/archive/delete/new changes', async () => {
  let time = NOW
  let refreshed = false
  let requests = 0
  const service = createGitHubService('test-user', { now: () => time, fetcher: async input => {
    requests++
    const page = new URL(String(input)).searchParams.get('page')
    return response(refreshed ? [{ ...repository(1, 'renamed'), archived: true }, repository(999, 'new')] : page === '1' ? Array.from({ length: 100 }, (_, i) => repository(i + 1)) : [repository(101)])
  } })
  await service.repositories.refresh()
  assert.equal(service.repositories.getSnapshot().data?.length, 101)
  assert.equal(requests, 2)
  await service.repositories.refresh()
  assert.equal(requests, 2, 'TTL should prevent a second fetch')
  time += 16 * 60_000
  refreshed = true
  await service.repositories.refresh()
  assert.deepEqual(service.repositories.getSnapshot().data?.map(r => [r.id, r.name, r.archived]), [[1, 'renamed', true], [999, 'new', false]])
})

test('failed pagination keeps the last successful complete snapshot, marked stale', async () => {
  let time = NOW
  let failed = false
  const service = createGitHubService('test-user', { now: () => time, fetcher: async input => {
    if (!failed) return response([repository(1)])
    return new URL(String(input)).searchParams.get('page') === '1' ? response(Array.from({ length: 100 }, (_, i) => repository(i + 2))) : response({}, 503)
  } })
  await service.repositories.refresh()
  failed = true; time += 16 * 60_000
  await service.repositories.refresh()
  assert.equal(service.repositories.getSnapshot().data?.[0].id, 1)
  assert.equal(service.repositories.getSnapshot().error?.kind, 'api')
})

test('public fields only; missing metadata is explicit; unsafe links and private repositories are excluded', () => {
  assert.equal(normalizeRepository({ ...repository(1), private: true }), null)
  assert.equal(normalizeCommit({ ...commit('abc'), repository: { private: true } }), null)
  const repo = normalizeRepository({ ...repository(1), homepage: 'javascript:alert(1)' })!
  assert.equal(repo.homepage, null)
  assert.equal(repo.description, null)
  assert.equal(repo.language, null)
  assert.equal(safeUrl('https://name:secret@example.com'), null)
  assert.equal(safeUrl('https://github.com.evil.test/repo', true), null)
  assert.equal(JSON.stringify(normalizeCommit(commit('abc'))).includes('email'), false)
})

test('language byte distribution, empty responses, and malformed values', () => {
  assert.deepEqual(normalizeLanguages({ Python: 300, TypeScript: 100 }), [{ name: 'Python', bytes: 300, percent: 75 }, { name: 'TypeScript', bytes: 100, percent: 25 }])
  assert.deepEqual(normalizeLanguages({}), [])
  assert.throws(() => normalizeLanguages({ Python: -1 }), GitHubError)
})

test('cache deduplicates in-flight work, survives remount/reload, and respects expiry', async () => {
  const storage = memoryStorage()
  let calls = 0
  let time = NOW
  const settings = { key: 'test', ttl: 1000, now: () => time, storage, load: async () => { calls++; return [calls] }, validate: (value: unknown): value is number[] => Array.isArray(value) && value.every(n => typeof n === 'number') }
  const resource = createResource(settings)
  const first = resource.refresh()
  assert.equal(resource.getSnapshot().loading, true)
  assert.equal(resource.refresh(), first)
  await first
  assert.equal(calls, 1)
  const restored = createResource(settings)
  assert.deepEqual(restored.getSnapshot().data, [1])
  await restored.refresh()
  assert.equal(calls, 1)
  time += 1001
  await restored.refresh()
  assert.equal(calls, 2)
})

test('corrupt/blocked storage and synchronous loader errors do not break retries', async () => {
  const storage = memoryStorage()
  storage.setItem('portfolio:github:v1:broken', '{')
  let calls = 0
  let time = NOW
  const resource = createResource({ key: 'broken', ttl: 1000, storage, now: () => time, validate: (v): v is number => typeof v === 'number', load: () => { if (++calls === 1) throw new Error('offline'); return Promise.resolve(7) } })
  await resource.refresh()
  assert.equal(resource.getSnapshot().error?.kind, 'api')
  time += 60_001
  await resource.refresh()
  assert.equal(resource.getSnapshot().data, 7)
  const blocked = createResource({ key: 'blocked', ttl: 1000, validate: (v): v is number => typeof v === 'number', storage: { getItem() { throw Error('blocked') }, setItem() { throw Error('blocked') }, removeItem() { throw Error('blocked') } }, load: async () => 1 })
  await blocked.refresh()
  assert.equal(blocked.getSnapshot().data, 1)
})

test('rate limits use Retry-After/reset, suppress repeated requests, and isolate search/core budgets', async () => {
  let time = NOW
  let calls = 0
  const client = createGitHubClient(async input => {
    calls++
    return String(input).includes('/search/') ? response({}, 429, { 'retry-after': '120', 'x-ratelimit-reset': String((NOW + 180_000) / 1000) }) : response([])
  }, () => time)
  await assert.rejects(client.get('/search/commits?q=test'), (e: unknown) => e instanceof GitHubError && e.kind === 'rate-limit' && e.retryAt === NOW + 180_000)
  await assert.rejects(client.get('/search/commits?q=test'), GitHubError)
  assert.equal(calls, 1)
  await client.get('/users/test-user/repos')
  assert.equal(calls, 2)
  time += 180_001
  await assert.rejects(client.get('/search/commits?q=test'), GitHubError)
  assert.equal(calls, 3)
})

test('404 removes old cached metadata; network failures and invalid JSON surface as typed errors', async () => {
  let time = NOW
  let missing = false
  const service = createGitHubService('test-user', { now: () => time, fetcher: async () => missing ? response({}, 404) : response([repository(1)]) })
  await service.repositories.refresh()
  missing = true; time += 16 * 60_000
  await service.repositories.refresh()
  assert.equal(service.repositories.getSnapshot().data, undefined)
  assert.equal(service.repositories.getSnapshot().error?.kind, 'not-found')
  await assert.rejects(createGitHubClient(async () => { throw Error('offline') }).get('/users/test-user'), (e: unknown) => e instanceof GitHubError && e.kind === 'network')
  await assert.rejects(createGitHubClient(async () => new Response('<html>')).get('/users/test-user'), (e: unknown) => e instanceof GitHubError && e.kind === 'invalid-data')
})

test('requests are anonymous, origin constrained, and activity is always queried as public', async () => {
  const service = createGitHubService('test-user', { now: () => NOW, fetcher: async (input, init) => {
    assert.equal(init?.credentials, 'omit')
    assert.equal(new Headers(init?.headers).has('authorization'), false)
    assert.equal(new URL(String(input)).origin, 'https://api.github.com')
    assert.match(new URL(String(input)).searchParams.get('q')!, /author:test-user is:public/)
    return response({ total_count: 0, incomplete_results: false, items: [] })
  } })
  await service.activity.refresh()
  assert.equal(service.activity.getSnapshot().data?.commits.length, 0)
  assert.equal(service.activity.getSnapshot().data?.complete, true)
  await assert.rejects(createGitHubClient().get('//evil.test/users/test'), GitHubError)
})

test('commit pagination deduplicates hashes and flags capped/incomplete search results', async () => {
  let requests = 0
  const service = createGitHubService('test-user', { now: () => NOW, fetcher: async () => {
    requests++
    return response({ total_count: 1001, incomplete_results: false, items: Array.from({ length: 100 }, (_, i) => commit(`${requests}-${i}`)) })
  } })
  await service.activity.refresh()
  assert.equal(requests, 10)
  assert.equal(service.activity.getSnapshot().data?.complete, false)
  assert.equal(service.activity.getSnapshot().data?.commits.length, 1000)
  const duplicates = createGitHubService('test-user', { now: () => NOW, fetcher: async () => response({ total_count: 2, incomplete_results: true, items: [commit('same'), commit('same')] }) })
  await duplicates.activity.refresh()
  assert.equal(duplicates.activity.getSnapshot().data?.commits.length, 1)
  assert.equal(duplicates.activity.getSnapshot().data?.complete, false)
})

test('calendar is chronological in UTC, handles leap years, and calculates frequency/trend', () => {
  assert.deepEqual(yearRange(new Date('2024-03-01T12:00:00Z')), { from: '2023-03-03', to: '2024-03-01' })
  const data: CommitActivity = { from: '2025-09-26', to: '2026-09-25', complete: true, reportedTotal: 3, commits: [normalizeCommit(commit('a', '2026-09-25T01:00:00+05:30'))!, normalizeCommit(commit('b', '2026-09-24T02:00:00Z'))!, normalizeCommit(commit('c', '2026-09-14T12:00:00Z'))!] }
  const days = calendarDays(data, 365)
  assert.equal(days.length, 365)
  assert.equal(days[0].date, data.from)
  assert.equal(days.at(-1)?.date, data.to)
  assert.equal(days.find(d => d.date === '2026-09-24')?.count, 2)
  assert.deepEqual(activitySummary(days), { total: 3, activeDays: 2, lastWeek: 2, difference: 1 })
})
