import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Pause, Play } from 'lucide-react'
import { createEnvironment } from './renderer'
import type { EnvironmentMode } from './renderer'
import './environment.css'

const media = '(prefers-reduced-motion: reduce)'
const subscribe = (listener: () => void) => {
  const query = matchMedia(media)
  query.addEventListener('change', listener)
  return () => query.removeEventListener('change', listener)
}

export function Environment({ mode }: { mode: EnvironmentMode }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const engine = useRef<ReturnType<typeof createEnvironment>>(null)
  const reduced = useSyncExternalStore(subscribe, () => matchMedia(media).matches, () => true)
  const [paused, setPaused] = useState(() => {
    try { return sessionStorage.getItem('portfolio:ambient-paused') === 'true' } catch { return false }
  })
  useEffect(() => {
    if (!canvas.current) return
    engine.current = createEnvironment(canvas.current)
    return () => { engine.current?.dispose(); engine.current = null }
  }, [])
  useEffect(() => { engine.current?.setMode(mode) }, [mode])
  useEffect(() => { engine.current?.setPaused(paused) }, [paused])

  return <>
    <div className="computational-environment" aria-hidden="true" data-mode={mode}>
      <canvas ref={canvas} />
    </div>
    <div className="environment-control mono">
      <span className="environment-label">FIELD / {mode.toUpperCase()}</span>
      {reduced ? <span className="environment-static">STATIC</span> : <button type="button" aria-label={paused ? 'Resume environment motion' : 'Pause environment motion'} onClick={() => {
        const next = !paused
        setPaused(next)
        try { sessionStorage.setItem('portfolio:ambient-paused', String(next)) } catch { /* Session-only preference. */ }
      }}>{paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}<span>{paused ? 'PAUSED' : 'RUNNING'}</span></button>}
    </div>
  </>
}
