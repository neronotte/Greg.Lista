'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import BottomSheet from '@/components/ui/BottomSheet'
import { inviteMember, removeMember, leaveFamily, renameFamily } from '@/lib/actions/families'
import { UserPlus, LogOut, Edit } from 'lucide-react'

interface FamilyDetailActionsProps {
  familyId: string
  isOwner?: boolean
  familyName?: string
  memberId?: string
  action?: 'remove'
  fab?: boolean
}

export default function FamilyDetailActions({
  familyId, isOwner, familyName, memberId, action, fab
}: FamilyDetailActionsProps) {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [newName, setNewName] = useState(familyName ?? '')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  // Remove button for a specific member
  if (action === 'remove' && memberId) {
    return (
      <button
        onClick={() => startTransition(() => removeMember(familyId, memberId))}
        disabled={pending}
        className="rounded-full border border-error/20 bg-error/8 px-3 py-1 text-xs font-bold text-error"
      >
        Rimuovi
      </button>
    )
  }

  if (!fab) return null

  return (
    <>
      <div className="fixed inset-x-0 bottom-24 z-20 px-4">
        <div className="mx-auto flex w-full max-w-3xl gap-2 rounded-[24px] border border-border bg-bg-surface p-3 shadow-[var(--shadow-md)]">
          {isOwner && (
            <>
              <button
                onClick={() => { setError(null); setSuccess(null); setInviteOpen(true) }}
                className="soft-button-secondary flex-1"
              >
                <UserPlus size={16} />Invita
              </button>
              <button
                onClick={() => { setNewName(familyName ?? ''); setRenameOpen(true) }}
                className="soft-button-secondary px-4"
              >
                <Edit size={16} />
              </button>
            </>
          )}
          <button
            onClick={() => startTransition(async () => {
              try { await leaveFamily(familyId); router.push('/families') }
              catch (err) { alert(err instanceof Error ? err.message : 'Errore') }
            })}
            disabled={pending}
            className="soft-button-danger px-4"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <BottomSheet open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invita membro">
        <form
          onSubmit={e => {
            e.preventDefault()
            if (!email.trim()) return
            setError(null)
            setSuccess(null)
            startTransition(async () => {
              try {
                await inviteMember(familyId, email.trim())
                setSuccess(`Invito inviato a ${email}`)
                setEmail('')
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Errore')
              }
            })
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-text-secondary">Email utente</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@esempio.com"
              autoFocus
              className="soft-input"
            />
          </div>
          {error && <p className="text-sm text-error">{error}</p>}
          {success && <p className="text-sm text-brand-mid">{success}</p>}
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={() => setInviteOpen(false)} className="soft-button-secondary flex-1">Chiudi</button>
            <button type="submit" disabled={pending} className="soft-button-primary flex-1">{pending ? '…' : 'Invita'}</button>
          </div>
        </form>
      </BottomSheet>

      <BottomSheet open={renameOpen} onClose={() => setRenameOpen(false)} title="Rinomina famiglia">
        <form
          onSubmit={e => {
            e.preventDefault()
            startTransition(async () => {
              try { await renameFamily(familyId, newName); setRenameOpen(false) }
              catch (err) { setError(err instanceof Error ? err.message : 'Errore') }
            })
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            autoFocus
            className="soft-input"
          />
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={() => setRenameOpen(false)} className="soft-button-secondary flex-1">Annulla</button>
            <button type="submit" disabled={pending} className="soft-button-primary flex-1">Salva</button>
          </div>
        </form>
      </BottomSheet>
    </>
  )
}
