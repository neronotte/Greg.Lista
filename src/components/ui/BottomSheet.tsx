'use client'

import { useEffect } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="absolute inset-0 z-50 flex items-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full bg-bg-surface rounded-t-3xl shadow-2xl overflow-hidden"
        style={{ maxHeight: '88%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-border mx-auto mt-3 mb-1" />
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(88vh - 28px)' }}>
          <div className="p-6 pt-3">
            {title && (
              <h2 className="text-xl font-black text-text-primary mb-5">{title}</h2>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
