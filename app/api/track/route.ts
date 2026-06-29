import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { sectionFromPath, deviceFromUA } from '@/lib/analytics/utils'

/** Enregistre une vue de page (analytique web). Léger, résilient, jamais bloquant. */
export async function POST(request: NextRequest) {
  try {
    const { path, visitor_id } = (await request.json()) as { path?: string; visitor_id?: string }
    if (!path || typeof path !== 'string') return NextResponse.json({ ok: false }, { status: 400 })

    // On ne traque pas l'espace admin
    if (path.startsWith('/admin')) return NextResponse.json({ ok: true })

    const ua = request.headers.get('user-agent') ?? ''
    const country =
      request.headers.get('x-vercel-ip-country') ??
      request.headers.get('cf-ipcountry') ??
      request.headers.get('x-country') ??
      'XX'

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } },
    )

    await supabase.from('page_views').insert({
      path: path.slice(0, 300),
      section: sectionFromPath(path),
      device: deviceFromUA(ua),
      country: country.toUpperCase().slice(0, 2),
      visitor_id: (visitor_id ?? '').slice(0, 64) || null,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
