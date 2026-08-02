'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertAdminSession } from '@/lib/admin/session'
import { REFERRAL_STATUS_LABELS, type ReferralStatus } from '@/lib/types'

const STATUSES = Object.keys(REFERRAL_STATUS_LABELS) as ReferralStatus[]

export async function updateReferralStatusAction(id: string, status: ReferralStatus) {
  await assertAdminSession()
  if (!STATUSES.includes(status)) throw new Error('Statut invalide')
  const supabase = await createClient()
  const { error } = await supabase.from('referrals').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/parrainage')
  revalidatePath('/admin')
}

/**
 * Montant de la prime due au parrain. Saisi à la main : il dépend du dossier,
 * et c'est la seule trace de ce que le cabinet doit réellement.
 */
export async function updateReferralRewardAction(id: string, amount: number | null) {
  await assertAdminSession()
  if (amount !== null && (!Number.isFinite(amount) || amount < 0)) {
    throw new Error('Montant invalide')
  }
  const supabase = await createClient()
  const { error } = await supabase.from('referrals').update({ reward_amount: amount }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/parrainage')
}

export async function deleteReferralAction(id: string) {
  await assertAdminSession()
  const supabase = await createClient()
  const { error } = await supabase.from('referrals').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/parrainage')
}
