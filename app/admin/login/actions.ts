'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_OPTIONS,
  ADMIN_EMAIL,
  buildSessionToken,
  checkCredentials,
} from '@/lib/admin/auth'

export interface SignInResult {
  ok: boolean
  error?: string
}

export async function signInAction(_prev: SignInResult | null, formData: FormData): Promise<SignInResult> {
  const password = String(formData.get('password') ?? '')

  if (!password) {
    return { ok: false, error: 'Mot de passe requis.' }
  }

  if (!checkCredentials(password)) {
    return { ok: false, error: 'Mot de passe incorrect.' }
  }

  const token = await buildSessionToken(ADMIN_EMAIL)
  const store = await cookies()
  store.set(ADMIN_COOKIE_NAME, token, ADMIN_COOKIE_OPTIONS)

  return { ok: true }
}

export async function signOutAction() {
  const store = await cookies()
  store.delete(ADMIN_COOKIE_NAME)
  redirect('/admin/login')
}
