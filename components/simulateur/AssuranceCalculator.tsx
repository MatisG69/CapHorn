'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Calculator, Sparkles, TrendingDown } from 'lucide-react'

/**
 * Simulateur d'économies — assurance emprunteur (loi Lemoine).
 *
 * Logique simplifiée mais crédible :
 *   · Taux Cap Horn estimé selon âge (jeune = moins risqué = moins cher)
 *   · Prime Cap Horn ≈ capital × taux / 12 (mensuelle)
 *   · Économie = (prime actuelle − prime Cap Horn) × 12 × durée_restante
 *
 * Les chiffres servent de teaser ; la prime réelle est calculée par
 * Guillaume après étude personnalisée.
 */

interface FormState {
  capital: string
  durationYears: string
  age: string
  currentPremium: string
}

const INITIAL: FormState = {
  capital: '180000',
  durationYears: '18',
  age: '38',
  currentPremium: '85',
}

function caphornRate(age: number): number {
  if (age < 35) return 0.0008      // 0.08%
  if (age < 45) return 0.0011      // 0.11%
  if (age < 55) return 0.0016      // 0.16%
  if (age < 65) return 0.0024      // 0.24%
  return 0.0035                    // 0.35%
}

function fmtEur(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)))
}

function parseNum(s: string): number {
  const n = Number(String(s).replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

export function AssuranceCalculator() {
  const [form, setForm] = useState<FormState>(INITIAL)

  const update = (key: keyof FormState, value: string) => {
    // Garde uniquement chiffres + décimal
    const clean = value.replace(/[^\d.,]/g, '')
    setForm((prev) => ({ ...prev, [key]: clean }))
  }

  const result = useMemo(() => {
    const capital = parseNum(form.capital)
    const duration = parseNum(form.durationYears)
    const age = parseNum(form.age)
    const currentPremium = parseNum(form.currentPremium)

    if (capital <= 0 || duration <= 0 || age <= 0 || currentPremium <= 0) {
      return null
    }

    const rate = caphornRate(age)
    const caphornPremium = (capital * rate) / 12
    const monthlySaving = Math.max(0, currentPremium - caphornPremium)
    const yearlySaving = monthlySaving * 12
    const totalSaving = yearlySaving * duration
    const savingsPercent = currentPremium > 0 ? (monthlySaving / currentPremium) * 100 : 0

    return {
      caphornPremium,
      monthlySaving,
      yearlySaving,
      totalSaving,
      savingsPercent,
      currentPremium,
    }
  }, [form])

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
          <Field label="Capital restant dû" suffix="€" placeholder="180 000">
            <input
              type="text"
              inputMode="numeric"
              value={form.capital}
              onChange={(e) => update('capital', e.target.value)}
              className="tunnel-input"
              placeholder="180 000"
            />
          </Field>

          <Field label="Durée restante" suffix="années" placeholder="18">
            <input
              type="text"
              inputMode="numeric"
              value={form.durationYears}
              onChange={(e) => update('durationYears', e.target.value)}
              className="tunnel-input"
              placeholder="18"
            />
          </Field>

          <Field label="Votre âge" suffix="ans" placeholder="38">
            <input
              type="text"
              inputMode="numeric"
              value={form.age}
              onChange={(e) => update('age', e.target.value)}
              className="tunnel-input"
              placeholder="38"
            />
          </Field>

          <Field label="Prime mensuelle actuelle" suffix="€/mois" placeholder="85">
            <input
              type="text"
              inputMode="numeric"
              value={form.currentPremium}
              onChange={(e) => update('currentPremium', e.target.value)}
              className="tunnel-input"
              placeholder="85"
            />
          </Field>
        </div>

        <p className="mt-6 text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--color-cream-mute)] leading-relaxed">
          Estimation indicative — votre prime réelle est calculée après étude
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
            background: 'radial-gradient(circle, rgba(201, 168, 76, 0.18) 0%, transparent 60%)',
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
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-md">
                      <TrendingDown className="w-3 h-3" />
                      −{result.savingsPercent.toFixed(0)} %
                    </span>
                  )}
                </div>
              </div>

              {/* Détail */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Stat
                  label="Économie / an"
                  value={fmtEur(result.yearlySaving)}
                />
                <Stat
                  label="Total sur la durée"
                  value={fmtEur(result.totalSaving)}
                  highlight
                />
                <Stat
                  label="Prime actuelle"
                  value={`${fmtEur(result.currentPremium)} / mois`}
                  muted
                />
                <Stat
                  label="Prime Cap Horn"
                  value={`${fmtEur(result.caphornPremium)} / mois`}
                  muted
                />
              </div>

              {/* CTA */}
              <div className="border-t border-[var(--color-ink-line)] pt-6">
                <p className="text-sm text-[var(--color-cream-dim)] leading-relaxed mb-5">
                  {hasSaving
                    ? 'Votre profil présente un potentiel d\'économie significatif. Lancez l\'étude personnalisée pour obtenir votre prime réelle et le dossier de renégociation.'
                    : 'Votre prime actuelle semble déjà optimisée. Une étude détaillée peut néanmoins identifier d\'autres leviers (garanties, exclusions).'}
                </p>
                <Link
                  href="/tunnel?path=particulier&need=assurance_emprunteur"
                  className="btn-gold w-full justify-center"
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

function Field({
  label,
  suffix,
  children,
}: {
  label: string
  suffix: string
  placeholder: string
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
    <div className={`p-4 rounded-xl border ${
      highlight
        ? 'border-[rgba(201,168,76,0.4)] bg-[rgba(201,168,76,0.06)]'
        : 'border-[var(--color-ink-line)] bg-[rgba(15,18,22,0.4)]'
    }`}>
      <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--color-cream-mute)] mb-1.5">
        {label}
      </p>
      <p className={`font-mono text-base font-semibold tabular-nums ${
        muted ? 'text-[var(--color-cream-dim)]' : 'text-[var(--color-gold-soft)]'
      }`}>
        {value}
      </p>
    </div>
  )
}
