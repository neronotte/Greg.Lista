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
    <div className="px-4 pt-3">
      <div className="surface-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-extrabold text-text-primary">{supermarket || 'Spesa'}</span>
          <span className="text-sm text-text-secondary">· {date}</span>
          <span className="soft-badge ml-auto bg-brand-mid/10 text-brand-mid">
            {checked}/{total}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-bg-header">
            <div
              className="h-full rounded-full bg-brand-mid transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
