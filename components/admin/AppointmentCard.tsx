'use client'

import { useState, useTransition } from 'react'
import { Mail, Phone, Clock, Trash2, Loader2 } from 'lucide-react'
import { updateAppointmentStatusAction, deleteAppointmentAction } from '@/app/admin/rendez-vous/actions'
import { APPOINTMENT_STATUS_LABELS, type AppointmentRequest, type AppointmentStatus } from '@/lib/types'
import { formatRelativeDate } from '@/lib/admin/labels'

const STATUS_ORDER: AppointmentStatus[] = ['new', 'contacted', 'scheduled', 'done', 'archived']

const STATUS_BG: Record<AppointmentStatus, string> = {
  new: 'border-amber-300 text-amber-700 bg-amber-50',
  contacted: 'border-blue-300 text-blue-700 bg-blue-50',
  scheduled: 'border-violet-300 text-violet-700 bg-violet-50',
  done: 'border-emerald-300 text-emerald-700 bg-emerald-50',
  archived: 'border-[var(--color-ink-line)] text-[var(--color-cream-mute)]',
}

export default function AppointmentCard({ appt }: { appt: AppointmentRequest }) {
  const [status, setStatus] = useState<AppointmentStatus>(appt.status)
  const [pending, start] = useTransition()
  const [confirm, setConfirm] = useState(false)

  const changeStatus = (s: AppointmentStatus) => {
    setStatus(s)
    start(async () => { await updateAppointmentStatusAction(appt.id, s) })
  }
  const remove = () => start(async () => { await deleteAppointmentAction(appt.id) })

  return (
    <div className="admin-card">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base font-medium text-[var(--color-cream)]">
              {appt.first_name} {appt.last_name}
            </h3>
            <span className={`text-[10px] font-mono uppercase tracking-[0.16em] px-2 py-0.5 rounded border ${STATUS_BG[status]}`}>
              {APPOINTMENT_STATUS_LABELS[status]}
            </span>
            {appt.preferred_slot && (
              <span className="inline-flex items-center gap-1 text-[11px] text-[var(--color-cream-mute)] font-mono">
                <Clock className="w-3 h-3" /> {appt.preferred_slot}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <a href={`tel:${appt.phone}`} className="inline-flex items-center gap-1.5 text-sm text-[var(--color-cream-dim)] hover:text-[var(--color-gold-soft)]">
              <Phone className="w-3.5 h-3.5" /> {appt.phone}
            </a>
            <a href={`mailto:${appt.email}`} className="inline-flex items-center gap-1.5 text-sm text-[var(--color-cream-dim)] hover:text-[var(--color-gold-soft)]">
              <Mail className="w-3.5 h-3.5" /> {appt.email}
            </a>
          </div>
        </div>
        <span className="text-xs text-[var(--color-cream-mute)] font-mono shrink-0">
          {formatRelativeDate(appt.created_at)}
        </span>
      </div>

      {appt.message && (
        <p className="text-sm text-[var(--color-cream-dim)] mt-3 leading-relaxed border-l-2 border-[var(--color-ink-line)] pl-3">
          {appt.message}
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
                status === s ? STATUS_BG[s] : 'border-[var(--color-ink-line)] text-[var(--color-cream-mute)] hover:text-[var(--color-cream)]'
              }`}
            >
              {APPOINTMENT_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        {confirm ? (
          <span className="inline-flex items-center gap-2 text-xs">
            <button onClick={remove} className="text-red-600 inline-flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Confirmer</button>
            <button onClick={() => setConfirm(false)} className="text-[var(--color-cream-mute)]">Annuler</button>
          </span>
        ) : (
          <button onClick={() => setConfirm(true)} className="text-[var(--color-cream-mute)] hover:text-red-600" title="Supprimer">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
