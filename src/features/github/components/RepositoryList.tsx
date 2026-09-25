import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { Repository } from '../types.ts'
import { RepositoryCard } from './RepositoryCard'

export function RepositoryList({ repositories }: { repositories: Repository[] }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('updated')
  const [shown, setShown] = useState(12)
  const filtered = useMemo(() => repositories.filter(repo => {
    const matches = `${repo.name} ${repo.description ?? ''} ${repo.language ?? ''} ${repo.topics.join(' ')}`.toLowerCase().includes(query.toLowerCase())
    return matches && (filter === 'all' || (filter === 'archived' ? repo.archived : !repo.archived))
  }).sort((a, b) => sort === 'stars' ? b.stars - a.stars || a.name.localeCompare(b.name) : sort === 'name' ? a.name.localeCompare(b.name) : Date.parse(b.updatedAt) - Date.parse(a.updatedAt)), [repositories, query, filter, sort])
  return <>
    <div className="repository-controls">
      <label className="repository-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search repositories</span><input type="search" value={query} onChange={event => { setQuery(event.target.value); setShown(12) }} placeholder="Search repositories, languages, topics…" /></label>
      <label className="repository-select"><span className="sr-only">Repository status</span><select value={filter} onChange={event => { setFilter(event.target.value); setShown(12) }}><option value="all">All repositories</option><option value="active">Active</option><option value="archived">Archived</option></select></label>
      <label className="repository-select"><span className="sr-only">Sort repositories</span><select value={sort} onChange={event => { setSort(event.target.value); setShown(12) }}><option value="updated">Recently updated</option><option value="stars">Most starred</option><option value="name">Name A–Z</option></select></label>
    </div>
    <p className="github-caption repository-result-count" role="status">{filtered.length} of {repositories.length} public repositories</p>
    {filtered.length ? <div className="repository-grid">{filtered.slice(0, shown).map(repository => <RepositoryCard key={`${repository.id}:${repository.fullName}`} repository={repository} />)}</div> : <p className="github-empty">{repositories.length ? 'No repositories match these filters.' : 'No public repositories are currently available.'}</p>}
    {filtered.length > shown && <button type="button" className="github-text-button load-more" onClick={() => setShown(shown + 12)}>Show more repositories ({filtered.length - shown} remaining)</button>}
  </>
}
