'use client'

import { useTransition, useOptimistic } from 'react'
import { toggleEntry } from '@/lib/actions/sessions'
import type { SessionEntry, ListItem } from '@/lib/types'

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
      className={`w-full flex items-center gap-3 px-4 min-h-[60px] border-b border-border text-left transition-colors duration-200 ${
        optimisticChecked ? 'bg-bg-checked' : 'bg-bg-surface'
      }`}
      aria-checked={optimisticChecked}
      role="checkbox"
    >
      <span
        className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center border-2 transition-all duration-[120ms] ${
          optimisticChecked ? 'bg-brand-mid border-brand-mid' : 'border-border-strong'
        }`}
      >
        {optimisticChecked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-base text-text-primary ${optimisticChecked ? 'line-through text-text-secondary' : ''}`}>
          {item.name}
          {(item.quantity || item.unit) && (
            <span className="text-sm text-text-secondary ml-2">
              {[item.quantity, item.unit].filter(Boolean).join(' ')}
            </span>
          )}
        </p>
      </div>
    </button>
  )
}
