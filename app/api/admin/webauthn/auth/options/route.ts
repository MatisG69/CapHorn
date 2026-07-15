import { NextRequest, NextResponse } from 'next/server'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import type { AuthenticatorTransportFuture } from '@simplewebauthn/server'
import { signState } from '@/lib/admin/auth'
import { getRpInfo, WA_AUTH_COOKIE, WA_COOKIE_OPTIONS } from '@/lib/admin/webauthn'
import { listApprovedPasskeys } from '@/lib/admin/passkeys'

/** Connexion par empreinte, étape 1 : options d'authentification WebAuthn. */
export async function POST(request: NextRequest) {
  const approved = await listApprovedPasskeys()
  if (approved.length === 0) {
    return NextResponse.json({ error: 'no-credentials' }, { status: 404 })
  }

  const { rpID } = getRpInfo(request)
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: 'required',
    allowCredentials: approved.map((p) => ({
      id: p.credential_id,
      transports: p.transports ? (p.transports.split(',') as AuthenticatorTransportFuture[]) : undefined,
    })),
  })

  const state = await signState({ challenge: options.challenge })
  const res = NextResponse.json(options)
  res.cookies.set(WA_AUTH_COOKIE, state, WA_COOKIE_OPTIONS)
  return res
}
