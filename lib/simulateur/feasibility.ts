/**
 * Faisabilité d'un financement immobilier : endettement, reste à vivre,
 * score indicatif et scénarios d'optimisation.
 *
 * Règles de référence (France, en vigueur) :
 * — Taux d'endettement plafonné à 35 % **assurance comprise** (recommandation
 *   HCSF, juridiquement contraignante depuis janvier 2022).
 * — Durée d'emprunt plafonnée à 25 ans (27 ans en VEFA ou avec travaux
 *   importants, grâce au différé d'amortissement).
 * — Les banques conservent une marge de flexibilité sur 20 % de leur
 *   production trimestrielle : au-delà de 35 %, un dossier reste finançable
 *   mais devient dérogatoire, donc plus exigeant sur le reste du profil.
 *
 * ⚠️ Tous les résultats produits ici sont INDICATIFS et NON CONTRACTUELS.
 * Ils ne préjugent en rien de la décision d'un établissement prêteur.
 */
import { getRate, monthlyPayment, type RateTier } from './rates'

/** Plafond d'endettement HCSF, assurance comprise. */
export const MAX_DEBT_RATIO = 35
/** Au-delà, le dossier passe en dérogatoire (marge des 20 %). */
export const DEROGATION_DEBT_RATIO = 38
/** Durée maximale de droit commun. */
export const MAX_DURATION_YEARS = 25
/** Taux d'assurance emprunteur en délégation (%/an du capital emprunté). */
export const INSURANCE_RATE_PCT = 0.13
/** Frais de notaire indicatifs dans l'ancien (% du prix du bien). */
export const NOTARY_FEES_PCT = 8

/**
 * Reste à vivre de référence, par foyer. Seuils indicatifs couramment
 * retenus par les banques ; ils varient d'un établissement à l'autre.
 */
const RAV_BASE = 800
const RAV_PER_EXTRA_PERSON = 350

/** Séparateur de milliers français, pour les libellés de critères. */
const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n)

export interface SituationInput {
  /** Revenus nets mensuels du foyer, avant impôt. */
  revenus: number
  /** Total des mensualités de crédits déjà en cours. */
  chargesActuelles: number
  /** Nombre de personnes au foyer (adultes + enfants). */
  foyer: number
}

export interface ProjectInput {
  bien: number
  apport: number
  duration: number
  tier: RateTier
  withInsurance: boolean
}

/** Mensualité assurance comprise pour un capital donné. */
export function totalMonthlyFor(
  principal: number,
  annualRatePct: number,
  years: number,
  withInsurance: boolean,
): number {
  const m = monthlyPayment(principal, annualRatePct, years)
  const ins = withInsurance ? (principal * INSURANCE_RATE_PCT) / 100 / 12 : 0
  return m + ins
}

/** Taux d'endettement en % (0 si les revenus ne sont pas renseignés). */
export function debtRatio(charges: number, revenus: number): number {
  if (revenus <= 0) return 0
  return (charges / revenus) * 100
}

/** Reste à vivre mensuel une fois toutes les charges de crédit payées. */
export function resteAVivre(revenus: number, charges: number): number {
  return Math.max(0, revenus - charges)
}

/** Seuil de reste à vivre attendu pour la taille du foyer. */
export function seuilResteAVivre(foyer: number): number {
  return RAV_BASE + Math.max(0, foyer - 1) * RAV_PER_EXTRA_PERSON
}

/**
 * Capacité d'emprunt maximale à 35 % d'endettement.
 *
 * On inverse la formule d'annuité. L'assurance étant proportionnelle au
 * capital, elle entre directement dans le facteur :
 *   mensualité = capital × ( r / (1 − (1+r)^−n) + tauxAssurance/12 )
 */
export function maxCapacity(
  situation: SituationInput,
  project: Pick<ProjectInput, 'duration' | 'tier' | 'withInsurance' | 'apport'>,
): { maxMonthly: number; maxPrincipal: number; maxBien: number } {
  const plafond = (situation.revenus * MAX_DEBT_RATIO) / 100
  const maxMonthly = Math.max(0, plafond - situation.chargesActuelles)

  const rate = getRate(project.duration, project.tier)
  const r = rate / 100 / 12
  const n = project.duration * 12
  const annuity = r === 0 ? 1 / n : r / (1 - Math.pow(1 + r, -n))
  const insFactor = project.withInsurance ? INSURANCE_RATE_PCT / 100 / 12 : 0

  const maxPrincipal = maxMonthly / (annuity + insFactor)
  return {
    maxMonthly,
    maxPrincipal,
    maxBien: maxPrincipal + project.apport,
  }
}

