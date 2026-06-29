import { getLeads, getLeadCounts } from '@/lib/supabase/queries'
import type { LeadStatus } from '@/lib/types'
import {
  TUNNEL_LABELS,
  SUBTUNNEL_LABELS,
  SCORE_BG,
  LEAD_STATUS_BG,
  LEAD_STATUS_LABELS,
  formatRelativeDate,
  stepLabel,
} from '@/lib/admin/labels'
import Link from 'next/link'
import { Search, CheckCircle2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

type View = 'tous' | 'complets' | 'en-cours'

export default async function LeadsPage({ searchParams }: PageProps) {
  const raw = await searchParams
  const view: View = raw.view === 'complets' ? 'complets' : raw.view === 'en-cours' ? 'en-cours' : 'tous'
  const completedFilter = view === 'complets' ? true : view === 'en-cours' ? false : undefined

  const params = {
    status: typeof raw.status === 'string' ? raw.status : undefined,
    tunnel: typeof raw.tunnel === 'string' ? raw.tunnel : undefined,
    score: typeof raw.score === 'string' ? raw.score : undefined,
    q: typeof raw.q === 'string' ? raw.q : undefined,
  }

  const [leads, counts] = await Promise.all([
    getLeads({
      completed: completedFilter,
      status: view === 'complets' ? (params.status as LeadStatus | undefined) : undefined,
      tunnel_type: params.tunnel,
      score_label: view === 'complets' ? params.score : undefined,
      search: params.q,
    }),
    getLeadCounts(),
  ])

  const total = counts.completed + counts.inProgress
  const SCORES = ['A', 'B', 'C', 'D'] as const

  const buildUrl = (overrides: Record<string, string>) => {
    const merged: Record<string, string> = {}
    if (view !== 'tous') merged.view = view
    if (params.score) merged.score = params.score
    if (params.q) merged.q = params.q
    Object.assign(merged, overrides)
    Object.keys(merged).forEach((k) => { if (!merged[k]) delete merged[k] })
    return `/admin/leads?${new URLSearchParams(merged).toString()}`
  }

  const tabs: { key: View; label: string; href: string; count: number; alert?: boolean }[] = [
    { key: 'tous', label: 'Tous', href: '/admin/leads', count: total },
    { key: 'complets', label: 'Complets', href: '/admin/leads?view=complets', count: counts.completed },
    { key: 'en-cours', label: 'En cours', href: '/admin/leads?view=en-cours', count: counts.inProgress, alert: counts.inProgress > 0 },
  ]

  return (
    <div className="p-8 space-y-6">
      <div>
        <p className="eyebrow eyebrow--single mb-3">Pipeline</p>
        <h1 className="display-serif text-4xl text-[var(--color-cream)] tracking-tight">Leads</h1>
        <p className="text-sm text-[var(--color-cream-dim)] mt-2">
          Tous les dossiers — finalisés et en cours. {leads.length} affiché{leads.length !== 1 ? 's' : ''}.
        </p>
      </div>

      {/* Onglets avec compteurs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => {
          const active = view === t.key
          return (
            <Link
              key={t.key}
              href={t.href}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-[0.16em] rounded-lg border transition-colors inline-flex items-center gap-2 ${
                active
                  ? 'border-[var(--color-gold-deep)] text-[var(--color-gold-soft)] bg-[rgba(201,168,76,0.08)]'
                  : 'border-[var(--color-ink-line)] text-[var(--color-cream-mute)] hover:text-[var(--color-gold-soft)]'
              }`}
            >
              {t.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full tabular-nums ${
                t.alert && !active ? 'bg-amber-100 text-amber-700' : 'bg-[rgba(201,168,76,0.14)] text-[var(--color-gold-soft)]'
              }`}>{t.count}</span>
            </Link>
          )
        })}
      </div>

      {/* Recherche + filtres (filtres score/statut uniquement sur Complets) */}
      <div className="admin-card flex flex-wrap gap-3">
        <form className="relative flex-1 min-w-48">
          {view !== 'tous' && <input type="hidden" name="view" value={view} />}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-cream-mute)]" />
          <input
            type="text"
            name="q"
            defaultValue={params.q}
            placeholder="Nom, email, société…"
            className="tunnel-input pl-9 text-sm py-2.5"
          />
        </form>

        {view === 'complets' && (
          <div className="flex gap-1.5">
            {SCORES.map((score) => (
              <Link
                key={score}
                href={buildUrl({ score: params.score === score ? '' : score })}
                className={`px-3 py-2 text-xs font-bold rounded-lg border transition-colors font-mono ${
                  params.score === score
                    ? SCORE_BG[score]
                    : 'border-[var(--color-ink-line)] text-[var(--color-cream-mute)] hover:border-[var(--color-gold-deep)] hover:text-[var(--color-gold-soft)]'
                }`}
              >
                {score}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Tableau unifié */}
      <div className="admin-card !p-0 overflow-hidden">
        {leads.length === 0 ? (
          <div className="py-20 text-center text-[var(--color-cream-mute)] text-sm">
            Aucun dossier {view === 'complets' ? 'finalisé' : view === 'en-cours' ? 'en cours' : ''} pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[2fr_1.3fr_1.5fr_1.2fr_0.9fr] gap-4 px-6 py-3 border-b border-[var(--color-ink-line)] bg-[var(--color-ink-raised)] min-w-[820px]">
              {['Contact', 'Profil', 'État', 'Score / étape', 'Activité'].map((h) => (
                <span key={h} className="text-[10px] font-mono font-semibold text-[var(--color-cream-mute)] uppercase tracking-[0.22em]">
                  {h}
                </span>
              ))}
            </div>

            <div className="divide-y divide-[var(--color-ink-line)] min-w-[820px]">
              {leads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="grid grid-cols-[2fr_1.3fr_1.5fr_1.2fr_0.9fr] gap-4 px-6 py-4 hover:bg-[rgba(201,168,76,0.04)] transition-colors items-center"
                >
                  {/* Contact */}
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[var(--color-cream)] truncate">
                      {lead.first_name || lead.last_name
                        ? `${lead.first_name ?? ''} ${lead.last_name ?? ''}`.trim()
                        : 'Anonyme'}
                    </div>
                    <div className="text-xs text-[var(--color-cream-mute)] truncate mt-0.5">{lead.email ?? '—'}</div>
                    {lead.phone && <div className="text-xs text-[var(--color-cream-mute)] truncate">{lead.phone}</div>}
                  </div>

                  {/* Profil */}
                  <div className="min-w-0">
                    <div className="text-xs text-[var(--color-cream-dim)]">
                      {lead.tunnel_type ? TUNNEL_LABELS[lead.tunnel_type] : '—'}
                    </div>
                    <div className="text-xs text-[var(--color-cream-mute)] mt-0.5 truncate">
                      {lead.sub_type ? SUBTUNNEL_LABELS[lead.sub_type] ?? lead.sub_type : '—'}
                    </div>
                  </div>

                  {/* État */}
                  <div>
                    {lead.completed ? (
                      <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md border border-emerald-300 text-emerald-700 bg-emerald-50">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Complet
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[var(--color-ink-raised)] rounded-full overflow-hidden max-w-[80px]">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${lead.progress}%`, background: 'linear-gradient(90deg, var(--color-gold-deep), var(--color-gold-soft))' }}
                          />
                        </div>
                        <span className="text-xs font-mono tabular-nums text-amber-700">{lead.progress}%</span>
                      </div>
                    )}
                  </div>

                  {/* Score / étape */}
                  <div className="min-w-0">
                    {lead.completed ? (
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${SCORE_BG[lead.score_label]}`}>
                          {lead.score_label}
                        </span>
                        <span className={`text-[11px] px-1.5 py-0.5 rounded border ${LEAD_STATUS_BG[lead.status]}`}>
                          {LEAD_STATUS_LABELS[lead.status]}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--color-cream-dim)] truncate">{stepLabel(lead.current_step)}</span>
                    )}
                  </div>

                  {/* Activité */}
                  <div className="text-xs text-[var(--color-cream-mute)] font-mono">
                    {formatRelativeDate(lead.last_activity_at ?? lead.created_at)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
