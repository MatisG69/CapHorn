'use server'

import { createServerClient } from '@supabase/ssr'
import { revalidatePath } from 'next/cache'
import { assertAdminSession } from '@/lib/admin/session'

/**
 * Réinitialise l'analytique web : supprime toutes les lignes de `page_views`.
 * Réservé à l'admin (session vérifiée) ; utilise la clé service_role pour
 * contourner la RLS (aucune policy DELETE publique sur la table).
 */
export async function resetAnalyticsAction(): Promise<{ ok: true }> {
  await assertAdminSession()

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    cookies: { getAll: () => [], setAll: () => {} },
  })

  // Filtre « id non nul » = toutes les lignes (Supabase impose un filtre sur delete).
  const { error } = await supabase.from('page_views').delete().not('id', 'is', null)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/analytics')
  return { ok: true }
}
