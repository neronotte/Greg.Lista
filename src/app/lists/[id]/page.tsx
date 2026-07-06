import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { getNavCounts } from '@/lib/nav-counts'
import AppBar from '@/components/ui/AppBar'
import BottomNav from '@/components/ui/BottomNav'
import CategoryHeader from '@/components/ui/CategoryHeader'
import EmptyState from '@/components/ui/EmptyState'
import ListDetailActions from './ListDetailActions'
import DeleteListButton from './DeleteListButton'
import { ShoppingBag, ShoppingCart } from 'lucide-react'
import type { ListItem, Category } from '@/lib/types'

interface GroupedItems {
  category: Category
  items: ListItem[]
}

export default async function ListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: list }, { data: rawItems }, { data: categories }, navCounts] = await Promise.all([
    supabase.from('lists').select('*, family:families(name)').eq('id', id).single(),
    supabase
      .from('list_items')
      .select('*, category:categories(id, name, sort_order)')
      .eq('list_id', id)
      .order('sort_order'),
    supabase.from('categories').select('*').order('sort_order'),
    getNavCounts(),
  ])

  if (!list) notFound()

  const items: ListItem[] = rawItems ?? []
  const cats: Category[] = categories ?? []

  // Group items by category
  const grouped: GroupedItems[] = []
  const uncategorized: ListItem[] = []
  const catMap = new Map<number, GroupedItems>()

  for (const item of items) {
    if (!item.category) { uncategorized.push(item); continue }
    if (!catMap.has(item.category.id)) {
      const g = { category: item.category as Category, items: [] }
      catMap.set(item.category.id, g)
      grouped.push(g)
    }
    catMap.get(item.category.id)!.items.push(item)
  }
  grouped.sort((a, b) => a.category.sort_order - b.category.sort_order)

  const title = `${list.name}${list.visibility === 'family' && list.family ? ` · ${list.family.name}` : ''}`

  return (
    <div className="min-h-screen flex flex-col bg-bg-app">
      <AppBar
        title={title}
        backHref="/"
        actions={
          <DeleteListButton listId={id} />
        }
      />

      <main className="flex-1 overflow-y-auto pb-4">
        {items.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag size={64} />}
            title="Lista vuota"
            subtitle="Aggiungi il primo articolo"
          />
        ) : (
          <>
            {grouped.map(g => (
              <section key={g.category.id}>
                <CategoryHeader name={g.category.name} />
                <ListDetailActions
                  listId={id}
                  categories={cats}
                  items={g.items}
                  sectionOnly
                />
              </section>
            ))}
            {uncategorized.length > 0 && (
              <section>
                <CategoryHeader name="Varie" />
                <ListDetailActions
                  listId={id}
                  categories={cats}
                  items={uncategorized}
                  sectionOnly
                />
              </section>
            )}
          </>
        )}
      </main>

      {/* Start shopping session button */}
      <div className="sticky bottom-16 px-4 pb-2 pt-2 bg-bg-app">
        <form action={`/session/new?listId=${id}`}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-brand-bright text-white font-semibold text-base"
            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}
          >
            <ShoppingCart size={20} />
            Avvia spesa
          </button>
        </form>
      </div>

      <ListDetailActions listId={id} categories={cats} items={items} fab fabClassName="bottom-36" />
      <BottomNav pendingInvites={navCounts.pendingInvites} activeSessions={navCounts.activeSessions} />
    </div>
  )
}
