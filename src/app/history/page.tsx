import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getNavCounts } from '@/lib/nav-counts'
import AppBar from '@/components/ui/AppBar'
import BottomNav from '@/components/ui/BottomNav'
import EmptyState from '@/components/ui/EmptyState'
import Link from 'next/link'
import { ShoppingBag, Store } from 'lucide-react'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: sessions }, navCounts] = await Promise.all([
    supabase
      .from('shopping_sessions')
      .select(`
        *,
        list:lists(name),
        entries:session_entries(count),
        checked:session_entries(count)
      `)
      .order('started_at', { ascending: false }),
    getNavCounts(),
  ])

  // Fetch checked count separately since Supabase doesn't support filtered counts inline easily
  const sessionList = sessions ?? []

  return (
    <div className="min-h-screen flex flex-col bg-bg-app">
      <AppBar title="Storico spese" />

      <main className="flex-1 overflow-y-auto">
        {sessionList.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag size={64} />}
            title="Nessuna spesa"
            subtitle="Le tue sessioni appariranno qui"
          />
        ) : (
          <ul>
            {sessionList.map(s => (
              <li key={s.id}>
                <Link
                  href={`/session/${s.id}`}
                  className="flex items-center gap-3 bg-bg-surface px-4 py-3 border-b border-border active:bg-bg-header"
                >
                  <span className="text-text-secondary shrink-0">
                    <Store size={20} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[17px] font-semibold text-text-primary truncate">
                      {s.supermarket || s.list?.name || 'Spesa'}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {s.list?.name} · {new Date(s.started_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${s.completed_at ? 'bg-brand-bright/20 text-brand-mid' : 'bg-warning/20 text-warning'}`}>
                    {s.completed_at ? 'Completata' : 'In corso'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <BottomNav pendingInvites={navCounts.pendingInvites} activeSessions={navCounts.activeSessions} />
    </div>
  )
}
