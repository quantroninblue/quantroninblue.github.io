import { AlertCircle, RefreshCw } from 'lucide-react'
import type { ResourceState } from '../resource.ts'

export function DataStatus<T>({ state, label, onRetry }: { state: ResourceState<T>; label: string; onRetry: () => void }) {
  if (state.error) return (
    <div className="github-status github-status-error" role="status">
      <AlertCircle size={17} aria-hidden="true" />
      <div><p>{state.error.message}</p>
        {state.data !== undefined && <p>Showing saved {label.toLowerCase()} from {new Date(state.updatedAt!).toLocaleString()}.</p>}
        {state.error.retryAt && <p>Next retry after {new Date(state.error.retryAt).toLocaleTimeString()}.</p>}
      </div>
      <button type="button" onClick={onRetry} className="github-text-button">Try again</button>
    </div>
  )
  if (state.data === undefined || state.loading) return <p className="github-status" role="status"><RefreshCw size={15} aria-hidden="true" />{state.data === undefined ? `Loading ${label.toLowerCase()}…` : `Updating ${label.toLowerCase()}…`}</p>
  return null
}
