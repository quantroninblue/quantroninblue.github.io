import { createGitHubClient } from './client.ts'
import { yearRange } from './calendar.ts'
import { count, invalidData, normalizeCommit, normalizeLanguages, normalizeProfile, normalizeRepository, record, validActivity, validLanguages, validProfile, validRepositories } from './normalize.ts'
import { createResource } from './resource.ts'
import type { Resource } from './resource.ts'
import type { CommitActivity, Language, PublicCommit, Repository } from './types.ts'

const MINUTE = 60_000
type Options = { fetcher?: typeof fetch; now?: () => number; storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> }

export function createGitHubService(username: string, options: Options = {}) {
  if (!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username)) throw new Error('Invalid GitHub username')
  const now = options.now ?? Date.now
  const client = createGitHubClient(options.fetcher, now)
  const shared = { storage: options.storage, now }
  const userPath = `/users/${encodeURIComponent(username)}`

  const profile = createResource({ ...shared, key: `${username}:profile`, ttl: 60 * MINUTE, validate: validProfile, load: async () => normalizeProfile(await client.get(userPath)) })

  const repositories = createResource({ ...shared, key: `${username}:repositories`, ttl: 15 * MINUTE, validate: validRepositories, load: async () => {
    const repos = new Map<number, Repository>()
    // Replace the entire snapshot only after every page succeeds. Stable IDs
    // reconcile renames; absent/deleted/newly private repositories disappear.
    for (let page = 1; ; page++) {
      const raw = await client.get(`${userPath}/repos?type=owner&sort=full_name&direction=asc&per_page=100&page=${page}`)
      if (!Array.isArray(raw)) throw invalidData()
      for (const value of raw) { const repo = normalizeRepository(value); if (repo) repos.set(repo.id, repo) }
      if (raw.length < 100) break
    }
    return [...repos.values()].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
  } })

  const activity = createResource({ ...shared, key: `${username}:commits`, ttl: 30 * MINUTE, validate: validActivity, load: async (): Promise<CommitActivity> => {
    const range = yearRange(new Date(now()))
    const commits = new Map<string, PublicCommit>()
    let reportedTotal = 0
    let received = 0
    let complete = true
    for (let page = 1; page <= 10; page++) {
      const query = new URLSearchParams({ q: `author:${username} is:public author-date:${range.from}..${range.to}`, sort: 'author-date', order: 'desc', per_page: '100', page: String(page) })
      const raw = record(await client.get(`/search/commits?${query}`))
      const total = count(raw.total_count)
      if (!Array.isArray(raw.items) || typeof raw.incomplete_results !== 'boolean') throw invalidData()
      if (page > 1 && total !== reportedTotal) complete = false
      reportedTotal = total
      if (raw.incomplete_results || total > 1000) complete = false
      received += raw.items.length
      for (const item of raw.items) {
        const commit = normalizeCommit(item)
        if (commit && commit.date.slice(0, 10) >= range.from && commit.date.slice(0, 10) <= range.to) {
          // A commit shared with a fork is one logical commit.
          commits.set(commit.sha, commit)
        }
      }
      if (received >= total || raw.items.length < 100) break
    }
    if (received < reportedTotal) complete = false
    return { ...range, commits: [...commits.values()].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)), complete, reportedTotal }
  } })

  const languageResources = new Map<string, Resource<Language[]>>()
  function languages(repository: Repository) {
    // Key includes the name to discard a renamed repo's old endpoint.
    const key = `${repository.id}:${repository.fullName}`
    let resource = languageResources.get(key)
    if (!resource) {
      const path = repository.fullName.split('/').map(encodeURIComponent).join('/')
      resource = createResource({ ...shared, key: `${username}:languages:${key}`, ttl: 60 * MINUTE, validate: validLanguages, load: async () => normalizeLanguages(await client.get(`/repos/${path}/languages`)) })
      languageResources.set(key, resource)
    }
    return resource
  }
  return { profile, repositories, activity, languages }
}
