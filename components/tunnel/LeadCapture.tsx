'use client'

import { useState } from 'react'
import { Shield, ArrowRight } from 'lucide-react'
import type { LeadCaptureData } from '@/lib/types'

interface LeadCaptureProps {
  isSubmitting: boolean
  onSubmit: (data: LeadCaptureData) => void
  isBusiness: boolean
}

export default function LeadCapture({ isSubmitting, onSubmit, isBusiness }: LeadCaptureProps) {
  const [form, setForm] = useState<LeadCaptureData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    consent_rgpd: false,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LeadCaptureData, string>>>({})

  const update = (key: keyof LeadCaptureData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof LeadCaptureData, string>> = {}
    if (!form.first_name.trim()) e.first_name = 'Requis'
    if (!form.last_name.trim()) e.last_name = 'Requis'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide'
    if (!form.phone.trim()) e.phone = 'Requis'
    if (!form.consent_rgpd) e.consent_rgpd = 'Requis pour continuer'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onSubmit(form)
  }

  return (
    <div className="space-y-9">
      <div className="space-y-3">
        <p className="eyebrow eyebrow--single">Étape finale</p>
        <h1 className="display-serif text-3xl sm:text-4xl text-[var(--color-cream)] leading-tight">
          Votre analyse est prête.
        </h1>
        <p className="text-[var(--color-cream-dim)] text-sm leading-relaxed">
          Laissez vos coordonnées — un expert Cap Horn vous contacte sous 24 h.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Prénom" error={errors.first_name} required>
            <input
              type="text"
              className="tunnel-input"
              value={form.first_name}
              onChange={(e) => update('first_name', e.target.value)}
              placeholder="Jean"
              autoComplete="given-name"
            />
          </Field>
          <Field label="Nom" error={errors.last_name} required>
            <input
              type="text"
              className="tunnel-input"
              value={form.last_name}
              onChange={(e) => update('last_name', e.target.value)}
              placeholder="Dupont"
              autoComplete="family-name"
            />
          </Field>
        </div>

        <Field label="Email" error={errors.email} required>
          <input
            type="email"
            className="tunnel-input"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="jean@exemple.fr"
            autoComplete="email"
            inputMode="email"
          />
        </Field>

        <Field label="Téléphone" error={errors.phone} required>
          <input
            type="tel"
            className="tunnel-input"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="06 12 34 56 78"
            autoComplete="tel"
            inputMode="tel"
          />
        </Field>

        {isBusiness && (
          <Field label="Nom de l'entreprise" error={errors.company_name}>
            <input
              type="text"
              className="tunnel-input"
              value={form.company_name ?? ''}
              onChange={(e) => update('company_name', e.target.value)}
              placeholder="Votre société"
              autoComplete="organization"
            />
          </Field>
        )}

        {/* RGPD */}
        <div className="pt-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative shrink-0 mt-0.5">
              <input
                type="checkbox"
                className="sr-only"
                checked={form.consent_rgpd}
                onChange={(e) => update('consent_rgpd', e.target.checked)}
              />
              <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${
                form.consent_rgpd
                  ? 'bg-[var(--color-gold)] border-[var(--color-gold)]'
                  : 'border-[var(--color-ink-line)] group-hover:border-[var(--color-gold-deep)]'
              }`}>
                {form.consent_rgpd && (
                  <svg className="w-3 h-3 text-[var(--color-ink)]" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-xs text-[var(--color-cream-dim)] leading-relaxed">
              J&apos;accepte que mes données soient utilisées pour le traitement de ma demande,
              conformément à la politique de confidentialité de Cap Horn Conseils.
            </span>
          </label>
          {errors.consent_rgpd && (
            <p className="text-xs text-red-300 mt-1.5 ml-8">{errors.consent_rgpd}</p>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="submit"
            className="btn-gold w-full justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-[var(--on-gold)]/30 border-t-[var(--on-gold)] rounded-full animate-spin" />
                Envoi en cours…
              </>
            ) : (
              <>
                Recevoir mon analyse gratuite
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--color-cream-mute)] font-mono">
            <Shield className="w-3 h-3" />
            <span>Données confidentielles · Sans engagement · RGPD</span>
          </div>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)]">
        {label}
        {required && <span className="text-[var(--color-gold)] ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  )
}
