import { useEffect, useSyncExternalStore } from 'react'
import { profile } from '../../data/profile'
import { createGitHubService } from './service.ts'
import type { Resource } from './resource.ts'

function browserStorage() { try { return window.localStorage } catch { return undefined } }
export const github = createGitHubService(profile.githubUsername, { storage: browserStorage() })

export function useGitHubResource<T>(resource: Resource<T>) {
  const state = useSyncExternalStore(resource.subscribe, resource.getSnapshot)
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === 'visible') void resource.refresh() }
    refresh()
    // Refresh only on a visible dashboard; TTL and shared in-flight promises
    // prevent duplicate requests (including React StrictMode remounts).
    const timer = window.setInterval(refresh, 60_000)
    document.addEventListener('visibilitychange', refresh)
    window.addEventListener('online', refresh)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', refresh)
      window.removeEventListener('online', refresh)
    }
  }, [resource])
  return state
}
