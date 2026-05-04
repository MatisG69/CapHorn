import { getDashboardStats, getLeads } from '@/lib/supabase/queries'
import {
  TUNNEL_LABELS,
  SUBTUNNEL_LABELS,
  SCORE_BG,
  PRIORITY_DOT,
  formatRelativeDate,
} from '@/lib/admin/labels'
import { Users, TrendingUp, Flame, Calendar } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [stats, recentLeads] = await Promise.all([
    getDashboardStats(),
    getLeads(),
  ])

  const recent = recentLeads.slice(0, 8)

  const kpis = [
    {
      label: 'Total leads',
      value: stats.total_leads,
      icon: Users,
      sub: `+${stats.new_leads_week} cette semaine`,
    },
    {
      label: "Aujourd'hui",
      value: stats.new_leads_today,
      icon: Calendar,
      sub: 'Nouveaux leads',
    },
    {
      label: 'Leads chauds',
      value: stats.hot_leads,
      icon: Flame,
      sub: 'Priorité haute',
    },
    {
      label: 'Conversion',
      value: `${stats.conversion_rate}%`,
      icon: TrendingUp,
      sub: 'Leads gagnés',
    },
  ]

  return (
    <div className="p-8 lg:p-10 space-y-10">
      {/* Page header — pattern éditorial cohérent */}
      <div className="page-header">
        <span className="page-header__index">01 — Pilotage</span>
        <h1 className="page-header__title">
          Vue d&apos;ensemble
        </h1>
        <p className="page-header__lead">
          Activité commerciale et santé du pipeline en temps réel.
        </p>
      </div>

      {/* KPIs avec sparkline mini-chart */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, sub }) => (
          <div key={label} className="admin-card group transition-colors hover:bg-[rgba(201,168,76,0.02)]">
            <div className="flex items-start justify-between mb-5">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)]">
                {label}
              </p>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[rgba(201,168,76,0.08)] border border-[var(--color-ink-line)] transition-all duration-200 group-hover:bg-[rgba(201,168,76,0.14)] group-hover:border-[rgba(201,168,76,0.3)]">
                <Icon className="w-4 h-4 text-[var(--color-gold)]" strokeWidth={1.7} />
              </div>
            </div>
            <p className="display-serif text-[2.5rem] text-[var(--color-gold-soft)] tabular-nums leading-none animate-number-pop">
              {value}
            </p>
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-[var(--color-cream-dim)]">{sub}</p>
              {/* Sparkline décoratif (placeholder pattern, données réelles plus tard) */}
              <svg className="sparkline w-16" viewBox="0 0 64 28" preserveAspectRatio="none" aria-hidden>
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity="0.7"
                  points="0,22 8,18 16,20 24,12 32,15 40,8 48,10 56,5 64,7"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Score & Tunnel distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score */}
        <div className="admin-card">
          <h2 className="eyebrow eyebrow--single mb-5">Répartition par score</h2>
          <div className="space-y-3">
            {(['A', 'B', 'C', 'D'] as const).map((score) => {
              const count = stats.leads_by_score[score] ?? 0
              const pct = stats.total_leads > 0 ? Math.round((count / stats.total_leads) * 100) : 0
              return (
                <div key={score} className="flex items-center gap-3">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${SCORE_BG[score]}`}>
                    {score}
                  </span>
                  <div className="flex-1 h-1.5 bg-[var(--color-ink-raised)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: 'linear-gradient(90deg, var(--color-gold-deep), var(--color-gold-soft))',
                      }}
                    />
                  </div>
                  <span className="text-xs text-[var(--color-cream-dim)] tabular-nums w-14 text-right font-mono">
                    {count} ({pct}%)
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tunnel */}
        <div className="admin-card">
          <h2 className="eyebrow eyebrow--single mb-5">Répartition par tunnel</h2>
          <div className="space-y-2.5">
            {Object.entries(stats.leads_by_tunnel)
              .sort(([, a], [, b]) => b - a)
              .map(([tunnel, count]) => {
                const pct = stats.total_leads > 0 ? Math.round((count / stats.total_leads) * 100) : 0
                const label = TUNNEL_LABELS[tunnel as keyof typeof TUNNEL_LABELS] ??
                  SUBTUNNEL_LABELS[tunnel] ?? tunnel
                return (
                  <div key={tunnel} className="flex items-center gap-3">
                    <span className="text-sm text-[var(--color-cream-dim)] w-36 truncate">{label}</span>
                    <div className="flex-1 h-1.5 bg-[var(--color-ink-raised)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: 'linear-gradient(90deg, var(--color-gold-deep), var(--color-gold-soft))',
                        }}
                      />
                    </div>
                    <span className="text-xs text-[var(--color-cream-mute)] tabular-nums w-8 text-right font-mono">
                      {count}
                    </span>
                  </div>
                )
              })}
            {Object.keys(stats.leads_by_tunnel).length === 0 && (
              <p className="text-sm text-[var(--color-cream-mute)] text-center py-4">Aucune donnée</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent leads */}
      <div className="admin-card !p-0">
        <div className="px-6 py-4 border-b border-[var(--color-ink-line)] flex items-center justify-between">
          <h2 className="eyebrow eyebrow--single">Leads récents</h2>
          <Link
            href="/admin/leads"
            className="text-xs text-[var(--color-gold-soft)] hover:text-[var(--color-gold)] font-mono uppercase tracking-[0.18em]"
          >
            Voir tous →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="py-16 text-center text-[var(--color-cream-mute)] text-sm">
            Aucun lead pour le moment
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-ink-line)]">
            {recent.map((lead) => (
              <Link
                key={lead.id}
                href={`/admin/leads/${lead.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-[rgba(201,168,76,0.04)] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOT[lead.priority]}`} />
                    <span className="text-sm font-medium text-[var(--color-cream)] truncate">
                      {lead.first_name} {lead.last_name}
                    </span>
                    <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded border ${SCORE_BG[lead.score_label]}`}>
                      {lead.score_label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-[var(--color-cream-mute)]">
                      {TUNNEL_LABELS[lead.tunnel_type]} — {SUBTUNNEL_LABELS[lead.sub_type] ?? lead.sub_type}
                    </span>
                    {lead.company_name && (
                      <span className="text-xs text-[var(--color-cream-mute)]">· {lead.company_name}</span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-[var(--color-cream-mute)] shrink-0 font-mono">
                  {formatRelativeDate(lead.created_at)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
