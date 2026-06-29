'use client'

import { useState } from 'react'
import { ArrowRight, Check, ShieldCheck } from 'lucide-react'
import type { LeadCaptureData, TunnelStepDef } from '@/lib/types'
import { stepGlyph } from './stepIcons'

interface ContactStepProps {
  step: TunnelStepDef
  initial: LeadCaptureData | null
  isBusiness: boolean
  onSubmit: (data: LeadCaptureData) => void
}

export default function ContactStep({ step, initial, isBusiness, onSubmit }: ContactStepProps) {
  const [form, setForm] = useState<LeadCaptureData>(
    initial ?? {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      company_name: '',
      consent_rgpd: false,
    },
  )
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
    <div className="chc-step-wrap">
      <span className="chc-tunnel__icon">{stepGlyph(step)}</span>
      <p className="chc-tunnel__eyebrow">Vos coordonnées</p>
      <h1 className="chc-tunnel__title">{step.title}</h1>
      {step.subtitle && <p className="chc-tunnel__lead">{step.subtitle}</p>}

      <form onSubmit={handleSubmit} className="chc-form" noValidate>
        <div className="chc-grid2">
          <Field label="Prénom" error={errors.first_name} required>
            <input
              type="text"
              className="chc-input"
              value={form.first_name}
              onChange={(e) => update('first_name', e.target.value)}
              placeholder="Jean"
              autoComplete="given-name"
            />
          </Field>
          <Field label="Nom" error={errors.last_name} required>
            <input
              type="text"
              className="chc-input"
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
            className="chc-input"
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
            className="chc-input"
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
              className="chc-input"
              value={form.company_name ?? ''}
              onChange={(e) => update('company_name', e.target.value)}
              placeholder="Votre société"
              autoComplete="organization"
            />
          </Field>
        )}

        {/* RGPD */}
        <div>
          <label className="chc-consent">
            <input
              type="checkbox"
              checked={form.consent_rgpd}
              onChange={(e) => update('consent_rgpd', e.target.checked)}
            />
            <span className="chc-consent__box">
              {form.consent_rgpd && <Check className="w-3 h-3" strokeWidth={3} />}
            </span>
            <span className="chc-consent__txt">
              J&apos;accepte que mes données soient utilisées pour le traitement de ma demande,
              conformément à la politique de confidentialité de Cap Horn Conseils.
            </span>
          </label>
          {errors.consent_rgpd && <p className="chc-error mt-1.5 ml-8">{errors.consent_rgpd}</p>}
        </div>

        <button type="submit" className="chc-btn chc-btn-gold">
          Continuer
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.16em] font-medium text-[var(--chc-lite)]">
          <ShieldCheck className="w-3.5 h-3.5" />
          Données confidentielles · Sans engagement · RGPD
        </p>
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
    <div className="chc-field">
      <label className="chc-label">
        {label}
        {required && <sup> *</sup>}
      </label>
      {children}
      {error && <p className="chc-error">{error}</p>}
    </div>
  )
}
