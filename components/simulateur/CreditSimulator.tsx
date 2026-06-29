'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Info } from 'lucide-react'
import {
  DURATIONS,
  RATE_SOURCE,
  TIER_LABELS,
  getRate,
  monthlyPayment,
  totalInterest,
  type RateTier,
} from '@/lib/simulateur/rates'

const euro = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
    Math.round(n),
  )

function NumberField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: number
  onChange: (n: number) => void
  placeholder: string
}) {
  const display = value > 0 ? new Intl.NumberFormat('fr-FR').format(value) : ''
  return (
    <div className="chc-credit__field">
      <label className="chc-credit__label">{label}</label>
      <div className="chc-credit__inputwrap">
        <input
          inputMode="numeric"
          className="chc-credit__input"
          value={display}
          placeholder={placeholder}
          onChange={(e) => onChange(parseInt(e.target.value.replace(/\D/g, '')) || 0)}
        />
        <span className="chc-credit__suffix">€</span>
      </div>
    </div>
  )
}

export default function CreditSimulator() {
  const [bien, setBien] = useState(300000)
  const [apport, setApport] = useState(30000)
  const [duration, setDuration] = useState(20)
  const [tier, setTier] = useState<RateTier>('bon')
  const [withIns, setWithIns] = useState(true)

  const r = useMemo(() => {
    const principal = Math.max(0, bien - apport)
    const rate = getRate(duration, tier)
    const m = monthlyPayment(principal, rate, duration)
    const insMonthly = withIns ? (principal * 0.13) / 100 / 12 : 0 // ~0,13 %/an (délégation)
    const interest = totalInterest(principal, m, duration)
    const insTotal = insMonthly * duration * 12
    return {
      principal,
      rate,
      monthly: m,
      insMonthly,
      totalMonthly: m + insMonthly,
      interest,
      coutTotal: interest + insTotal,
    }
  }, [bien, apport, duration, tier, withIns])

  const apportPct = bien > 0 ? Math.round((apport / bien) * 100) : 0

  return (
    <div className="chc-credit">
      {/* Paramètres */}
      <div className="chc-credit__panel">
        <div className="chc-credit__grid2">
          <NumberField label="Montant du bien" value={bien} onChange={setBien} placeholder="300 000" />
          <NumberField label={`Apport (${apportPct} %)`} value={apport} onChange={setApport} placeholder="30 000" />
        </div>

        <div className="chc-credit__field">
          <label className="chc-credit__label">Durée du prêt</label>
          <div className="chc-credit__pills">
            {DURATIONS.map((d) => (
              <button key={d} className={`chc-credit__pill ${duration === d ? 'is-on' : ''}`} onClick={() => setDuration(d)}>
                {d} ans
              </button>
            ))}
          </div>
        </div>

        <div className="chc-credit__field">
          <label className="chc-credit__label">Votre profil</label>
          <div className="chc-credit__pills">
            {(['excellent', 'bon', 'ordinaire'] as RateTier[]).map((t) => (
              <button key={t} className={`chc-credit__pill ${tier === t ? 'is-on' : ''}`} onClick={() => setTier(t)}>
                {TIER_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        <label className="chc-credit__toggle">
          <input type="checkbox" checked={withIns} onChange={(e) => setWithIns(e.target.checked)} />
          <span className="chc-credit__toggle-box" />
          Inclure une estimation d’assurance emprunteur
        </label>
      </div>

      {/* Résultat */}
      <div className="chc-credit__result">
        <div className="chc-credit__rate">
          <span className="chc-credit__rate-val">{r.rate.toFixed(2).replace('.', ',')} %</span>
          <span className="chc-credit__rate-label">Taux indicatif · {duration} ans</span>
        </div>

        <div className="chc-credit__big">
          <span className="chc-credit__big-val">{euro(r.totalMonthly)}</span>
          <span className="chc-credit__big-label">par mois{withIns ? ' (assurance incluse)' : ''}</span>
        </div>

        <div className="chc-credit__rows">
          <div className="chc-credit__row"><span>Montant emprunté</span><b>{euro(r.principal)}</b></div>
          <div className="chc-credit__row"><span>Mensualité hors assurance</span><b>{euro(r.monthly)}</b></div>
          {withIns && <div className="chc-credit__row"><span>Assurance / mois (est.)</span><b>{euro(r.insMonthly)}</b></div>}
          <div className="chc-credit__row"><span>Coût total du crédit</span><b>{euro(r.coutTotal)}</b></div>
        </div>

        <Link href="/tunnel" className="chc-btn chc-btn-gold chc-credit__cta">
          Affiner avec un expert <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="chc-credit__legal">
          <Info className="w-3.5 h-3.5" />
          Simulation non contractuelle. {RATE_SOURCE}. Les conditions réelles dépendent de votre profil
          (revenus, apport, reste à vivre), de la banque et de l’assurance retenue.
        </p>
      </div>
    </div>
  )
}
