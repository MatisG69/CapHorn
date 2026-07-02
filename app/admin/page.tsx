import { getDashboardStats, getLeads, getLeadCounts, getKpiTrends } from '@/lib/supabase/queries'
import { TUNNEL_LABELS, SUBTUNNEL_LABELS, SCORE_BG, formatRelativeDate } from '@/lib/admin/labels'
import { Folder, Clock, Flame, TrendingUp, Bell, Download, Calendar, Eye, MoreVertical, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

// Palette de score cohérente avec les badges (SCORE_BG) : A vert, B bleu, C ambre, D rouge.
const SCORE_COLORS: Record<string, string> = { A: '#16a34a', B: '#2563eb', C: '#d97706', D: '#dc2626' }
const SCORE_LEGEND_DOT: Record<string, string> = SCORE_COLORS

export default async function AdminDashboard() {
  const [stats, recent, counts, trends] = await Promise.all([getDashboardStats(), getLeads(), getLeadCounts(), getKpiTrends()])
  const recentLeads = recent.slice(0, 6)
  const totalAll = counts.completed + counts.inProgress

  // Donut — répartition par score (dossiers finalisés)
  const scoreTotal = (['A', 'B', 'C', 'D'] as const).reduce((s, k) => s + (stats.leads_by_score[k] ?? 0), 0)
  const scoreSegments = (['A', 'B', 'C', 'D'] as const).map((k) => ({
    key: k, count: stats.leads_by_score[k] ?? 0, color: SCORE_COLORS[k],
    pct: scoreTotal > 0 ? Math.round(((stats.leads_by_score[k] ?? 0) / scoreTotal) * 100) : 0,
  }))

  // Funnel — pipeline par statut (tous les leads)
  const st = stats.leads_by_status
  const funnel = [
    { label: 'Nouveaux leads', count: totalAll, color: '#C9A45C' },
    { label: 'Contactés', count: (st['contacted'] ?? 0) + (st['qualified'] ?? 0) + (st['proposal'] ?? 0) + (st['won'] ?? 0), color: '#A9A48C' },
    { label: 'Qualifiés', count: (st['qualified'] ?? 0) + (st['proposal'] ?? 0) + (st['won'] ?? 0), color: '#8FA98C' },
    { label: 'Proposition', count: (st['proposal'] ?? 0) + (st['won'] ?? 0), color: '#C98C8C' },
    { label: 'Gagnés', count: st['won'] ?? 0, color: '#7BB37B' },
  ]

  const kpis = [
    { label: 'Dossiers complets', value: counts.completed, icon: Folder, tint: 'rgba(184,146,42,0.12)', color: '#B8922A', spark: '#C9A45C', data: trends.completed, pill: stats.new_leads_week > 0 ? { t: `+${stats.new_leads_week} cette sem.`, c: 'green' } : null, sub: 'Finalisés à 100 %' },
    { label: 'Dossiers en cours', value: counts.inProgress, icon: Clock, tint: 'rgba(217,119,6,0.12)', color: '#d97706', spark: '#e0a45c', data: trends.inProgress, pill: counts.inProgress > 0 ? { t: 'à relancer', c: 'amber' } : null, sub: 'Non finalisés' },
    { label: 'Leads chauds', value: stats.hot_leads, icon: Flame, tint: 'rgba(220,38,38,0.10)', color: '#dc2626', spark: '#e07a7a', data: trends.hot, pill: stats.hot_leads > 0 ? { t: 'priorité', c: 'red' } : null, sub: 'Priorité haute' },
    { label: 'Taux de conversion', value: `${stats.conversion_rate}%`, icon: TrendingUp, tint: 'rgba(22,163,74,0.12)', color: '#16a34a', spark: '#5fb87f', data: trends.conversion, pill: (st['won'] ?? 0) > 0 ? { t: `${st['won']} gagnés`, c: 'green' } : null, sub: 'Leads gagnés / total' },
  ] as const

  return (
    <div className="p-7 lg:p-9 space-y-7">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-[var(--color-cream-dim)]">Bonjour, Admin 👋</p>
          <h1 className="mt-1 text-[2.4rem] leading-none text-[var(--color-cream)]" style={{ fontFamily: 'var(--font-cormorant), serif', fontWeight: 500, letterSpacing: '-0.02em' }}>
            Vue d’ensemble
          </h1>
          <p className="text-sm text-[var(--color-cream-dim)] mt-2.5">Activité commerciale et santé du pipeline en temps réel.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[var(--color-ink-line)] bg-[var(--color-ink-soft)] text-sm text-[var(--color-cream-dim)]">
            <Calendar className="w-4 h-4 text-[var(--color-cream-mute)]" /> 30 derniers jours
          </span>
          <Link href="/admin/leads" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16130E] text-white text-sm font-medium hover:bg-[#2a251d] transition-colors">
            <Download className="w-4 h-4" /> Exporter
          </Link>
          <Link href="/admin/leads?view=en-cours" className="relative w-11 h-11 rounded-xl border border-[var(--color-ink-line)] bg-[var(--color-ink-soft)] flex items-center justify-center text-[var(--color-cream-dim)] hover:text-[var(--color-cream)] transition-colors" aria-label="Dossiers en cours">
            <Bell className="w-5 h-5" />
            {counts.inProgress > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#dc2626] text-white text-[10px] font-semibold flex items-center justify-center">{counts.inProgress}</span>
            )}
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="admin-card !p-5 overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: k.tint }}>
                  <k.icon className="w-[18px] h-[18px]" style={{ color: k.color }} strokeWidth={2} />
                </span>
                <span className="text-[13px] font-medium text-[var(--color-cream-dim)]">{k.label}</span>
              </div>
              <MoreVertical className="w-4 h-4 text-[var(--color-cream-mute)]" />
            </div>
            <div className="flex items-end gap-2 mt-4">
              <span className="text-[2.2rem] leading-none font-semibold text-[var(--color-cream)] tabular-nums tracking-tight">{k.value}</span>
              {k.pill && <Pill text={k.pill.t} color={k.pill.c} />}
            </div>
            <p className="text-xs text-[var(--color-cream-mute)] mt-2.5">{k.sub}</p>
            <Sparkline color={k.spark} data={k.data} />
          </div>
        ))}
      </div>

      {/* Donut + Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Score donut */}
        <div className="admin-card !p-6">
          <h2 className="text-[15px] font-semibold text-[var(--color-cream)] mb-5">Répartition par score</h2>
          {scoreTotal === 0 ? (
            <p className="text-sm text-[var(--color-cream-mute)] py-8 text-center">Aucun dossier finalisé.</p>
          ) : (
            <div className="flex items-center gap-6 flex-wrap">
              <Donut segments={scoreSegments} total={scoreTotal} />
              <div className="flex-1 min-w-[180px] space-y-3">
                {scoreSegments.map((s) => (
                  <div key={s.key} className="flex items-center gap-3 text-sm">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: SCORE_LEGEND_DOT[s.key] }} />
                    <span className="text-[var(--color-cream-dim)] flex-1">Score {s.key}</span>
                    <span className="text-[var(--color-cream-mute)] tabular-nums">{s.count} leads</span>
                    <span className="text-[var(--color-cream)] font-medium tabular-nums w-10 text-right">{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Link href="/admin/leads" className="mt-6 flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--color-ink-line)] text-sm text-[var(--color-cream-dim)] hover:text-[var(--color-cream)] hover:border-[var(--color-gold-deep)] transition-colors">
            Voir tous les leads <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Funnel */}
        <div className="admin-card !p-6">
          <h2 className="text-[15px] font-semibold text-[var(--color-cream)] mb-5">Pipeline de conversion</h2>
          <div className="flex items-center gap-6 flex-wrap">
            <Funnel stages={funnel} />
            <div className="flex-1 min-w-[200px] space-y-3.5">
              {funnel.map((f) => {
                const pct = totalAll > 0 ? Math.round((f.count / totalAll) * 100) : 0
                return (
                  <div key={f.label} className="flex items-center gap-3 text-sm">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: f.color }} />
                    <span className="text-[var(--color-cream-dim)] flex-1">{f.label}</span>
                    <span className="text-[var(--color-cream)] font-medium tabular-nums">{f.count}</span>
                    <span className="text-[var(--color-cream-mute)] tabular-nums w-10 text-right">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[var(--color-ink-raised)]">
            <span className="text-sm text-[var(--color-cream-dim)]">Taux de conversion global</span>
            <span className="text-sm font-semibold px-2.5 py-1 rounded-lg" style={{ background: 'rgba(184,146,42,0.16)', color: '#8A6B12' }}>{stats.conversion_rate}%</span>
          </div>
        </div>
      </div>

      {/* Recent leads */}
      <div className="admin-card !p-0 overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-[var(--color-cream)]">Leads récents</h2>
          <Link href="/admin/leads" className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-gold)] hover:text-[var(--color-gold-deep)]">
            Voir tous les leads <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <div className="py-14 text-center text-[var(--color-cream-mute)] text-sm">Aucun lead pour le moment.</div>
        ) : (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[2fr_1.4fr_0.7fr_1.1fr_1.1fr_0.7fr] gap-4 px-6 py-3 border-y border-[var(--color-ink-line)] text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-cream-mute)] min-w-[860px]">
              <span>Lead</span><span>Entreprise</span><span>Score</span><span>Statut</span><span>Dernière activité</span><span className="text-right">Action</span>
            </div>
            <div className="divide-y divide-[var(--color-ink-line)] min-w-[860px]">
              {recentLeads.map((lead) => {
                const name = lead.first_name || lead.last_name ? `${lead.first_name ?? ''} ${lead.last_name ?? ''}`.trim() : 'Anonyme'
                const initials = (name === 'Anonyme' ? 'A' : name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('')).toUpperCase()
                return (
                  <div key={lead.id} className="grid grid-cols-[2fr_1.4fr_0.7fr_1.1fr_1.1fr_0.7fr] gap-4 px-6 py-3.5 items-center hover:bg-[var(--color-ink-raised)] transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0" style={{ background: 'linear-gradient(150deg, #C9A45C, #8A6F2A)' }}>{initials}</span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-[var(--color-cream)] truncate">{name}</span>
                        <span className="block text-xs text-[var(--color-cream-mute)] truncate">{lead.email ?? '—'}</span>
                      </span>
                    </div>
                    <span className="text-sm text-[var(--color-cream-dim)] truncate">
                      {lead.company_name ?? (lead.tunnel_type ? TUNNEL_LABELS[lead.tunnel_type] : '—')}
                      {lead.sub_type && !lead.company_name ? <span className="text-[var(--color-cream-mute)]"> · {SUBTUNNEL_LABELS[lead.sub_type] ?? lead.sub_type}</span> : null}
                    </span>
                    <span>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${SCORE_BG[lead.score_label]}`}>{lead.completed ? lead.score_label : '—'}</span>
                    </span>
                    <span className={`text-xs font-medium ${lead.completed ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {lead.completed ? 'Dossier complet' : `En cours · ${lead.progress}%`}
                    </span>
                    <span className="text-xs text-[var(--color-cream-mute)]">{formatRelativeDate(lead.last_activity_at ?? lead.created_at)}</span>
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/leads/${lead.id}`} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-cream-mute)] hover:text-[var(--color-cream)] hover:bg-[var(--color-ink-raised)]" aria-label="Voir"><Eye className="w-4 h-4" /></Link>
                      <Link href={`/admin/leads/${lead.id}`} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-cream-mute)] hover:text-[var(--color-cream)] hover:bg-[var(--color-ink-raised)]" aria-label="Plus"><MoreVertical className="w-4 h-4" /></Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Pill({ text, color }: { text: string; color: string }) {
  const map: Record<string, string> = {
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
  }
  return <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${map[color] ?? map.green}`}>{text}</span>
}

function Sparkline({ color, data }: { color: string; data: readonly number[] }) {
  // Courbe réelle — cumul sur 30 jours
  const pts = data && data.length > 1 ? data : [0, 0]
  const W = 240, H = 36
  const max = Math.max(1, ...pts)
  const min = Math.min(...pts)
  const range = Math.max(1, max - min)
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i / (pts.length - 1)) * W} ${H - 2 - ((p - min) / range) * (H - 6)}`).join(' ')
  const area = `${path} L ${W} ${H} L 0 ${H} Z`
  const id = `spk-${color.replace('#', '')}`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full mt-3" style={{ height: 36 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Donut({ segments, total }: { segments: { key: string; count: number; color: string }[]; total: number }) {
  const R = 62, sw = 22, cx = 80, cy = 80
  const C = 2 * Math.PI * R
  const active = segments.filter((s) => s.count > 0)
  return (
    <svg viewBox="0 0 160 160" style={{ width: 160, height: 160 }}>
      <circle r={R} cx={cx} cy={cy} fill="none" stroke="#EEE9DE" strokeWidth={sw} />
      {active.map((s, i) => {
        const priorCount = active.slice(0, i).reduce((a, x) => a + x.count, 0)
        const offset = (priorCount / total) * C
        const len = (s.count / total) * C
        return (
          <circle key={s.key} r={R} cx={cx} cy={cy} fill="none" stroke={s.color} strokeWidth={sw}
            strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} transform={`rotate(-90 ${cx} ${cy})`} />
        )
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 30, fontWeight: 600, fill: 'var(--color-cream)', fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}>{total}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" style={{ fontSize: 11, fill: 'var(--color-cream-mute)', letterSpacing: '0.1em' }}>LEADS</text>
    </svg>
  )
}

function Funnel({ stages }: { stages: { label: string; count: number; color: string }[] }) {
  const W = 180, bandH = 34, gap = 4, H = stages.length * (bandH + gap)
  const max = Math.max(1, ...stages.map((s) => s.count))
  const widthFor = (c: number) => 40 + (c / max) * (W - 40) // largeur min 40
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W, height: H }}>
      {stages.map((s, i) => {
        const y = i * (bandH + gap)
        const wTop = widthFor(s.count)
        const wBot = widthFor(i < stages.length - 1 ? stages[i + 1].count : s.count * 0.6)
        const xTopL = (W - wTop) / 2, xTopR = (W + wTop) / 2
        const xBotL = (W - wBot) / 2, xBotR = (W + wBot) / 2
        return (
          <polygon key={s.label} points={`${xTopL},${y} ${xTopR},${y} ${xBotR},${y + bandH} ${xBotL},${y + bandH}`} fill={s.color} opacity={0.92} />
        )
      })}
    </svg>
  )
}
