'use client'

import { useState, useTransition } from 'react'
import { Save, Check, Loader2, RotateCcw, Sliders } from 'lucide-react'
import { saveSimulatorSettingsAction } from '@/app/admin/simulateur/actions'
import {
  DEFAULT_SIMULATOR_SETTINGS,
  fmtEur,
  type SimulatorSettings,
} from '@/lib/simulateur/estimate'

type NumKey = keyof SimulatorSettings

const RATE_FIELDS: { key: NumKey; label: string; hint: string }[] = [
  { key: 'rateUnder35', label: 'Moins de 35 ans', hint: '% annuel du capital' },
  { key: 'rateUnder45', label: '35 – 44 ans', hint: '% annuel du capital' },
  { key: 'rateUnder55', label: '45 – 54 ans', hint: '% annuel du capital' },
  { key: 'rateUnder65', label: '55 – 64 ans', hint: '% annuel du capital' },
  { key: 'rate65plus', label: '65 ans et plus', hint: '% annuel du capital' },
]

const DEFAULT_FIELDS: { key: NumKey; label: string; suffix: string }[] = [
  { key: 'defaultCapital', label: 'Capital restant dû', suffix: '€' },
  { key: 'defaultDurationYears', label: 'Durée restante', suffix: 'années' },
  { key: 'defaultAge', label: 'Âge', suffix: 'ans' },
  { key: 'defaultCurrentPremium', label: 'Prime mensuelle actuelle', suffix: '€/mois' },
]

export default function SimulatorSettingsForm({ initial }: { initial: SimulatorSettings }) {
  const [values, setValues] = useState<Record<NumKey, string>>(() => {
    const o = {} as Record<NumKey, string>
    ;(Object.keys(initial) as NumKey[]).forEach((k) => (o[k] = String(initial[k])))
    return o
  })
  const [pending, start] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: NumKey, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v.replace(/[^\d.,]/g, '') }))
    setSaved(false)
  }

  const num = (k: NumKey) => Number(String(values[k]).replace(',', '.')) || 0

  // Aperçu : prime Cap Horn estimée pour le profil par défaut
  const previewRatePct = (() => {
    const age = num('defaultAge')
    if (age < 35) return num('rateUnder35')
    if (age < 45) return num('rateUnder45')
    if (age < 55) return num('rateUnder55')
    if (age < 65) return num('rateUnder65')
    return num('rate65plus')
  })()
  const previewPremium = (num('defaultCapital') * (previewRatePct / 100)) / 12

  const save = () => {
    setError(null)
    const payload = {} as Record<NumKey, number>
    ;(Object.keys(values) as NumKey[]).forEach((k) => (payload[k] = num(k)))
    start(async () => {
      try {
        await saveSimulatorSettingsAction(payload as Partial<SimulatorSettings>)
        setSaved(true)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur lors de l\'enregistrement')
      }
    })
  }

  const reset = () => {
    const o = {} as Record<NumKey, string>
    ;(Object.keys(DEFAULT_SIMULATOR_SETTINGS) as NumKey[]).forEach(
      (k) => (o[k] = String(DEFAULT_SIMULATOR_SETTINGS[k])),
    )
    setValues(o)
    setSaved(false)
  }

  return (
    <div className="admin-card !p-6">
      <div className="flex items-center gap-2.5 mb-1">
        <Sliders className="w-4 h-4 text-[var(--color-gold)]" />
        <h2 className="text-[15px] font-semibold text-[var(--color-cream)]">Paramètres de l’estimation</h2>
      </div>
      <p className="text-sm text-[var(--color-cream-dim)] mb-6">
        Ces réglages pilotent le simulateur côté client sur <span className="text-[var(--color-gold-soft)]">/simulateur</span>.
      </p>

      {/* Taux Cap Horn par tranche d'âge */}
      <p className="eyebrow eyebrow--single mb-3">Taux Cap Horn par tranche d’âge</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {RATE_FIELDS.map((f) => (
          <NumField key={f.key} label={f.label} suffix="%" hint={f.hint} value={values[f.key]} onChange={(v) => set(f.key, v)} />
        ))}
      </div>

      {/* Valeurs par défaut du formulaire */}
      <p className="eyebrow eyebrow--single mb-3">Valeurs pré-remplies du formulaire</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {DEFAULT_FIELDS.map((f) => (
          <NumField key={f.key} label={f.label} suffix={f.suffix} value={values[f.key]} onChange={(v) => set(f.key, v)} />
        ))}
      </div>

      {/* Aperçu */}
      <div className="rounded-xl border border-[var(--color-ink-line)] bg-[var(--color-ink-raised)] px-4 py-3 mb-6 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-sm text-[var(--color-cream-dim)]">
          Aperçu — prime Cap Horn pour le profil par défaut ({Math.round(num('defaultAge'))} ans · {fmtEur(num('defaultCapital'))})
        </span>
        <span className="text-sm font-semibold text-[var(--color-gold-soft)] font-mono tabular-nums">
          {fmtEur(previewPremium)} / mois
        </span>
      </div>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={save}
          disabled={pending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16130E] text-white text-sm font-medium hover:bg-[#2a251d] transition-colors disabled:opacity-50"
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
          {saved ? 'Enregistré' : 'Enregistrer'}
        </button>
        <button
          onClick={reset}
          disabled={pending}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-ink-line)] text-sm text-[var(--color-cream-mute)] hover:text-[var(--color-cream)] transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Valeurs par défaut
        </button>
      </div>
    </div>
  )
}

function NumField({
  label,
  suffix,
  hint,
  value,
  onChange,
}: {
  label: string
  suffix: string
  hint?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--color-cream-mute)]">{label}</label>
        <span className="text-[10px] font-mono text-[var(--color-gold-deep)]">{suffix}</span>
      </div>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="tunnel-input"
      />
      {hint && <p className="mt-1 text-[10px] text-[var(--color-cream-mute)]">{hint}</p>}
    </div>
  )
}
