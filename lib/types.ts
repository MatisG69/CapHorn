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
}

export type StepType = 'choice' | 'input' | 'capture' | 'result'

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

export type Phase = 'entry' | 'qualification' | 'capture' | 'result'

export interface TunnelState {
  phase: Phase
  currentStepId: string
  answers: Record<string, string>
  visitedSteps: string[]
  isSubmitting: boolean
  submitError: string | null
}

export type TunnelAction =
  | { type: 'ANSWER'; stepId: string; value: string; nextStepId: string | null }
  | { type: 'BACK' }
  | { type: 'SET_SUBMITTING'; value: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'GO_TO_RESULT' }

export interface TrackingEvent {
  event: string
  step?: string
  value?: string
  timestamp: number
}

export interface DashboardStats {
  total_leads: number
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
