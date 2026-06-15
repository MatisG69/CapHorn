'use client'

import { CheckCircle, Phone, Calendar } from 'lucide-react'
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
    <div className="space-y-9 text-center">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(180deg, var(--gold-fill-1), var(--gold-fill-2) 58%, var(--gold-fill-3))',
              boxShadow: '0 18px 40px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.6)',
            }}
          >
            <CheckCircle className="w-9 h-9 text-[var(--on-gold)]" />
          </div>
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: 'rgba(201, 164, 92, 0.25)', animationDuration: '2.4s' }}
          />
        </div>
      </div>

      {/* Message */}
      <div className="space-y-4">
        {firstName && (
          <p className="eyebrow eyebrow--single text-[var(--color-gold-soft)]">{firstName}</p>
        )}
        <h1 className="display-serif text-3xl sm:text-4xl text-[var(--color-cream)] leading-tight">
          {variant.title}
        </h1>
        <p className="text-[var(--color-cream-dim)] text-sm leading-relaxed max-w-md mx-auto">
          {variant.body}
        </p>
      </div>

      {/* Status badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-gold-deep)] bg-[rgba(201,164,92,0.08)] text-xs font-mono uppercase tracking-[0.22em] text-[var(--color-gold-soft)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
        {badgeLabel}
      </div>

      {/* Next steps */}
      <div className="gold-card text-left">
        <p className="eyebrow eyebrow--single mb-5">Prochaines étapes</p>
        <ol className="space-y-4">
          {[
            'Un expert Cap Horn Conseils analyse votre dossier.',
            'Vous recevez un appel personnalisé pour discuter de votre projet.',
            'Cap Horn négocie les meilleures conditions pour votre financement.',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shrink-0 border border-[var(--color-gold-deep)] bg-[rgba(201,164,92,0.06)]">
                <span className="text-[var(--color-gold-soft)] text-xs font-mono font-semibold">{i + 1}</span>
              </div>
              <p className="text-sm text-[var(--color-cream-dim)] pt-0.5 leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Contact */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center text-xs uppercase tracking-[0.18em] text-[var(--color-cream-mute)] font-mono">
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-[var(--color-gold)]" />
          <span>Rappel sous 24–48h</span>
        </div>
        <div className="hidden sm:block opacity-40">·</div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[var(--color-gold)]" />
          <span>Rendez-vous possible sous 72h</span>
        </div>
      </div>

      <Link
        href="/"
        className="text-xs uppercase tracking-[0.22em] font-mono text-[var(--color-cream-mute)] hover:text-[var(--color-gold-soft)] transition-colors underline underline-offset-4 decoration-dotted"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
