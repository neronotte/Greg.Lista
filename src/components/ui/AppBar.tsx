import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

interface AppBarProps {
  title: string
  subtitle?: string
  backHref?: string
  actions?: React.ReactNode
  variant?: 'default' | 'shopping'
}

export default function AppBar({
  title,
  subtitle,
  backHref,
  actions,
  variant = 'default',
}: AppBarProps) {
  const isDefault = variant === 'default'

  return (
    <header
      className={`shrink-0 px-5 pt-2 pb-4 ${
        isDefault ? 'bg-bg-app' : 'border-b border-border bg-bg-surface'
      }`}
    >
      <div className="flex items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            aria-label="Back"
            className="p-2 -ml-2 text-text-secondary rounded-xl active:bg-bg-header transition-colors"
          >
            <ChevronLeft size={22} />
          </Link>
        )}
        {!backHref && (
          <div className="flex-1 min-w-0">
            <h1 className="text-[26px] font-black text-text-primary leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm font-medium text-text-secondary">{subtitle}</p>
            )}
          </div>
        )}
        {backHref && (
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-text-primary text-lg leading-tight truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
            )}
          </div>
        )}
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    </header>
  )
}
