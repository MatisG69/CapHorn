import { getDashboardStats } from '@/lib/supabase/queries'
import { getWebAnalytics, type WebAnalytics } from '@/lib/supabase/analytics'
import { DEVICE_LABELS, countryName } from '@/lib/analytics/utils'
import { TUNNEL_LABELS, SUBTUNNEL_LABELS, SCORE_BG } from '@/lib/admin/labels'
import { Users, Eye, Calendar, MousePointerClick, Monitor, Smartphone, Tablet } from 'lucide-react'
import ResetAnalyticsButton from '@/components/admin/ResetAnalyticsButton'

export const dynamic = 'force-dynamic'

const DEVICE_ICON: Record<string, React.ElementType> = { desktop: Monitor, mobile: Smartphone, tablet: Tablet }

export default async function AnalyticsPage() {
  const [web, stats] = await Promise.all([getWebAnalytics(), getDashboardStats()])

  return (
    <div className="p-8 lg:p-10 space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="page-header">
          <span className="page-header__index">02, Analyse</span>
          <h1 className="page-header__title">Analytique</h1>
          <p className="page-header__lead">Audience du site et santé du pipeline, 30 derniers jours.</p>
        </div>
        <ResetAnalyticsButton />
      </div>

      {/* ── Audience web ─────────────────────────────────────── */}
      {!web.hasData ? (
        <div className="admin-card py-14 text-center text-[var(--color-cream-mute)] text-sm">
          Aucune donnée d’audience pour l’instant. Les visites s’enregistreront automatiquement —
          pensez à exécuter <span className="font-mono text-[var(--color-gold-soft)]">analytics_schema.sql</span> dans Supabase.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <Kpi label="Visiteurs uniques" value={web.uniqueVisitors} sub="30 derniers jours" icon={Users} />
            <Kpi label="Pages vues" value={web.totalViews} sub="30 derniers jours" icon={Eye} />
            <Kpi label="Visiteurs aujourd'hui" value={web.visitorsToday} sub="depuis minuit" icon={Calendar} />
            <Kpi label="Vues aujourd'hui" value={web.viewsToday} sub="depuis minuit" icon={MousePointerClick} />
          </div>

          {/* Courbe 30 jours */}
          <div className="admin-card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="eyebrow eyebrow--single">Vues, 30 derniers jours</h2>
              <span className="text-xs text-[var(--color-cream-mute)] font-mono">{web.days[0]?.label} → {web.days[web.days.length - 1]?.label}</span>
            </div>
            <TrendChart days={web.days} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Appareils */}
            <div className="admin-card">
              <h2 className="eyebrow eyebrow--single mb-5">Par appareil</h2>
              <BarList items={web.byDevice.map((d) => ({ label: DEVICE_LABELS[d.key] ?? d.key, count: d.count, icon: DEVICE_ICON[d.key] }))} total={web.totalViews} />
            </div>
            {/* Pays */}
            <div className="admin-card">
              <h2 className="eyebrow eyebrow--single mb-5">Par pays</h2>
              {web.byCountry.length === 0 ? (
                <Empty />
              ) : (
                <BarList items={web.byCountry.map((c) => ({ label: countryName(c.key), count: c.count }))} total={web.totalViews} />
              )}
            </div>
            {/* Sections */}
            <div className="admin-card">
              <h2 className="eyebrow eyebrow--single mb-5">Sections les plus vues</h2>
              <BarList items={web.bySection.map((s) => ({ label: s.key, count: s.count }))} total={web.totalViews} />
            </div>
          </div>
        </>
      )}

      {/* ── Pipeline leads ───────────────────────────────────── */}
      <div className="page-header" style={{ marginTop: 8 }}>
        <span className="page-header__index">03, Pipeline</span>
        <h2 className="page-header__title" style={{ fontSize: '1.6rem' }}>Conversion des leads</h2>
      </div>
      {stats.total_leads === 0 ? (
        <div className="admin-card py-10 text-center text-[var(--color-cream-mute)] text-sm">
          Aucun lead finalisé pour l’instant.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="admin-card">
            <h2 className="eyebrow eyebrow--single mb-5">Distribution par score</h2>
            <div className="space-y-3">
              {(['A', 'B', 'C', 'D'] as const).map((score) => {
                const count = stats.leads_by_score[score] ?? 0
                const pct = stats.total_leads > 0 ? Math.round((count / stats.total_leads) * 100) : 0
                return (
                  <div key={score} className="flex items-center gap-3">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${SCORE_BG[score]}`}>{score}</span>
                    <Bar pct={pct} />
                    <span className="text-xs font-mono text-[var(--color-cream-dim)] w-20 shrink-0 text-right tabular-nums whitespace-nowrap">{count} · {pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="admin-card">
            <h2 className="eyebrow eyebrow--single mb-5">Distribution par tunnel</h2>
            <div className="space-y-2.5">
              {Object.entries(stats.leads_by_tunnel).sort(([, a], [, b]) => b - a).map(([tunnel, count]) => {
                const pct = stats.total_leads > 0 ? Math.round((count / stats.total_leads) * 100) : 0
                const label = TUNNEL_LABELS[tunnel as keyof typeof TUNNEL_LABELS] ?? SUBTUNNEL_LABELS[tunnel] ?? tunnel
                return (
                  <div key={tunnel} className="flex items-center gap-3">
                    <span className="text-sm text-[var(--color-cream-dim)] w-36 truncate">{label}</span>
                    <Bar pct={pct} />
                    <span className="text-xs font-mono text-[var(--color-cream-mute)] w-8 text-right tabular-nums">{count}</span>
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

function Kpi({ label, value, sub, icon: Icon }: { label: string; value: number; sub: string; icon: React.ElementType }) {
  return (
    <div className="admin-card">
      <div className="flex items-start justify-between mb-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)]">{label}</p>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[rgba(201,168,76,0.08)] border border-[var(--color-ink-line)]">
          <Icon className="w-4 h-4 text-[var(--color-gold)]" strokeWidth={1.7} />
        </div>
      </div>
      <p className="display-serif text-[2.5rem] text-[var(--color-gold-soft)] leading-none" style={{ fontFeatureSettings: "'lnum' 1, 'tnum' 1", fontVariantNumeric: 'lining-nums tabular-nums' }}>{value}</p>
      <p className="text-xs text-[var(--color-cream-dim)] mt-3">{sub}</p>
    </div>
  )
}

function TrendChart({ days }: { days: WebAnalytics['days'] }) {
  const W = 720, H = 180, P = 6
  const max = Math.max(1, ...days.map((d) => d.views))
  const n = days.length
  const x = (i: number) => P + (i / (n - 1)) * (W - 2 * P)
  const y = (v: number) => H - P - (v / max) * (H - 2 * P - 14)
  const line = days.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d.views).toFixed(1)}`).join(' ')
  const area = `${line} L ${x(n - 1).toFixed(1)} ${H - P} L ${x(0).toFixed(1)} ${H - P} Z`
  const ticks = [0, 7, 14, 21, 29]

  return (
    <div className="w-full">
      {/* Le tracé est étiré en pleine largeur (preserveAspectRatio=none) ; les
          libellés d'axe sont rendus en HTML sous le SVG pour éviter la
          distorsion et le rognage des dates aux extrémités. */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" preserveAspectRatio="none" style={{ height: 180 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(201,168,76,0.35)" />
            <stop offset="100%" stopColor="rgba(201,168,76,0)" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#trendFill)" />
        <path d={line} fill="none" stroke="var(--color-gold-soft)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {days.map((d, i) => d.views > 0 && i % 3 === 0 ? (
          <circle key={i} cx={x(i)} cy={y(d.views)} r="2.5" fill="var(--color-gold)" />
        ) : null)}
      </svg>
      <div className="flex justify-between mt-2 text-[10px] font-mono text-[var(--color-cream-mute)] tabular-nums">
        {ticks.map((i) => (
          <span key={i}>{days[i]?.label}</span>
        ))}
      </div>
    </div>
  )
}

function BarList({ items, total }: { items: { label: string; count: number; icon?: React.ElementType }[]; total: number }) {
  if (items.length === 0) return <Empty />
  const max = Math.max(1, ...items.map((i) => i.count))
  return (
    <div className="space-y-3">
      {items.map((it) => {
        const pct = Math.round((it.count / max) * 100)
        const share = total > 0 ? Math.round((it.count / total) * 100) : 0
        const Icon = it.icon
        return (
          <div key={it.label} className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm text-[var(--color-cream-dim)] w-32 truncate">
              {Icon && <Icon className="w-3.5 h-3.5 text-[var(--color-cream-mute)]" />}
              {it.label}
            </span>
            <Bar pct={pct} />
            <span className="text-xs font-mono text-[var(--color-cream-mute)] w-20 shrink-0 text-right tabular-nums whitespace-nowrap">{it.count} · {share}%</span>
          </div>
        )
      })}
    </div>
  )
}

function Bar({ pct }: { pct: number }) {
  return (
    <div className="flex-1 h-2 bg-[var(--color-ink-raised)] rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--color-gold-deep), var(--color-gold-soft))' }} />
    </div>
  )
}

function Empty() {
  return <p className="text-sm text-[var(--color-cream-mute)]">Aucune donnée.</p>
}
