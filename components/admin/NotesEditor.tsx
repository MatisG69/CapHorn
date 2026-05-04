'use client'

import { useState, useTransition } from 'react'
import { updateLeadNotesAction } from '@/app/admin/leads/[id]/actions'
import { Save, Pencil, X } from 'lucide-react'

interface Props {
  leadId: string
  initial: string | null
}

export default function NotesEditor({ leadId, initial }: Props) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(initial ?? '')
  const [saved, setSaved] = useState(initial ?? '')
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const cancel = () => {
    setValue(saved)
    setEditing(false)
    setError(null)
  }

  const submit = () => {
    setError(null)
    startTransition(async () => {
      try {
        await updateLeadNotesAction(leadId, value)
        setSaved(value)
        setEditing(false)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur de sauvegarde')
      }
    })
  }

  return (
    <div className="admin-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="eyebrow eyebrow--single">Notes commerciales</h2>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.18em] text-[var(--color-gold-soft)] hover:text-[var(--color-gold)] transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" strokeWidth={1.8} />
            {saved ? 'Modifier' : 'Ajouter'}
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={6}
            placeholder="Échange téléphonique, prochaine action, contexte client…"
            className="tunnel-input w-full resize-y leading-relaxed text-sm"
            maxLength={5000}
            disabled={pending}
            autoFocus
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-[var(--color-cream-mute)] font-mono">
              {value.length} / 5000
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={cancel}
                disabled={pending}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[var(--color-ink-line)] text-[var(--color-cream-dim)] hover:text-[var(--color-cream)] hover:border-[var(--color-gold-deep)] transition-colors"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2} />
                Annuler
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={pending}
                className="btn-gold text-xs px-3 py-1.5"
              >
                <Save className="w-3.5 h-3.5" strokeWidth={2} />
                {pending ? 'Sauvegarde…' : 'Sauvegarder'}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-xs text-red-300 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>
      ) : saved ? (
        <p className="text-sm text-[var(--color-cream)] whitespace-pre-wrap leading-relaxed">
          {saved}
        </p>
      ) : (
        <p className="text-sm text-[var(--color-cream-mute)] italic">
          Aucune note pour ce lead. Ajoutez le contexte du dernier échange ou la prochaine action.
        </p>
      )}
    </div>
  )
}
