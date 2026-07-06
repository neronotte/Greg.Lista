'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'

export async function createFamily(name: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autenticato')

  const { data: family, error } = await supabase
    .from('families')
    .insert({ name, created_by: user.id })
    .select()
    .single()

  if (error || !family) throw new Error(error?.message ?? 'Errore')

  await supabase.from('family_members').insert({
    family_id: family.id,
    user_id: user.id,
    role: 'owner',
  })

  revalidatePath('/families')
  return family
}

export async function renameFamily(familyId: string, name: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autenticato')

  const { error } = await supabase
    .from('families')
    .update({ name })
    .eq('id', familyId)
    .eq('created_by', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/families')
  revalidatePath(`/families/${familyId}`)
}

export async function inviteMember(familyId: string, email: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autenticato')

  // Verify caller is owner
  const { data: membership } = await supabase
    .from('family_members')
    .select('role')
    .eq('family_id', familyId)
    .eq('user_id', user.id)
    .single()

  if (membership?.role !== 'owner') throw new Error('Solo il proprietario può invitare membri')

  // Find invited user by email
  const { data: invited } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (!invited) throw new Error('Utente non trovato. Assicurati che si sia già registrato a List@.')

  // Check not already a member
  const { data: existing } = await supabase
    .from('family_members')
    .select('user_id')
    .eq('family_id', familyId)
    .eq('user_id', invited.id)
    .single()

  if (existing) throw new Error('L\'utente è già membro della famiglia')

  // Create invite
  const token = randomUUID()
  const { error } = await supabase.from('family_invites').insert({
    family_id: familyId,
    invited_email: email,
    token,
    status: 'pending',
  })

  if (error) throw new Error(error.message)
  revalidatePath(`/families/${familyId}`)
  return token
}

export async function acceptInvite(token: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autenticato')

  const { data: invite } = await supabase
    .from('family_invites')
    .select('*')
    .eq('token', token)
    .eq('status', 'pending')
    .single()

  if (!invite) throw new Error('Invito non valido o già utilizzato')

  await supabase.from('family_members').insert({
    family_id: invite.family_id,
    user_id: user.id,
    role: 'member',
  })

  await supabase
    .from('family_invites')
    .update({ status: 'accepted' })
    .eq('token', token)

  revalidatePath('/families')
  revalidatePath('/')
}

export async function rejectInvite(token: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autenticato')

  await supabase
    .from('family_invites')
    .update({ status: 'expired' })
    .eq('token', token)

  revalidatePath('/profile')
}

export async function removeMember(familyId: string, userId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autenticato')

  const { data: membership } = await supabase
    .from('family_members')
    .select('role')
    .eq('family_id', familyId)
    .eq('user_id', user.id)
    .single()

  if (membership?.role !== 'owner') throw new Error('Solo il proprietario può rimuovere membri')
  if (userId === user.id) throw new Error('Non puoi rimuovere te stesso')

  await supabase
    .from('family_members')
    .delete()
    .eq('family_id', familyId)
    .eq('user_id', userId)

  revalidatePath(`/families/${familyId}`)
}

export async function leaveFamily(familyId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non autenticato')

  const { data: membership } = await supabase
    .from('family_members')
    .select('role')
    .eq('family_id', familyId)
    .eq('user_id', user.id)
    .single()

  if (membership?.role === 'owner') {
    const { count } = await supabase
      .from('family_members')
      .select('*', { count: 'exact', head: true })
      .eq('family_id', familyId)

    if ((count ?? 0) > 1) throw new Error('Trasferisci la proprietà prima di lasciare la famiglia')
  }

  await supabase
    .from('family_members')
    .delete()
    .eq('family_id', familyId)
    .eq('user_id', user.id)

  revalidatePath('/families')
  revalidatePath('/')
}
