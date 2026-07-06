'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createList, updateList } from '@/lib/actions/lists'
import type { Visibility } from '@/lib/types'

interface ListFormProps {
  families?: { id: string; name: string }[]
  initial?: { id: string; name: string; visibility: Visibility; familyId?: string | null }
  onDone: () => void
}

export default function ListForm({ families = [], initial, onDone }: ListFormProps) {
  const router = useRouter()
  const [name, setName] = useState(initial?.name ?? '')
  const [visibility, setVisibility] = useState<Visibility>(initial?.visibility ?? 'private')
  const [familyId, setFamilyId] = useState(initial?.familyId ?? '')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Il nome è obbligatorio'); return }
    setError(null)
    startTransition(async () => {
      try {
        if (initial) {
          await updateList(initial.id, name.trim(), visibility, visibility === 'family' ? familyId || undefined : null)
        } else {
          await createList(name.trim(), visibility, visibility === 'family' ? familyId || undefined : undefined)
        }
        router.refresh()
        onDone()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs text-text-secondary mb-1">Nome lista</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="es. Spesa settimanale"
          autoFocus
          className="w-full border-b border-border focus:border-brand-mid outline-none py-2 text-base text-text-primary bg-transparent"
        />
      </div>

      <div>
        <label className="block text-xs text-text-secondary mb-2">Visibilità</label>
        <div className="flex gap-2">
          {(['private', 'family'] as Visibility[]).map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setVisibility(v)}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                visibility === v
                  ? 'bg-brand-mid text-white border-brand-mid'
                  : 'border-border text-text-secondary'
              }`}
            >
              {v === 'private' ? '🔒 Privata' : '👥 Famiglia'}
            </button>
          ))}
        </div>
      </div>

      {visibility === 'family' && families.length > 0 && (
        <div>
          <label className="block text-xs text-text-secondary mb-1">Famiglia</label>
          <select
            value={familyId}
            onChange={e => setFamilyId(e.target.value)}
            className="w-full border-b border-border focus:border-brand-mid outline-none py-2 text-base text-text-primary bg-transparent"
          >
            <option value="">Seleziona famiglia…</option>
            {families.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={onDone}
          className="flex-1 py-3 rounded-lg border border-brand-mid text-brand-mid font-semibold text-base"
        >
          Annulla
        </button>
        <button
          type="submit"
          disabled={pending}
          className="flex-1 py-3 rounded-lg bg-brand-bright text-white font-semibold text-base disabled:opacity-60"
        >
          {pending ? 'Salvo…' : initial ? 'Salva' : 'Crea'}
        </button>
      </div>
    </form>
  )
}
