'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import FAB from '@/components/ui/FAB'
import BottomSheet from '@/components/ui/BottomSheet'
import { createFamily } from '@/lib/actions/families'

export default function FamiliesActions() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Il nome è obbligatorio'); return }
    setError(null)
    startTransition(async () => {
      try {
        await createFamily(name.trim())
        router.refresh()
        setOpen(false)
        setName('')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore')
      }
    })
  }

  return (
    <>
      <FAB onClick={() => setOpen(true)} ariaLabel="Nuova famiglia" />
      <BottomSheet open={open} onClose={() => setOpen(false)} title="Nuova famiglia">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-text-secondary mb-1">Nome famiglia</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="es. Famiglia Gregori"
              autoFocus
              className="w-full border-b border-border focus:border-brand-mid outline-none py-2 text-base text-text-primary bg-transparent"
            />
          </div>
          {error && <p className="text-sm text-error">{error}</p>}
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={() => setOpen(false)} className="flex-1 py-3 rounded-lg border border-brand-mid text-brand-mid font-semibold">Annulla</button>
            <button type="submit" disabled={pending} className="flex-1 py-3 rounded-lg bg-brand-bright text-white font-semibold disabled:opacity-60">{pending ? 'Creo…' : 'Crea'}</button>
          </div>
        </form>
      </BottomSheet>
    </>
  )
}
