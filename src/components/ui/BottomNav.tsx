'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, ShoppingBag, User } from 'lucide-react'

interface BottomNavProps {
  pendingInvites?: number
  activeSessions?: number
}

const tabs = [
  { href: '/', label: 'Liste', icon: ShoppingCart, match: (p: string) => p === '/' || p.startsWith('/lists') },
  { href: '/history', label: 'In spesa', icon: ShoppingBag, match: (p: string) => p.startsWith('/session') || p.startsWith('/history') },
  { href: '/profile', label: 'Profilo', icon: User, match: (p: string) => p.startsWith('/profile') || p.startsWith('/families') || p.startsWith('/invite') },
]

export default function BottomNav({ pendingInvites = 0, activeSessions = 0 }: BottomNavProps) {
  const pathname = usePathname()

  const badges: Record<string, number> = {
    '/history': activeSessions,
    '/profile': pendingInvites,
  }

  return (
    <nav
      className="h-16 bg-bg-surface sticky bottom-0 z-10 flex items-stretch"
      style={{ boxShadow: '0 -1px 4px rgba(0,0,0,0.1)' }}
    >
      {tabs.map((tab) => {
        const active = tab.match(pathname)
        const badge = badges[tab.href] ?? 0
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 min-w-[44px] relative"
            aria-current={active ? 'page' : undefined}
          >
            {badge > 0 && (
              <span className="absolute top-2 right-[calc(50%-20px)] min-w-5 h-5 rounded-full bg-error text-white text-[11px] font-medium flex items-center justify-center px-1">
                {badge}
              </span>
            )}
            <tab.icon size={24} className={active ? 'text-brand-mid' : 'text-text-disabled'} />
            {active && (
              <span className="text-[11px] font-medium text-brand-mid leading-none">{tab.label}</span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
