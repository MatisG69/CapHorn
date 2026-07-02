export type TunnelType = 'pro' | 'particulier' | 'reseau'

export type ProSubType =
  | 'tresorerie'
  | 'materiel'
  | 'vehicule'
  | 'reprise'
  | 'lancement'
  | 'developpement'
  | 'levee_fonds'

export type ParticulierSubType =
  | 'residence_principale'
  | 'investissement_locatif'
  | 'patrimoine'
  | 'assurance_emprunteur'

export type ReseauSubType = 'recommandation' | 'apporteur' | 'partenaire' | 'courtier'

export type SubType = ProSubType | ParticulierSubType | ReseauSubType

export type ScoreLabel = 'A' | 'B' | 'C' | 'D'
export type Priority = 'high' | 'medium' | 'low'
export type InternalStatus = 'hot' | 'warm' | 'cold' | 'disqualified'
export type MessageVariant = 'positive' | 'neutral' | 'conditional' | 'redirect'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost' | 'archived'

/** Document justificatif uploadé par le lead (ex. bilan comptable). */
export interface LeadDocument {
  name: string
  /** Chemin dans le bucket Storage `lead-documents` (non public). */
  path: string
  size?: number
}

export interface Lead {
  id: string
  created_at: string
  updated_at: string
  tunnel_type: TunnelType
  sub_type: SubType
  answers: Record<string, string>
  first_name: string
  last_name: string
  email: string
  phone: string
  company_name?: string
  siret?: string
  /** Description libre du projet saisie à la dernière étape (max 3000 car.). */
  project_details?: string
  /** Pièces jointes transmises par le lead. */
  documents?: LeadDocument[]
  consent_rgpd: boolean
  score: number
  score_label: ScoreLabel
  priority: Priority
  internal_status: InternalStatus
  tags: string[]
  message_variant: MessageVariant
  status: LeadStatus
  notes?: string
  assigned_to?: string
  // ── Suivi du dossier / sauvegarde progressive ───────────────────────────
  session_id?: string
  completed: boolean
  progress: number
  current_step?: string
  last_activity_at: string
}

/**
 * Payload envoyé par le tunnel à chaque sauvegarde.
 * `completed: false` → enregistrement progressif (dossier en cours).
 * `completed: true`  → finalisation : déclenche le scoring serveur.
 */
export interface LeadUpsertPayload {
  session_id: string
  tunnel_type: TunnelType
  sub_type?: SubType
  answers: Record<string, string>
  progress: number
  current_step: string
  completed: boolean
  contact?: LeadCaptureData
  /** Description libre du projet (transmise à la finalisation). */
  project_details?: string
  /** Pièces jointes transmises à la finalisation. */
  documents?: LeadDocument[]
}

export type StepType = 'choice' | 'input' | 'contact' | 'capture' | 'finalize' | 'result'

export interface StepOption {
  value: string
  label: string
  description?: string
}

export interface StepConfig {
  id: string
  type: StepType
  title: string
  subtitle?: string
  options?: StepOption[]
  inputType?: 'text' | 'number' | 'email' | 'tel'
  inputLabel?: string
  inputPlaceholder?: string
  inputSuffix?: string
  progressValue?: number
  getNext: (answers: Record<string, string>) => string | null
}

// ─── Tunnel éditable (config déclarative chargée depuis la base) ────────────

export interface TunnelOptionDef {
  value: string
  label: string
  description?: string | null
  next_step_id?: string | null
}

export interface TunnelStepDef {
  id: string
  type: StepType
  title: string
  subtitle?: string | null
  progress: number
  position: number
  inputType?: 'text' | 'number' | 'email' | 'tel' | null
  inputLabel?: string | null
  inputPlaceholder?: string | null
  inputSuffix?: string | null
  options: TunnelOptionDef[]
  default_next_step_id?: string | null
  /** Route selon la réponse d'un champ antérieur (ex: 'entry' pour l'étape contact). */
  branch_on?: string | null
}

export interface TunnelConfig {
  firstStepId: string
  steps: TunnelStepDef[]
}

export type Phase = 'entry' | 'contact' | 'qualification' | 'capture' | 'result'

export interface TunnelState {
  phase: Phase
  currentStepId: string
  answers: Record<string, string>
  visitedSteps: string[]
  isSubmitting: boolean
  submitError: string | null
  sessionId: string
  contact: LeadCaptureData | null
}

export type TunnelAction =
  | { type: 'ANSWER'; stepId: string; value: string; nextStepId: string | null; phase: Phase }
  | { type: 'ADVANCE'; nextStepId: string; phase: Phase }
  | { type: 'BACK'; prevStepId: string; phase: Phase }
  | { type: 'SET_CONTACT'; contact: LeadCaptureData }
  | { type: 'SET_SESSION'; sessionId: string }
  | { type: 'SET_SUBMITTING'; value: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'GO_TO_RESULT'; resultStepId: string }

