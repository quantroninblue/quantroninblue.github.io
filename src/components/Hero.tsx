import { ArrowDownRight } from 'lucide-react'
import { profile } from '../data/profile'
import { ActionLink } from './ActionLink'
import { SystemsFigure } from './SystemsFigure'

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-topline mono" data-entrance>
        <span><span className="status-dot" aria-hidden="true" />PERSONAL PORTFOLIO</span>
        <span>{profile.location.toUpperCase()}</span>
      </div>
      <div className="hero-grid">
        <div className="hero-copy">
          <h1 id="hero-title" className="hero-name" aria-label={profile.name}>
            <span className="name-line"><span data-name>{profile.firstName}</span></span>
            <span className="name-line"><span data-name>{profile.lastName}<span className="name-period">.</span></span></span>
          </h1>
          <div className="role-row" data-entrance><span className="role-line" /><p>AI / ML ENGINEER</p></div>
        </div>
        <div className="hero-visual" data-entrance><SystemsFigure /></div>
      </div>
      <div className="hero-bottom" id="about">
        <div className="intro" data-entrance>
          <p className="disciplines mono">LLM SYSTEMS <span>·</span> ROBOTICS <span>·</span> MACHINE LEARNING</p>
          <p className="intro-statement">{profile.statement}</p>
          <div className="hero-actions">
            <ActionLink href="#projects" primary>View projects</ActionLink>
            <ActionLink href="#cv">View CV</ActionLink>
          </div>
        </div>
        <div className="hero-note" data-entrance>
          <span className="mono note-index">RESEARCH → SYSTEMS</span>
          <p>Quantitative intelligence.<br />Autonomous robotics.</p>
          <a className="scroll-link mono" href="#projects">EXPLORE SELECTED WORK<ArrowDownRight size={24} strokeWidth={1} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  )
}
