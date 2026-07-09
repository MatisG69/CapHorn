'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { RotateCcw, Loader2 } from 'lucide-react'
import { resetAnalyticsAction } from '@/app/admin/analytics/actions'

export default function ResetAnalyticsButton() {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setError(null)
    startTransition(async () => {
      try {
        await resetAnalyticsAction()
        setConfirming(false)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur lors de la réinitialisation')
      }
    })
  }

  if (confirming) {
    return (
      <div className="inline-flex items-center gap-2 flex-wrap">
        <span className="text-xs text-[var(--color-cream-mute)]">Supprimer toutes les données d’audience ?</span>
        <button
          onClick={reset}
          disabled={pending}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
          {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
          {pending ? 'Réinitialisation…' : 'Confirmer'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="text-xs px-2.5 py-2 text-[var(--color-cream-mute)] hover:text-[var(--color-cream)]"
        >
          Annuler
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-[var(--color-ink-line)] text-[var(--color-cream-dim)] hover:text-red-600 hover:border-red-200 transition-colors"
      title="Réinitialiser l’analytique (supprime toutes les vues enregistrées)"
    >
      <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser les analytics
    </button>
  )
}
