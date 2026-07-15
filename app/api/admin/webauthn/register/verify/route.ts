import { NextRequest, NextResponse } from 'next/server'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { readState } from '@/lib/admin/auth'
import { getRpInfo, WA_REG_COOKIE, WA_COOKIE_OPTIONS, toB64url } from '@/lib/admin/webauthn'
import { insertPasskey } from '@/lib/admin/passkeys'

/** Étape 2 : vérifie l'empreinte créée par le navigateur et l'enregistre (statut « pending »). */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { response?: unknown }
  const response = (body?.response ?? body) as Parameters<typeof verifyRegistrationResponse>[0]['response']

  const state = await readState<{ challenge: string; email: string; approve?: boolean }>(request.cookies.get(WA_REG_COOKIE)?.value)
  if (!state) {
    return NextResponse.json({ error: 'Session expirée, recommencez.' }, { status: 400 })
  }

  const { rpID, origin } = getRpInfo(request)
  let verification
  try {
    verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: state.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
    })
  } catch {
    return NextResponse.json({ error: 'Vérification impossible.' }, { status: 400 })
  }

  if (!verification.verified || !verification.registrationInfo) {
    return NextResponse.json({ error: 'Empreinte non vérifiée.' }, { status: 400 })
  }

  const { credential } = verification.registrationInfo
  try {
    await insertPasskey(
      {
        email: state.email,
        label: `Empreinte du ${new Date().toLocaleDateString('fr-FR')}`,
        credential_id: credential.id,
        public_key: toB64url(credential.publicKey),
        counter: credential.counter ?? 0,
        transports: credential.transports?.join(',') ?? null,
      },
      state.approve ? 'approved' : 'pending',
    )
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Enregistrement impossible.' },
      { status: 500 },
    )
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(WA_REG_COOKIE, '', { ...WA_COOKIE_OPTIONS, maxAge: 0 })
  return res
}
