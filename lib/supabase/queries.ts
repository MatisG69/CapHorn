import { createClient } from './server'
import type { Lead, DashboardStats, LeadStatus, AppointmentRequest } from '../types'

/** Demandes de rendez-vous (formulaire « Prendre contact »). Résilient. */
export async function getAppointments(): Promise<AppointmentRequest[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('appointment_requests')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return []
    return (data ?? []) as AppointmentRequest[]
  } catch {
    return []
  }
}

export async function getLeads(filters?: {
  status?: LeadStatus
  tunnel_type?: string
  score_label?: string
  search?: string
  /** true = dossiers finalisés · false = dossiers en cours · undefined = tous */
  completed?: boolean
}): Promise<Lead[]> {
  const supabase = await createClient()

  // Complets → date de finalisation ; sinon (tous / en cours) → dernière activité.
  const orderColumn = filters?.completed === true ? 'created_at' : 'last_activity_at'

  let query = supabase
    .from('leads')
    .select('*')
    .order(orderColumn, { ascending: false })

  if (filters?.completed !== undefined) query = query.eq('completed', filters.completed)
  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.tunnel_type) query = query.eq('tunnel_type', filters.tunnel_type)
  if (filters?.score_label) query = query.eq('score_label', filters.score_label)
  if (filters?.search) {
    query = query.or(
      `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%`,
    )
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as Lead[]
}

/** Compteurs pour les onglets : dossiers complets vs en cours. */
export async function getLeadCounts(): Promise<{ completed: number; inProgress: number }> {
  try {
    const supabase = await createClient()
    const [c, p] = await Promise.all([
      supabase.from('leads').select('id', { count: 'exact', head: true }).eq('completed', true),
      supabase.from('leads').select('id', { count: 'exact', head: true }).eq('completed', false),
    ])
    return { completed: c.count ?? 0, inProgress: p.count ?? 0 }
  } catch {
    return { completed: 0, inProgress: 0 }
  }
}

export interface KpiTrends {
  completed: number[]
  inProgress: number[]
  hot: number[]
  conversion: number[]
}

/** Séries cumulées sur 30 jours pour les sparklines KPI (données réelles). */
export async function getKpiTrends(): Promise<KpiTrends> {
  const empty: KpiTrends = { completed: [], inProgress: [], hot: [], conversion: [] }
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('leads')
      .select('created_at,completed,status,internal_status')
    if (error || !data) return empty

    const rows = data as { created_at: string; completed: boolean; status: string; internal_status: string }[]
    const stamps = rows.map((r) => ({ t: new Date(r.created_at).getTime(), completed: r.completed, won: r.status === 'won', hot: r.internal_status === 'hot' }))

    const today = new Date()
    const completed: number[] = [], inProgress: number[] = [], hot: number[] = [], conversion: number[] = []
    for (let i = 29; i >= 0; i--) {
      const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i, 23, 59, 59, 999).getTime()
      let c = 0, p = 0, h = 0, won = 0, total = 0
      for (const s of stamps) {
        if (s.t <= end) {
          total++
          if (s.completed) c++; else p++
          if (s.hot) h++
          if (s.won) won++
        }
      }
      completed.push(c); inProgress.push(p); hot.push(h)
      conversion.push(total > 0 ? Math.round((won / total) * 100) : 0)
    }
    return { completed, inProgress, hot, conversion }
  } catch {
    return empty
  }
}

export async function getLead(id: string): Promise<Lead | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('leads').select('*').eq('id', id).single()
  if (error) return null
  return data as Lead
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()

  const { data: leads, error } = await supabase
    .from('leads')
    .select('created_at,status,tunnel_type,score_label,internal_status,completed')
  if (error) throw new Error(error.message)

  const all = leads ?? []
  // Les statistiques de pipeline ne portent que sur les dossiers finalisés ;
  // les dossiers en cours sont comptés à part (relances de Guillaume).
  const completedLeads = all.filter((l) => l.completed)
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const weekStart = todayStart - 6 * 86400000

  const leads_by_tunnel: Record<string, number> = {}
  const leads_by_status: Record<string, number> = {}
  const leads_by_score: Record<string, number> = {}
  let hot_leads = 0
  let new_today = 0
  let new_week = 0

  // Score / scoring / fraîcheur : sur les dossiers finalisés (scorés).
  for (const lead of completedLeads) {
    const createdAt = new Date(lead.created_at).getTime()
    if (lead.tunnel_type) leads_by_tunnel[lead.tunnel_type] = (leads_by_tunnel[lead.tunnel_type] ?? 0) + 1
    leads_by_score[lead.score_label] = (leads_by_score[lead.score_label] ?? 0) + 1
    if (lead.internal_status === 'hot') hot_leads++
    if (createdAt >= todayStart) new_today++
    if (createdAt >= weekStart) new_week++
  }

  // Statut / conversion : sur TOUS les leads — un lead peut être gagné ou perdu
  // même s'il n'a pas terminé le tunnel à 100 %.
  for (const lead of all) {
    leads_by_status[lead.status] = (leads_by_status[lead.status] ?? 0) + 1
  }

  const won = leads_by_status['won'] ?? 0
  const totalAll = all.length
  const total = completedLeads.length
  const in_progress = totalAll - total

  return {
    total_leads: total,
    in_progress_leads: in_progress,
    new_leads_today: new_today,
    new_leads_week: new_week,
    hot_leads,
    leads_by_tunnel,
    leads_by_status,
    leads_by_score,
    conversion_rate: totalAll > 0 ? Math.round((won / totalAll) * 100) : 0,
  }
}
