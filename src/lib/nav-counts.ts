import { createClient } from '@/lib/supabase/server'

export async function getNavCounts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { pendingInvites: 0, activeSessions: 0 }

  const [invitesRes, sessionsRes] = await Promise.all([
    supabase
      .from('family_invites')
      .select('*', { count: 'exact', head: true })
      .eq('invited_email', user.email!)
      .eq('status', 'pending'),
    supabase
      .from('shopping_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', user.id)
      .is('completed_at', null),
  ])

  return {
    pendingInvites: invitesRes.count ?? 0,
    activeSessions: sessionsRes.count ?? 0,
  }
}
