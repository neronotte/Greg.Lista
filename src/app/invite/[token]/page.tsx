import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { acceptInvite, rejectInvite } from '@/lib/actions/families'
import AppBar from '@/components/ui/AppBar'
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
      <div className="min-h-screen flex flex-col bg-bg-app">
        <AppBar title="Invito" backHref="/profile" />
        <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
          <p className="text-[17px] font-semibold text-text-secondary">Invito non valido</p>
          <p className="mt-1 text-sm text-text-disabled">L&apos;invito è già stato usato o è scaduto.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-app">
      <AppBar title="Invito famiglia" backHref="/profile" />
      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
        <div className="w-16 h-16 rounded-full bg-brand-mid/20 flex items-center justify-center">
          <Users size={32} className="text-brand-mid" />
        </div>
        <div className="text-center">
          <p className="text-[17px] font-semibold text-text-primary">
            Sei stato invitato a unirsi a
          </p>
          <p className="text-2xl font-bold text-brand-dark mt-1">{invite.family?.name}</p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <form action={async () => { 'use server'; await acceptInvite(token); redirect('/families') }}>
            <button type="submit" className="w-full py-3 rounded-lg bg-brand-bright text-white font-semibold text-base">
              Accetta invito
            </button>
          </form>
          <form action={async () => { 'use server'; await rejectInvite(token); redirect('/profile') }}>
            <button type="submit" className="w-full py-3 rounded-lg border border-border text-text-secondary font-semibold text-base">
              Rifiuta
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
