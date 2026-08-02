'use client'

import { useState } from 'react'
import { Check, Download, ShieldCheck } from 'lucide-react'

/**
 * Capture des coordonnées avant téléchargement du guide.
 *
 * Le fichier n'est jamais exposé avant l'envoi : le lien de téléchargement
 * est renvoyé par l'API, une fois le contact enregistré. Un lien en dur dans
 * le HTML aurait rendu le formulaire purement décoratif.
 */

interface FormState {
  first_name: string
  last_name: string
  email: string
  phone: string
  situation: string
  consent_rgpd: boolean
}

const SITUATIONS = [
  'Je termine mon internat',
  'Je prépare mon installation',
  'Je reprends une patientèle',
  'Je rejoins une SELARL / SELAS',
  'J’achète les murs de mon cabinet',
  'Je développe mon activité',
  'Je prépare ma transmission',
  'Autre / je me renseigne',
]

const EMPTY: FormState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  situation: '',
  consent_rgpd: false,
}

export default function GuideForm({
  label = 'Télécharger gratuitement',
  note = 'Aucun engagement. Vos données restent confidentielles.',
}: {
  label?: string
  note?: string
}) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<{ file?: string; message?: string } | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.first_name.trim()) next.first_name = 'Requis'
    if (!form.last_name.trim()) next.last_name = 'Requis'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'E-mail invalide'
    if (form.phone.replace(/\D/g, '').length < 9) next.phone = 'Téléphone invalide'
    if (!form.consent_rgpd) next.consent_rgpd = 'Consentement requis'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting || !validate()) return
    setSubmitting(true)
    setServerError(null)
    try {
      const res = await fetch('/api/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await res.json().catch(() => ({}))) as {
        file?: string
        message?: string
        error?: string
      }
      if (!res.ok || (!data.file && !data.message)) {
        setServerError(data.error ?? 'Une erreur est survenue. Réessayez dans un instant.')
        return
      }
      setDone({ file: data.file, message: data.message })
      // Ouverture immédiate : la personne obtient le guide sans clic de plus.
      if (data.file) window.open(data.file, '_blank', 'noopener,noreferrer')
    } catch {
      setServerError('Connexion impossible. Réessayez dans un instant.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="med-guide__done">
        <span className="med-guide__done-icon" aria-hidden>
          <Check className="w-5 h-5" />
        </span>
        <p className="med-guide__done-title">
          {done.file ? 'Votre guide est prêt.' : 'C’est noté, merci.'}
        </p>
        <p className="med-guide__done-text">
          {done.file
            ? 'Le téléchargement a démarré dans un nouvel onglet. Si rien ne se passe, utilisez le lien ci-dessous.'
            : done.message}
        </p>
        {done.file && (
          <a
            className="med-btn med-btn--accent"
            href={done.file}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="w-4 h-4" aria-hidden /> Ouvrir le guide
          </a>
        )}
      </div>
    )
  }

  return (
    <form className="med-guide__form" onSubmit={onSubmit} noValidate>
      <div className="med-guide__row">
        <label className="med-field">
          <span className="med-field__label">Prénom</span>
          <input
            className={`med-input ${errors.first_name ? 'is-error' : ''}`}
            value={form.first_name}
            onChange={(e) => set('first_name', e.target.value)}
            autoComplete="given-name"
            required
          />
        </label>
        <label className="med-field">
          <span className="med-field__label">Nom</span>
          <input
            className={`med-input ${errors.last_name ? 'is-error' : ''}`}
            value={form.last_name}
            onChange={(e) => set('last_name', e.target.value)}
            autoComplete="family-name"
            required
          />
        </label>
      </div>

      <div className="med-guide__row">
        <label className="med-field">
          <span className="med-field__label">E-mail</span>
          <input
            type="email"
            inputMode="email"
            className={`med-input ${errors.email ? 'is-error' : ''}`}
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className="med-field">
          <span className="med-field__label">Téléphone</span>
          <input
            type="tel"
            inputMode="tel"
            className={`med-input ${errors.phone ? 'is-error' : ''}`}
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            autoComplete="tel"
            required
          />
        </label>
      </div>

      <label className="med-field">
        <span className="med-field__label">Où en êtes-vous ? (facultatif)</span>
        <select
          className="med-input"
          value={form.situation}
          onChange={(e) => set('situation', e.target.value)}
        >
          <option value="">Sélectionner…</option>
          {SITUATIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className={`med-consent ${errors.consent_rgpd ? 'is-error' : ''}`}>
        <input
          type="checkbox"
          checked={form.consent_rgpd}
          onChange={(e) => set('consent_rgpd', e.target.checked)}
          required
        />
        <span>
          J’accepte que mes coordonnées soient utilisées par Cap Horn Conseils pour m’adresser ce
          guide et, le cas échéant, échanger sur mon projet. Aucune cession à des tiers.
        </span>
      </label>

      {(errors.first_name || errors.last_name || errors.email || errors.phone || errors.consent_rgpd) && (
        <p className="med-guide__error" role="alert">
          Merci de compléter les champs signalés.
        </p>
      )}
      {serverError && (
        <p className="med-guide__error" role="alert">
          {serverError}
        </p>
      )}

      <button type="submit" className="med-btn med-btn--accent med-btn--block" disabled={submitting}>
        <Download className="w-4 h-4" aria-hidden />
        {submitting ? 'Envoi…' : label}
      </button>

      <p className="med-guide__note">
        <ShieldCheck className="w-3.5 h-3.5" aria-hidden /> {note}
      </p>
    </form>
  )
}
