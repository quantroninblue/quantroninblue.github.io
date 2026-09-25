import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { navigation } from '../data/navigation'

export function Header({ activePage }: { activePage: 'home' | 'github' | 'experience' | 'cv' }) {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    const onPointer = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false)
    }
    const desktop = window.matchMedia('(min-width: 900px)')
    const onResize = () => { if (desktop.matches) setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    desktop.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      desktop.removeEventListener('change', onResize)
    }
  }, [open])

  return (
    <header className="site-header shell" ref={header}>
      <a className="brand" href="#home" aria-label="Abhroneel Mukherjee — Home">
        <span className="brand-mark" aria-hidden="true">a<span>m</span><i>.</i></span>
        <span className="brand-caption">ABHRONEEL MUKHERJEE<span>APPLIED AI & ENGINEERING</span></span>
      </a>
      <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="primary-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>
        <span>{open ? 'Close' : 'Menu'}</span>
        {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>
      <nav id="primary-navigation" aria-label="Main navigation" className={`primary-nav ${open ? 'is-open' : ''}`} onBlur={(event) => {
        if (event.relatedTarget && !header.current?.contains(event.relatedTarget as Node)) setOpen(false)
      }}>
        {navigation.map((item) => (
          <a key={item.label} href={item.href} aria-current={item.href === `#${activePage}` ? 'page' : undefined} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} aria-label={item.accessibleLabel ?? (item.external ? `${item.label} (opens in a new tab)` : undefined)} onClick={() => setOpen(false)}>
            {item.label}<ArrowUpRight size={12} aria-hidden="true" />
          </a>
        ))}
      </nav>
    </header>
  )
}
