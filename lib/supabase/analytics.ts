import { createClient } from './server'

export interface WebAnalytics {
  hasData: boolean
  totalViews: number
  uniqueVisitors: number
  viewsToday: number
  visitorsToday: number
  days: { date: string; label: string; views: number; visitors: number }[]
  byDevice: { key: string; count: number }[]
  byCountry: { key: string; count: number }[]
  bySection: { key: string; count: number }[]
}

interface ViewRow {
  created_at: string
  section: string | null
  device: string | null
  country: string | null
  visitor_id: string | null
}

const EMPTY: WebAnalytics = {
  hasData: false, totalViews: 0, uniqueVisitors: 0, viewsToday: 0, visitorsToday: 0,
  days: [], byDevice: [], byCountry: [], bySection: [],
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export async function getWebAnalytics(): Promise<WebAnalytics> {
  try {
    const supabase = await createClient()
    const since = new Date(Date.now() - 29 * 86400000)
    since.setHours(0, 0, 0, 0)
    const { data, error } = await supabase
      .from('page_views')
      .select('created_at,section,device,country,visitor_id')
      .gte('created_at', since.toISOString())
    if (error || !data) return EMPTY
    const rows = data as ViewRow[]
    if (rows.length === 0) return { ...EMPTY, hasData: true, days: buildDays(new Map(), new Map()) }

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

    const visitors = new Set<string>()
    const visitorsToday = new Set<string>()
    const deviceMap = new Map<string, number>()
    const countryMap = new Map<string, number>()
    const sectionMap = new Map<string, number>()
    const dayViews = new Map<string, number>()
    const dayVisitors = new Map<string, Set<string>>()
    let viewsToday = 0

    for (const r of rows) {
      const t = new Date(r.created_at)
      const dk = dateKey(t)
      dayViews.set(dk, (dayViews.get(dk) ?? 0) + 1)
      if (r.visitor_id) {
        visitors.add(r.visitor_id)
        if (!dayVisitors.has(dk)) dayVisitors.set(dk, new Set())
        dayVisitors.get(dk)!.add(r.visitor_id)
      }
      if (r.device) deviceMap.set(r.device, (deviceMap.get(r.device) ?? 0) + 1)
      if (r.country) countryMap.set(r.country, (countryMap.get(r.country) ?? 0) + 1)
      if (r.section) sectionMap.set(r.section, (sectionMap.get(r.section) ?? 0) + 1)
      if (t.getTime() >= todayStart) {
        viewsToday++
        if (r.visitor_id) visitorsToday.add(r.visitor_id)
      }
    }

    const toSorted = (m: Map<string, number>) =>
      [...m.entries()].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count)

    return {
      hasData: true,
      totalViews: rows.length,
      uniqueVisitors: visitors.size,
      viewsToday,
      visitorsToday: visitorsToday.size,
      days: buildDays(dayViews, dayVisitors),
      byDevice: toSorted(deviceMap),
      byCountry: toSorted(countryMap).slice(0, 8),
      bySection: toSorted(sectionMap).slice(0, 8),
    }
  } catch {
    return EMPTY
  }
}

function buildDays(dayViews: Map<string, number>, dayVisitors: Map<string, Set<string>>) {
  const out: WebAnalytics['days'] = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
    const k = dateKey(d)
    out.push({
      date: k,
      label: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`,
      views: dayViews.get(k) ?? 0,
      visitors: dayVisitors.get(k)?.size ?? 0,
    })
  }
  return out
}
