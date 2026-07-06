'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import BottomSheet from '@/components/ui/BottomSheet'
import { inviteMember, removeMember, leaveFamily, renameFamily } from '@/lib/actions/families'
import { UserPlus, LogOut, Edit } from 'lucide-react'

interface FamilyDetailActionsProps {
  familyId: string
  isOwner?: boolean
  currentUserId?: string
  familyName?: string
  memberId?: string
  action?: 'remove'
  fab?: boolean
}

export default function FamilyDetailActions({
  familyId, isOwner, currentUserId, familyName, memberId, action, fab
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
        className="text-xs text-error px-2 py-1 border border-error rounded"
      >
        Rimuovi
      </button>
    )
  }

  if (!fab) return null

  return (
    <>
      {/* Action bar */}
      <div className="sticky bottom-16 bg-bg-surface border-t border-border px-4 py-3 flex gap-2">
        {isOwner && (
          <>
            <button
              onClick={() => { setError(null); setSuccess(null); setInviteOpen(true) }}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-brand-mid text-brand-mid text-sm font-semibold"
            >
              <UserPlus size={16} />Invita
            </button>
            <button
              onClick={() => { setNewName(familyName ?? ''); setRenameOpen(true) }}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-border text-text-secondary text-sm"
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
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-error text-error text-sm"
        >
          <LogOut size={16} />
        </button>
      </div>

      {/* Invite sheet */}
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
            <label className="block text-xs text-text-secondary mb-1">Email utente</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@esempio.com"
              autoFocus
              className="w-full border-b border-border focus:border-brand-mid outline-none py-2 text-base text-text-primary bg-transparent"
            />
          </div>
          {error && <p className="text-sm text-error">{error}</p>}
          {success && <p className="text-sm text-brand-mid">{success}</p>}
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={() => setInviteOpen(false)} className="flex-1 py-3 rounded-lg border border-brand-mid text-brand-mid font-semibold">Chiudi</button>
            <button type="submit" disabled={pending} className="flex-1 py-3 rounded-lg bg-brand-bright text-white font-semibold disabled:opacity-60">{pending ? '…' : 'Invita'}</button>
          </div>
        </form>
      </BottomSheet>

      {/* Rename sheet */}
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
            className="w-full border-b border-border focus:border-brand-mid outline-none py-2 text-base text-text-primary bg-transparent"
          />
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={() => setRenameOpen(false)} className="flex-1 py-3 rounded-lg border border-brand-mid text-brand-mid font-semibold">Annulla</button>
            <button type="submit" disabled={pending} className="flex-1 py-3 rounded-lg bg-brand-bright text-white font-semibold disabled:opacity-60">Salva</button>
          </div>
        </form>
      </BottomSheet>
    </>
  )
}
