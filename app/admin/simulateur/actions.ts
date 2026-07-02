'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertAdminSession } from '@/lib/admin/session'
import { mergeSettings } from '@/lib/simulateur/settings'
import type { SimulatorSettings } from '@/lib/simulateur/estimate'
import type { SimulatorEstimationStatus } from '@/lib/types'

const STATUSES: SimulatorEstimationStatus[] = ['new', 'contacted', 'converted', 'archived']

/** Enregistre les paramètres du simulateur (ligne unique id=1). */
export async function saveSimulatorSettingsAction(raw: Partial<SimulatorSettings>) {
  await assertAdminSession()
  const settings = mergeSettings(raw as Record<string, unknown>)
  const supabase = await createClient()
  const { error } = await supabase
    .from('simulator_settings')
    .upsert({ id: 1, settings, updated_at: new Date().toISOString() }, { onConflict: 'id' })
  if (error) throw new Error(error.message)
  revalidatePath('/simulateur')
  revalidatePath('/admin/simulateur')
  return settings
}

export async function updateEstimationStatusAction(id: string, status: SimulatorEstimationStatus) {
  await assertAdminSession()
  if (!STATUSES.includes(status)) throw new Error('Statut invalide')
  const supabase = await createClient()
  const { error } = await supabase.from('simulator_estimations').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/simulateur')
  revalidatePath('/admin')
}

export async function deleteEstimationAction(id: string) {
  await assertAdminSession()
  const supabase = await createClient()
  const { error } = await supabase.from('simulator_estimations').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/simulateur')
}
