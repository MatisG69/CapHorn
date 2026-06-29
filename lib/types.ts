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
