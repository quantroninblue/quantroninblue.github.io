import { ArrowUpRight } from 'lucide-react'
import { selectedWork } from '../data/profile'

export function SelectedWork() {
  return (
    <section className="selected-work" id="projects" aria-labelledby="work-title">
      <div className="section-heading">
        <div className="flex items-baseline gap-5"><span className="mono section-index">01 /</span><h2 id="work-title">Selected work</h2></div>
        <span className="mono section-caption">FOUR DOMAINS. END-TO-END SYSTEMS.</span>
      </div>
      <div className="work-grid">
        {selectedWork.map((work) => (
          <article className="work-item" key={work.name}>
            <div className="work-meta mono"><span>{work.number}</span><span>{work.field}</span></div>
            <h3>{work.name}</h3>
            <p className="work-description">{work.description}</p>
            <p className="work-tech mono">{work.technologies}</p>
            <a href={work.href} target={work.href.startsWith('#') ? undefined : '_blank'} rel={work.href.startsWith('#') ? undefined : 'noopener noreferrer'} className="work-link mono" aria-label={`${work.name} — ${work.action}${work.href.startsWith('#') ? '' : ' (opens in a new tab)'}`}>
              {work.action}<ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
