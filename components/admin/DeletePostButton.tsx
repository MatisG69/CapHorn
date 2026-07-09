'use client'

import { useState, useTransition } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { deletePostAction } from '@/app/admin/blog/actions'

export default function DeletePostButton({ postId, title }: { postId: string; title: string }) {
  const [confirming, setConfirming] = useState(false)
  const [pending, startTransition] = useTransition()

  const remove = () => {
    startTransition(async () => {
      try {
        await deletePostAction(postId)
      } catch {
        setConfirming(false)
      }
    })
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <button
          onClick={remove}
          disabled={pending}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors inline-flex items-center gap-1.5"
        >
          {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          Confirmer
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
    <button
      onClick={() => setConfirming(true)}
      title={`Mettre « ${title} » à la corbeille`}
      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--color-ink-line)] text-[var(--color-cream-mute)] hover:text-red-600 hover:border-red-200 transition-colors"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  )
}
