'use client'

import { useEffect, useRef } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[rgba(17,27,33,0.5)]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full md:max-w-[480px] bg-bg-surface rounded-t-[18px] md:rounded-[12px] max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }}
      >
        {/* Drag handle (phone only) */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-8 h-1 rounded-full bg-border" />
        </div>

        {title && (
          <div className="px-4 pt-2 pb-4 border-b border-border">
            <h2 className="text-[17px] font-semibold text-text-primary">{title}</h2>
          </div>
        )}

        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
