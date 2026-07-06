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
        className="text-sm text-brand-mid"
      >
        Modifica nome
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
            setError(err instanceof Error ? err.message : 'Errore')
          }
        })
      }}
      className="flex gap-2 items-center"
    >
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        autoFocus
        className="border-b border-brand-mid outline-none py-1 text-base text-text-primary bg-transparent"
      />
      <button type="submit" disabled={pending} className="text-sm text-brand-bright font-semibold">
        {pending ? '…' : 'Salva'}
      </button>
      <button type="button" onClick={() => setEditing(false)} className="text-sm text-text-secondary">
        Annulla
      </button>
      {error && <p className="text-xs text-error">{error}</p>}
    </form>
  )
}
