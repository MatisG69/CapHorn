'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertAdminSession } from '@/lib/admin/session'
import type { LeadStatus } from '@/lib/types'

const ALLOWED_STATUSES: LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'won',
  'lost',
  'archived',
]

export async function updateLeadStatusAction(id: string, status: LeadStatus) {
  await assertAdminSession()
  if (!ALLOWED_STATUSES.includes(status)) {
    throw new Error('Statut invalide')
  }
  const supabase = await createClient()
  const { error } = await supabase.from('leads').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/admin/leads')
  revalidatePath(`/admin/leads/${id}`)
}

export async function updateLeadNotesAction(id: string, notes: string) {
  await assertAdminSession()
  const supabase = await createClient()
  const trimmed = notes.slice(0, 5000)
  const { error } = await supabase
    .from('leads')
    .update({ notes: trimmed.length > 0 ? trimmed : null })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/leads/${id}`)
}

export async function deleteLeadAction(id: string) {
  await assertAdminSession()
  const supabase = await createClient()
  const { error } = await supabase.from('leads').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/leads')
  revalidatePath('/admin')
}
