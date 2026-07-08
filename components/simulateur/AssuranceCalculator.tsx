'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Calculator, Sparkles, TrendingDown, Send, Check, Loader2, ShieldCheck } from 'lucide-react'
import {
  computeEstimation,
  parseFrNumber,
  fmtEur,
  DEFAULT_SIMULATOR_SETTINGS,
  type SimulatorSettings,
} from '@/lib/simulateur/estimate'

/**
 * Simulateur d'économies, assurance emprunteur (loi Lemoine).
 *
 * La logique de calcul et le parsing des montants vivent dans
 * `lib/simulateur/estimate.ts` (partagés avec l'API `/api/simulateur`).
 * Les paramètres (taux Cap Horn, valeurs par défaut) proviennent de Guillaume
 * via `/admin/simulateur` et sont passés en prop `settings`.
 */

interface FormState {
  capital: string
  durationYears: string
  age: string
  currentPremium: string
}

const groupInt = (digits: string): string =>
  digits ? new Intl.NumberFormat('fr-FR').format(parseFrNumber(digits)) : ''

export function AssuranceCalculator({
  settings = DEFAULT_SIMULATOR_SETTINGS,
}: {
  settings?: SimulatorSettings
}) {
  const [form, setForm] = useState<FormState>({
    capital: String(settings.defaultCapital),
    durationYears: String(settings.defaultDurationYears),
    age: String(settings.defaultAge),
    currentPremium: String(settings.defaultCurrentPremium),
  })

  // capital : entier avec séparateur de milliers · age/durée : entiers ·
  // prime : décimales autorisées (virgule).
  const update = (key: keyof FormState, value: string) => {
    let clean: string
    if (key === 'currentPremium') clean = value.replace(/[^\d.,]/g, '')
    else clean = value.replace(/\D/g, '') // digits uniquement
    setForm((prev) => ({ ...prev, [key]: clean }))
  }

  const result = useMemo(
    () =>
      computeEstimation(
        {
          capital: parseFrNumber(form.capital),
          durationYears: parseFrNumber(form.durationYears),
          age: parseFrNumber(form.age),
          currentPremium: parseFrNumber(form.currentPremium),
        },
        settings,
      ),
    [form, settings],
  )

  const hasSaving = result && result.monthlySaving > 5

  return (
    <div className="grid lg:grid-cols-[420px_1fr] gap-8 items-start">
      {/* ── Colonne gauche : formulaire ─────────────────────── */}
      <div className="gold-card">
        <div className="flex items-center gap-2.5 mb-7">
          <Calculator className="w-4 h-4 text-[var(--color-gold)]" />
          <p className="eyebrow eyebrow--single">Vos paramètres</p>
        </div>

        <div className="space-y-5">
          <Field label="Capital restant dû" suffix="€">
            <input
              type="text"
              inputMode="numeric"
              value={groupInt(form.capital)}
              onChange={(e) => update('capital', e.target.value)}
              className="tunnel-input"
              placeholder="180 000"
            />
          </Field>

          <Field label="Durée restante" suffix="années">
            <input
              type="text"
              inputMode="numeric"
              value={form.durationYears}
              onChange={(e) => update('durationYears', e.target.value)}
              className="tunnel-input"
              placeholder="18"
            />
          </Field>

          <Field label="Votre âge" suffix="ans">
            <input
              type="text"
              inputMode="numeric"
              value={form.age}
              onChange={(e) => update('age', e.target.value)}
              className="tunnel-input"
              placeholder="38"
            />
          </Field>

          <Field label="Prime mensuelle actuelle" suffix="€/mois">
            <input
              type="text"
              inputMode="decimal"
              value={form.currentPremium}
              onChange={(e) => update('currentPremium', e.target.value)}
              className="tunnel-input"
              placeholder="85"
            />
          </Field>
        </div>

        <p className="mt-6 text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--color-cream-mute)] leading-relaxed">
          Estimation indicative, votre prime réelle est calculée après étude
          personnalisée du dossier.
        </p>
      </div>

      {/* ── Colonne droite : résultat ──────────────────────── */}
      <div className="gold-card relative overflow-hidden">
        {/* Halo doré décoratif */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-30%',
            right: '-15%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(201, 164, 92, 0.12) 0%, transparent 60%)',
          }}
        />

        <div className="relative">
          <div className="flex items-center gap-2.5 mb-7">
            <Sparkles className="w-4 h-4 text-[var(--color-gold)]" />
            <p className="eyebrow eyebrow--single">Estimation Cap Horn</p>
          </div>

          {!result ? (
            <p className="text-[var(--color-cream-dim)] text-sm leading-relaxed">
              Renseignez vos paramètres pour voir une estimation personnalisée.
            </p>
          ) : (
            <>
              {/* Hero éco mensuelle */}
              <div className="mb-8">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)] mb-2">
                  Économie mensuelle estimée
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="display-serif text-[var(--color-gold-soft)] text-5xl sm:text-6xl leading-none">
                    {fmtEur(result.monthlySaving)}
                  </span>
                  {result.savingsPercent >= 1 && (
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-amber-200 bg-amber-400/10 border border-amber-400/30 px-2 py-1 rounded-md">
                      <TrendingDown className="w-3 h-3" />
                      −{result.savingsPercent.toFixed(0)} %
                    </span>
                  )}
                </div>
              </div>

              {/* Détail */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Stat label="Économie / an" value={fmtEur(result.yearlySaving)} />
                <Stat label="Total sur la durée" value={fmtEur(result.totalSaving)} highlight />
                <Stat label="Prime actuelle" value={`${fmtEur(result.currentPremium)} / mois`} muted />
                <Stat label="Prime Cap Horn" value={`${fmtEur(result.caphornPremium)} / mois`} muted />
              </div>

              {/* CTA */}
              <div className="border-t border-[var(--color-ink-line)] pt-6">
                <p className="text-sm text-[var(--color-cream-dim)] leading-relaxed mb-5">
                  {hasSaving
                    ? 'Votre profil présente un potentiel d\'économie significatif. Lancez l\'étude personnalisée pour obtenir votre prime réelle et le dossier de renégociation.'
                    : 'Votre prime actuelle semble déjà optimisée. Une étude détaillée peut néanmoins identifier d\'autres leviers (garanties, exclusions).'}
                </p>

                <SendToGuillaume
                  inputs={{
                    capital: parseFrNumber(form.capital),
                    durationYears: parseFrNumber(form.durationYears),
                    age: parseFrNumber(form.age),
                    currentPremium: parseFrNumber(form.currentPremium),
                  }}
                  monthlySaving={result.monthlySaving}
                />

                <Link
                  href="/tunnel?path=particulier&need=assurance_emprunteur"
                  className="btn-gold w-full justify-center mt-3"
                >
                  Demander une étude détaillée
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Envoi de l'estimation à Guillaume ─────────────────────────────────── */

function SendToGuillaume({
  inputs,
  monthlySaving,
}: {
  inputs: { capital: number; durationYears: number; age: number; currentPremium: number }
  monthlySaving: number
}) {
  const [open, setOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState<string | null>(null)

  const canSubmit =
    firstName.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    consent &&
    state !== 'sending'

  const submit = async () => {
    if (!canSubmit) return
    setState('sending')
    setError(null)
    try {
      const res = await fetch('/api/simulateur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          consent_rgpd: consent,
          capital: inputs.capital,
          duration_years: inputs.durationYears,
          age: inputs.age,
          current_premium: inputs.currentPremium,
        }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => null)
        throw new Error(j?.error ?? 'Erreur lors de l\'envoi')
      }
      setState('sent')
    } catch (e) {
      setState('idle')
      setError(e instanceof Error ? e.message : 'Erreur lors de l\'envoi')
    }
  }

  if (state === 'sent') {
    return (
      <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-4 flex items-start gap-3">
        <Check className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" strokeWidth={2.2} />
        <div>
          <p className="text-sm font-medium text-emerald-100">Estimation envoyée à Guillaume</p>
          <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">
            Il revient vers vous rapidement avec une étude personnalisée et votre prime réelle.
          </p>
        </div>
      </div>
    )
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-[var(--color-gold-deep)] text-[var(--color-gold-soft)] text-sm font-medium hover:bg-[rgba(201,164,92,0.1)] transition-colors"
      >
        <Send className="w-4 h-4" />
        Envoyer cette estimation à Guillaume
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-[var(--color-ink-line)] bg-[rgba(255,255,255,0.03)] p-5 space-y-4">
      <div className="flex items-start gap-2.5">
        <Send className="w-4 h-4 text-[var(--color-gold)] mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[var(--color-cream)]">Envoyer à Guillaume</p>
          <p className="text-xs text-[var(--color-cream-mute)] mt-1 leading-relaxed">
            Il reçoit votre estimation ({fmtEur(monthlySaving)}/mois) et vos coordonnées pour
            vous recontacter avec une étude personnalisée.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="tunnel-input"
          placeholder="Votre prénom"
          autoComplete="given-name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="tunnel-input"
          placeholder="Votre email"
          autoComplete="email"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="tunnel-input"
          placeholder="Votre téléphone (facultatif)"
          autoComplete="tel"
        />
      </div>

      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 accent-[var(--color-gold)]"
        />
        <span className="text-[11px] text-[var(--color-cream-mute)] leading-relaxed">
          J’accepte que Cap Horn Conseils utilise ces informations pour me recontacter au sujet
          de mon assurance emprunteur (RGPD).
        </span>
      </label>

      {error && <p className="text-xs text-red-300">{error}</p>}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className="flex-1 btn-gold justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === 'sending' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Envoi…
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" /> Envoyer
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-3 rounded-xl border border-[var(--color-ink-line)] text-sm text-[var(--color-cream-mute)] hover:text-[var(--color-cream)] transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}

function Field({
  label,
  suffix,
  children,
}: {
  label: string
  suffix: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)]">
          {label}
        </label>
        <span className="text-[10px] font-mono text-[var(--color-gold-deep)]">{suffix}</span>
      </div>
      {children}
    </div>
  )
}

function Stat({
  label,
  value,
  highlight,
  muted,
}: {
  label: string
  value: string
  highlight?: boolean
  muted?: boolean
}) {
  return (
    <div
      className={`p-4 rounded-xl border ${
        highlight
          ? 'border-[rgba(201,164,92,0.4)] bg-[rgba(201,164,92,0.08)]'
          : 'border-[var(--color-ink-line)] bg-[rgba(255,255,255,0.04)]'
      }`}
    >
      <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--color-cream-mute)] mb-1.5">
        {label}
      </p>
      <p
        className={`font-mono text-base font-semibold tabular-nums ${
          muted ? 'text-[var(--color-cream-dim)]' : 'text-[var(--color-gold-soft)]'
        }`}
      >
        {value}
      </p>
    </div>
  )
}
