import { profile } from './profile'

// Hash routes and Home section anchors work directly on GitHub Pages.
type NavigationItem = { label: string; href: string; external?: boolean; accessibleLabel?: string }
export const navigation: NavigationItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'GitHub', href: '#github' },
  { label: 'CV', href: '#cv' },
  { label: 'Contact', href: `mailto:${profile.email}` },
]
