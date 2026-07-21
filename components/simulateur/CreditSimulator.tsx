'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Info, TrendingDown } from 'lucide-react'
import {
  DURATIONS,
  RATE_SOURCE,
  TIER_LABELS,
  getRate,
  monthlyPayment,
  totalInterest,
  type RateTier,
} from '@/lib/simulateur/rates'
import {
  DEROGATION_DEBT_RATIO,
  INSURANCE_RATE_PCT,
  MAX_DEBT_RATIO,
  assessFeasibility,
  buildScenarios,
  debtRatio,
  totalMonthlyFor,
} from '@/lib/simulateur/feasibility'

const euro = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
    Math.round(n),
  )
const pct = (n: number) => `${n.toFixed(1).replace('.', ',')} %`

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
  // Projet
  const [bien, setBien] = useState(300000)
  const [apport, setApport] = useState(30000)
  const [duration, setDuration] = useState(20)
  const [tier, setTier] = useState<RateTier>('bon')
  const [withIns, setWithIns] = useState(true)
  // Situation : facultative, c'est elle qui débloque endettement/score/scénarios.
  const [revenus, setRevenus] = useState(0)
  const [charges, setCharges] = useState(0)
  const [foyer, setFoyer] = useState(1)

  const r = useMemo(() => {
    const principal = Math.max(0, bien - apport)
    const rate = getRate(duration, tier)
    const m = monthlyPayment(principal, rate, duration)
    const insMonthly = withIns ? (principal * INSURANCE_RATE_PCT) / 100 / 12 : 0
    const interest = totalInterest(principal, m, duration)
    const insTotal = insMonthly * duration * 12
    return {
      principal, rate,
      monthly: m,
      insMonthly,
      totalMonthly: m + insMonthly,
      interest,
      coutTotal: interest + insTotal,
    }
  }, [bien, apport, duration, tier, withIns])

  const situation = useMemo(
    () => ({ revenus, chargesActuelles: charges, foyer }),
    [revenus, charges, foyer],
  )
  const project = useMemo(
    () => ({ bien, apport, duration, tier, withInsurance: withIns }),
    [bien, apport, duration, tier, withIns],
  )

  const hasSituation = revenus > 0

  /** Grille affichée vs meilleur taux constaté : l'apport du courtier. */
  const negotiation = useMemo(() => {
    const best = getRate(duration, 'excellent')
    const mBest = totalMonthlyFor(r.principal, best, duration, withIns)
    const gainMonthly = r.totalMonthly - mBest
    return {
      best,
      monthlyBest: mBest,
      gainMonthly,
      gainTotal: gainMonthly * duration * 12,
      alreadyBest: tier === 'excellent',
    }
  }, [r.principal, r.totalMonthly, duration, tier, withIns])

  const feas = useMemo(
    () => (hasSituation ? assessFeasibility(situation, project, r.totalMonthly) : null),
    [hasSituation, situation, project, r.totalMonthly],
  )
  const scenarios = useMemo(
    () => (hasSituation ? buildScenarios(situation, project) : []),
    [hasSituation, situation, project],
  )

  const endAvant = debtRatio(charges, revenus)
  const endApres = debtRatio(charges + r.totalMonthly, revenus)
  const apportPct = bien > 0 ? Math.round((apport / bien) * 100) : 0

  /** Position sur la jauge : 45 % d'endettement occupe toute la largeur. */
  const gaugePos = (v: number) => Math.min(100, (v / 45) * 100)

  return (
    <div className="chc-credit">
      {/* ── Paramètres ──────────────────────────────────────────────── */}
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

        <div className="chc-credit__sep">
          <span>Votre situation</span>
          <em>facultatif, pour calculer votre endettement</em>
        </div>
        <div className="chc-credit__grid2">
          <NumberField label="Revenus nets du foyer" value={revenus} onChange={setRevenus} placeholder="4 500" />
          <NumberField label="Crédits en cours" value={charges} onChange={setCharges} placeholder="0" />
        </div>
        <div className="chc-credit__field">
          <label className="chc-credit__label">Personnes au foyer</label>
          <div className="chc-credit__pills">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className={`chc-credit__pill ${foyer === n ? 'is-on' : ''}`} onClick={() => setFoyer(n)}>
                {n}{n === 5 ? '+' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Résultat ────────────────────────────────────────────────── */}
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

        {/* Barème affiché vs meilleur taux constaté */}
        {!negotiation.alreadyBest && negotiation.gainMonthly > 0 && (
          <div className="chc-credit__nego">
            <div className="chc-credit__nego-head">
              <TrendingDown className="w-4 h-4" aria-hidden />
              Ce qu’un dossier bien présenté peut changer
            </div>
            <div className="chc-credit__nego-cols">
              <div>
                <span className="chc-credit__nego-k">Votre grille</span>
                <b>{r.rate.toFixed(2).replace('.', ',')} %</b>
                <span className="chc-credit__nego-sub">{euro(r.totalMonthly)} / mois</span>
              </div>
              <div className="is-best">
                <span className="chc-credit__nego-k">Meilleur taux constaté</span>
                <b>{negotiation.best.toFixed(2).replace('.', ',')} %</b>
                <span className="chc-credit__nego-sub">{euro(negotiation.monthlyBest)} / mois</span>
              </div>
            </div>
            <p className="chc-credit__nego-gain">
              Soit <b>{euro(negotiation.gainMonthly)} / mois</b> et{' '}
              <b>{euro(negotiation.gainTotal)}</b> sur {duration} ans.
            </p>
            <p className="chc-credit__nego-note">
              Écart entre le taux d’un profil standard et le meilleur taux de la grille, à durée
              identique. L’accès à ce dernier dépend de votre dossier : il n’est pas garanti.
            </p>
          </div>
        )}

        {/* ── Analyse débloquée par les revenus ─────────────────────── */}
        {!hasSituation ? (
          <p className="chc-credit__prompt">
            Renseignez vos revenus pour obtenir votre <b>taux d’endettement</b>, un{' '}
            <b>score de faisabilité</b> et des <b>scénarios</b> d’optimisation.
          </p>
        ) : (
          <>
            <div className="chc-credit__block">
              <h3 className="chc-credit__block-title">Vos mensualités</h3>
              <div className="chc-credit__ba">
                <div>
                  <span className="chc-credit__ba-k">Aujourd’hui</span>
                  <b>{euro(charges)}</b>
                  <span className="chc-credit__ba-sub">{pct(endAvant)} d’endettement</span>
                </div>
                <ArrowRight className="w-4 h-4 chc-credit__ba-arrow" aria-hidden />
                <div className={endApres > MAX_DEBT_RATIO ? 'is-over' : 'is-ok'}>
                  <span className="chc-credit__ba-k">Avec ce projet</span>
                  <b>{euro(charges + r.totalMonthly)}</b>
                  <span className="chc-credit__ba-sub">{pct(endApres)} d’endettement</span>
                </div>
              </div>

              <div className="chc-credit__gauge">
                <div className="chc-credit__gauge-track">
                  <span
                    className={`chc-credit__gauge-fill ${
                      endApres > DEROGATION_DEBT_RATIO ? 'is-bad' : endApres > MAX_DEBT_RATIO ? 'is-warn' : 'is-good'
                    }`}
                    style={{ width: `${gaugePos(endApres)}%` }}
                  />
                  <span className="chc-credit__gauge-limit" style={{ left: `${gaugePos(MAX_DEBT_RATIO)}%` }} />
                </div>
                <div className="chc-credit__gauge-legend">
                  <span>0 %</span>
                  <span className="chc-credit__gauge-mark">Plafond {MAX_DEBT_RATIO} %</span>
                  <span>45 %</span>
                </div>
              </div>
            </div>

            {feas && (
              <div className="chc-credit__block">
                <h3 className="chc-credit__block-title">Faisabilité</h3>
                <div className={`chc-credit__score is-${feas.level}`}>
                  <div className="chc-credit__score-num">
                    <b>{feas.score}</b><span>/100</span>
                  </div>
                  <div>
                    <p className="chc-credit__score-label">{feas.label}</p>
                    <p className="chc-credit__score-sum">{feas.summary}</p>
                  </div>
                </div>
                <ul className="chc-credit__criteria">
                  {feas.criteria.map((c) => (
                    <li key={c.key} className={`is-${c.status}`}>
                      <span className="chc-credit__crit-dot" aria-hidden />
                      <span className="chc-credit__crit-label">{c.label}</span>
                      <span className="chc-credit__crit-detail">{c.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {scenarios.length > 0 && (
              <div className="chc-credit__block">
                <h3 className="chc-credit__block-title">Scénarios</h3>
                <div className="chc-credit__scenarios">
                  {scenarios.map((s) => (
                    <div key={s.key} className={`chc-credit__scenario ${s.feasible ? 'is-ok' : 'is-over'}`}>
                      <p className="chc-credit__scenario-title">{s.title}</p>
                      <p className="chc-credit__scenario-detail">{s.detail}</p>
                      <div className="chc-credit__scenario-nums">
                        <span><b>{euro(s.monthly)}</b> / mois</span>
                        <span className={s.endettement > MAX_DEBT_RATIO ? 'is-over' : ''}>{pct(s.endettement)}</span>
                      </div>
                      <p className="chc-credit__scenario-delta">
                        {s.deltaCost >= 0 ? 'Coût total +' : 'Coût total −'}{euro(Math.abs(s.deltaCost))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <Link href="/tunnel" className="chc-btn chc-btn-gold chc-credit__cta">
          Affiner avec un expert <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="chc-credit__legal">
          <Info className="w-3.5 h-3.5" />
          Simulation non contractuelle, sans valeur d’offre de prêt. {RATE_SOURCE}. Le plafond
          d’endettement de {MAX_DEBT_RATIO} % suit la recommandation HCSF ; les banques conservent
          une marge de dérogation. Les conditions réelles dépendent de votre dossier complet.
        </p>
      </div>
    </div>
  )
}
