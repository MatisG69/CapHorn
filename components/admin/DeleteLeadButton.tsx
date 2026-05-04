'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteLeadAction } from '@/app/admin/leads/[id]/actions'

interface Props {
  leadId: string
}

export default function DeleteLeadButton({ leadId }: Props) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleDelete = () => {
    setError(null)
    startTransition(async () => {
      try {
        await deleteLeadAction(leadId)
        router.push('/admin/leads')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur suppression')
      }
    })
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[var(--color-ink-line)] text-[var(--color-cream-dim)] hover:text-red-300 hover:border-red-900/60 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
        Supprimer
      </button>
    )
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-xs text-red-200">Confirmer ?</span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="text-xs px-3 py-1.5 rounded-lg bg-red-900/40 text-red-100 border border-red-800/60 hover:bg-red-900/60 transition-colors"
      >
        {pending ? 'Suppression…' : 'Oui, supprimer'}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        disabled={pending}
        className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-ink-line)] text-[var(--color-cream-dim)] hover:text-[var(--color-cream)]"
      >
        Annuler
      </button>
      {error && <span className="text-xs text-red-300 ml-2">{error}</span>}
    </div>
  )
}
