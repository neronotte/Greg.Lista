import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { acceptInvite, rejectInvite } from '@/lib/actions/families'
import AppBar from '@/components/ui/AppBar'
import EmptyState from '@/components/ui/EmptyState'
import { Users } from 'lucide-react'

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/invite/${token}`)

  const { data: invite } = await supabase
    .from('family_invites')
    .select('*, family:families(name, created_by, profiles:profiles!families_created_by_fkey(display_name, email))')
    .eq('token', token)
    .eq('status', 'pending')
    .single()

  if (!invite) {
    return (
      <div className="app-shell">
        <AppBar title="Invito" backHref="/profile" />
        <div className="page-body">
          <EmptyState
            icon={<Users size={56} />}
            title="Invito non valido"
            subtitle="L&apos;invito è gia' stato usato o e' scaduto."
          />
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <AppBar title="Invito famiglia" backHref="/profile" />
      <div className="page-body flex items-center justify-center">
        <div className="surface-card flex w-full max-w-md flex-col items-center gap-6 px-5 py-8 text-center">
          <div className="surface-icon h-16 w-16 rounded-[20px]">
            <Users size={28} className="text-brand-mid" />
          </div>
          <div>
            <p className="text-[17px] font-semibold text-text-primary">
              Sei stato invitato a unirsi a
            </p>
            <p className="mt-1 text-2xl font-extrabold text-brand-dark">{invite.family?.name}</p>
          </div>

          <div className="w-full flex flex-col gap-3">
            <form action={async () => { 'use server'; await acceptInvite(token); redirect('/families') }}>
              <button type="submit" className="soft-button-primary w-full">
                Accetta invito
              </button>
            </form>
            <form action={async () => { 'use server'; await rejectInvite(token); redirect('/profile') }}>
              <button type="submit" className="soft-button-secondary w-full">
                Rifiuta
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
