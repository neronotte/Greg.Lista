'use client'

import { useTransition, useOptimistic } from 'react'
import { toggleEntry } from '@/lib/actions/sessions'
import type { SessionEntry, ListItem } from '@/lib/types'
import { Check } from 'lucide-react'

interface CheckableItemProps {
  entry: SessionEntry & { list_item: ListItem & { category?: { name: string } | null } }
}

export default function CheckableItem({ entry }: CheckableItemProps) {
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(entry.checked)
  const [, startTransition] = useTransition()

  function handleToggle() {
    const newChecked = !optimisticChecked
    startTransition(async () => {
      setOptimisticChecked(newChecked)
      await toggleEntry(entry.id, newChecked)
    })
  }

  const item = entry.list_item

  return (
    <button
      onClick={handleToggle}
      className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 border transition-all text-left active:scale-[0.98] ${
        optimisticChecked
          ? 'bg-bg-header/50 border-border/40'
          : 'bg-bg-surface border-border'
      }`}
      aria-checked={optimisticChecked}
      role="checkbox"
    >
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          optimisticChecked ? 'bg-brand-mid border-brand-mid' : 'border-border-strong'
        }`}
      >
        {optimisticChecked && (
          <Check size={13} className="text-white" strokeWidth={3} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span
          className={`text-sm font-semibold transition-all ${
            optimisticChecked ? 'line-through text-text-secondary' : 'text-text-primary'
          }`}
        >
          {item.name}
        </span>
        {item.notes && (
          <p className="text-xs text-text-secondary mt-0.5">{item.notes}</p>
        )}
      </div>
      {(item.quantity || item.unit) && (
        <span className="text-xs font-bold text-text-secondary whitespace-nowrap shrink-0">
          {[item.quantity, item.unit].filter(Boolean).join(' ')}
        </span>
      )}
    </button>
  )
}
