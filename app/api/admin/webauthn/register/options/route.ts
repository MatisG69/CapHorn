import { NextRequest, NextResponse } from 'next/server'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import type { AuthenticatorTransportFuture } from '@simplewebauthn/server'
import { signState } from '@/lib/admin/auth'
import { getAdminSession } from '@/lib/admin/session'
import { getRpInfo, RP_NAME, WA_REG_COOKIE, WA_COOKIE_OPTIONS } from '@/lib/admin/webauthn'
import { listApprovedPasskeys } from '@/lib/admin/passkeys'

/** Étape 1 de l'enregistrement d'empreinte → options WebAuthn.
 *  Réservé à un admin déjà connecté (par empreinte) : une nouvelle empreinte
 *  ne peut être ajoutée que depuis Paramètres, et elle est validée d'office. */
export async function POST(request: NextRequest) {
  const { email } = (await request.json().catch(() => ({}))) as { email?: string }

  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 })
  }

  const { rpID } = getRpInfo(request)
  const approved = await listApprovedPasskeys()

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID,
    userName: email,
    userDisplayName: email,
    userID: new TextEncoder().encode(email.toLowerCase()),
    attestationType: 'none',
    authenticatorSelection: {
      authenticatorAttachment: 'platform', // Touch ID / capteur d'empreinte de l'appareil
      userVerification: 'required',
      residentKey: 'preferred',
    },
    excludeCredentials: approved.map((p) => ({
      id: p.credential_id,
      transports: p.transports ? (p.transports.split(',') as AuthenticatorTransportFuture[]) : undefined,
    })),
  })

  const state = await signState({ challenge: options.challenge, email: email.toLowerCase(), approve: true })
  const res = NextResponse.json(options)
  res.cookies.set(WA_REG_COOKIE, state, WA_COOKIE_OPTIONS)
  return res
}
