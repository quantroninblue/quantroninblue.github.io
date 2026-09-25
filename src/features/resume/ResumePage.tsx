import { useEffect, useRef } from 'react'
import { ArrowRight, Download } from 'lucide-react'
import { profile } from '../../data/profile'
import { employment, openSource, resume, resumeContacts } from '../../data/resume'
import { ExperienceEntries } from './ExperienceEntries'
import './resume.css'

type Props = { kind: 'experience' | 'cv' }
export default function ResumePage({ kind }: Props) {
  const isCV = kind === 'cv'
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    heading.current?.focus({ preventScroll: true })
  }, [kind])

  return <div className={`resume-page ${isCV ? 'cv-page' : 'experience-page'}`} id={kind}>
    <header className="resume-heading">
      <p className="mono resume-kicker">{isCV ? 'THE FULL PICTURE / CURRICULUM VITAE' : 'APPLIED RESEARCH / ENGINEERING PRACTICE'}</p>
      <h1 ref={heading} tabIndex={-1}>{isCV ? 'Curriculum vitae' : 'Experience'}<span>.</span></h1>
      <div className="resume-heading-bottom"><p>{isCV ? profile.name : resume.specialization}</p>
        {isCV ? <a className="resume-action mono" href={profile.cvUrl} download="Abhroneel-Mukherjee-CV.pdf">Download PDF<Download size={16} aria-hidden="true" /></a> : <a className="resume-action mono" href="#cv">Read the full CV<ArrowRight size={16} aria-hidden="true" /></a>}
      </div>
    </header>
    {isCV && <>
      <section className="cv-identity" aria-label="Professional identity and contact details">
        <div><p className="cv-role">{resume.identity}</p><p className="cv-specialization">{resume.specialization}</p><p className="cv-location mono">{resume.location}</p></div>
        <address>{resumeContacts.map(contact => <a key={contact.href} href={contact.href}>{contact.label}</a>)}<span>LinkedIn: {resume.linkedinName}</span></address>
      </section>
      <section className="resume-section" aria-labelledby="summary-title"><div className="resume-section-heading"><span className="mono">01 /</span><h2 id="summary-title">Professional summary</h2></div><p className="cv-summary">{resume.summary}</p></section>
      <section className="resume-section" aria-labelledby="skills-title"><div className="resume-section-heading"><span className="mono">02 /</span><h2 id="skills-title">Technical skills</h2></div><dl className="cv-skills">{resume.skills.map(skill => <div key={skill.label}><dt>{skill.label}</dt><dd>{skill.items}</dd></div>)}</dl></section>
    </>}
    <section className="resume-section" aria-labelledby="employment-title"><div className="resume-section-heading"><span className="mono">{isCV ? '03' : '01'} /</span><h2 id="employment-title">Professional experience</h2></div><ExperienceEntries entries={employment} /></section>
    <section className="resume-section" aria-labelledby="open-source-title"><div className="resume-section-heading"><span className="mono">{isCV ? '04' : '02'} /</span><h2 id="open-source-title">Open-source engineering</h2></div><ExperienceEntries entries={openSource} /></section>
    {isCV && <section className="resume-section" aria-labelledby="education-title"><div className="resume-section-heading"><span className="mono">05 /</span><h2 id="education-title">Education</h2></div><div className="cv-education">{resume.education.map(item => <article key={item.degree}><p className="mono experience-dates">{item.dates}</p><div><h3>{item.degree}</h3>{item.detail && <p>{item.detail}</p>}<p className="cv-school">{item.school}</p></div></article>)}</div></section>}
    <p className="resume-colophon mono">{isCV ? 'CV CONTENT / PRESENTED FOR THE WEB' : 'EXPERIENCE / FROM THE CV'}<span>ABHRONEEL MUKHERJEE</span></p>
  </div>
}
