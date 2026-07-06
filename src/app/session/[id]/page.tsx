import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { getNavCounts } from '@/lib/nav-counts'
import AppBar from '@/components/ui/AppBar'
import BottomNav from '@/components/ui/BottomNav'
import SessionHeader from '@/components/session/SessionHeader'
import CheckableItem from '@/components/session/CheckableItem'
import CategoryHeader from '@/components/ui/CategoryHeader'
import { completeSession, reopenSession } from '@/lib/actions/sessions'

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: session }, { data: entries }, navCounts] = await Promise.all([
    supabase
      .from('shopping_sessions')
      .select('*, list:lists(name, visibility)')
      .eq('id', id)
      .single(),
    supabase
      .from('session_entries')
      .select('*, list_item:list_items(*, category:categories(id, name, sort_order))')
      .eq('session_id', id)
      .order('list_item(sort_order)'),
    getNavCounts(),
  ])

  if (!session) notFound()

  const isCompleted = !!session.completed_at
  const allEntries = entries ?? []
  const todo = allEntries.filter(e => !e.checked)
  const done = allEntries.filter(e => e.checked)

  return (
    <div className="min-h-screen flex flex-col bg-bg-app">
      <AppBar
        title={session.supermarket || session.list?.name || 'Spesa'}
        backHref={`/lists/${session.list_id}`}
        variant={isCompleted ? 'default' : 'shopping'}
      />

      <SessionHeader
        supermarket={session.supermarket}
        startedAt={session.started_at}
        total={allEntries.length}
        checked={done.length}
      />

      <main className="flex-1 overflow-y-auto pb-32">
        {!isCompleted && todo.length > 0 && (
          <section>
            <CategoryHeader name={`Da prendere (${todo.length})`} />
            {todo.map(entry => <CheckableItem key={entry.id} entry={entry as Parameters<typeof CheckableItem>[0]['entry']} />)}
          </section>
        )}

        {done.length > 0 && (
          <section>
            <CategoryHeader name={`Nel carrello (${done.length})`} />
            {done.map(entry => <CheckableItem key={entry.id} entry={entry as Parameters<typeof CheckableItem>[0]['entry']} />)}
          </section>
        )}

        {isCompleted && allEntries.length === 0 && (
          <p className="text-center text-text-disabled py-8">Sessione vuota</p>
        )}
      </main>

      {/* Bottom actions */}
      <div className="fixed bottom-16 left-0 right-0 px-4 pb-2 pt-2">
        {isCompleted ? (
          <form action={async () => { 'use server'; await reopenSession(id) }}>
            <button type="submit" className="w-full py-3 rounded-lg border border-brand-mid text-brand-mid font-semibold text-base bg-bg-surface">
              Riapri sessione
            </button>
          </form>
        ) : (
          <form action={async () => { 'use server'; await completeSession(id) }}>
            <button type="submit" className="w-full py-3 rounded-lg bg-brand-bright text-white font-semibold text-base">
              Concludi spesa
            </button>
          </form>
        )}
      </div>

      <BottomNav pendingInvites={navCounts.pendingInvites} activeSessions={navCounts.activeSessions} />
    </div>
  )
}