export type CriterionStatus = 'good' | 'warn' | 'bad'

export interface Criterion {
  key: string
  label: string
  /** Valeur affichée à l'utilisateur (déjà formatée côté composant). */
  detail: string
  status: CriterionStatus
  /** Note sur 100 pour ce critère. */
  score: number
  weight: number
}

export interface Feasibility {
  score: number
  level: 'solide' | 'favorable' | 'a-optimiser' | 'difficile'
  label: string
  summary: string
  criteria: Criterion[]
}

/**
 * Score de faisabilité, pondéré sur quatre critères que les banques
 * examinent réellement. Le détail est exposé : un score opaque n'aide
 * personne, et le but est d'expliquer, pas d'impressionner.
 */
export function assessFeasibility(
  situation: SituationInput,
  project: ProjectInput,
  newMonthly: number,
): Feasibility {
  const chargesApres = situation.chargesActuelles + newMonthly
  const endettement = debtRatio(chargesApres, situation.revenus)
  const rav = resteAVivre(situation.revenus, chargesApres)
  const seuilRav = seuilResteAVivre(situation.foyer)
  const apportPct = project.bien > 0 ? (project.apport / project.bien) * 100 : 0

  // 1. Endettement — le critère dominant depuis la règle HCSF.
  let sEndettement = 10
  let stEndettement: CriterionStatus = 'bad'
  if (endettement <= 33) { sEndettement = 100; stEndettement = 'good' }
  else if (endettement <= MAX_DEBT_RATIO) { sEndettement = 80; stEndettement = 'good' }
  else if (endettement <= DEROGATION_DEBT_RATIO) { sEndettement = 45; stEndettement = 'warn' }

  // 2. Apport — il doit au minimum couvrir les frais de notaire (~8 %).
  let sApport = 15
  let stApport: CriterionStatus = 'bad'
  if (apportPct >= 20) { sApport = 100; stApport = 'good' }
  else if (apportPct >= 10) { sApport = 75; stApport = 'good' }
  else if (apportPct >= NOTARY_FEES_PCT) { sApport = 50; stApport = 'warn' }
  else if (apportPct >= 5) { sApport = 35; stApport = 'warn' }

  // 3. Reste à vivre — deux dossiers à 35 % ne se valent pas.
  const ravRatio = seuilRav > 0 ? rav / seuilRav : 0
  let sRav = 15
  let stRav: CriterionStatus = 'bad'
  if (ravRatio >= 1.6) { sRav = 100; stRav = 'good' }
  else if (ravRatio >= 1.1) { sRav = 78; stRav = 'good' }
  else if (ravRatio >= 0.85) { sRav = 45; stRav = 'warn' }

  // 4. Durée — au-delà de 25 ans on sort du cadre de droit commun.
  let sDuree = 30
  let stDuree: CriterionStatus = 'bad'
  if (project.duration <= 20) { sDuree = 100; stDuree = 'good' }
  else if (project.duration <= MAX_DURATION_YEARS) { sDuree = 80; stDuree = 'good' }

  const criteria: Criterion[] = [
    {
      key: 'endettement',
      label: 'Taux d’endettement',
      detail: `${endettement.toFixed(1).replace('.', ',')} % · plafond ${MAX_DEBT_RATIO} %`,
      status: stEndettement, score: sEndettement, weight: 45,
    },
    {
      key: 'apport',
      label: 'Apport personnel',
      detail: `${Math.round(apportPct)} % du prix · frais de notaire ≈ ${NOTARY_FEES_PCT} %`,
      status: stApport, score: sApport, weight: 20,
    },
    {
      key: 'rav',
      label: 'Reste à vivre',
      detail: `${fmt(Math.round(rav))} € / mois · référence ${fmt(seuilRav)} €`,
      status: stRav, score: sRav, weight: 20,
    },
    {
      key: 'duree',
      label: 'Durée du prêt',
      detail: `${project.duration} ans · maximum ${MAX_DURATION_YEARS} ans`,
      status: stDuree, score: sDuree, weight: 15,
    },
  ]

  const totalWeight = criteria.reduce((a, c) => a + c.weight, 0)
  const score = Math.round(criteria.reduce((a, c) => a + c.score * c.weight, 0) / totalWeight)

  let level: Feasibility['level'] = 'difficile'
  let label = 'Difficile en l’état'
  let summary = 'Le projet dépasse les critères habituels. Un ajustement est nécessaire, mais des solutions existent : parlons-en.'
  if (score >= 80) {
    level = 'solide'; label = 'Dossier solide'
    summary = 'Votre projet respecte les grands critères bancaires. L’enjeu devient la négociation des conditions.'
  } else if (score >= 62) {
    level = 'favorable'; label = 'Dossier favorable'
    summary = 'Le projet tient la route. Quelques ajustements peuvent encore améliorer vos conditions.'
  } else if (score >= 42) {
    level = 'a-optimiser'; label = 'À optimiser'
    summary = 'Le projet est envisageable mais demande à être structuré avant présentation aux banques.'
  }

  return { score, level, label, summary, criteria }
}

