import { GitHubError } from './types.ts'

export type ResourceState<T> = {
  data: T | undefined
  updatedAt: number | null
  loading: boolean
  error: GitHubError | null
}
export type Resource<T> = {
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => ResourceState<T>
  refresh: () => Promise<void>
  ttl: number
}
type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem' | 'removeItem'>
type Options<T> = { key: string; ttl: number; load: () => Promise<T>; validate: (value: unknown) => value is T; storage?: Storage; now?: () => number }
const MAX_AGE = 24 * 60 * 60 * 1000

export function createResource<T>({ key, ttl, load, validate, storage, now = Date.now }: Options<T>): Resource<T> {
  const storageKey = `portfolio:github:v1:${key}`
  let state: ResourceState<T> = { data: undefined, updatedAt: null, loading: false, error: null }
  let flight: Promise<void> | undefined
  let retryAt = 0
  const listeners = new Set<() => void>()
  try {
    const value: unknown = JSON.parse(storage?.getItem(storageKey) ?? 'null')
    if (value && typeof value === 'object' && 'at' in value && 'data' in value && typeof value.at === 'number' &&
      value.at <= now() && now() - value.at < MAX_AGE && validate(value.data)) {
      state = { ...state, data: value.data, updatedAt: value.at }
    } else storage?.removeItem(storageKey)
  } catch { /* Blocked or corrupt storage must not prevent live API access. */ }

  function publish(next: ResourceState<T>) { state = next; listeners.forEach(listener => listener()) }
  function refresh(): Promise<void> {
    if (flight) return flight
    if (now() < retryAt || (state.updatedAt !== null && now() - state.updatedAt < ttl && !state.error)) return Promise.resolve()
    publish({ ...state, loading: true, error: null })
    flight = (async () => {
      try {
        const data = await Promise.resolve().then(load)
        const at = now()
        retryAt = 0
        try { storage?.setItem(storageKey, JSON.stringify({ at, data })) } catch { /* Quota/privacy mode: keep the memory cache. */ }
        publish({ data, updatedAt: at, loading: false, error: null })
      } catch (error) {
        const failure = error instanceof GitHubError ? error : new GitHubError('api', 'GitHub data is temporarily unavailable.')
        retryAt = Math.max(now() + 60_000, failure.retryAt ?? 0)
        // Stale public data remains explicitly marked. Never retain a deleted
        // resource on 404, or an arbitrarily old snapshot beyond one day.
        const discard = failure.kind === 'not-found' || (state.updatedAt !== null && now() - state.updatedAt >= MAX_AGE)
        if (discard) { try { storage?.removeItem(storageKey) } catch { /* Storage is optional. */ } }
        publish({ ...state, ...(discard ? { data: undefined, updatedAt: null } : {}), loading: false, error: new GitHubError(failure.kind, failure.message, retryAt) })
      } finally { flight = undefined }
    })()
    return flight
  }
  return { ttl, refresh, getSnapshot: () => state, subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener) } } }
}
