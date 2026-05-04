import { getLeads } from '@/lib/supabase/queries'
import type { LeadStatus } from '@/lib/types'
import {
  TUNNEL_LABELS,
  SUBTUNNEL_LABELS,
  SCORE_BG,
  LEAD_STATUS_BG,
  LEAD_STATUS_LABELS,
  PRIORITY_DOT,
  formatRelativeDate,
} from '@/lib/admin/labels'
import Link from 'next/link'
import { Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function LeadsPage({ searchParams }: PageProps) {
  const raw = await searchParams
  const params = {
    status: typeof raw.status === 'string' ? raw.status : undefined,
    tunnel: typeof raw.tunnel === 'string' ? raw.tunnel : undefined,
    score: typeof raw.score === 'string' ? raw.score : undefined,
    q: typeof raw.q === 'string' ? raw.q : undefined,
  }
  const leads = await getLeads({
    status: params.status as LeadStatus | undefined,
    tunnel_type: params.tunnel,
    score_label: params.score,
    search: params.q,
  })

  const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'archived'] as const
  const SCORES = ['A', 'B', 'C', 'D'] as const

  const buildUrl = (overrides: Record<string, string>) => {
    const merged: Record<string, string> = {}
    if (params.status) merged.status = params.status
    if (params.tunnel) merged.tunnel = params.tunnel
    if (params.score) merged.score = params.score
    if (params.q) merged.q = params.q
    Object.assign(merged, overrides)
    Object.keys(merged).forEach((k) => { if (!merged[k]) delete merged[k] })
    return `/admin/leads?${new URLSearchParams(merged).toString()}`
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <p className="eyebrow eyebrow--single mb-3">Pipeline</p>
        <h1 className="display-serif text-4xl text-[var(--color-cream)] tracking-tight">Leads</h1>
        <p className="text-sm text-[var(--color-cream-dim)] mt-2">
          {leads.length} lead{leads.length !== 1 ? 's' : ''}
          {params.status || params.tunnel || params.score || params.q ? ' filtrés' : ' au total'}
        </p>
      </div>

      {/* Filters */}
      <div className="admin-card flex flex-wrap gap-3">
        {/* Search */}
        <form className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-cream-mute)]" />
          <input
            type="text"
            name="q"
            defaultValue={params.q}
            placeholder="Nom, email, société…"
            className="tunnel-input pl-9 text-sm py-2.5"
          />
        </form>

        {/* Score filter */}
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

        {/* Status filter */}
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map((status) => (
            <Link
              key={status}
              href={buildUrl({ status: params.status === status ? '' : status })}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                params.status === status
                  ? LEAD_STATUS_BG[status]
                  : 'border-[var(--color-ink-line)] text-[var(--color-cream-mute)] hover:border-[var(--color-gold-deep)] hover:text-[var(--color-gold-soft)]'
              }`}
            >
              {LEAD_STATUS_LABELS[status]}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-card !p-0 overflow-hidden">
        {leads.length === 0 ? (
          <div className="py-20 text-center text-[var(--color-cream-mute)] text-sm">
            Aucun lead ne correspond aux filtres
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-[var(--color-ink-line)] bg-[rgba(7,9,12,0.6)]">
              {['Contact', 'Profil', 'Score', 'Statut', 'Priorité', 'Date'].map((h) => (
                <span
                  key={h}
                  className="text-[10px] font-mono font-semibold text-[var(--color-cream-mute)] uppercase tracking-[0.22em]"
                >
                  {h}
                </span>
              ))}
            </div>

            <div className="divide-y divide-[var(--color-ink-line)]">
              {leads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 hover:bg-[rgba(201,168,76,0.04)] transition-colors items-center"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[var(--color-cream)] truncate">
                      {lead.first_name} {lead.last_name}
                    </div>
                    <div className="text-xs text-[var(--color-cream-mute)] truncate mt-0.5">{lead.email}</div>
                    {lead.company_name && (
                      <div className="text-xs text-[var(--color-cream-mute)] truncate">{lead.company_name}</div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs text-[var(--color-cream-dim)]">
                      {TUNNEL_LABELS[lead.tunnel_type]}
                    </div>
                    <div className="text-xs text-[var(--color-cream-mute)] mt-0.5">
                      {SUBTUNNEL_LABELS[lead.sub_type] ?? lead.sub_type}
                    </div>
                  </div>

                  <div>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${SCORE_BG[lead.score_label]}`}>
                      {lead.score_label}
                    </span>
                  </div>

                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded border ${LEAD_STATUS_BG[lead.status]}`}>
                      {LEAD_STATUS_LABELS[lead.status]}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${PRIORITY_DOT[lead.priority]}`} />
                    <span className="text-xs text-[var(--color-cream-mute)] capitalize">
                      {lead.priority === 'high' ? 'Haute' : lead.priority === 'medium' ? 'Normale' : 'Basse'}
                    </span>
                  </div>

                  <div className="text-xs text-[var(--color-cream-mute)] font-mono">
                    {formatRelativeDate(lead.created_at)}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
