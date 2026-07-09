'use client'

import { useState, useTransition } from 'react'
import { RotateCcw, Trash2, Loader2 } from 'lucide-react'
import { restorePostAction, permanentlyDeletePostAction } from '@/app/admin/blog/actions'

export default function TrashPostButtons({ postId, title }: { postId: string; title: string }) {
  const [confirming, setConfirming] = useState(false)
  const [pending, startTransition] = useTransition()

  const restore = () => {
    startTransition(async () => {
      try {
        await restorePostAction(postId)
      } catch {
        /* no-op */
      }
    })
  }

  const purge = () => {
    startTransition(async () => {
      try {
        await permanentlyDeletePostAction(postId)
      } catch {
        setConfirming(false)
      }
    })
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="text-xs text-[var(--color-cream-mute)] mr-1">Définitivement ?</span>
        <button
          onClick={purge}
          disabled={pending}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors inline-flex items-center gap-1.5"
        >
          {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          Supprimer
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="text-xs px-2.5 py-1.5 text-[var(--color-cream-mute)] hover:text-[var(--color-cream)]"
        >
          Annuler
        </button>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        onClick={restore}
        disabled={pending}
        title={`Restaurer « ${title} »`}
        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[var(--color-ink-line)] text-[var(--color-cream-dim)] hover:text-emerald-600 hover:border-emerald-300 transition-colors"
      >
        {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
        Restaurer
      </button>
      <button
        onClick={() => setConfirming(true)}
        title={`Supprimer définitivement « ${title} »`}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--color-ink-line)] text-[var(--color-cream-mute)] hover:text-red-600 hover:border-red-200 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </span>
  )
}
