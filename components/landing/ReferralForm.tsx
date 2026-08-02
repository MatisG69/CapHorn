'use client'

import { useState } from 'react'
import { ArrowRight, Check, ShieldCheck } from 'lucide-react'
import { track } from '@/lib/tracking'
import {
  REFERRAL_PROJECT_LABELS,
  REFERRAL_RELATIONS,
  type ReferralFormData,
  type ReferralProjectType,
} from '@/lib/types'

const PROJECT_TYPES = Object.keys(REFERRAL_PROJECT_LABELS) as ReferralProjectType[]

const EMPTY: ReferralFormData = {
  parrain_first_name: '',
  parrain_last_name: '',
  parrain_email: '',
  parrain_phone: '',
  parrain_relation: '',
  filleul_first_name: '',
  filleul_last_name: '',
  filleul_email: '',
  filleul_phone: '',
  project_type: 'immobilier',
  project_details: '',
  consent_rgpd: false,
  consent_filleul: false,
}

/**
 * Formulaire de parrainage (POST /api/parrainage → table `referrals`).
 *
 * Deux personnes sur un seul écran : le parrain et son filleul. Les deux blocs
 * sont visuellement séparés, sinon on saisit ses propres coordonnées deux fois.
 * L'accord préalable du filleul est bloquant : on transmet les données d'un
 * tiers, la trace du consentement n'est pas optionnelle.
 */
