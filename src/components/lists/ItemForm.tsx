'use client'

import { useState, useTransition } from 'react'
import { addItem, updateItem } from '@/lib/actions/items'
import type { Category } from '@/lib/types'

interface ItemFormProps {
  listId: string
  categories: Category[]
  initial?: {
    id: string
    name: string
    quantity?: string | null
    unit?: string | null
    notes?: string | null
    categoryName?: string | null
  }
  onDone: () => void
}

export default function ItemForm({ listId, categories, initial, onDone }: ItemFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [quantity, setQuantity] = useState(initial?.quantity ?? '')
  const [unit, setUnit] = useState(initial?.unit ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [categoryName, setCategoryName] = useState(initial?.categoryName ?? 'auto')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Il nome è obbligatorio'); return }
    setError(null)
    startTransition(async () => {
      try {
        const data = {
          name: name.trim(),
          categoryName: categoryName === 'auto' ? null : categoryName,
          quantity: quantity || null,
          unit: unit || null,
          notes: notes || null,
        }
        if (initial) {
          await updateItem(initial.id, listId, data)
        } else {
          await addItem(listId, data)
        }
        onDone()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs text-text-secondary mb-1">Nome articolo *</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="es. Parmigiano Reggiano"
          autoFocus
          className="w-full border-b border-border focus:border-brand-mid outline-none py-2 text-base text-text-primary bg-transparent"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-text-secondary mb-1">Quantità</label>
          <input
            type="text"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            placeholder="500"
            className="w-full border-b border-border focus:border-brand-mid outline-none py-2 text-base text-text-primary bg-transparent"
          />
        </div>
        <div className="w-24">
          <label className="block text-xs text-text-secondary mb-1">Unità</label>
          <input
            type="text"
            value={unit}
            onChange={e => setUnit(e.target.value)}
            placeholder="g, L, pz"
            className="w-full border-b border-border focus:border-brand-mid outline-none py-2 text-base text-text-primary bg-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-text-secondary mb-1">Categoria</label>
        <select
          value={categoryName}
          onChange={e => setCategoryName(e.target.value)}
          className="w-full border-b border-border focus:border-brand-mid outline-none py-2 text-base text-text-primary bg-transparent"
        >
          <option value="auto">Auto (suggerita)</option>
          {categories.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-text-secondary mb-1">Note</label>
        <input
          type="text"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Marca, dettagli…"
          className="w-full border-b border-border focus:border-brand-mid outline-none py-2 text-base text-text-primary bg-transparent"
        />
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex gap-2 mt-2">
        <button type="button" onClick={onDone} className="flex-1 py-3 rounded-lg border border-brand-mid text-brand-mid font-semibold text-base">
          Annulla
        </button>
        <button type="submit" disabled={pending} className="flex-1 py-3 rounded-lg bg-brand-bright text-white font-semibold text-base disabled:opacity-60">
          {pending ? 'Salvo…' : initial ? 'Salva' : 'Aggiungi'}
        </button>
      </div>
    </form>
  )
}