export interface Scenario {
  key: string
  title: string
  detail: string
  monthly: number
  endettement: number
  /** Écart de coût total par rapport au scénario de référence (€). */
  deltaCost: number
  feasible: boolean
}

/** Coût total du crédit (intérêts + assurance) pour un capital donné. */
function totalCost(principal: number, annualRatePct: number, years: number, withInsurance: boolean): number {
  const m = monthlyPayment(principal, annualRatePct, years)
  const interest = Math.max(0, m * years * 12 - principal)
  const ins = withInsurance ? ((principal * INSURANCE_RATE_PCT) / 100) * years : 0
  return interest + ins
}

/**
 * Scénarios d'optimisation. On ne propose que des leviers réellement
 * actionnables, et on affiche systématiquement la contrepartie (coût total),
 * car allonger la durée soulage la mensualité mais renchérit le crédit.
 */
export function buildScenarios(
  situation: SituationInput,
  project: ProjectInput,
): Scenario[] {
  const principal = Math.max(0, project.bien - project.apport)
  const baseRate = getRate(project.duration, project.tier)
  const baseCost = totalCost(principal, baseRate, project.duration, project.withInsurance)
  const out: Scenario[] = []

  const endettementFor = (monthly: number) =>
    debtRatio(situation.chargesActuelles + monthly, situation.revenus)

  // Levier 1 : allonger la durée (dans la limite des 25 ans).
  const longer = [project.duration + 5, project.duration + 10]
    .filter((d) => d <= MAX_DURATION_YEARS)
    .slice(0, 1)
  for (const d of longer) {
    const rate = getRate(d, project.tier)
    const m = totalMonthlyFor(principal, rate, d, project.withInsurance)
    out.push({
      key: `duree-${d}`,
      title: `Allonger à ${d} ans`,
      detail: `Taux ${rate.toFixed(2).replace('.', ',')} % · mensualité allégée`,
      monthly: m,
      endettement: endettementFor(m),
      deltaCost: totalCost(principal, rate, d, project.withInsurance) - baseCost,
      feasible: endettementFor(m) <= MAX_DEBT_RATIO,
    })
  }

  // Levier 2 : renforcer l'apport de 5 points de prix.
  const extraApport = Math.round((project.bien * 0.05) / 1000) * 1000
  if (extraApport > 0) {
    const p2 = Math.max(0, principal - extraApport)
    const m = totalMonthlyFor(p2, baseRate, project.duration, project.withInsurance)
    out.push({
      key: 'apport',
      title: `Apport +${new Intl.NumberFormat('fr-FR').format(extraApport)} €`,
      detail: 'Moins de capital emprunté, donc moins d’intérêts',
      monthly: m,
      endettement: endettementFor(m),
      deltaCost: totalCost(p2, baseRate, project.duration, project.withInsurance) - baseCost,
      feasible: endettementFor(m) <= MAX_DEBT_RATIO,
    })
  }

  // Levier 3 : le budget maximal tenable à 35 % d'endettement.
  if (situation.revenus > 0) {
    const cap = maxCapacity(situation, project)
    const m = totalMonthlyFor(cap.maxPrincipal, baseRate, project.duration, project.withInsurance)
    out.push({
      key: 'capacite',
      title: `Budget maximal ${new Intl.NumberFormat('fr-FR').format(Math.max(0, Math.round(cap.maxBien / 1000) * 1000))} €`,
      detail: `Le plus haut budget tenable à ${MAX_DEBT_RATIO} % d’endettement`,
      monthly: m,
      endettement: endettementFor(m),
      deltaCost: totalCost(cap.maxPrincipal, baseRate, project.duration, project.withInsurance) - baseCost,
      feasible: true,
    })
  }

  return out
}
