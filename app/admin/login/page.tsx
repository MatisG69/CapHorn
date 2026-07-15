'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Fingerprint, Loader2 } from 'lucide-react'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'
import { signInAction, type SignInResult } from './actions'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [state, formAction, pending] = useActionState<SignInResult | null, FormData>(signInAction, null)

  // Connexion par empreinte
  const [bioLoading, setBioLoading] = useState(false)
  const [bioError, setBioError] = useState<string | null>(null)

  // Première connexion : enregistrement d'empreinte
  const [regOpen, setRegOpen] = useState(false)
  const [regEmail, setRegEmail] = useState('')
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState<string | null>(null)
  const [regDone, setRegDone] = useState(false)

  useEffect(() => {
    if (state?.ok) router.replace('/admin')
  }, [state, router])

  async function loginWithFingerprint() {
    setBioError(null)
    setBioLoading(true)
    try {
      const optRes = await fetch('/api/admin/webauthn/auth/options', { method: 'POST' })
      if (optRes.status === 404) {
        setBioError('Aucune empreinte validée pour le moment.')
        return
      }
      if (!optRes.ok) throw new Error('options')
      const optionsJSON = await optRes.json()
      const assertion = await startAuthentication({ optionsJSON })
      const verifyRes = await fetch('/api/admin/webauthn/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: assertion }),
      })
      const data = (await verifyRes.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (verifyRes.ok && data.ok) {
        router.replace('/admin')
      } else {
        setBioError(data.error || 'Connexion par empreinte échouée.')
      }
    } catch {
      setBioError('Empreinte non reconnue ou action annulée.')
    } finally {
      setBioLoading(false)
    }
  }

  async function registerFingerprint() {
    setRegError(null)
    setRegDone(false)
    if (!password.trim()) {
      setRegError('Entrez d’abord le mot de passe ci-dessus.')
      return
    }
    setRegLoading(true)
    try {
      const optRes = await fetch('/api/admin/webauthn/register/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regEmail, password }),
      })
      const opt = (await optRes.json().catch(() => ({}))) as { error?: string; challenge?: string }
      if (!optRes.ok) {
        setRegError(opt.error || 'Enregistrement impossible.')
        return
      }
      const attestation = await startRegistration({ optionsJSON: opt as never })
      const verifyRes = await fetch('/api/admin/webauthn/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: attestation }),
      })
      const data = (await verifyRes.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (verifyRes.ok && data.ok) {
        setRegDone(true)
      } else {
        setRegError(data.error || 'Enregistrement impossible.')
      }
    } catch {
      setRegError('Empreinte non enregistrée (action annulée ?).')
    } finally {
      setRegLoading(false)
    }
  }

  return (
    <div className="landing-root min-h-dvh flex items-center justify-center px-6">
      <div className="w-full max-w-sm relative z-[1]">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(160deg,#1c2432,#0b0d11)',
              border: '1px solid rgba(201, 168, 76, 0.35)',
              boxShadow: '0 18px 40px -8px rgba(12,14,18,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt="Cap Horn Conseils" className="w-9 h-9 object-contain" />
          </div>
          <div className="text-center">
            <h1 className="display-serif text-2xl text-[var(--color-cream)] tracking-wide">Cap Horn Conseils</h1>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-cream-mute)] mt-2 font-mono">
              Espace administration
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="admin-card">
          {/* Empreinte digitale */}
          <button
            type="button"
            onClick={loginWithFingerprint}
            disabled={bioLoading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-gold-deep)] text-[var(--color-cream)] hover:border-[var(--color-gold)] hover:bg-[rgba(201,168,76,0.06)] transition-colors py-3 text-sm font-medium"
          >
            {bioLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4 text-[var(--color-gold-soft)]" />}
            Se connecter avec l’empreinte
          </button>
          {bioError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mt-3">{bioError}</p>
          )}

          {/* Séparateur */}
          <div className="flex items-center gap-3 my-5">
            <span className="h-px flex-1 bg-[var(--color-ink-line)]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-cream-mute)]">ou mot de passe</span>
            <span className="h-px flex-1 bg-[var(--color-ink-line)]" />
          </div>

          {/* Mot de passe */}
          <form action={formAction} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)]">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="tunnel-input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-cream-mute)] hover:text-[var(--color-gold-soft)] transition-colors"
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {state?.error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">{state.error}</p>
            )}

            <button type="submit" className="btn-gold w-full justify-center mt-2" disabled={pending}>
              {pending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[var(--color-ink)]/30 border-t-[var(--color-ink)] rounded-full animate-spin" />
                  Connexion…
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Première connexion : enregistrement d'empreinte */}
          <div className="mt-5 pt-5 border-t border-[var(--color-ink-line)]">
            {!regOpen ? (
              <button
                type="button"
                onClick={() => setRegOpen(true)}
                className="text-xs text-[var(--color-cream-mute)] hover:text-[var(--color-gold-soft)] transition-colors"
              >
                Première connexion ? Enregistrer votre empreinte →
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-[11px] text-[var(--color-cream-mute)] leading-relaxed">
                  Saisissez le mot de passe ci-dessus, votre email, puis validez avec votre empreinte.
                  La demande devra être validée par l’administrateur avant activation.
                </p>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  autoComplete="email"
                  className="tunnel-input w-full text-sm"
                />
                {regError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">{regError}</p>
                )}
                {regDone ? (
                  <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
                    Empreinte enregistrée ! En attente de validation par l’administrateur.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={registerFingerprint}
                    disabled={regLoading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-ink-raised)] border border-[var(--color-ink-line)] text-[var(--color-cream)] hover:border-[var(--color-gold-deep)] transition-colors py-2.5 text-sm font-medium"
                  >
                    {regLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4 text-[var(--color-gold-soft)]" />}
                    Enregistrer mon empreinte
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
