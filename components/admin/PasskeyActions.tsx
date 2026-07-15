'use client'

import { useState, useTransition } from 'react'
import { Check, Trash2, Loader2 } from 'lucide-react'
import { approvePasskeyAction, deletePasskeyAction } from '@/app/admin/parametres/actions'

export default function PasskeyActions({ id, status }: { id: string; status: 'pending' | 'approved' }) {
  const [pending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)

  const approve = () => startTransition(async () => { await approvePasskeyAction(id).catch(() => {}) })
  const remove = () => startTransition(async () => { await deletePasskeyAction(id).catch(() => setConfirming(false)) })

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <button onClick={remove} disabled={pending} className="text-xs px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors inline-flex items-center gap-1.5">
          {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          {status === 'approved' ? 'Révoquer' : 'Refuser'}
        </button>
        <button onClick={() => setConfirming(false)} disabled={pending} className="text-xs px-2 py-1.5 text-[var(--color-cream-mute)] hover:text-[var(--color-cream)]">Annuler</button>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-2">
      {status === 'pending' && (
        <button onClick={approve} disabled={pending} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors">
          {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Accepter
        </button>
      )}
      <button
        onClick={() => setConfirming(true)}
        title={status === 'approved' ? 'Révoquer cette empreinte' : 'Refuser cette demande'}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--color-ink-line)] text-[var(--color-cream-mute)] hover:text-red-600 hover:border-red-200 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </span>
  )
}
