/**
 * ⚠️  DEV / PRE-PROD ONLY, Auth admin hardcodée.
 *
 * Identifiants en dur le temps que Guillaume choisisse ses creds définitifs.
 * À remplacer par Supabase Auth (ou autre IdP) avant mise en production.
 *
 * Mécanisme :
 *  1. La page login soumet le mot de passe au server action `signInAction`.
 *  2. Si match → on dépose un cookie HttpOnly signé HMAC-SHA256.
 *  3. Le middleware (proxy.ts) lit le cookie et autorise / redirige.
 *  4. Toute action serveur sensible appelle `assertAdminSession()`.
 *
 * Accès par mot de passe seul, défini via la variable d'environnement BOARD
 * (.env.local en dev, variables Vercel en prod). Repli sur ADMIN_PASSWORD si
 * BOARD absente. ADMIN_EMAIL sert uniquement d'identité interne de session.
 *
 * Note : ce fichier est compatible Edge runtime (utilise Web Crypto, pas
 * `next/headers`). Les helpers cookie sont dans ./session.ts.
 */

export const ADMIN_EMAIL = 'test@test.com'
export const ADMIN_PASSWORD = 'Test123'

export const ADMIN_COOKIE_NAME = 'caphorn_admin_session'
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 jours

// Secret HMAC, fixe le temps du dev hardcodé. À sortir en env quand l'auth
// passera en prod (ne sera plus nécessaire à ce moment-là).
const SESSION_SECRET = 'caphorn-dev-session-secret-2026-replace-before-prod'

const enc = new TextEncoder()

let cachedKey: CryptoKey | null = null
async function getKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey
  cachedKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
  return cachedKey
}

function bufferToHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let hex = ''
  for (const b of bytes) hex += b.toString(16).padStart(2, '0')
  return hex
}

function hexToBuffer(hex: string): ArrayBuffer {
  if (hex.length % 2 !== 0) return new ArrayBuffer(0)
  const out = new Uint8Array(hex.length / 2)
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return out.buffer
}

function base64UrlEncode(input: string): string {
  // btoa is available in Edge + Node 20+
  const b64 = typeof btoa === 'function'
    ? btoa(input)
    : Buffer.from(input, 'utf8').toString('base64')
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(input: string): string {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(input.length + ((4 - (input.length % 4)) % 4), '=')
  if (typeof atob === 'function') return atob(b64)
  return Buffer.from(b64, 'base64').toString('utf8')
}

async function sign(payload: string): Promise<string> {
  const key = await getKey()
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  return bufferToHex(sig)
}

async function verifySignature(payload: string, signature: string): Promise<boolean> {
  const key = await getKey()
  const sigBuf = hexToBuffer(signature)
  if (sigBuf.byteLength === 0) return false
  return crypto.subtle.verify('HMAC', key, sigBuf, enc.encode(payload))
}

export interface AdminSession {
  email: string
  issuedAt: number
}

export async function buildSessionToken(email: string): Promise<string> {
  const payload = JSON.stringify({ email, iat: Date.now() })
  const encoded = base64UrlEncode(payload)
  const sig = await sign(encoded)
  return `${encoded}.${sig}`
}

export async function parseSessionToken(token: string | undefined): Promise<AdminSession | null> {
  if (!token) return null
  const dot = token.indexOf('.')
  if (dot === -1) return null
  const encoded = token.slice(0, dot)
  const signature = token.slice(dot + 1)
  if (!(await verifySignature(encoded, signature))) return null
  try {
    const decoded = base64UrlDecode(encoded)
    const data = JSON.parse(decoded) as { email?: string; iat?: number }
    if (typeof data.email !== 'string' || typeof data.iat !== 'number') return null
    if (Date.now() - data.iat > COOKIE_MAX_AGE * 1000) return null
    return { email: data.email, issuedAt: data.iat }
  } catch {
    return null
  }
}

/** Jeton court signé (HMAC) pour transporter un état WebAuthn (challenge, email)
 *  entre deux requêtes via un cookie HttpOnly. `iat` ajouté automatiquement. */
export async function signState(obj: Record<string, unknown>): Promise<string> {
  const encoded = base64UrlEncode(JSON.stringify({ ...obj, iat: Date.now() }))
  const sig = await sign(encoded)
  return `${encoded}.${sig}`
}

export async function readState<T = Record<string, unknown>>(
  token: string | undefined,
  maxAgeMs = 5 * 60 * 1000,
): Promise<T | null> {
  if (!token) return null
  const dot = token.indexOf('.')
  if (dot === -1) return null
  const encoded = token.slice(0, dot)
  const signature = token.slice(dot + 1)
  if (!(await verifySignature(encoded, signature))) return null
  try {
    const data = JSON.parse(base64UrlDecode(encoded)) as { iat?: number }
    if (typeof data.iat !== 'number' || Date.now() - data.iat > maxAgeMs) return null
    return data as T
  } catch {
    return null
  }
}

export function checkCredentials(password: string): boolean {
  // Accès par mot de passe seul : variable d'environnement BOARD si définie,
  // sinon repli sur ADMIN_PASSWORD (dev).
  const expectedPassword = process.env.BOARD?.trim() || ADMIN_PASSWORD
  return password === expectedPassword
}

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: COOKIE_MAX_AGE,
  secure: process.env.NODE_ENV === 'production',
}
