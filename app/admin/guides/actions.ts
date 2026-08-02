'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertAdminSession } from '@/lib/admin/session'
import { GUIDE_REQUEST_STATUS_LABELS, type GuideRequestStatus } from '@/lib/types'

const STATUSES = Object.keys(GUIDE_REQUEST_STATUS_LABELS) as GuideRequestStatus[]

export async function updateGuideRequestStatusAction(id: string, status: GuideRequestStatus) {
  await assertAdminSession()
  if (!STATUSES.includes(status)) throw new Error('Statut invalide')
  const supabase = await createClient()
  const { error } = await supabase.from('guide_requests').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/guides')
  revalidatePath('/admin')
}

export async function deleteGuideRequestAction(id: string) {
  await assertAdminSession()
  const supabase = await createClient()
  const { error } = await supabase.from('guide_requests').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/guides')
}
