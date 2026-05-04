import type { ScoreLabel, Priority, InternalStatus, LeadStatus, TunnelType, MessageVariant } from '../types'

export const TUNNEL_LABELS: Record<TunnelType, string> = {
  pro: 'Professionnel',
  particulier: 'Particulier',
  reseau: 'Réseau',
}

export const SUBTUNNEL_LABELS: Record<string, string> = {
  tresorerie: 'Trésorerie',
  materiel: 'Matériel',
  vehicule: 'Véhicule',
  reprise: 'Reprise',
  lancement: 'Lancement',
  developpement: 'Développement',
  levee_fonds: 'Levée de fonds',
  residence_principale: 'Résidence principale',
  investissement_locatif: 'Investissement locatif',
  patrimoine: 'Patrimoine',
  assurance_emprunteur: 'Assurance emprunteur',
  recommandation: 'Recommandation',
  apporteur: 'Apporteur',
  partenaire: 'Partenaire',
  courtier: 'Courtier',
}

export const SCORE_LABELS: Record<ScoreLabel, string> = {
  A: 'Score A',
  B: 'Score B',
  C: 'Score C',
  D: 'Score D',
}

export const SCORE_BG: Record<ScoreLabel, string> = {
  A: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  B: 'bg-blue-100 text-blue-800 border-blue-200',
  C: 'bg-amber-100 text-amber-800 border-amber-200',
  D: 'bg-red-100 text-red-800 border-red-200',
}

export const PRIORITY_DOT: Record<Priority, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-400',
  low: 'bg-slate-400',
}

export const INTERNAL_STATUS_LABELS: Record<InternalStatus, string> = {
  hot: 'Chaud',
  warm: 'Tiède',
  cold: 'Froid',
  disqualified: 'Non qualifié',
}

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Nouveau',
  contacted: 'Contacté',
  qualified: 'Qualifié',
  proposal: 'Proposition',
  won: 'Gagné',
  lost: 'Perdu',
  archived: 'Archivé',
}

export const LEAD_STATUS_BG: Record<LeadStatus, string> = {
  new: 'bg-slate-100 text-slate-700 border-slate-200',
  contacted: 'bg-blue-100 text-blue-700 border-blue-200',
  qualified: 'bg-violet-100 text-violet-700 border-violet-200',
  proposal: 'bg-amber-100 text-amber-700 border-amber-200',
  won: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  lost: 'bg-red-100 text-red-700 border-red-200',
  archived: 'bg-slate-100 text-slate-500 border-slate-200',
}

export const MESSAGE_VARIANT_LABELS: Record<MessageVariant, string> = {
  positive: 'Prioritaire',
  neutral: 'Standard',
  conditional: 'Conditionnel',
  redirect: 'Redirigé',
}

export function formatEuro(value: string | number | undefined): string {
  if (value === undefined || value === null || value === '') return '—'
  const num = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : value
  if (isNaN(num) || num === 0) return '—'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatRelativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 5) return "À l'instant"
  if (minutes < 60) return `Il y a ${minutes} min`
  if (hours < 24) return `Il y a ${hours}h`
  if (days < 7) return `Il y a ${days}j`
  return formatDate(dateStr)
}
