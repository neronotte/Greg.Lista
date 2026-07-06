'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { suggestCategoryWithAI } from '@/lib/categories/matcher'
import { createClient as createCategories } from '@/lib/supabase/server'

interface ItemData {
  name: string
  categoryName?: string | null
  quantity?: string | null
  unit?: string | null
  notes?: string | null
}

async function resolveCategoryId(categoryName: string | null | undefined): Promise<number | null> {
  if (!categoryName || categoryName === 'auto') return null
  const supabase = await createCategories()
  const { data } = await supabase
    .from('categories')
    .select('id')
    .eq('name', categoryName)
    .single()
  return data?.id ?? null
}

export async function addItem(listId: string, data: ItemData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autenticato')

  let categoryName = data.categoryName
  if (!categoryName || categoryName === 'auto') {
    categoryName = await suggestCategoryWithAI(data.name)
  }
  const categoryId = await resolveCategoryId(categoryName)

  // Get max sort_order for this list
  const { data: last } = await supabase
    .from('list_items')
    .select('sort_order')
    .eq('list_id', listId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const sortOrder = (last?.sort_order ?? 0) + 10

  const { error } = await supabase.from('list_items').insert({
    list_id: listId,
    name: data.name,
    category_id: categoryId,
    quantity: data.quantity ?? null,
    unit: data.unit ?? null,
    notes: data.notes ?? null,
    sort_order: sortOrder,
  })

  if (error) throw new Error(error.message)
  revalidatePath(`/lists/${listId}`)
}

export async function updateItem(itemId: string, listId: string, data: ItemData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autenticato')

  let categoryName = data.categoryName
  if (categoryName === 'auto') {
    categoryName = await suggestCategoryWithAI(data.name)
  }
  const categoryId = await resolveCategoryId(categoryName)

  const { error } = await supabase
    .from('list_items')
    .update({
      name: data.name,
      category_id: categoryId,
      quantity: data.quantity ?? null,
      unit: data.unit ?? null,
      notes: data.notes ?? null,
    })
    .eq('id', itemId)

  if (error) throw new Error(error.message)
  revalidatePath(`/lists/${listId}`)
}

export async function deleteItem(itemId: string, listId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autenticato')

  const { error } = await supabase.from('list_items').delete().eq('id', itemId)
  if (error) throw new Error(error.message)
  revalidatePath(`/lists/${listId}`)
}

export async function reorderItems(listId: string, orderedIds: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autenticato')

  const updates = orderedIds.map((id, i) =>
    supabase.from('list_items').update({ sort_order: (i + 1) * 10 }).eq('id', id)
  )
  await Promise.all(updates)
  revalidatePath(`/lists/${listId}`)
}
