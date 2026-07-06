'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  action?: { label: string; onClick: () => void }
  onDismiss: () => void
  duration?: number
}

export default function Toast({ message, action, onDismiss, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 200)
    }, duration)
    return () => clearTimeout(t)
  }, [duration, onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-text-primary text-white text-sm rounded-lg px-4 py-3 transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)', maxWidth: 'calc(100vw - 32px)' }}
    >
      <span>{message}</span>
      {action && (
        <button onClick={action.onClick} className="text-brand-bright font-semibold shrink-0">
          {action.label}
        </button>
      )}
    </div>
  )
}
