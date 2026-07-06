'use client'

import { Plus } from 'lucide-react'

interface FABProps {
  onClick: () => void
  label?: string
  ariaLabel?: string
  className?: string
}

export default function FAB({ onClick, label, ariaLabel = 'Aggiungi', className }: FABProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`fixed right-4 z-20 flex items-center justify-center gap-2 rounded-full bg-brand-bright text-white active:scale-95 transition-transform duration-[120ms] ${className ?? 'bottom-20'}`}
      style={{
        width: label ? 'auto' : '56px',
        height: '56px',
        padding: label ? '0 20px' : undefined,
        boxShadow: '0 4px 12px rgba(37,211,102,0.4)',
      }}
    >
      <Plus size={24} />
      {label && <span className="text-base font-semibold pr-1">{label}</span>}
    </button>
  )
}