export default function ReferralForm() {
  const [form, setForm] = useState<ReferralFormData>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof ReferralFormData, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const update = (k: keyof ReferralFormData, v: string | boolean) => {
    setForm((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }))
  }

  const validate = () => {
    const e: Partial<Record<keyof ReferralFormData, string>> = {}
    if (!form.parrain_first_name.trim()) e.parrain_first_name = 'Requis'
    if (!form.parrain_last_name.trim()) e.parrain_last_name = 'Requis'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parrain_email)) e.parrain_email = 'E-mail invalide'
    if (!form.parrain_phone.trim()) e.parrain_phone = 'Requis'
    if (!form.filleul_first_name.trim()) e.filleul_first_name = 'Requis'
    if (!form.filleul_last_name.trim()) e.filleul_last_name = 'Requis'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.filleul_email)) e.filleul_email = 'E-mail invalide'
    if (!form.filleul_phone.trim()) e.filleul_phone = 'Requis'
    if (!form.consent_filleul)
      e.consent_filleul = 'Sans l’accord de votre filleul, nous ne pouvons pas le contacter.'
    if (!form.consent_rgpd) e.consent_rgpd = 'Merci de cocher cette case pour être recontacté(e).'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/parrainage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source_page: '/parrainage-apporteur-affaires' }),
      })
      if (res.ok) {
        track('referral_submitted', { value: form.project_type })
        setDone(true)
      } else {
        const payload = (await res.json().catch(() => ({}))) as { error?: string }
        setErrors({ parrain_email: payload.error ?? 'Une erreur est survenue. Réessayez dans un instant.' })
      }
    } catch {
      setErrors({ parrain_email: 'Connexion impossible. Vérifiez votre réseau et réessayez.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="chc-parr-done">
        <span className="chc-parr-done__mark" aria-hidden>
          <Check className="w-6 h-6" strokeWidth={2.2} />
        </span>
        <h3 className="chc-parr-done__title">Recommandation transmise</h3>
        <p className="chc-parr-done__text">
          Merci {form.parrain_first_name.trim()}. Guillaume prend contact avec{' '}
          {form.filleul_first_name.trim()} sous 24 h ouvrées. Vous recevez un e-mail de confirmation,
          et nous vous tenons informé(e) de l’avancement du dossier.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="chc-form">
      {/* ── Le parrain ─────────────────────────────────────────────── */}
      <fieldset className="chc-parr-block">
        <legend className="chc-parr-legend">Vos coordonnées</legend>

        <div className="chc-grid2">
          <Field label="Prénom" error={errors.parrain_first_name} required>
            <input
              type="text"
              className="chc-input"
              value={form.parrain_first_name}
              onChange={(e) => update('parrain_first_name', e.target.value)}
              placeholder="Jean"
              autoComplete="given-name"
            />
          </Field>
          <Field label="Nom" error={errors.parrain_last_name} required>
            <input
              type="text"
              className="chc-input"
              value={form.parrain_last_name}
              onChange={(e) => update('parrain_last_name', e.target.value)}
              placeholder="Dupont"
              autoComplete="family-name"
            />
          </Field>
        </div>

        <Field label="Votre e-mail" error={errors.parrain_email} required>
          <input
            type="email"
            className="chc-input"
            value={form.parrain_email}
            onChange={(e) => update('parrain_email', e.target.value)}
            placeholder="jean@exemple.fr"
            autoComplete="email"
            inputMode="email"
          />
        </Field>

        <Field label="Votre téléphone" error={errors.parrain_phone} required>
          <input
            type="tel"
            className="chc-input"
            value={form.parrain_phone}
            onChange={(e) => update('parrain_phone', e.target.value)}
            placeholder="06 12 34 56 78"
            autoComplete="tel"
            inputMode="tel"
          />
        </Field>

        <Field label="Votre filleul est…">
          <div className="chc-pick" role="group" aria-label="Lien avec votre filleul">
            {REFERRAL_RELATIONS.map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => update('parrain_relation', form.parrain_relation === r ? '' : r)}
                aria-pressed={form.parrain_relation === r}
                className={`chc-pick__opt${form.parrain_relation === r ? ' is-on' : ''}`}
              >
                {r}
              </button>
            ))}
          </div>
        </Field>
      </fieldset>

      {/* ── Le filleul ─────────────────────────────────────────────── */}
      <fieldset className="chc-parr-block">
        <legend className="chc-parr-legend">La personne que vous recommandez</legend>

        <div className="chc-grid2">
          <Field label="Prénom" error={errors.filleul_first_name} required>
            <input
              type="text"
              className="chc-input"
              value={form.filleul_first_name}
              onChange={(e) => update('filleul_first_name', e.target.value)}
              placeholder="Marie"
            />
          </Field>
          <Field label="Nom" error={errors.filleul_last_name} required>
            <input
              type="text"
              className="chc-input"
              value={form.filleul_last_name}
              onChange={(e) => update('filleul_last_name', e.target.value)}
              placeholder="Durand"
            />
          </Field>
        </div>

        <Field label="Son e-mail" error={errors.filleul_email} required>
          <input
            type="email"
            className="chc-input"
            value={form.filleul_email}
            onChange={(e) => update('filleul_email', e.target.value)}
            placeholder="marie@exemple.fr"
            inputMode="email"
          />
        </Field>

        <Field label="Son téléphone" error={errors.filleul_phone} required>
          <input
            type="tel"
            className="chc-input"
            value={form.filleul_phone}
            onChange={(e) => update('filleul_phone', e.target.value)}
            placeholder="06 98 76 54 32"
            inputMode="tel"
          />
        </Field>

        <Field label="Son projet" required>
          <div className="chc-pick" role="group" aria-label="Nature du projet">
            {PROJECT_TYPES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => update('project_type', t)}
                aria-pressed={form.project_type === t}
                className={`chc-pick__opt${form.project_type === t ? ' is-on' : ''}`}
              >
                {REFERRAL_PROJECT_LABELS[t]}
              </button>
            ))}
          </div>
        </Field>

        <Field label="En quelques mots" optional>
          <textarea
            className="chc-textarea"
            rows={3}
            value={form.project_details ?? ''}
            onChange={(e) => update('project_details', e.target.value)}
            placeholder="Achat d’une résidence principale à Lille, rachat de patientèle, trésorerie professionnelle…"
            maxLength={2000}
          />
        </Field>
      </fieldset>

      {/* ── Consentements ──────────────────────────────────────────── */}
      <div>
        <label className="chc-consent">
          <input
            type="checkbox"
            checked={form.consent_filleul}
            onChange={(e) => update('consent_filleul', e.target.checked)}
          />
          <span className="chc-consent__box" aria-hidden>
            {form.consent_filleul && <Check className="w-3 h-3" strokeWidth={3} />}
          </span>
          <span className="chc-consent__txt">
            Je certifie avoir obtenu l’accord préalable de la personne que je recommande avant de
            transmettre ses coordonnées à Cap Horn Conseils.
          </span>
        </label>
        {errors.consent_filleul && <p className="chc-error mt-1.5 ml-8">{errors.consent_filleul}</p>}
      </div>

      <div>
        <label className="chc-consent">
          <input
            type="checkbox"
            checked={form.consent_rgpd}
            onChange={(e) => update('consent_rgpd', e.target.checked)}
          />
          <span className="chc-consent__box" aria-hidden>
            {form.consent_rgpd && <Check className="w-3 h-3" strokeWidth={3} />}
          </span>
          <span className="chc-consent__txt">
            J’accepte d’être recontacté(e) et que nos données soient traitées conformément à la
            politique de confidentialité de Cap Horn Conseils.
          </span>
        </label>
        {errors.consent_rgpd && <p className="chc-error mt-1.5 ml-8">{errors.consent_rgpd}</p>}
      </div>

      <button type="submit" disabled={submitting} className="chc-btn chc-btn-gold">
        {submitting ? (
          <>
            <span className="chc-btn-spin" aria-hidden /> Envoi en cours…
          </>
        ) : (
          <>
            Envoyer ma recommandation <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.16em] font-medium text-[var(--chc-lite)]">
        <ShieldCheck className="w-3.5 h-3.5" />
        Données confidentielles · RGPD · Réponse sous 24 h
      </p>
    </form>
  )
}

function Field({
  label,
  error,
  required,
  optional,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="chc-field">
      <label className="chc-label">
        {label}
        {required && <sup> *</sup>}
        {optional && <span className="chc-label-opt"> (facultatif)</span>}
      </label>
      {children}
      {error && <p className="chc-error">{error}</p>}
    </div>
  )
}
