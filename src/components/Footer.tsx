import { ArrowUpRight, Download } from 'lucide-react'
import { githubUrl, profile } from '../data/profile'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-identity"><span className="footer-mark" aria-hidden="true">am.</span><p>Abhroneel Mukherjee<span>Applied AI & Machine Learning Engineer</span></p></div>
      <div className="footer-links mono">
        <a href={`mailto:${profile.email}`}>Get in touch<ArrowUpRight size={15} aria-hidden="true" /></a>
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)">GitHub<ArrowUpRight size={15} aria-hidden="true" /></a>
        <a href={profile.cvUrl} download="Abhroneel-Mukherjee-CV.pdf">Download CV<Download size={14} aria-hidden="true" /></a>
      </div>
    </footer>
  )
}
