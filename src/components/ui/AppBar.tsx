import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface AppBarProps {
  title: string
  backHref?: string
  actions?: React.ReactNode
  variant?: 'default' | 'shopping'
}

export default function AppBar({ title, backHref, actions, variant = 'default' }: AppBarProps) {
  const bg = variant === 'shopping' ? 'bg-brand-bright' : 'bg-brand-dark'

  return (
    <header
      className={`h-14 ${bg} sticky top-0 z-10 flex items-center px-2`}
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
    >
      {backHref && (
        <Link
          href={backHref}
          aria-label="Indietro"
          className="w-10 h-10 flex items-center justify-center text-white rounded-full active:bg-white/10 transition-colors shrink-0"
        >
          <ArrowLeft size={24} />
        </Link>
      )}
      <h1 className={`flex-1 text-[20px] font-semibold text-white leading-snug truncate ${backHref ? 'ml-1' : 'ml-2'}`}>
        {title}
      </h1>
      {actions && (
        <div className="flex items-center gap-1 shrink-0">
          {actions}
        </div>
      )}
    </header>
  )
}
