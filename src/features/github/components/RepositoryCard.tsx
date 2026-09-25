import { useState } from 'react'
import { ArrowUpRight, Archive, GitFork, Star, CircleDot, ChevronDown } from 'lucide-react'
import { github, useGitHubResource } from '../useGitHub'
import type { Repository } from '../types.ts'
import { DataStatus } from './DataStatus'

function LanguageDistribution({ repository }: { repository: Repository }) {
  const resource = github.languages(repository)
  const state = useGitHubResource(resource)
  return <div className="language-distribution">
    <DataStatus state={state} label="Language data" onRetry={() => void resource.refresh()} />
    {state.data && (state.data.length === 0 ? <p className="github-caption">No language data reported by GitHub.</p> : <ul>{state.data.map(language => <li key={language.name}>
      <div><span>{language.name}</span><span className="mono">{language.percent < 0.1 ? '<0.1' : language.percent.toFixed(1)}%</span></div>
      <span className="language-track" aria-hidden="true"><span style={{ width: `${language.percent}%` }} /></span>
    </li>)}</ul>)}
    <p className="github-caption">Share of code bytes reported by GitHub.</p>
  </div>
}

export function RepositoryCard({ repository }: { repository: Repository }) {
  const [languagesOpen, setLanguagesOpen] = useState(false)
  return <article className="repository-card">
    <div className="repository-topline mono"><span>{repository.fork ? 'FORK' : 'PUBLIC REPOSITORY'}</span>{repository.archived && <span className="archive-badge"><Archive size={12} aria-hidden="true" />ARCHIVED</span>}</div>
    <h3><a href={repository.url} target="_blank" rel="noopener noreferrer" aria-label={`${repository.name} on GitHub (opens in a new tab)`}>{repository.name}<ArrowUpRight size={19} aria-hidden="true" /></a></h3>
    <p className={`repository-description ${repository.description ? '' : 'unavailable'}`}>{repository.description ?? 'No description provided on GitHub.'}</p>
    {repository.topics.length > 0 && <ul className="repository-topics" aria-label="Repository topics">{repository.topics.map(topic => <li key={topic}>{topic}</li>)}</ul>}
    <dl className="repository-stats">
      <div><dt><Star size={14} aria-hidden="true" /><span className="sr-only">Stars</span></dt><dd>{repository.stars}</dd></div>
      <div><dt><GitFork size={14} aria-hidden="true" /><span className="sr-only">Forks</span></dt><dd>{repository.forks}</dd></div>
      <div title="GitHub includes open pull requests in this count"><dt><CircleDot size={14} aria-hidden="true" /><span className="sr-only">Open issues and pull requests</span></dt><dd>{repository.openIssuesAndPullRequests}<span className="stat-explanation"> issues + PRs</span></dd></div>
    </dl>
    <div className="repository-footer"><span className="mono">{repository.language ?? 'Language not reported'}</span><time dateTime={repository.updatedAt} title={new Date(repository.updatedAt).toISOString()}>Updated {new Date(repository.updatedAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</time></div>
    <div className="repository-actions">
      <button type="button" aria-expanded={languagesOpen} aria-controls={`languages-${repository.id}`} onClick={() => setLanguagesOpen(!languagesOpen)}>Language distribution<ChevronDown size={14} aria-hidden="true" /></button>
      {repository.homepage && <a href={repository.homepage} target="_blank" rel="noopener noreferrer" aria-label={`${repository.name} homepage (opens in a new tab)`}>Homepage<ArrowUpRight size={14} aria-hidden="true" /></a>}
    </div>
    <div id={`languages-${repository.id}`}>{languagesOpen && <LanguageDistribution repository={repository} />}</div>
  </article>
}
