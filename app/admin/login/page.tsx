'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Fingerprint, Loader2 } from 'lucide-react'
import { startAuthentication } from '@simplewebauthn/browser'

/** Connexion à l'espace admin : empreinte digitale uniquement (WebAuthn). */
export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loginWithFingerprint() {
    setError(null)
    setLoading(true)
    try {
      const optRes = await fetch('/api/admin/webauthn/auth/options', { method: 'POST' })
      if (optRes.status === 404) {
        setError('Aucune empreinte validée sur ce site.')
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
        setError(data.error || 'Connexion refusée.')
      }
    } catch {
      setError('Empreinte non reconnue ou action annulée.')
    } finally {
      setLoading(false)
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
        <div className="admin-card text-center">
          <Fingerprint className="w-10 h-10 mx-auto text-[var(--color-gold-soft)]" strokeWidth={1.3} />
          <p className="text-sm text-[var(--color-cream-dim)] mt-4 leading-relaxed">
            Accès réservé, par empreinte digitale.
          </p>

          <button
            type="button"
            onClick={loginWithFingerprint}
            disabled={loading}
            className="btn-gold w-full justify-center mt-6"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Vérification…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Fingerprint className="w-4 h-4" />
                Se connecter avec l’empreinte
              </span>
            )}
          </button>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mt-4 text-left">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
