import { NextRequest, NextResponse } from 'next/server'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import type { AuthenticatorTransportFuture } from '@simplewebauthn/server'
import { checkCredentials, signState } from '@/lib/admin/auth'
import { getAdminSession } from '@/lib/admin/session'
import { getRpInfo, RP_NAME, WA_REG_COOKIE, WA_COOKIE_OPTIONS } from '@/lib/admin/webauthn'
import { listApprovedPasskeys } from '@/lib/admin/passkeys'

/** Étape 1 de l'enregistrement d'empreinte → options WebAuthn.
 *  Autorisé soit par le mot de passe (première connexion, résultat « pending »),
 *  soit par une session admin déjà ouverte (mode `self` → auto-validé). */
export async function POST(request: NextRequest) {
  const { email, password, self } = (await request.json().catch(() => ({}))) as {
    email?: string
    password?: string
    self?: boolean
  }

  const session = await getAdminSession()
  const selfMode = self === true && !!session
  if (!selfMode && (typeof password !== 'string' || !checkCredentials(password))) {
    return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 })
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

  const state = await signState({ challenge: options.challenge, email: email.toLowerCase(), approve: selfMode })
  const res = NextResponse.json(options)
  res.cookies.set(WA_REG_COOKIE, state, WA_COOKIE_OPTIONS)
  return res
}
