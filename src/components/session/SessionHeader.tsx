interface SessionHeaderProps {
  supermarket: string | null
  startedAt: string
  total: number
  checked: number
}

export default function SessionHeader({ supermarket, startedAt, total, checked }: SessionHeaderProps) {
  const progress = total > 0 ? (checked / total) * 100 : 0
  const date = new Date(startedAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="bg-brand-dark px-4 py-3" style={{ minHeight: 72 }}>
      <div className="flex items-center gap-2">
        <span className="text-white text-base font-semibold">{supermarket || 'Spesa'}</span>
        <span className="text-white/60 text-sm">· {date}</span>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <div className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-bright transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-white/80 text-sm shrink-0">{checked}/{total}</span>
      </div>
    </div>
  )
}
