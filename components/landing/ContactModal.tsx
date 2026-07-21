'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ArrowRight, Check, ShieldCheck, Phone } from 'lucide-react'
import type { ContactFormData } from '@/lib/types'
import { LEGAL_ENTITY } from '@/lib/seo/config'

/**
 * Modale « Prendre contact ».
 *
 * L'habillage précédent était un pastiche Apple codé en dur (bleu #0071e3,
 * vert #34c759, verre blanc), totalement étranger à la charte. Tout passe
 * désormais par les jetons Cap Horn, donc la modale suivra les évolutions du
 * design system au lieu d'en diverger.
 *
 * La logique d'origine est conservée (validation, portail, Échap, verrou du
 * défilement). Trois manques d'accessibilité ont été corrigés : le focus est
 * placé puis piégé dans la boîte, le dialogue porte un nom accessible, et la
 * croix de fermeture atteint la cible tactile de 44 px.
 */
const SLOTS = ['Indifférent', 'Matin', 'Après-midi', 'Fin de journée']

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState<ContactFormData>({
    first_name: '', last_name: '', email: '', phone: '', message: '', preferred_slot: 'Indifférent', consent_rgpd: false,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => {
      setMounted(true)
      firstFieldRef.current?.focus()
    })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      // Piège à focus : sans lui, la tabulation sort de la modale et parcourt
      // la page située derrière.
      if (e.key !== 'Tab' || !boxRef.current) return
      const items = boxRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([type="hidden"]), textarea, select, [tabindex]:not([tabindex="-1"])',
      )
      if (items.length === 0) return
      const first = items[0], last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      setMounted(false)
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

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
    if (!form.consent_rgpd) e.consent_rgpd = 'Requis'
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
      else setErrors({ email: 'Une erreur est survenue. Réessayez.' })
    } catch {
      setErrors({ email: 'Connexion impossible. Réessayez.' })
    } finally {
      setSubmitting(false)
    }
  }

  return createPortal(
    <div
      className={`chc-cm ${mounted ? 'is-in' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chc-cm-title"
    >
      <div ref={boxRef} className="chc-cm__box" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Fermer" className="chc-cm__close">
          <X className="w-4 h-4" aria-hidden />
        </button>

        {done ? (
          <div className="chc-cm__done">
            <span className="chc-cm__done-mark" aria-hidden><Check className="w-7 h-7" strokeWidth={2.4} /></span>
            <h2 id="chc-cm-title" className="chc-cm__title">Demande envoyée</h2>
            <p className="chc-cm__sub">
              Merci {form.first_name}. Guillaume vous recontacte sous 24 h ouvrées, au créneau indiqué.
            </p>
            <a href={`tel:${LEGAL_ENTITY.phone}`} className="chc-cm__call">
              <Phone className="w-4 h-4" aria-hidden /> {LEGAL_ENTITY.phoneDisplay}
            </a>
            <button type="button" onClick={onClose} className="chc-cm__submit chc-cm__submit--ghost">Fermer</button>
          </div>
        ) : (
          <>
            <header className="chc-cm__head">
              <p className="chc-eyebrow">Prendre contact</p>
              <h2 id="chc-cm-title" className="chc-cm__title">Être rappelé par Guillaume</h2>
              <p className="chc-cm__sub">Laissez vos coordonnées : réponse sous 24 h ouvrées, sans engagement.</p>
            </header>

            <form onSubmit={submit} noValidate className="chc-cm__form">
              <div className="chc-cm__row">
                <Field label="Prénom" error={errors.first_name} id="cm-fn">
                  <input ref={firstFieldRef} id="cm-fn" className="chc-cm__input" value={form.first_name}
                    onChange={(e) => update('first_name', e.target.value)} placeholder="Jean" autoComplete="given-name" />
                </Field>
                <Field label="Nom" error={errors.last_name} id="cm-ln">
                  <input id="cm-ln" className="chc-cm__input" value={form.last_name}
                    onChange={(e) => update('last_name', e.target.value)} placeholder="Dupont" autoComplete="family-name" />
                </Field>
              </div>

              <div className="chc-cm__row">
                <Field label="Email" error={errors.email} id="cm-em">
                  <input id="cm-em" className="chc-cm__input" type="email" inputMode="email" value={form.email}
                    onChange={(e) => update('email', e.target.value)} placeholder="jean@exemple.fr" autoComplete="email" />
                </Field>
                <Field label="Téléphone" error={errors.phone} id="cm-tel">
                  <input id="cm-tel" className="chc-cm__input" type="tel" inputMode="tel" value={form.phone}
                    onChange={(e) => update('phone', e.target.value)} placeholder="06 12 34 56 78" autoComplete="tel" />
                </Field>
              </div>

              <fieldset className="chc-cm__field chc-cm__fieldset">
                <legend className="chc-cm__label">Créneau préféré</legend>
                <div className="chc-cm__slots">
                  {SLOTS.map((s) => (
                    <button type="button" key={s} onClick={() => update('preferred_slot', s)}
                      className={`chc-cm__slot ${form.preferred_slot === s ? 'is-on' : ''}`}
                      aria-pressed={form.preferred_slot === s}>{s}</button>
                  ))}
                </div>
              </fieldset>

              <Field label="Votre projet (optionnel)" id="cm-msg">
                <textarea id="cm-msg" rows={2} className="chc-cm__input chc-cm__textarea" value={form.message ?? ''}
                  onChange={(e) => update('message', e.target.value)} placeholder="Quelques mots sur votre projet…" />
              </Field>

              <label className="chc-cm__consent">
                <input type="checkbox" checked={form.consent_rgpd}
                  onChange={(e) => update('consent_rgpd', e.target.checked)} className="chc-cm__check" />
                <span className="chc-cm__check-box" aria-hidden><Check className="w-3.5 h-3.5" strokeWidth={3} /></span>
                <span className="chc-cm__consent-text">
                  J’accepte d’être recontacté(e) et que mes données soient traitées conformément à la
                  politique de confidentialité.
                </span>
              </label>
              {errors.consent_rgpd && <p className="chc-cm__error" role="alert">{errors.consent_rgpd}</p>}

              <button type="submit" disabled={submitting} className="chc-cm__submit">
                {submitting ? 'Envoi…' : <>Demander à être rappelé <ArrowRight className="w-4 h-4" aria-hidden /></>}
              </button>

              {/* Alternative directe : plus rapide qu'un formulaire pour qui hésite. */}
              <a href={`tel:${LEGAL_ENTITY.phone}`} className="chc-cm__call">
                <Phone className="w-4 h-4" aria-hidden /> Ou appeler le {LEGAL_ENTITY.phoneDisplay}
              </a>

              <p className="chc-cm__legal">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden /> Données confidentielles · RGPD · Réponse sous 24 h
              </p>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}

function Field({ label, error, id, children }: {
  label: string; error?: string; id: string; children: React.ReactNode
}) {
  return (
    <div className="chc-cm__field">
      <label className="chc-cm__label" htmlFor={id}>{label}</label>
      {children}
      {error && <span className="chc-cm__error" role="alert">{error}</span>}
    </div>
  )
}
