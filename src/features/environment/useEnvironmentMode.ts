import { useEffect, useState } from 'react'
import type { EnvironmentMode } from './renderer'

/** Existing anchors drive the field; future pages can reuse the same modes. */
export function useEnvironmentMode(hash: string): EnvironmentMode {
  const [section, setSection] = useState<EnvironmentMode>('home')
  useEffect(() => {
    if (['#github', '#experience', '#cv'].includes(hash)) return
    let frame = 0
    const measure = () => {
      frame = 0
      const line = innerHeight * .45
      let next: EnvironmentMode = 'home'
      for (const [selector, mode] of [
        ['#about', 'about'], ['#projects', 'projects'], ['#workbench', 'projects'],
        ['#field-notes', 'about'], ['.site-footer', 'contact'],
      ] as const) {
        const element = document.querySelector(selector)
        if (element && element.getBoundingClientRect().top <= line) next = mode
      }
      setSection(next)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure) }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [hash])
  return hash === '#github' ? 'github' : hash === '#cv' ? 'cv' : hash === '#experience' ? 'projects' : section
}
