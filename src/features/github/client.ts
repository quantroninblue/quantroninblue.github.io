import { GitHubError } from './types.ts'

const API_ORIGIN = 'https://api.github.com'
type Fetch = typeof globalThis.fetch

export function createGitHubClient(fetcher: Fetch = globalThis.fetch.bind(globalThis), now = Date.now) {
  // Separate search/core budgets; a depleted search quota should not hide repos.
  const cooldowns = new Map<string, number>()
  async function get(path: string): Promise<unknown> {
    const url = new URL(path, API_ORIGIN)
    if (url.origin !== API_ORIGIN || !path.startsWith('/')) throw new GitHubError('api', 'Invalid GitHub endpoint.')
    const bucket = url.pathname.startsWith('/search/') ? 'search' : 'core'
    const retryAt = cooldowns.get(bucket) ?? 0
    if (retryAt > now()) throw new GitHubError('rate-limit', 'GitHub’s public API limit has been reached.', retryAt)
    let response: Response
    try {
      response = await fetcher(url.href, {
        headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2026-03-10' },
        // This client has no authentication option, including browser cookies.
        credentials: 'omit', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(20_000),
      })
    } catch { throw new GitHubError('network', 'GitHub could not be reached. Check your connection and try again.') }

    if (!response.ok) {
      if (response.status === 429 || response.status === 403) {
        const retryHeader = response.headers.get('retry-after')
        const retrySeconds = retryHeader === null ? NaN : Number(retryHeader)
        const retryDate = retryHeader === null ? NaN : Date.parse(retryHeader)
        const reset = Number(response.headers.get('x-ratelimit-reset')) * 1000
        const until = Math.max(now() + 60_000, Number.isFinite(retrySeconds) ? now() + retrySeconds * 1000 : Number.isFinite(retryDate) ? retryDate : 0, Number.isFinite(reset) ? reset : 0)
        cooldowns.set(bucket, until)
        throw new GitHubError('rate-limit', 'GitHub is limiting public requests. Please wait before trying again.', until)
      }
      if (response.status === 404) throw new GitHubError('not-found', 'This GitHub resource is no longer public or could not be found.')
      throw new GitHubError('api', `GitHub is temporarily unavailable (HTTP ${response.status}).`)
    }
    if (response.headers.get('x-ratelimit-remaining') === '0') {
      cooldowns.set(bucket, Math.max(now() + 60_000, Number(response.headers.get('x-ratelimit-reset')) * 1000 || 0))
    }
    try { return await response.json() as unknown } catch { throw new GitHubError('invalid-data', 'GitHub returned an unreadable response.') }
  }
  return { get }
}
