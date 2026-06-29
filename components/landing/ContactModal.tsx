'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ArrowRight, Check, ShieldCheck } from 'lucide-react'
import type { ContactFormData } from '@/lib/types'

// Palette « Apple » (en dur → indépendant du CSS global / du cache)
const TEXT = '#1d1d1f'
const SUB = '#6e6e73'
const FILL = 'rgba(118,118,128,0.10)'
const SEP = 'rgba(0,0,0,0.08)'
const BLUE = '#0071e3'
const GREEN = '#34c759'

const SLOTS = ['Indifférent', 'Matin', 'Après-midi', 'Fin de journée']

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState<ContactFormData>({
    first_name: '', last_name: '', email: '', phone: '', message: '', preferred_slot: 'Indifférent', consent_rgpd: false,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [reduceMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => setMounted(true))
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
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

  if (!open) return null

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

  const anim = reduceMotion ? {} : { transition: 'transform 0.45s cubic-bezier(0.2,0.8,0.2,1), opacity 0.3s ease' }

  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 400,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18,
        background: 'rgba(0,0,0,0.42)',
        WebkitBackdropFilter: 'blur(8px) saturate(120%)', backdropFilter: 'blur(8px) saturate(120%)',
        opacity: mounted ? 1 : 0, transition: 'opacity 0.3s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative', width: '100%', maxWidth: 470, maxHeight: 'calc(100dvh - 36px)', overflowY: 'auto',
          borderRadius: 28, padding: 'clamp(26px, 4vw, 38px)',
          background: 'rgba(255,255,255,0.72)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)', backdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.7)',
          boxShadow: '0 30px 90px -20px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.9)',
          fontFamily: 'var(--font-ibm-plex), system-ui, sans-serif',
          color: TEXT,
          transform: mounted ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(12px)',
          opacity: mounted ? 1 : 0,
          ...anim,
        }}
      >
        <button onClick={onClose} aria-label="Fermer" style={closeBtn}><X className="w-4 h-4" /></button>

        {done ? (
          <div style={{ textAlign: 'center', padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: GREEN, color: '#fff', boxShadow: `0 14px 30px -10px ${GREEN}` }}>
              <Check className="w-7 h-7" strokeWidth={2.4} />
            </span>
            <h2 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>Demande envoyée</h2>
            <p style={{ fontSize: 15, lineHeight: 1.5, color: SUB, margin: 0, maxWidth: 320 }}>
              Merci {form.first_name}. Guillaume vous recontacte sous 24 h ouvrées au créneau indiqué.
            </p>
            <button onClick={onClose} style={{ ...primaryBtn, width: 'auto', padding: '12px 28px', marginTop: 4 }}>Fermer</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: SUB }}>Prendre contact</div>
              <h2 style={{ fontSize: 'clamp(24px, 3.4vw, 30px)', fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '10px 0 8px' }}>
                Être rappelé par Guillaume
              </h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.5, color: SUB, margin: 0 }}>
                Laissez vos coordonnées — réponse sous 24 h, sans engagement.
              </p>
            </div>

            <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Prénom" error={errors.first_name}>
                  <Input value={form.first_name} onChange={(v) => update('first_name', v)} placeholder="Jean" autoComplete="given-name" />
                </Field>
                <Field label="Nom" error={errors.last_name}>
                  <Input value={form.last_name} onChange={(v) => update('last_name', v)} placeholder="Dupont" autoComplete="family-name" />
                </Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Email" error={errors.email}>
                  <Input value={form.email} onChange={(v) => update('email', v)} placeholder="jean@exemple.fr" type="email" autoComplete="email" />
                </Field>
                <Field label="Téléphone" error={errors.phone}>
                  <Input value={form.phone} onChange={(v) => update('phone', v)} placeholder="06 12 34 56 78" type="tel" autoComplete="tel" />
                </Field>
              </div>

              <Field label="Créneau préféré">
                <div style={{ display: 'flex', gap: 4, padding: 4, background: FILL, borderRadius: 12 }}>
                  {SLOTS.map((s) => {
                    const on = form.preferred_slot === s
                    return (
                      <button type="button" key={s} onClick={() => update('preferred_slot', s)} style={{
                        flex: 1, padding: '8px 6px', borderRadius: 9, border: 'none', cursor: 'pointer',
                        fontSize: 12.5, fontWeight: on ? 600 : 500, color: on ? TEXT : SUB,
                        background: on ? '#fff' : 'transparent',
                        boxShadow: on ? '0 1px 3px rgba(0,0,0,0.12)' : 'none', transition: 'all 0.2s',
                      }}>{s}</button>
                    )
                  })}
                </div>
              </Field>

              <Field label="Votre projet (optionnel)">
                <Textarea value={form.message ?? ''} onChange={(v) => update('message', v)} placeholder="Quelques mots sur votre projet…" />
              </Field>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 11, cursor: 'pointer', marginTop: 2 }}>
                <span onClick={() => update('consent_rgpd', !form.consent_rgpd)} style={{
                  flexShrink: 0, marginTop: 1, width: 22, height: 22, borderRadius: 7,
                  border: form.consent_rgpd ? `1px solid ${BLUE}` : `1px solid ${SEP}`,
                  background: form.consent_rgpd ? BLUE : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'all 0.15s',
                }}>{form.consent_rgpd && <Check className="w-3.5 h-3.5" strokeWidth={3} />}</span>
                <input type="checkbox" checked={form.consent_rgpd} onChange={(e) => update('consent_rgpd', e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                <span style={{ fontSize: 12.5, lineHeight: 1.5, color: SUB }}>
                  J’accepte d’être recontacté(e) et que mes données soient traitées conformément à la politique de confidentialité.
                </span>
              </label>
              {errors.consent_rgpd && <p style={{ fontSize: 12, color: '#c0392b', margin: 0 }}>{errors.consent_rgpd}</p>}

              <button type="submit" disabled={submitting} style={{ ...primaryBtn, opacity: submitting ? 0.6 : 1, marginTop: 4 }}>
                {submitting ? 'Envoi…' : <>Demander à être rappelé <ArrowRight className="w-4 h-4" /></>}
              </button>
              <p style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 7, margin: '2px 0 0', fontSize: 11, fontWeight: 500, color: '#86868b' }}>
                <ShieldCheck className="w-3.5 h-3.5" /> Données confidentielles · RGPD · Réponse sous 24 h
              </p>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}

