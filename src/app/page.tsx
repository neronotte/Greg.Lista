import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getNavCounts } from '@/lib/nav-counts'
import AppBar from '@/components/ui/AppBar'
import BottomNav from '@/components/ui/BottomNav'
import EmptyState from '@/components/ui/EmptyState'
import CategoryHeader from '@/components/ui/CategoryHeader'
import ListCard from '@/components/ui/ListCard'
import HomeActions from './HomeActions'
import { Search, ShoppingCart } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: lists }, { data: families }, navCounts] = await Promise.all([
    supabase
      .from('lists')
      .select(`
        *,
        family:families(id, name),
        item_count:list_items(count)
      `)
      .order('updated_at', { ascending: false }),
    supabase
      .from('family_members')
      .select('families(id, name)')
      .eq('user_id', user.id),
    getNavCounts(),
  ])

  const myLists = (lists ?? []).filter(l => l.owner_id === user.id && l.visibility === 'private')
  const familyLists = (lists ?? []).filter(l => l.visibility === 'family')

  const familyOptions = (families ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((m: any) => (Array.isArray(m.families) ? m.families[0] : m.families) as { id: string; name: string } | null)
    .filter(Boolean) as { id: string; name: string }[]

  return (
    <div className="min-h-screen flex flex-col bg-bg-app">
      <AppBar
        title="List@"
        actions={
          <button aria-label="Cerca" className="w-10 h-10 flex items-center justify-center text-white rounded-full active:bg-white/10">
            <Search size={24} />
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto pb-4">
        {myLists.length === 0 && familyLists.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart size={64} />}
            title="Nessuna lista"
            subtitle="Aggiungi la tua prima lista della spesa"
          />
        ) : (
          <>
            {myLists.length > 0 && (
              <section>
                <CategoryHeader name="Le mie liste" />
                {myLists.map(l => (
                  <ListCard
                    key={l.id}
                    id={l.id}
                    name={l.name}
                    visibility="private"
                    itemCount={l.item_count?.[0]?.count ?? 0}
                    updatedAt={l.updated_at}
                  />
                ))}
              </section>
            )}
            {familyLists.length > 0 && (
              <section>
                <CategoryHeader name="Famiglia" />
                {familyLists.map(l => (
                  <ListCard
                    key={l.id}
                    id={l.id}
                    name={l.name}
                    visibility="family"
                    itemCount={l.item_count?.[0]?.count ?? 0}
                    updatedAt={l.updated_at}
                    familyName={l.family?.name}
                  />
                ))}
              </section>
            )}
          </>
        )}
      </main>

      <HomeActions families={familyOptions} />
      <BottomNav pendingInvites={navCounts.pendingInvites} activeSessions={navCounts.activeSessions} />
    </div>
  )
}
