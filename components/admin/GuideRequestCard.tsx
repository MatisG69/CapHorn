'use client'

import { useState, useTransition } from 'react'
import { BookOpen, Loader2, Mail, Phone, Trash2 } from 'lucide-react'
import {
  deleteGuideRequestAction,
  updateGuideRequestStatusAction,
} from '@/app/admin/guides/actions'
import {
  GUIDE_REQUEST_STATUS_LABELS,
  type GuideRequest,
  type GuideRequestStatus,
} from '@/lib/types'
import { formatRelativeDate } from '@/lib/admin/labels'

/**
 * Une demande de guide.
 *
 * Tant que le PDF n'est pas en ligne, l'envoi est manuel : le statut
 * « À envoyer » est donc la file d'attente réelle de Guillaume, et le bouton
 * e-mail ouvre un brouillon pré-rempli auquel il n'a plus qu'à joindre le
 * document. C'est ce qui évite qu'une coordonnée laissée reste sans réponse.
 */

const STATUS_ORDER: GuideRequestStatus[] = ['new', 'sent', 'contacted', 'converted', 'archived']

const STATUS_BG: Record<GuideRequestStatus, string> = {
  new: 'border-amber-300 text-amber-700 bg-amber-50',
  sent: 'border-blue-300 text-blue-700 bg-blue-50',
  contacted: 'border-violet-300 text-violet-700 bg-violet-50',
  converted: 'border-emerald-300 text-emerald-700 bg-emerald-50',
  archived: 'border-[var(--color-ink-line)] text-[var(--color-cream-mute)]',
}

export default function GuideRequestCard({ request }: { request: GuideRequest }) {
  const [status, setStatus] = useState<GuideRequestStatus>(request.status)
  const [pending, start] = useTransition()
  const [confirm, setConfirm] = useState(false)

  const changeStatus = (s: GuideRequestStatus) => {
    setStatus(s)
    start(async () => {
      await updateGuideRequestStatusAction(request.id, s)
    })
  }

  const remove = () =>
    start(async () => {
      await deleteGuideRequestAction(request.id)
    })

  const fullName = `${request.first_name} ${request.last_name}`.trim()
  const mailtoSubject = encodeURIComponent(
    'Votre guide — Réussir le financement de son installation médicale',
  )
  const mailtoBody = encodeURIComponent(
    `Bonjour ${request.first_name},\n\n` +
      'Comme demandé sur le site, vous trouverez ci-joint le guide « Réussir le financement de ' +
      'son installation médicale ».\n\n' +
      'Si vous préparez une installation, une reprise de patientèle ou une association, je peux ' +
      'étudier votre projet avant votre premier rendez-vous bancaire. Dites-moi simplement ce ' +
      'qui vous arrangerait.\n\n' +
      'Bien à vous,\nGuillaume Horn\nCap Horn Conseils',
  )

  return (
    <div className="admin-card">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base font-medium text-[var(--color-cream)]">{fullName}</h3>
            <span
              className={`text-[10px] font-mono uppercase tracking-[0.16em] px-2 py-0.5 rounded border ${STATUS_BG[status]}`}
            >
              {GUIDE_REQUEST_STATUS_LABELS[status]}
            </span>
            {request.situation && (
              <span className="text-[11px] text-[var(--color-cream-mute)] font-mono">
                {request.situation}
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--color-cream-mute)] mt-1.5 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" aria-hidden />
            {request.guide_slug}
            {request.source_page && <span className="opacity-60">· {request.source_page}</span>}
          </p>
        </div>
        <span className="text-xs text-[var(--color-cream-mute)] font-mono shrink-0">
          {formatRelativeDate(request.created_at)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={`mailto:${request.email}?subject=${mailtoSubject}&body=${mailtoBody}`}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-cream)] hover:text-[#C9A45C] transition-colors"
        >
          <Mail className="w-4 h-4" aria-hidden />
          {request.email}
        </a>
        <a
          href={`tel:${request.phone.replace(/\s/g, '')}`}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-cream)] hover:text-[#C9A45C] transition-colors"
        >
          <Phone className="w-4 h-4" aria-hidden />
          {request.phone}
        </a>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => changeStatus(s)}
              disabled={pending}
              aria-pressed={status === s}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                status === s
                  ? 'border-[#C9A45C] text-[#E8D29A] bg-[rgba(201,164,92,0.12)]'
                  : 'border-white/10 text-white/50 hover:text-white hover:border-white/25'
              }`}
            >
              {GUIDE_REQUEST_STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {pending && <Loader2 className="w-4 h-4 animate-spin text-white/40" aria-hidden />}
          {confirm ? (
            <>
              <button
                type="button"
                onClick={remove}
                disabled={pending}
                className="text-[11px] px-2.5 py-1 rounded-lg border border-red-400/40 text-red-300 hover:bg-red-500/10 transition-colors"
              >
                Confirmer
              </button>
              <button
                type="button"
                onClick={() => setConfirm(false)}
                className="text-[11px] px-2.5 py-1 rounded-lg border border-white/10 text-white/50 hover:text-white transition-colors"
              >
                Annuler
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirm(true)}
              aria-label={`Supprimer la demande de ${fullName}`}
              className="p-1.5 rounded-lg text-white/35 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" aria-hidden />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
