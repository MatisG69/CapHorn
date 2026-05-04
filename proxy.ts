import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE_NAME, parseSessionToken } from '@/lib/admin/auth'

// Auth admin hardcodée pour l'instant — voir lib/admin/auth.ts.
// On ne valide ici que la signature/présence du cookie ; la vérité reste serveur.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  const session = await parseSessionToken(token)

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!session) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  if (pathname === '/admin/login' && session) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
