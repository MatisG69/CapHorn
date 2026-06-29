/**
 * Grille de taux de crédit immobilier — indicative, basée sur les données
 * Pretto (historique des taux, juin 2026). Valeurs ancrées sur les chiffres
 * publiés (15, 20 et 25 ans) et interpolées pour 7 et 10 ans.
 *
 * Source : pretto.fr/taux-immobilier — mise à jour juin 2026.
 * ⚠️ Simulation NON CONTRACTUELLE : les taux réels dépendent du profil
 * (revenus, apport, reste à vivre, banque, assurance…).
 */
export type RateTier = 'excellent' | 'bon' | 'ordinaire'

export interface DurationRates {
  excellent: number
  bon: number
  ordinaire: number
}

export const RATE_GRID: Record<number, DurationRates> = {
  7: { excellent: 2.95, bon: 3.05, ordinaire: 3.2 },
  10: { excellent: 3.1, bon: 3.2, ordinaire: 3.35 },
  15: { excellent: 3.24, bon: 3.34, ordinaire: 3.45 }, // Pretto : meilleur 3,24 %
  20: { excellent: 3.3, bon: 3.49, ordinaire: 3.65 }, // Pretto : 3,30 / 3,49 / 3,65 %
  25: { excellent: 3.49, bon: 3.62, ordinaire: 3.75 }, // Pretto : meilleur 3,49 %
}

export const DURATIONS = [7, 10, 15, 20, 25]

export const RATE_SOURCE = 'Grille indicative — Pretto, juin 2026'

export const TIER_LABELS: Record<RateTier, string> = {
  excellent: 'Excellent profil',
  bon: 'Bon profil',
  ordinaire: 'Profil standard',
}

/** Taux annuel (%) pour une durée + un niveau de profil. */
export function getRate(duration: number, tier: RateTier): number {
  const row = RATE_GRID[duration] ?? RATE_GRID[20]
  return row[tier]
}

/** Mensualité d'un prêt amortissable (hors assurance). */
export function monthlyPayment(principal: number, annualRatePct: number, years: number): number {
  if (principal <= 0) return 0
  const n = years * 12
  const r = annualRatePct / 100 / 12
  if (r === 0) return principal / n
  return (principal * r) / (1 - Math.pow(1 + r, -n))
}

/** Coût total des intérêts. */
export function totalInterest(principal: number, monthly: number, years: number): number {
  return Math.max(0, monthly * years * 12 - principal)
}
