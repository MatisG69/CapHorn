'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Fingerprint, Loader2 } from 'lucide-react'
import { startRegistration } from '@simplewebauthn/browser'

/** Enregistre une empreinte sur l'appareil courant, depuis l'admin connecté
 *  (auto-validée, pas besoin de passer par la file d'attente). */
export default function AddOwnPasskey() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function add() {
    setError(null)
    setDone(false)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Adresse email invalide.')
      return
    }
    setLoading(true)
    try {
      const optRes = await fetch('/api/admin/webauthn/register/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const opt = (await optRes.json().catch(() => ({}))) as { error?: string }
      if (!optRes.ok) {
        setError(opt.error || 'Enregistrement impossible.')
        return
      }
      const attestation = await startRegistration({ optionsJSON: opt as never })
      const vr = await fetch('/api/admin/webauthn/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: attestation }),
      })
      const data = (await vr.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (vr.ok && data.ok) {
        setDone(true)
        setEmail('')
        router.refresh()
      } else {
        setError(data.error || 'Enregistrement impossible.')
      }
    } catch {
      setError('Empreinte non enregistrée (action annulée ?).')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-card space-y-3">
      <h2 className="eyebrow eyebrow--single flex items-center gap-2">
        <Fingerprint className="w-3.5 h-3.5" /> Ajouter mon empreinte (cet appareil)
      </h2>
      <p className="text-xs text-[var(--color-cream-mute)] leading-relaxed">
        Enregistrez votre propre empreinte sur cet appareil. Étant déjà connecté, elle est
        validée automatiquement.
      </p>
      <div className="flex flex-wrap items-center gap-2.5">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.fr"
          autoComplete="email"
          className="tunnel-input text-sm flex-1 min-w-[200px]"
        />
        <button
          type="button"
          onClick={add}
          disabled={loading}
          className="btn-gold text-xs px-4 py-2.5"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Fingerprint className="w-3.5 h-3.5" />}
          Enregistrer mon empreinte
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {done && <p className="text-xs text-emerald-700">Empreinte ajoutée et validée.</p>}
    </div>
  )
}
