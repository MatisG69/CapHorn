'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE_NAME } from '@/lib/admin/auth'

/**
 * La connexion se fait exclusivement par empreinte digitale (WebAuthn) :
 * voir `app/api/admin/webauthn/auth/*`. Aucune action de connexion par mot de
 * passe n'existe plus ici.
 */
export async function signOutAction() {
  const store = await cookies()
  store.delete(ADMIN_COOKIE_NAME)
  redirect('/admin/login')
}
