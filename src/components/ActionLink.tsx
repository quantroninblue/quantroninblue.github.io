import type { ReactNode } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

type ActionLinkProps = {
  children: ReactNode
  href: string
  primary?: boolean
  external?: boolean
  label?: string
}

export function ActionLink({ children, href, primary, external, label }: ActionLinkProps) {
  const Icon = external ? ArrowUpRight : ArrowDown
  return (
    <a className={`action-link ${primary ? 'action-primary' : 'action-secondary'}`} href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} aria-label={label}>
      {children}<Icon size={18} strokeWidth={1.5} aria-hidden="true" />
    </a>
  )
}
