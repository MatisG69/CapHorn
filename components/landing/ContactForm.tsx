'use client'

import { useState } from 'react'
import { ArrowRight, Check, ShieldCheck } from 'lucide-react'
import type { ContactFormData } from '@/lib/types'

const SLOTS = ['Indifférent', 'Matin', 'Après-midi', 'Fin de journée']

/**
 * Formulaire « Prendre contact » de la page dédiée /contact.
 * Même contrat que la modale (POST /api/contact → table appointment_requests),
 * donc chaque envoi remonte dans le portail admin (Demandes de rendez-vous).
 * Habillage éditorial Cap Horn (crème + or), présenté comme une « fiche de contact ».
 */
export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>({
    first_name: '', last_name: '', email: '', phone: '',
    message: '', preferred_slot: 'Indifférent', consent_rgpd: false,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const update = (k: keyof ContactFormData, v: string | boolean) => {
    setForm((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }))
  }

  const validate = () => {
    const e: Partial<Record<keyof ContactFormData, string>> = {}
    if (!form.first_name.trim()) e.first_name = 'Requis'
    if (!form.last_name.trim()) e.last_name = 'Requis'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide'
    if (!form.phone.trim()) e.phone = 'Requis'
    if (!form.consent_rgpd) e.consent_rgpd = 'Merci de cocher cette case pour être recontacté(e).'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (res.ok) setDone(true)
      else setErrors({ email: 'Une erreur est survenue. Réessayez dans un instant.' })
    } catch {
      setErrors({ email: 'Connexion impossible. Vérifiez votre réseau et réessayez.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="chc-contact-card r" data-d="1">
      <div className="chc-contact-card__manifest">
        <span>Fiche de contact</span>
        <span>50.68° N · 3.09° E</span>
      </div>

      {done ? (
        <div className="chc-contact-done">
          <span className="chc-contact-done__mark"><Check className="w-6 h-6" strokeWidth={2.2} /></span>
          <h2 className="chc-contact-done__title">Demande transmise</h2>
          <p className="chc-contact-done__text">
            Merci {form.first_name.trim() || ''}. Votre demande est enregistrée au cabinet.
            Guillaume reprend la barre et vous rappelle sous 24 h ouvrées, au créneau indiqué.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="chc-contact-form">
          <div className="chc-field-row">
            <Field label="Prénom" error={errors.first_name}>
              <input className="chc-input2" value={form.first_name} onChange={(e) => update('first_name', e.target.value)}
                placeholder="Jean" autoComplete="given-name" />
            </Field>
            <Field label="Nom" error={errors.last_name}>
              <input className="chc-input2" value={form.last_name} onChange={(e) => update('last_name', e.target.value)}
                placeholder="Dupont" autoComplete="family-name" />
            </Field>
          </div>

          <div className="chc-field-row">
            <Field label="Email" error={errors.email}>
              <input className="chc-input2" type="email" inputMode="email" value={form.email}
                onChange={(e) => update('email', e.target.value)} placeholder="jean@exemple.fr" autoComplete="email" />
            </Field>
            <Field label="Téléphone" error={errors.phone}>
              <input className="chc-input2" type="tel" inputMode="tel" value={form.phone}
                onChange={(e) => update('phone', e.target.value)} placeholder="06 12 34 56 78" autoComplete="tel" />
            </Field>
          </div>

          <Field label="Créneau préféré">
            <div className="chc-slots" role="group" aria-label="Créneau préféré">
              {SLOTS.map((s) => (
                <button type="button" key={s} onClick={() => update('preferred_slot', s)}
                  aria-pressed={form.preferred_slot === s}
                  className={`chc-slot${form.preferred_slot === s ? ' is-on' : ''}`}>
                  {s}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Votre projet (optionnel)">
            <textarea className="chc-textarea" rows={3} value={form.message ?? ''}
              onChange={(e) => update('message', e.target.value)}
              placeholder="Achat immobilier, financement pro, reprise, assurance emprunteur…" />
          </Field>

          <label className="chc-consent">
            <input type="checkbox" checked={form.consent_rgpd} onChange={(e) => update('consent_rgpd', e.target.checked)} />
            <span className="chc-consent__box" aria-hidden>{form.consent_rgpd && <Check className="w-3.5 h-3.5" strokeWidth={3} />}</span>
            <span className="chc-consent__text">
              J’accepte d’être recontacté(e) et que mes données soient traitées conformément à la politique de confidentialité.
            </span>
          </label>
          {errors.consent_rgpd && <p className="chc-error chc-error--block">{errors.consent_rgpd}</p>}

          <button type="submit" disabled={submitting} className="chc-contact-submit">
            {submitting ? 'Envoi en cours…' : <>Demander à être rappelé <ArrowRight className="w-4 h-4" /></>}
          </button>

          <p className="chc-contact-reassure">
            <ShieldCheck className="w-3.5 h-3.5" /> Données confidentielles · RGPD · Réponse sous 24 h
          </p>
        </form>
      )}
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="chc-field">
      <span className="chc-label">{label}</span>
      {children}
      {error && <span className="chc-error">{error}</span>}
    </div>
  )
}
