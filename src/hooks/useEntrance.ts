import { useEffect } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'

export function useEntrance(scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      // Content is visible in CSS. Animation is a progressive enhancement;
      // context cleanup restores all inline styles, including in StrictMode.
      gsap.from('[data-name]', { yPercent: 105, duration: 0.85, stagger: 0.1, ease: 'power3.out' })
      gsap.from('[data-entrance]', { opacity: 0, y: 12, duration: 0.65, stagger: 0.07, delay: 0.2, ease: 'power2.out', clearProps: 'all' })
    }, scope)
    return () => media.revert()
  }, [scope])
}
