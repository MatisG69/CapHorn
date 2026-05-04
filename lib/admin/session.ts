// Helpers cookies — Node runtime (server components + server actions).
// Le middleware utilise directement parseSessionToken depuis ./auth.ts.

import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME, parseSessionToken, type AdminSession } from './auth'

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies()
  const token = store.get(ADMIN_COOKIE_NAME)?.value
  return parseSessionToken(token)
}

export async function assertAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session) throw new Error('Non authentifié')
  return session
}
