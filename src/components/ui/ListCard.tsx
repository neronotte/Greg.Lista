import Link from 'next/link'
import { Lock, Users, ChevronRight } from 'lucide-react'

interface ListCardProps {
  id: string
  name: string
  visibility: 'private' | 'family'
  itemCount: number
  updatedAt: string
  familyName?: string
}

export default function ListCard({ id, name, visibility, itemCount, updatedAt, familyName }: ListCardProps) {
  const ago = formatRelative(updatedAt)

  return (
    <Link
      href={`/lists/${id}`}
      className="flex items-center gap-3 bg-bg-surface px-4 py-3 border-b border-border active:bg-bg-header transition-colors"
    >
      <span className="text-text-secondary shrink-0">
        {visibility === 'private'
          ? <Lock size={20} aria-label="Lista privata" />
          : <Users size={20} aria-label={`Lista famiglia${familyName ? ` — ${familyName}` : ''}`} />
        }
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[17px] font-semibold text-text-primary truncate">{name}</p>
        <p className="text-sm text-text-secondary mt-0.5">{ago}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm text-text-secondary">{itemCount} {itemCount === 1 ? 'articolo' : 'articoli'}</span>
        <ChevronRight size={16} className="text-text-disabled" />
      </div>
    </Link>
  )
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ora'
  if (mins < 60) return `${mins} min fa`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} ore fa`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'ieri'
  if (days < 7) return `${days} giorni fa`
  return new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
}
