import { getDashboardStats } from '@/lib/supabase/queries'
import { TUNNEL_LABELS, SUBTUNNEL_LABELS, LEAD_STATUS_LABELS, SCORE_BG, LEAD_STATUS_BG } from '@/lib/admin/labels'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const stats = await getDashboardStats()

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[--color-foreground]">Analytique</h1>
        <p className="text-sm text-[--color-muted] mt-1">
          Vue consolidée sur {stats.total_leads} lead{stats.total_leads !== 1 ? 's' : ''}
        </p>
      </div>

      {stats.total_leads === 0 ? (
        <div className="bg-[--color-surface] rounded-xl border border-[--color-border-light] py-20 text-center text-[--color-muted] text-sm">
          Aucune donnée disponible
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score distribution */}
          <div className="bg-[--color-surface] rounded-xl border border-[--color-border-light] p-6">
            <h2 className="text-sm font-semibold text-[--color-foreground] mb-5">Distribution par score</h2>
            <div className="space-y-4">
              {(['A', 'B', 'C', 'D'] as const).map((score) => {
                const count = stats.leads_by_score[score] ?? 0
                const pct = stats.total_leads > 0 ? Math.round((count / stats.total_leads) * 100) : 0
                return (
                  <div key={score} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded border ${SCORE_BG[score]}`}>
                        Score {score}
                      </span>
                      <span className="text-sm font-medium text-[--color-foreground] tabular-nums">
                        {count} leads · {pct}%
                      </span>
                    </div>
                    <div className="h-3 bg-[--color-muted-bg] rounded-full overflow-hidden">
                      <div className="h-full bg-[--color-navy] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Status distribution */}
          <div className="bg-[--color-surface] rounded-xl border border-[--color-border-light] p-6">
            <h2 className="text-sm font-semibold text-[--color-foreground] mb-5">Distribution par statut</h2>
            <div className="space-y-4">
              {Object.entries(stats.leads_by_status)
                .sort(([, a], [, b]) => b - a)
                .map(([status, count]) => {
                  const pct = stats.total_leads > 0 ? Math.round((count / stats.total_leads) * 100) : 0
                  const label = LEAD_STATUS_LABELS[status as keyof typeof LEAD_STATUS_LABELS] ?? status
                  const bg = LEAD_STATUS_BG[status as keyof typeof LEAD_STATUS_BG]
                  return (
                    <div key={status} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs px-2 py-0.5 rounded border ${bg}`}>{label}</span>
                        <span className="text-sm font-medium text-[--color-foreground] tabular-nums">
                          {count} · {pct}%
                        </span>
                      </div>
                      <div className="h-3 bg-[--color-muted-bg] rounded-full overflow-hidden">
                        <div className="h-full bg-[--color-gold] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Tunnel distribution */}
          <div className="bg-[--color-surface] rounded-xl border border-[--color-border-light] p-6 lg:col-span-2">
            <h2 className="text-sm font-semibold text-[--color-foreground] mb-5">Distribution par tunnel</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(stats.leads_by_tunnel)
                .sort(([, a], [, b]) => b - a)
                .map(([tunnel, count]) => {
                  const pct = stats.total_leads > 0 ? Math.round((count / stats.total_leads) * 100) : 0
                  const label =
                    TUNNEL_LABELS[tunnel as keyof typeof TUNNEL_LABELS] ??
                    SUBTUNNEL_LABELS[tunnel] ??
                    tunnel
                  return (
                    <div
                      key={tunnel}
                      className="bg-[--color-muted-bg] rounded-lg border border-[--color-border-light] p-4"
                    >
                      <p className="text-xs text-[--color-muted] truncate">{label}</p>
                      <p className="text-2xl font-bold text-[--color-foreground] mt-1 tabular-nums">{count}</p>
                      <p className="text-xs text-[--color-muted] mt-0.5">{pct}% du total</p>
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
