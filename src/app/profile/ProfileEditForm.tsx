'use client'

import { useState, useTransition } from 'react'
import { updateProfile } from '@/lib/actions/sessions'

export default function ProfileEditForm({ currentName }: { currentName: string }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(currentName)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-sm font-bold text-brand-mid flex items-center gap-1"
      >
        Edit name
      </button>
    )
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        setError(null)
        startTransition(async () => {
          try {
            await updateProfile(name)
            setEditing(false)
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Error')
          }
        })
      }}
      className="flex w-full gap-2"
    >
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        autoFocus
        className="flex-1 bg-bg-header rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-mid font-medium"
      />
      <button type="button" onClick={() => setEditing(false)}
              className="px-3 py-2 border border-border rounded-xl text-sm font-semibold text-text-secondary">
        Cancel
      </button>
      <button type="submit" disabled={pending}
              className="px-3 py-2 bg-brand-mid text-white rounded-xl text-sm font-bold">
        {pending ? '…' : 'Save'}
      </button>
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </form>
  )
}
