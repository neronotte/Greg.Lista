'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function startSession(listId: string, supermarket?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autenticato')

  // Create session
  const { data: session, error } = await supabase
    .from('shopping_sessions')
    .insert({
      list_id: listId,
      created_by: user.id,
      supermarket: supermarket?.trim() || null,
    })
    .select()
    .single()

  if (error || !session) throw new Error(error?.message ?? 'Errore')

  // Copy list items as session entries
  const { data: items } = await supabase
    .from('list_items')
    .select('id')
    .eq('list_id', listId)
    .order('sort_order')

  if (items && items.length > 0) {
    await supabase.from('session_entries').insert(
      items.map((item) => ({
        session_id: session.id,
        list_item_id: item.id,
        checked: false,
      }))
    )
  }

  revalidatePath(`/lists/${listId}`)
  redirect(`/session/${session.id}`)
}

export async function toggleEntry(entryId: string, checked: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autenticato')

  const { data: entry } = await supabase
    .from('session_entries')
    .select('session_id')
    .eq('id', entryId)
    .single()

  await supabase
    .from('session_entries')
    .update({
      checked,
      checked_at: checked ? new Date().toISOString() : null,
      checked_by: checked ? user.id : null,
    })
    .eq('id', entryId)

  if (entry) revalidatePath(`/session/${entry.session_id}`)
}

export async function completeSession(sessionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autenticato')

  await supabase
    .from('shopping_sessions')
    .update({ completed_at: new Date().toISOString() })
    .eq('id', sessionId)
    .eq('created_by', user.id)

  revalidatePath(`/session/${sessionId}`)
  redirect('/history')
}

export async function reopenSession(sessionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autenticato')

  await supabase
    .from('shopping_sessions')
    .update({ completed_at: null })
    .eq('id', sessionId)
    .eq('created_by', user.id)

  revalidatePath(`/session/${sessionId}`)
  revalidatePath('/history')
}

export async function updateProfile(displayName: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autenticato')

  const name = displayName.trim()
  if (!name) throw new Error('Il nome non può essere vuoto')

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: name })
    .eq('id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/profile')
}
