import { getDashboardStats } from '@/lib/supabase/queries'
import {
  TUNNEL_LABELS,
  SUBTUNNEL_LABELS,
  LEAD_STATUS_LABELS,
  SCORE_BG,
  LEAD_STATUS_BG,
} from '@/lib/admin/labels'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const stats = await getDashboardStats()

  return (
    <div className="p-8 lg:p-10 space-y-8">
      <div className="page-header">
        <span className="page-header__index">02 — Analyse</span>
        <h1 className="page-header__title">Analytique</h1>
        <p className="page-header__lead">
          Vue consolidée sur {stats.total_leads} lead{stats.total_leads !== 1 ? 's' : ''} collecté
          {stats.total_leads !== 1 ? 's' : ''}.
        </p>
      </div>

      {stats.total_leads === 0 ? (
        <div className="admin-card py-16 text-center text-[var(--color-cream-mute)] text-sm">
          Aucune donnée disponible — les graphiques apparaîtront dès le premier lead.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score distribution */}
          <div className="admin-card">
            <h2 className="eyebrow eyebrow--single mb-5">Distribution par score</h2>
            <div className="space-y-4">
              {(['A', 'B', 'C', 'D'] as const).map((score) => {
                const count = stats.leads_by_score[score] ?? 0
                const pct =
                  stats.total_leads > 0 ? Math.round((count / stats.total_leads) * 100) : 0
                return (
                  <div key={score} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${SCORE_BG[score]}`}
                      >
                        Score {score}
                      </span>
                      <span className="text-sm font-mono text-[var(--color-cream)] tabular-nums">
                        {count} · {pct}%
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--color-ink-raised)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background:
                            'linear-gradient(90deg, var(--color-gold-deep), var(--color-gold-soft))',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Status distribution */}
          <div className="admin-card">
            <h2 className="eyebrow eyebrow--single mb-5">Distribution par statut</h2>
            <div className="space-y-4">
              {Object.entries(stats.leads_by_status)
                .sort(([, a], [, b]) => b - a)
                .map(([status, count]) => {
                  const pct =
                    stats.total_leads > 0
                      ? Math.round((count / stats.total_leads) * 100)
                      : 0
                  const label =
                    LEAD_STATUS_LABELS[status as keyof typeof LEAD_STATUS_LABELS] ?? status
                  const bg = LEAD_STATUS_BG[status as keyof typeof LEAD_STATUS_BG] ?? ''
                  return (
                    <div key={status} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs px-2 py-0.5 rounded border ${bg}`}>
                          {label}
                        </span>
                        <span className="text-sm font-mono text-[var(--color-cream)] tabular-nums">
                          {count} · {pct}%
                        </span>
                      </div>
                      <div className="h-2 bg-[var(--color-ink-raised)] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background:
                              'linear-gradient(90deg, var(--color-gold-deep), var(--color-gold-soft))',
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Tunnel distribution */}
          <div className="admin-card lg:col-span-2">
            <h2 className="eyebrow eyebrow--single mb-5">Distribution par tunnel</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(stats.leads_by_tunnel)
                .sort(([, a], [, b]) => b - a)
                .map(([tunnel, count]) => {
                  const pct =
                    stats.total_leads > 0
                      ? Math.round((count / stats.total_leads) * 100)
                      : 0
                  const label =
                    TUNNEL_LABELS[tunnel as keyof typeof TUNNEL_LABELS] ??
                    SUBTUNNEL_LABELS[tunnel] ??
                    tunnel
                  return (
                    <div
                      key={tunnel}
                      className="rounded-xl border border-[var(--color-ink-line)] bg-[rgba(201,168,76,0.03)] p-4"
                    >
                      <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)] truncate">
                        {label}
                      </p>
                      <p className="display-serif text-2xl text-[var(--color-gold-soft)] mt-2 tabular-nums leading-none">
                        {count}
                      </p>
                      <p className="text-[11px] text-[var(--color-cream-dim)] mt-2 font-mono">
                        {pct}% du total
                      </p>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
