import type { NextRequest } from 'next/server'

/** Nom affiché à l'utilisateur lors de l'enregistrement de l'empreinte. */
export const RP_NAME = 'Cap Horn Conseils — Admin'

export const WA_REG_COOKIE = 'wa_reg'
export const WA_AUTH_COOKIE = 'wa_auth'

export const WA_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 300, // 5 min, le temps de faire l'empreinte
  secure: process.env.NODE_ENV === 'production',
}

/** Déduit le Relying Party ID (domaine) et l'origine attendue depuis la requête. */
export function getRpInfo(request: NextRequest): { rpID: string; origin: string } {
  const origin =
    request.headers.get('origin') ??
    `${request.headers.get('x-forwarded-proto') ?? 'https'}://${request.headers.get('host') ?? 'localhost'}`
  let rpID = 'localhost'
  try {
    rpID = new URL(origin).hostname
  } catch {
    /* garde localhost */
  }
  return { rpID, origin }
}

export function toB64url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('base64url')
}

export function fromB64url(str: string): Uint8Array<ArrayBuffer> {
  const buf = Buffer.from(str, 'base64url')
  const out = new Uint8Array(new ArrayBuffer(buf.byteLength))
  out.set(buf)
  return out
}
