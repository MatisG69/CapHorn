/**
 * Logique PARTAGÉE du simulateur d'économies (assurance emprunteur — loi Lemoine).
 *
 * Ce module est PUR (aucun import serveur) : il est utilisé aussi bien côté
 * client (composant `AssuranceCalculator`) que côté serveur (route
 * `/api/simulateur`, qui recalcule l'estimation pour ne jamais faire confiance
 * aux chiffres envoyés par le navigateur).
 *
 * Les paramètres (taux Cap Horn par tranche d'âge, valeurs par défaut du
 * formulaire) sont réglables par Guillaume depuis `/admin/simulateur`.
 */

/** Paramètres réglables par Guillaume. Taux exprimés en % annuel du capital. */
export interface SimulatorSettings {
  /** Taux Cap Horn (% annuel du capital) par tranche d'âge. */
  rateUnder35: number
  rateUnder45: number
  rateUnder55: number
  rateUnder65: number
  rate65plus: number
  /** Valeurs pré-remplies dans le formulaire côté client. */
  defaultCapital: number
  defaultDurationYears: number
  defaultAge: number
  defaultCurrentPremium: number
}

/** Réglages par défaut — repris des constantes historiques du composant. */
export const DEFAULT_SIMULATOR_SETTINGS: SimulatorSettings = {
  rateUnder35: 0.08,
  rateUnder45: 0.11,
  rateUnder55: 0.16,
  rateUnder65: 0.24,
  rate65plus: 0.35,
  defaultCapital: 180000,
  defaultDurationYears: 18,
  defaultAge: 38,
  defaultCurrentPremium: 85,
}

export interface EstimationInputs {
  capital: number
  durationYears: number
  age: number
  currentPremium: number
}

export interface EstimationResult {
  caphornPremium: number
  monthlySaving: number
  yearlySaving: number
  totalSaving: number
  savingsPercent: number
  currentPremium: number
}

/**
 * Parse un nombre saisi au format français, y compris pour les GROS montants
 * (1 500 000 · 1.500.000 · 1500000 · 85,50).
 *
 * ⚠️ Corrige le bug historique : `Number('1.500.000')` renvoyait `NaN` → 0 →
 * l'estimation « disparaissait » dès qu'on dépassait ~1 M€ en tapant des
 * séparateurs de milliers.
 */
export function parseFrNumber(input: string | number | null | undefined): number {
  if (typeof input === 'number') return Number.isFinite(input) ? input : 0
  if (!input) return 0
  let s = String(input).trim()
  // Séparateurs de milliers en espaces — \s couvre l'espace insécable (U+00A0)
  // et l'espace fine insécable (U+202F) produits par Intl.NumberFormat('fr-FR').
  s = s.replace(/\s/g, '')

  if (s.includes(',')) {
    // Format FR classique : points = milliers, virgule = décimale
    s = s.replace(/\./g, '').replace(',', '.')
  } else {
    const parts = s.split('.')
    if (parts.length > 2) {
      // 1.500.000 → milliers
      s = parts.join('')
    } else if (parts.length === 2 && parts[1].length === 3) {
      // 180.000 → milliers (et non 180,0)
      s = parts.join('')
    }
    // sinon on conserve un éventuel point décimal (ex : "3.5")
  }

  const n = Number(s.replace(/[^\d.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

/** Taux Cap Horn (fraction, ex 0.0008) pour un âge donné selon les réglages. */
export function caphornRate(age: number, s: SimulatorSettings): number {
  const pct =
    age < 35 ? s.rateUnder35 :
    age < 45 ? s.rateUnder45 :
    age < 55 ? s.rateUnder55 :
    age < 65 ? s.rateUnder65 :
    s.rate65plus
  return pct / 100
}

/**
 * Calcule l'estimation. Renvoie `null` UNIQUEMENT si une donnée est absente
 * ou ≤ 0 — jamais à cause d'un montant élevé.
 */
export function computeEstimation(
  inputs: EstimationInputs,
  settings: SimulatorSettings = DEFAULT_SIMULATOR_SETTINGS,
): EstimationResult | null {
  const { capital, durationYears, age, currentPremium } = inputs
  if (
    !Number.isFinite(capital) || capital <= 0 ||
    !Number.isFinite(durationYears) || durationYears <= 0 ||
    !Number.isFinite(age) || age <= 0 ||
    !Number.isFinite(currentPremium) || currentPremium <= 0
  ) {
    return null
  }

  const rate = caphornRate(age, settings)
  const caphornPremium = (capital * rate) / 12
  const monthlySaving = Math.max(0, currentPremium - caphornPremium)
  const yearlySaving = monthlySaving * 12
  const totalSaving = yearlySaving * durationYears
  const savingsPercent = currentPremium > 0 ? (monthlySaving / currentPremium) * 100 : 0

  return { caphornPremium, monthlySaving, yearlySaving, totalSaving, savingsPercent, currentPremium }
}

/** Formatte un montant en euros (sans décimales). */
export function fmtEur(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)))
}
