import type { ScoringResult, ScoreLabel, Priority, InternalStatus, MessageVariant } from './types'

export const MESSAGE_VARIANTS: Record<MessageVariant, { title: string; body: string }> = {
  positive: {
    title: 'Votre dossier est prioritaire',
    body: 'Votre profil correspond parfaitement à nos solutions de financement. Guillaume vous contacte dans les 24h pour finaliser votre demande.',
  },
  neutral: {
    title: 'Votre demande est bien enregistrée',
    body: 'Nous avons bien reçu votre dossier. Un expert Cap Horn Conseils vous contacte sous 48h pour étudier votre situation.',
  },
  conditional: {
    title: "Votre dossier est en cours d'analyse",
    body: "Votre demande présente des critères spécifiques. Un expert vous contacte rapidement pour explorer les solutions adaptées à votre situation.",
  },
  redirect: {
    title: 'Nous avons une solution adaptée',
    body: 'Votre profil nous permet de vous orienter vers une solution spécifique. Guillaume vous rappelle pour vous présenter les options disponibles.',
  },
}

function getScoreLabel(score: number): ScoreLabel {
  if (score >= 75) return 'A'
  if (score >= 50) return 'B'
  if (score >= 30) return 'C'
  return 'D'
}

function getPriority(score: number): Priority {
  if (score >= 65) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

function getInternalStatus(score: number, tags: string[]): InternalStatus {
  if (tags.includes('bank_refusal')) return 'disqualified'
  if (score >= 70) return 'hot'
  if (score >= 45) return 'warm'
  if (score >= 25) return 'cold'
  return 'disqualified'
}

function getMessageVariant(score: number, tags: string[]): MessageVariant {
  if (tags.includes('bank_refusal')) return 'redirect'
  if (score >= 70) return 'positive'
  if (score >= 45) return 'neutral'
  return 'conditional'
}

export function scoreLead(answers: Record<string, string>, subType: string): ScoringResult {
  let score = 50
  const tags: string[] = []

  if (answers['common_bank_refusal'] === 'yes') {
    score -= 30
    tags.push('bank_refusal')
  } else if (answers['common_bank_refusal'] === 'no') {
    score += 10
  }

  const revenue = answers['common_revenue']
    ? parseInt(answers['common_revenue'].replace(/\D/g, ''))
    : 0
  if (revenue >= 1000000) { score += 20; tags.push('large_revenue') }
  else if (revenue >= 250000) { score += 10; tags.push('mid_revenue') }
  else if (revenue >= 50000) { score += 5 }
  else if (revenue > 0) { score -= 5; tags.push('small_revenue') }

  const amountKey = `${subType}_amount` in answers ? `${subType}_amount` :
    'tresorerie_amount' in answers ? 'tresorerie_amount' :
    'materiel_amount' in answers ? 'materiel_amount' :
    'vehicule_amount' in answers ? 'vehicule_amount' :
    'lancement_amount' in answers ? 'lancement_amount' :
    'developpement_amount' in answers ? 'developpement_amount' :
    'levee_amount' in answers ? 'levee_amount' : ''

  const amount = amountKey ? parseInt((answers[amountKey] || '0').replace(/\D/g, '')) : 0
  if (amount > 500000) { score += 15; tags.push('large_deal') }
  else if (amount > 100000) { score += 10; tags.push('mid_deal') }
  else if (amount > 20000) { score += 5 }

  if (subType === 'tresorerie') {
    if (answers['tresorerie_step1'] === 'growth') score += 10
    if (answers['tresorerie_step1'] === 'recovery') score -= 10
    if (answers['tresorerie_step1'] === 'seasonal') score += 5
  }

  if (subType === 'reprise') {
    if (answers['reprise_step1'] === 'signed') score += 20
    else if (answers['reprise_step1'] === 'letter') score += 10
    if (answers['reprise_experience'] === 'yes') score += 10
    if (answers['reprise_profitability'] === 'profitable') score += 10
    else if (answers['reprise_profitability'] === 'loss') score -= 15
  }

  if (subType === 'lancement') {
    if (answers['lancement_step1'] === 'registered') score += 15
    else if (answers['lancement_step1'] === 'launched') score += 20
    else if (answers['lancement_step1'] === 'idea') score -= 5
    if (answers['lancement_clients'] === 'yes') score += 15
    else if (answers['lancement_clients'] === 'prospects') score += 8
    if (answers['lancement_bp'] === 'yes') score += 10
  }

  if (subType === 'levee_fonds') {
    if (answers['levee_traction'] === 'revenue') score += 20
    else if (answers['levee_traction'] === 'users') score += 10
    if (answers['levee_fonds_step1'] === 'term_sheet') score += 25
    else if (answers['levee_fonds_step1'] === 'conversations') score += 10
    if (answers['levee_deck'] === 'yes') score += 10
  }

  if (subType === 'vehicule' && answers['vehicule_chosen'] === 'yes') score += 10
  if (subType === 'materiel' && answers['materiel_quote'] === 'yes') score += 15

  score = Math.max(0, Math.min(100, score))

  return {
    score,
    score_label: getScoreLabel(score),
    priority: getPriority(score),
    internal_status: getInternalStatus(score, tags),
    tags,
    message_variant: getMessageVariant(score, tags),
  }
}
