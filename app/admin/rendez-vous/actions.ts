'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertAdminSession } from '@/lib/admin/session'
import type { AppointmentStatus } from '@/lib/types'

const STATUSES: AppointmentStatus[] = ['new', 'contacted', 'scheduled', 'done', 'archived']

export async function updateAppointmentStatusAction(id: string, status: AppointmentStatus) {
  await assertAdminSession()
  if (!STATUSES.includes(status)) throw new Error('Statut invalide')
  const supabase = await createClient()
  const { error } = await supabase.from('appointment_requests').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/rendez-vous')
  revalidatePath('/admin')
}

export async function deleteAppointmentAction(id: string) {
  await assertAdminSession()
  const supabase = await createClient()
  const { error } = await supabase.from('appointment_requests').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/rendez-vous')
}
