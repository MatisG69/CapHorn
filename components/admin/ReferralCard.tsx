'use client'

import { useState, useTransition } from 'react'
import { Mail, Phone, Trash2, Loader2, ArrowRight, Gift } from 'lucide-react'
import {
  updateReferralStatusAction,
  updateReferralRewardAction,
  deleteReferralAction,
} from '@/app/admin/parrainage/actions'
import {
  REFERRAL_PROJECT_LABELS,
  REFERRAL_STATUS_LABELS,
  type Referral,
  type ReferralStatus,
} from '@/lib/types'
import { formatRelativeDate } from '@/lib/admin/labels'

const STATUS_ORDER: ReferralStatus[] = ['new', 'contacted', 'study', 'signed', 'paid', 'lost', 'archived']

const STATUS_BG: Record<ReferralStatus, string> = {
  new: 'border-amber-300 text-amber-700 bg-amber-50',
  contacted: 'border-blue-300 text-blue-700 bg-blue-50',
  study: 'border-violet-300 text-violet-700 bg-violet-50',
  signed: 'border-emerald-300 text-emerald-700 bg-emerald-50',
  paid: 'border-teal-300 text-teal-700 bg-teal-50',
  lost: 'border-red-300 text-red-700 bg-red-50',
  archived: 'border-[var(--color-ink-line)] text-[var(--color-cream-mute)]',
}

export default function ReferralCard({ referral }: { referral: Referral }) {
  const [status, setStatus] = useState<ReferralStatus>(referral.status)
  const [reward, setReward] = useState(
    referral.reward_amount === null ? '' : String(referral.reward_amount),
  )
  const [pending, start] = useTransition()
  const [confirm, setConfirm] = useState(false)

  const changeStatus = (s: ReferralStatus) => {
    setStatus(s)
    start(async () => {
      await updateReferralStatusAction(referral.id, s)
    })
  }

  const saveReward = () => {
    const raw = reward.replace(',', '.').trim()
    const amount = raw === '' ? null : Number(raw)
    if (amount !== null && !Number.isFinite(amount)) return
    start(async () => {
      await updateReferralRewardAction(referral.id, amount)
    })
  }

  const remove = () =>
    start(async () => {
      await deleteReferralAction(referral.id)
    })

  return (
    <div className="admin-card">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base font-medium text-[var(--color-cream)]">
              {referral.parrain_first_name} {referral.parrain_last_name}
              <ArrowRight className="inline w-3.5 h-3.5 mx-2 text-[var(--color-cream-mute)]" />
              {referral.filleul_first_name} {referral.filleul_last_name}
            </h3>
            <span
              className={`text-[10px] font-mono uppercase tracking-[0.16em] px-2 py-0.5 rounded border ${STATUS_BG[status]}`}
            >
              {REFERRAL_STATUS_LABELS[status]}
            </span>
            <span className="text-[11px] text-[var(--color-cream-mute)] font-mono">
              {REFERRAL_PROJECT_LABELS[referral.project_type] ?? referral.project_type}
            </span>
          </div>
          {referral.parrain_relation && (
            <p className="text-xs text-[var(--color-cream-mute)] mt-1.5">
              Lien déclaré : {referral.parrain_relation}
            </p>
          )}
        </div>
        <span className="text-xs text-[var(--color-cream-mute)] font-mono shrink-0">
          {formatRelativeDate(referral.created_at)}
        </span>
      </div>

      {/* Le filleul d'abord : c'est lui qu'il faut rappeler sous 24 h. */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Party
          role="Filleul, à rappeler"
          name={`${referral.filleul_first_name} ${referral.filleul_last_name}`}
          email={referral.filleul_email}
          phone={referral.filleul_phone}
          highlight
        />
        <Party
          role="Parrain"
          name={`${referral.parrain_first_name} ${referral.parrain_last_name}`}
          email={referral.parrain_email}
          phone={referral.parrain_phone}
        />
      </div>

      {referral.project_details && (
        <p className="text-sm text-[var(--color-cream-dim)] mt-4 leading-relaxed border-l-2 border-[var(--color-ink-line)] pl-3">
          {referral.project_details}
        </p>
      )}

      <div className="mt-4 pt-4 border-t border-[var(--color-ink-line)] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1.5 flex-wrap items-center">
          {pending && <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--color-cream-mute)]" />}
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              onClick={() => changeStatus(s)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                status === s
                  ? STATUS_BG[s]
                  : 'border-[var(--color-ink-line)] text-[var(--color-cream-mute)] hover:text-[var(--color-cream)]'
              }`}
            >
              {REFERRAL_STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-xs text-[var(--color-cream-mute)]">
            <Gift className="w-3.5 h-3.5" />
            <span className="sr-only sm:not-sr-only">Prime</span>
            <input
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              onBlur={saveReward}
              inputMode="decimal"
              placeholder="—"
              aria-label="Montant de la prime de parrainage, en euros"
              className="w-20 px-2 py-1 rounded-lg bg-transparent border border-[var(--color-ink-line)] text-[var(--color-cream)] text-right"
            />
            <span>€</span>
          </label>

          {confirm ? (
            <span className="inline-flex items-center gap-2 text-xs">
              <button onClick={remove} className="text-red-600 inline-flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Confirmer
              </button>
              <button onClick={() => setConfirm(false)} className="text-[var(--color-cream-mute)]">
                Annuler
              </button>
            </span>
          ) : (
            <button
              onClick={() => setConfirm(true)}
              className="text-[var(--color-cream-mute)] hover:text-red-600"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Party({
  role,
  name,
  email,
  phone,
  highlight,
}: {
  role: string
  name: string
  email: string
  phone: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        highlight
          ? 'border-[var(--color-gold-deep)]/40 bg-[var(--color-gold-deep)]/[0.06]'
          : 'border-[var(--color-ink-line)]'
      }`}
    >
      <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--color-cream-mute)]">
        {role}
      </p>
      <p className="text-sm text-[var(--color-cream)] mt-1">{name}</p>
      <div className="flex items-center gap-4 mt-2 flex-wrap">
        <a
          href={`tel:${phone}`}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-cream-dim)] hover:text-[var(--color-gold-soft)]"
        >
          <Phone className="w-3.5 h-3.5" /> {phone}
        </a>
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-cream-dim)] hover:text-[var(--color-gold-soft)]"
        >
          <Mail className="w-3.5 h-3.5" /> {email}
        </a>
      </div>
    </div>
  )
}
