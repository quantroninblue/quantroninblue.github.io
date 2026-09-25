import { ArrowUpRight } from 'lucide-react'
import type { ExperienceEntry } from '../../data/resume'

export function ExperienceEntries({ entries }: { entries: ExperienceEntry[] }) {
  return <div className="experience-entries">{entries.map(entry => <article className="experience-entry" key={entry.id} aria-labelledby={`role-${entry.id}`}>
    <div className="experience-meta"><p className="mono experience-dates">{entry.dates}</p><p className="experience-organization">{entry.organization}</p><p className="experience-context">{entry.context}</p></div>
    <div className="experience-detail"><p className="mono experience-project">{entry.project}</p><h3 id={`role-${entry.id}`}>{entry.role}</h3>
      <ul>{entry.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
      {entry.links && <div className="experience-links">{entry.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} (opens in a new tab)`}>{link.label}<ArrowUpRight size={15} aria-hidden="true" /></a>)}</div>}
    </div>
  </article>)}</div>
}
