interface ItemRowProps {
  id: string
  name: string
  quantity?: string | null
  unit?: string | null
  categoryName?: string | null
  checked?: boolean
  onToggle?: (id: string, checked: boolean) => void
  showCategory?: boolean
}

export default function ItemRow({ id, name, quantity, unit, categoryName, checked = false, onToggle, showCategory = true }: ItemRowProps) {
  return (
    <div
      className={`flex items-center gap-3 px-4 min-h-[60px] border-b border-border transition-colors duration-200 ${checked ? 'bg-bg-checked' : 'bg-bg-surface'}`}
    >
      {onToggle && (
        <button
          aria-label={checked ? 'Segna come da prendere' : 'Segna come acquistato'}
          aria-checked={checked}
          role="checkbox"
          onClick={() => onToggle(id, !checked)}
          className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center border-2 transition-all duration-[120ms] ${
            checked
              ? 'bg-brand-mid border-brand-mid scale-100'
              : 'border-border-strong'
          }`}
        >
          {checked && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      )}

      <div className="flex-1 min-w-0">
        <p className={`text-base text-text-primary leading-snug ${checked ? 'line-through text-text-secondary' : ''}`}>
          {name}
          {(quantity || unit) && (
            <span className="text-sm text-text-secondary ml-2">
              {[quantity, unit].filter(Boolean).join(' ')}
            </span>
          )}
        </p>
        {showCategory && categoryName && !checked && (
          <p className="text-xs text-text-disabled mt-0.5">{categoryName}</p>
        )}
      </div>
    </div>
  )
}
