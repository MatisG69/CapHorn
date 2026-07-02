import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getAdminSession } from '@/lib/admin/session'

/**
 * Téléchargement d'une pièce jointe de lead — réservé à l'admin.
 *
 * Le bucket `lead-documents` est PRIVÉ. On génère une URL signée à durée
 * limitée puis on redirige dessus. L'accès est protégé par la session admin.
 *
 * Utilise la clé service_role si disponible (contourne la RLS), sinon retombe
 * sur la clé anon (nécessite alors une policy SELECT sur le bucket).
 */
export async function GET(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const path = request.nextUrl.searchParams.get('path')
  if (!path || typeof path !== 'string' || path.includes('..')) {
    return NextResponse.json({ error: 'Chemin invalide' }, { status: 400 })
  }

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    cookies: { getAll: () => [], setAll: () => {} },
  })

  const { data, error } = await supabase.storage
    .from('lead-documents')
    .createSignedUrl(path, 300) // 5 minutes

  if (error || !data?.signedUrl) {
    console.error('[lead-document] signed url error:', error?.message)
    return NextResponse.json({ error: 'Document introuvable' }, { status: 404 })
  }

  return NextResponse.redirect(data.signedUrl)
}
