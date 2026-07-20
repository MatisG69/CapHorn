import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Client Supabase sans cookies, réservé aux lectures publiques (blog, sitemap).
 *
 * Le client de `./server` appelle `cookies()` : cette API de requête rend
 * dynamique toute page qui l'utilise, ce qui neutralise `revalidate` et
 * interdit la mise en cache. Les contenus publics n'ont besoin d'aucune
 * session — la clé anonyme et les politiques RLS suffisent — donc on utilise
 * ici un client neutre qui laisse le rendu statique et l'ISR opérer.
 *
 * Ne jamais l'employer pour des données dépendant de l'utilisateur connecté.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}
