import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight, RefreshCw } from 'lucide-react'
import { githubUrl, profile } from '../../data/profile'
import { github, useGitHubResource } from './useGitHub'
import { CommitCalendar } from './components/CommitCalendar'
import { DataStatus } from './components/DataStatus'
import { RepositoryList } from './components/RepositoryList'
import './github.css'

export default function GitHubPage() {
  const [checkMessage, setCheckMessage] = useState('')
  const user = useGitHubResource(github.profile)
  const repositories = useGitHubResource(github.repositories)
  const activity = useGitHubResource(github.activity)
  const loading = user.loading || repositories.loading || activity.loading
  const timestamps = [user.updatedAt, repositories.updatedAt, activity.updatedAt].filter((value): value is number => value !== null)
  const oldest = timestamps.length ? Math.min(...timestamps) : null
  const hasError = !!(user.error || repositories.error || activity.error)
  async function checkForUpdates() {
    setCheckMessage('Checking public data…')
    await Promise.all([github.profile.refresh(), github.repositories.refresh(), github.activity.refresh()])
    const failed = [github.profile, github.repositories, github.activity].some(resource => resource.getSnapshot().error)
    setCheckMessage(failed ? 'Some data could not be refreshed. See the status messages below.' : 'Checked. Fresh data is available; cached results are reused until the next refresh window.')
  }
  useEffect(() => { document.title = 'GitHub activity — Abhroneel Mukherjee'; return () => { document.title = 'Abhroneel Mukherjee — AI / ML Engineer' } }, [])

  return <div className="github-page">
    <div className="github-breadcrumb mono"><a href="#home"><ArrowLeft size={14} aria-hidden="true" />BACK TO HOME</a><span>PUBLIC ENGINEERING / GITHUB</span></div>
    <header className="github-page-heading">
      <div><p className="mono github-eyebrow">@{profile.githubUsername}</p><h1>GITHUB<span className="accent"> / </span>ACTIVITY</h1><p className="github-intro">Public repositories. A year of commits.<br />An evolving record of the work.</p></div>
      <div className="github-account"><span className="mono">PUBLIC GITHUB PROFILE</span><a href={user.data?.url ?? githubUrl} target="_blank" rel="noopener noreferrer" aria-label="View GitHub profile (opens in a new tab)">Explore profile<ArrowUpRight size={18} aria-hidden="true" /></a>{user.data && <p>{repositories.data?.length ?? user.data.publicRepositories} public repositories<span> / </span>{user.data.followers} followers</p>}</div>
    </header>
    <DataStatus state={user} label="Profile" onRetry={() => void github.profile.refresh()} />
    <div className="github-sync"><p className="mono"><span className="status-dot" aria-hidden="true" />{loading ? 'SYNCING PUBLIC DATA' : hasError ? 'SYNC INTERRUPTED' : oldest ? `DATA SYNCED ${new Date(oldest).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}` : 'CONNECTING'}</p><button type="button" className="github-text-button" disabled={loading} onClick={() => void checkForUpdates()}><RefreshCw size={14} aria-hidden="true" />Check for updates</button></div>
    <p className="github-caption" role="status">{checkMessage}</p>
    <p className="github-caption sync-caption">Repositories refresh every 15 minutes; commit activity every 30 minutes while this page is open. GitHub indexing can delay new commits. Checking early reuses the cache.</p>

    <section className="github-section" aria-labelledby={activity.data ? 'activity-title' : 'activity-loading-title'}>
      {!activity.data && <h2 id="activity-loading-title">Public commit activity</h2>}
      <DataStatus state={activity} label="Commit activity" onRetry={() => void github.activity.refresh()} />
      {activity.data && <CommitCalendar activity={activity.data} />}
    </section>

    <section className="github-section" aria-labelledby="repositories-title">
      <div className="github-section-heading"><div><p className="mono github-eyebrow">02 / THE REPOSITORIES</p><h2 id="repositories-title">Work in the open<span className="accent">.</span></h2></div><span className="mono github-caption">AUTOMATICALLY DISCOVERED</span></div>
      <DataStatus state={repositories} label="Repositories" onRetry={() => void github.repositories.refresh()} />
      {repositories.data && <RepositoryList repositories={repositories.data} />}
    </section>

    {activity.data && <section className="github-section recent-commits" aria-labelledby="recent-title">
      <div className="github-section-heading"><div><p className="mono github-eyebrow">03 / LATEST CHANGES</p><h2 id="recent-title">Recent commits<span className="accent">.</span></h2></div><span className="mono github-caption">FROM THE SEARCH INDEX · UTC</span></div>
      {activity.data.commits.length ? <ol className="commit-list">{activity.data.commits.slice(0, 8).map(commit => <li key={commit.sha}><time dateTime={commit.date}>{new Date(commit.date).toLocaleDateString('en', { month: 'short', day: 'numeric', timeZone: 'UTC' })}</time><div><span className="mono">{commit.repository}</span><a href={commit.url} target="_blank" rel="noopener noreferrer" aria-label={`${commit.message} (opens in a new tab)`}>{commit.message || 'View commit'}<ArrowUpRight size={16} aria-hidden="true" /></a></div><code>{commit.sha.slice(0, 7)}</code></li>)}</ol> : <p className="github-empty">No public commits were returned for this period.</p>}
    </section>}
  </div>
}
