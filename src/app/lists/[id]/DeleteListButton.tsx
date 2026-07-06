'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteList } from '@/lib/actions/lists'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Toast from '@/components/ui/Toast'

interface DeleteListButtonProps {
  listId: string
}

export default function DeleteListButton({ listId }: DeleteListButtonProps) {
  const [pending, startTransition] = useTransition()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleDeleteConfirmed() {
    startTransition(async () => {
      try {
        await deleteList(listId)
        router.push('/')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore durante l\'eliminazione della lista.')
      } finally {
        setConfirmOpen(false)
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        disabled={pending}
        aria-label="Elimina lista"
        className="w-10 h-10 flex items-center justify-center text-white rounded-full active:bg-white/10 disabled:opacity-60"
        title="Elimina lista"
      >
        <Trash2 size={22} />
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Elimina lista"
        message="Vuoi davvero eliminare questa lista? Questa azione non puo essere annullata."
        confirmLabel="Elimina"
        cancelLabel="Annulla"
        destructive
        pending={pending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirmed}
      />

      {error && (
        <Toast
          message={error}
          onDismiss={() => setError(null)}
        />
      )}
    </>
  )
}