const closeBtn: React.CSSProperties = {
  position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(118,118,128,0.14)', border: 'none', color: '#6e6e73', cursor: 'pointer',
}

const primaryBtn: React.CSSProperties = {
  width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
  padding: '15px 24px', borderRadius: 14, border: 'none', cursor: 'pointer',
  background: '#1d1d1f', color: '#fff', fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
  fontFamily: 'var(--font-ibm-plex), system-ui, sans-serif',
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: SUB }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: 11.5, color: '#c0392b' }}>{error}</span>}
    </div>
  )
}

const fieldBase: React.CSSProperties = {
  width: '100%', background: 'rgba(118,118,128,0.08)', borderRadius: 12,
  padding: '12px 13px', fontSize: 16, color: TEXT, outline: 'none',
  fontFamily: 'var(--font-ibm-plex), system-ui, sans-serif',
}

function Input({ value, onChange, placeholder, type = 'text', autoComplete }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; autoComplete?: string
}) {
  const [f, setF] = useState(false)
  return (
    <input
      type={type} value={value} placeholder={placeholder} autoComplete={autoComplete}
      inputMode={type === 'email' ? 'email' : type === 'tel' ? 'tel' : undefined}
      onChange={(e) => onChange(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{ ...fieldBase, border: f ? `1px solid ${BLUE}` : '1px solid transparent', boxShadow: f ? `0 0 0 4px rgba(0,113,227,0.12)` : 'none' }}
    />
  )
}

function Textarea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [f, setF] = useState(false)
  return (
    <textarea
      rows={2} value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{ ...fieldBase, resize: 'vertical', minHeight: 60, lineHeight: 1.5, border: f ? `1px solid ${BLUE}` : '1px solid transparent', boxShadow: f ? `0 0 0 4px rgba(0,113,227,0.12)` : 'none' }}
    />
  )
}
