import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getNavCounts } from '@/lib/nav-counts'
import AppBar from '@/components/ui/AppBar'
import BottomNav from '@/components/ui/BottomNav'
import Avatar from '@/components/ui/Avatar'
import ProfileEditForm from './ProfileEditForm'
import SignOutButton from './SignOutButton'
import Link from 'next/link'
import { ChevronRight, Users } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: families }, { data: invites }, navCounts] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('family_members')
      .select('role, families(id, name)')
      .eq('user_id', user.id),
    supabase
      .from('family_invites')
      .select('*, family:families(name)')
      .eq('invited_email', user.email!)
      .eq('status', 'pending'),
    getNavCounts(),
  ])

  const displayName = profile?.display_name ?? user.email?.split('@')[0] ?? 'Utente'
  const email = user.email ?? ''

  return (
    <div className="min-h-screen flex flex-col bg-bg-app">
      <AppBar title="Profilo" />

      <main className="flex-1 overflow-y-auto">
        {/* Avatar + info */}
        <div className="bg-bg-surface px-4 py-6 flex flex-col items-center gap-3 border-b border-border">
          <Avatar name={displayName} email={email} avatarUrl={profile?.avatar_url} size={80} />
          <div className="text-center">
            <p className="text-[17px] font-semibold text-text-primary">{displayName}</p>
            <p className="text-sm text-text-secondary">{email}</p>
          </div>
          <ProfileEditForm currentName={displayName} />
        </div>

        {/* Pending invites */}
        {(invites ?? []).length > 0 && (
          <section className="mt-4">
            <p className="px-4 pb-2 text-xs uppercase text-text-secondary tracking-[0.08em]">Inviti in attesa</p>
            {(invites ?? []).map(invite => (
              <Link
                key={invite.id}
                href={`/invite/${invite.token}`}
                className="flex items-center gap-3 bg-bg-surface px-4 py-3 border-b border-border"
              >
                <Users size={20} className="text-text-secondary shrink-0" />
                <div className="flex-1">
                  <p className="text-base text-text-primary">{invite.family?.name ?? 'Famiglia'}</p>
                  <p className="text-sm text-text-secondary">Invito in attesa</p>
                </div>
                <ChevronRight size={16} className="text-text-disabled" />
              </Link>
            ))}
          </section>
        )}

        {/* Families */}
        <section className="mt-4">
          <p className="px-4 pb-2 text-xs uppercase text-text-secondary tracking-[0.08em]">Le mie famiglie</p>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(families ?? []).map((m: any) => {
            const fam = (Array.isArray(m.families) ? m.families[0] : m.families) as { id: string; name: string } | null
            return fam && (
              <Link
                key={fam.id}
                href={`/families/${fam.id}`}
                className="flex items-center gap-3 bg-bg-surface px-4 py-3 border-b border-border"
              >
                <Users size={20} className="text-text-secondary shrink-0" />
                <div className="flex-1">
                  <p className="text-base text-text-primary">{fam.name}</p>
                  <p className="text-sm text-text-secondary capitalize">{m.role}</p>
                </div>
                <ChevronRight size={16} className="text-text-disabled" />
              </Link>
            )
          })}
          <Link
            href="/families"
            className="flex items-center justify-center py-3 bg-bg-surface border-b border-border text-brand-mid text-base"
          >
            Gestisci famiglie
          </Link>
        </section>

        {/* Sign out */}
        <section className="mt-4 mb-8">
          <SignOutButton />
        </section>
      </main>

      <BottomNav pendingInvites={navCounts.pendingInvites} activeSessions={navCounts.activeSessions} />
    </div>
  )
}
