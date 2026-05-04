import { createClient } from './server'
import type { Lead, DashboardStats, LeadStatus } from '../types'

export async function getLeads(filters?: {
  status?: LeadStatus
  tunnel_type?: string
  score_label?: string
  search?: string
}): Promise<Lead[]> {
  const supabase = await createClient()

  let query = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

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
    .select('created_at,status,tunnel_type,score_label,internal_status')
  if (error) throw new Error(error.message)

  const all = leads ?? []
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const weekStart = todayStart - 6 * 86400000

  const leads_by_tunnel: Record<string, number> = {}
  const leads_by_status: Record<string, number> = {}
  const leads_by_score: Record<string, number> = {}
  let hot_leads = 0
  let new_today = 0
  let new_week = 0

  for (const lead of all) {
    const createdAt = new Date(lead.created_at).getTime()

    leads_by_tunnel[lead.tunnel_type] = (leads_by_tunnel[lead.tunnel_type] ?? 0) + 1
    leads_by_status[lead.status] = (leads_by_status[lead.status] ?? 0) + 1
    leads_by_score[lead.score_label] = (leads_by_score[lead.score_label] ?? 0) + 1

    if (lead.internal_status === 'hot') hot_leads++
    if (createdAt >= todayStart) new_today++
    if (createdAt >= weekStart) new_week++
  }

  const won = leads_by_status['won'] ?? 0
  const total = all.length

  return {
    total_leads: total,
    new_leads_today: new_today,
    new_leads_week: new_week,
    hot_leads,
    leads_by_tunnel,
    leads_by_status,
    leads_by_score,
    conversion_rate: total > 0 ? Math.round((won / total) * 100) : 0,
  }
}