export interface TrackingEvent {
  event: string
  step?: string
  value?: string
  timestamp: number
}

export interface DashboardStats {
  total_leads: number
  in_progress_leads: number
  new_leads_today: number
  new_leads_week: number
  hot_leads: number
  leads_by_tunnel: Record<string, number>
  leads_by_status: Record<string, number>
  leads_by_score: Record<string, number>
  conversion_rate: number
}

export interface ScoringResult {
  score: number
  score_label: ScoreLabel
  priority: Priority
  internal_status: InternalStatus
  tags: string[]
  message_variant: MessageVariant
}

export interface LeadCaptureData {
  first_name: string
  last_name: string
  email: string
  phone: string
  company_name?: string
  siret?: string
  consent_rgpd: boolean
}

// ─── Blog ─────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string
  created_at: string
  updated_at: string
  title: string
  slug: string
  excerpt: string | null
  body: string
  cover_image_url: string | null
  category: string | null
  author: string
  published: boolean
  published_at: string
}

/** Catégories éditoriales — alignées sur les axes SEO de Cap Horn. */
export const BLOG_CATEGORIES: { value: string; label: string }[] = [
  { value: 'professions-liberales', label: 'Professions libérales' },
  { value: 'immobilier', label: 'Immobilier' },
  { value: 'financement-pro', label: 'Financement pro' },
  { value: 'franchise', label: 'Franchise' },
  { value: 'reprise-transmission', label: 'Reprise & transmission' },
  { value: 'assurance-emprunteur', label: 'Assurance emprunteur' },
  { value: 'actualites', label: 'Actualités & conseils' },
]

export function blogCategoryLabel(value?: string | null): string {
  if (!value) return 'Actualités'
  return BLOG_CATEGORIES.find((c) => c.value === value)?.label ?? value
}

/** État de diffusion d'un article, dérivé de `published` + `published_at`.
 *  - draft     : brouillon, jamais visible publiquement ;
 *  - scheduled : programmé — `published=true` mais `published_at` est dans le
 *                futur ; l'article apparaît tout seul sur le site à cette date ;
 *  - published : en ligne (date de mise en ligne atteinte). */
export type BlogPostStatus = 'draft' | 'scheduled' | 'published'

export function blogPostStatus(
  post: Pick<BlogPost, 'published' | 'published_at'>,
  now: number = Date.now(),
): BlogPostStatus {
  if (!post.published) return 'draft'
  if (post.published_at && new Date(post.published_at).getTime() > now) return 'scheduled'
  return 'published'
}

export const BLOG_STATUS_LABELS: Record<BlogPostStatus, string> = {
  draft: 'Brouillon',
  scheduled: 'Programmé',
  published: 'Publié',
}

// ─── Demandes de rendez-vous (formulaire « Prendre contact ») ───────────────

export type AppointmentStatus = 'new' | 'contacted' | 'scheduled' | 'done' | 'archived'

export interface AppointmentRequest {
  id: string
  created_at: string
  updated_at: string
  first_name: string
  last_name: string
  email: string
  phone: string
  message: string | null
  preferred_slot: string | null
  consent_rgpd: boolean
  status: AppointmentStatus
}

export interface ContactFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  message?: string
  preferred_slot?: string
  consent_rgpd: boolean
}

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  new: 'Nouvelle',
  contacted: 'Contacté',
  scheduled: 'RDV planifié',
  done: 'Traité',
  archived: 'Archivé',
}

/* ── Simulateur — estimations envoyées par les clients ─────────────────── */

export type SimulatorEstimationStatus = 'new' | 'contacted' | 'converted' | 'archived'

export const SIMULATOR_STATUS_LABELS: Record<SimulatorEstimationStatus, string> = {
  new: 'Nouvelle',
  contacted: 'Contacté',
  converted: 'Converti',
  archived: 'Archivé',
}

export interface SimulatorEstimation {
  id: string
  created_at: string
  updated_at: string
  first_name: string
  email: string
  phone: string | null
  consent_rgpd: boolean
  status: SimulatorEstimationStatus
  // Paramètres saisis par le client
  capital: number
  duration_years: number
  age: number
  current_premium: number
  // Résultat recalculé côté serveur
  caphorn_premium: number
  monthly_saving: number
  yearly_saving: number
  total_saving: number
  savings_percent: number
}

/** Corps du POST /api/simulateur (envoi « à Guillaume »). */
export interface SimulatorEstimationPayload {
  first_name: string
  email: string
  phone?: string
  consent_rgpd: boolean
  capital: number
  duration_years: number
  age: number
  current_premium: number
}
