import { lazy, Suspense, useEffect, useRef, useSyncExternalStore } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { SelectedWork } from './components/SelectedWork'
import { Footer } from './components/Footer'
import { useEntrance } from './hooks/useEntrance'
import { PersonalLab } from './features/workbench/PersonalLab'
import { Environment } from './features/environment/Environment'
import { useEnvironmentMode } from './features/environment/useEnvironmentMode'

const GitHubPage = lazy(() => import('./features/github/GitHubPage'))
const ResumePage = lazy(() => import('./features/resume/ResumePage'))
const subscribeToHash = (listener: () => void) => {
  window.addEventListener('hashchange', listener)
  return () => window.removeEventListener('hashchange', listener)
}

function Home() {
  const scope = useRef<HTMLDivElement>(null)
  useEntrance(scope)
  return <div ref={scope}><Hero /><SelectedWork /><PersonalLab /></div>
}

export function App() {
  const hash = useSyncExternalStore(subscribeToHash, () => window.location.hash)
  const page = hash === '#github' ? 'github' : hash === '#experience' ? 'experience' : hash === '#cv' ? 'cv' : 'home'
  const environmentMode = useEnvironmentMode(hash)
  useEffect(() => {
    // Hash routing works on GitHub Pages without a server rewrite. Home's
    // existing section anchors keep working when returning from the dashboard.
    const frame = requestAnimationFrame(() => {
      if (page !== 'home' || hash === '#home') window.scrollTo({ top: 0, behavior: 'instant' })
      else if (['#about', '#projects', '#workbench', '#field-notes'].includes(hash)) document.getElementById(hash.slice(1))?.scrollIntoView()
    })
    return () => cancelAnimationFrame(frame)
  }, [hash, page])
  useEffect(() => {
    const label = page === 'home' ? 'AI / ML Engineer' : page === 'cv' ? 'CV' : page === 'experience' ? 'Experience' : 'GitHub'
    document.title = `Abhroneel Mukherjee — ${label}`
  }, [page])

  return (
    <div id="home">
      <a className="skip-link" href="#main-content" onClick={event => {
        event.preventDefault()
        const main = document.getElementById('main-content')
        main?.focus()
        main?.scrollIntoView({ behavior: 'instant' })
      }}>Skip to content</a>
      <Header activePage={page} />
      <main id="main-content" tabIndex={-1} className="shell">
        {page === 'home' ? <Home /> : <Suspense fallback={<p className="github-route-loading" role="status">Loading {page === 'github' ? 'GitHub dashboard' : page === 'cv' ? 'CV' : 'experience'}…</p>}>
          {page === 'github' ? <GitHubPage /> : <ResumePage kind={page} />}
        </Suspense>}
      </main>
      <div className="shell"><Footer /></div>
      <Environment mode={environmentMode} />
    </div>
  )
}
