'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_OPTIONS,
  buildSessionToken,
  checkCredentials,
} from '@/lib/admin/auth'

export interface SignInResult {
  ok: boolean
  error?: string
}

export async function signInAction(_prev: SignInResult | null, formData: FormData): Promise<SignInResult> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { ok: false, error: 'Email et mot de passe requis.' }
  }

  if (!checkCredentials(email, password)) {
    return { ok: false, error: 'Identifiants incorrects.' }
  }

  const token = await buildSessionToken(email.trim().toLowerCase())
  const store = await cookies()
  store.set(ADMIN_COOKIE_NAME, token, ADMIN_COOKIE_OPTIONS)

  return { ok: true }
}

export async function signOutAction() {
  const store = await cookies()
  store.delete(ADMIN_COOKIE_NAME)
  redirect('/admin/login')
}
