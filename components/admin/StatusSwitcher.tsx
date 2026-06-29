'use client'

import { useState, useTransition } from 'react'
import type { LeadStatus } from '@/lib/types'
import { LEAD_STATUS_BG, LEAD_STATUS_LABELS } from '@/lib/admin/labels'
import { updateLeadStatusAction } from '@/app/admin/leads/[id]/actions'
import { Check, ChevronDown } from 'lucide-react'

const STATUSES: LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'won',
  'lost',
  'archived',
]

interface Props {
  leadId: string
  current: LeadStatus
}

export default function StatusSwitcher({ leadId, current }: Props) {
  const [open, setOpen] = useState(false)
  const [optimistic, setOptimistic] = useState<LeadStatus>(current)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const choose = (next: LeadStatus) => {
    if (next === optimistic) {
      setOpen(false)
      return
    }
    setError(null)
    setOptimistic(next)
    setOpen(false)
    startTransition(async () => {
      try {
        await updateLeadStatusAction(leadId, next)
      } catch (e) {
        setOptimistic(current)
        setError(e instanceof Error ? e.message : 'Erreur de mise à jour')
      }
    })
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-all ${LEAD_STATUS_BG[optimistic]} ${pending ? 'opacity-60 cursor-wait' : 'hover:brightness-110'}`}
      >
        <span>{LEAD_STATUS_LABELS[optimistic]}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70" strokeWidth={2} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden />
          <div
            role="listbox"
            className="absolute z-40 right-0 mt-2 w-56 rounded-xl border border-[var(--color-ink-line)] bg-[var(--color-ink-raised)] shadow-2xl overflow-hidden"
          >
            {STATUSES.map((s) => {
              const active = s === optimistic
              return (
                <button
                  key={s}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => choose(s)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-[rgba(201,168,76,0.06)] transition-colors"
                >
                  <span
                    className={`text-xs px-2 py-0.5 rounded border ${LEAD_STATUS_BG[s]}`}
                  >
                    {LEAD_STATUS_LABELS[s]}
                  </span>
                  <span className="ml-auto">
                    {active && <Check className="w-3.5 h-3.5 text-[var(--color-gold)]" strokeWidth={2.4} />}
                  </span>
                </button>
              )
            })}
          </div>
        </>
      )}

      {error && (
        <p className="absolute top-full mt-1 right-0 text-[11px] text-red-600 whitespace-nowrap">
          {error}
        </p>
      )}
    </div>
  )
}
