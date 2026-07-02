'use client'

import { useState, useTransition } from 'react'
import { Mail, Phone, Trash2, Loader2, TrendingDown } from 'lucide-react'
import { updateEstimationStatusAction, deleteEstimationAction } from '@/app/admin/simulateur/actions'
import { SIMULATOR_STATUS_LABELS, type SimulatorEstimation, type SimulatorEstimationStatus } from '@/lib/types'
import { fmtEur } from '@/lib/simulateur/estimate'
import { formatRelativeDate } from '@/lib/admin/labels'

const STATUS_ORDER: SimulatorEstimationStatus[] = ['new', 'contacted', 'converted', 'archived']

const STATUS_BG: Record<SimulatorEstimationStatus, string> = {
  new: 'border-amber-300 text-amber-700 bg-amber-50',
  contacted: 'border-blue-300 text-blue-700 bg-blue-50',
  converted: 'border-emerald-300 text-emerald-700 bg-emerald-50',
  archived: 'border-[var(--color-ink-line)] text-[var(--color-cream-mute)]',
}

export default function EstimationCard({ est }: { est: SimulatorEstimation }) {
  const [status, setStatus] = useState<SimulatorEstimationStatus>(est.status)
  const [pending, start] = useTransition()
  const [confirm, setConfirm] = useState(false)

  const changeStatus = (s: SimulatorEstimationStatus) => {
    setStatus(s)
    start(async () => { await updateEstimationStatusAction(est.id, s) })
  }
  const remove = () => start(async () => { await deleteEstimationAction(est.id) })

  return (
    <div className="admin-card">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base font-medium text-[var(--color-cream)]">{est.first_name}</h3>
            <span className={`text-[10px] font-mono uppercase tracking-[0.16em] px-2 py-0.5 rounded border ${STATUS_BG[status]}`}>
              {SIMULATOR_STATUS_LABELS[status]}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <a href={`mailto:${est.email}`} className="inline-flex items-center gap-1.5 text-sm text-[var(--color-cream-dim)] hover:text-[var(--color-gold-soft)]">
              <Mail className="w-3.5 h-3.5" /> {est.email}
            </a>
            {est.phone && (
              <a href={`tel:${est.phone}`} className="inline-flex items-center gap-1.5 text-sm text-[var(--color-cream-dim)] hover:text-[var(--color-gold-soft)]">
                <Phone className="w-3.5 h-3.5" /> {est.phone}
              </a>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="inline-flex items-center gap-1.5 text-lg font-semibold text-[var(--color-gold-soft)] font-mono tabular-nums">
            <TrendingDown className="w-4 h-4" />
            {fmtEur(est.monthly_saving)}<span className="text-xs text-[var(--color-cream-mute)] font-sans font-normal">/mois</span>
          </div>
          <p className="text-xs text-[var(--color-cream-mute)] font-mono mt-0.5">{formatRelativeDate(est.created_at)}</p>
        </div>
      </div>

      {/* Détail des paramètres et du gain */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Metric label="Capital" value={fmtEur(est.capital)} />
        <Metric label="Durée" value={`${Math.round(est.duration_years)} ans`} />
        <Metric label="Âge" value={`${Math.round(est.age)} ans`} />
        <Metric label="Prime actuelle" value={`${fmtEur(est.current_premium)}/mois`} />
        <Metric label="Prime Cap Horn" value={`${fmtEur(est.caphorn_premium)}/mois`} />
        <Metric label="Économie / an" value={fmtEur(est.yearly_saving)} />
        <Metric label="Total sur durée" value={fmtEur(est.total_saving)} gold />
        <Metric label="Réduction" value={`−${Math.round(est.savings_percent)} %`} />
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--color-ink-line)] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1.5 flex-wrap items-center">
          {pending && <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--color-cream-mute)]" />}
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              onClick={() => changeStatus(s)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                status === s ? STATUS_BG[s] : 'border-[var(--color-ink-line)] text-[var(--color-cream-mute)] hover:text-[var(--color-cream)]'
              }`}
            >
              {SIMULATOR_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        {confirm ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-cream-mute)]">Supprimer ?</span>
            <button onClick={remove} className="px-2.5 py-1 text-xs rounded-lg border border-red-300 text-red-600 bg-red-50 hover:bg-red-100 transition-colors">Oui</button>
            <button onClick={() => setConfirm(false)} className="px-2.5 py-1 text-xs rounded-lg border border-[var(--color-ink-line)] text-[var(--color-cream-mute)] hover:text-[var(--color-cream)] transition-colors">Non</button>
          </div>
        ) : (
          <button onClick={() => setConfirm(true)} className="inline-flex items-center gap-1.5 text-xs text-[var(--color-cream-mute)] hover:text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Supprimer
          </button>
        )}
      </div>
    </div>
  )
}

function Metric({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="rounded-lg border border-[var(--color-ink-line)] bg-[rgba(255,255,255,0.03)] px-3 py-2">
      <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-[var(--color-cream-mute)] mb-0.5">{label}</p>
      <p className={`text-sm font-mono font-semibold tabular-nums ${gold ? 'text-[var(--color-gold-soft)]' : 'text-[var(--color-cream-dim)]'}`}>{value}</p>
    </div>
  )
}
