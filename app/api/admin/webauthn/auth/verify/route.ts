import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import type { AuthenticatorTransportFuture } from '@simplewebauthn/server'
import {
  readState,
  buildSessionToken,
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_OPTIONS,
} from '@/lib/admin/auth'
import { getRpInfo, WA_AUTH_COOKIE, WA_COOKIE_OPTIONS, fromB64url } from '@/lib/admin/webauthn'
import { getPasskeyByCredentialId, setPasskeyCounter } from '@/lib/admin/passkeys'

/** Connexion par empreinte, étape 2 : vérifie l'empreinte et ouvre la session. */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { response?: { id?: string } }
  const response = (body?.response ?? body) as Parameters<typeof verifyAuthenticationResponse>[0]['response']

  const state = await readState<{ challenge: string }>(request.cookies.get(WA_AUTH_COOKIE)?.value)
  if (!state) {
    return NextResponse.json({ error: 'Session expirée, réessayez.' }, { status: 400 })
  }

  const credentialId = typeof response?.id === 'string' ? response.id : ''
  const passkey = await getPasskeyByCredentialId(credentialId)
  if (!passkey || passkey.status !== 'approved') {
    return NextResponse.json({ error: 'Empreinte non reconnue ou non validée.' }, { status: 401 })
  }

  const { rpID, origin } = getRpInfo(request)
  let verification
  try {
    verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: state.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
      credential: {
        id: passkey.credential_id,
        publicKey: fromB64url(passkey.public_key),
        counter: Number(passkey.counter),
        transports: passkey.transports
          ? (passkey.transports.split(',') as AuthenticatorTransportFuture[])
          : undefined,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Vérification impossible.' }, { status: 401 })
  }

  if (!verification.verified) {
    return NextResponse.json({ error: 'Empreinte invalide.' }, { status: 401 })
  }

  await setPasskeyCounter(passkey.credential_id, verification.authenticationInfo.newCounter)

  const token = await buildSessionToken(passkey.email)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE_NAME, token, ADMIN_COOKIE_OPTIONS)
  res.cookies.set(WA_AUTH_COOKIE, '', { ...WA_COOKIE_OPTIONS, maxAge: 0 })
  return res
}
