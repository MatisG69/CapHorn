'use client'

import { Check, Phone, Calendar } from 'lucide-react'
import Link from 'next/link'
import { MESSAGE_VARIANTS } from '@/lib/scoring'
import type { MessageVariant } from '@/lib/types'

interface ResultStepProps {
  messageVariant: MessageVariant
  firstName?: string
}

export default function ResultStep({ messageVariant, firstName }: ResultStepProps) {
  const variant = MESSAGE_VARIANTS[messageVariant]

  const badgeLabel =
    messageVariant === 'positive' ? 'Dossier prioritaire' :
    messageVariant === 'neutral' ? 'Dossier enregistré' :
    messageVariant === 'conditional' ? 'Analyse en cours' :
    'Solution identifiée'

  return (
    <div className="text-center">
      <div className="chc-result-icon">
        <Check className="w-8 h-8" strokeWidth={2.4} />
      </div>

      {firstName && <p className="chc-tunnel__eyebrow justify-center mt-7">{firstName}</p>}
      <h1 className="chc-tunnel__title mt-2">{variant.title}</h1>
      <p className="chc-tunnel__lead mx-auto" style={{ marginInline: 'auto' }}>{variant.body}</p>

      <div className="mt-7 flex justify-center">
        <span className="chc-result-badge">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--chc-gold)]" />
          {badgeLabel}
        </span>
      </div>

      <ul className="chc-tunnel__steps text-left">
        {[
          'Un expert Cap Horn Conseils analyse votre dossier.',
          'Vous recevez un appel personnalisé pour discuter de votre projet.',
          'Cap Horn négocie les meilleures conditions pour votre financement.',
        ].map((stepTxt, i) => (
          <li key={i}>
            <span className="chc-tunnel__stepn">{i + 1}</span>
            <span className="chc-tunnel__stept">{stepTxt}</span>
          </li>
        ))}
      </ul>

      <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center text-[11px] uppercase tracking-[0.14em] font-medium text-[var(--chc-mid)]">
        <span className="flex items-center justify-center gap-2">
          <Phone className="w-3.5 h-3.5 text-[var(--chc-gold)]" />
          Rappel sous 24 à 48 h
        </span>
        <span className="hidden sm:block opacity-40">·</span>
        <span className="flex items-center justify-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[var(--chc-gold)]" />
          Rendez-vous possible sous 72h
        </span>
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[var(--chc-mid)] hover:text-[var(--chc-gold)] transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
