import { getLead } from '@/lib/supabase/queries'
import {
  TUNNEL_LABELS,
  SUBTUNNEL_LABELS,
  SCORE_BG,
  INTERNAL_STATUS_LABELS,
  MESSAGE_VARIANT_LABELS,
  PRIORITY_DOT,
  formatDate,
  formatEuro,
} from '@/lib/admin/labels'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Building2, Calendar } from 'lucide-react'
import StatusSwitcher from '@/components/admin/StatusSwitcher'
import NotesEditor from '@/components/admin/NotesEditor'
import DeleteLeadButton from '@/components/admin/DeleteLeadButton'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params
  const lead = await getLead(id)
  if (!lead) notFound()

  const amount =
    lead.answers['tresorerie_amount'] ??
    lead.answers['materiel_amount'] ??
    lead.answers['vehicule_amount'] ??
    lead.answers['lancement_amount'] ??
    lead.answers['developpement_amount'] ??
    lead.answers['levee_amount'] ??
    lead.answers['reprise_price'] ??
    lead.answers['immo_amount'] ??
    lead.answers['assurance_amount'] ??
    null

  const revenue = lead.answers['common_revenue'] ?? lead.answers['levee_ca'] ?? null

  const priorityLabel =
    lead.priority === 'high' ? 'Haute' : lead.priority === 'medium' ? 'Normale' : 'Basse'

  return (
    <div className="p-8 lg:p-10 space-y-8 max-w-6xl">
      {/* Back */}
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[var(--color-cream-mute)] hover:text-[var(--color-gold-soft)] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Retour aux leads
      </Link>

      {/* Header card */}
      <div className="admin-card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="display-serif text-3xl text-[var(--color-cream)] tracking-tight">
                {lead.first_name} {lead.last_name}
              </h1>
              <span
                className={`text-sm font-mono font-bold px-2.5 py-1 rounded-md border ${SCORE_BG[lead.score_label]}`}
              >
                {lead.score_label}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.18em] text-[var(--color-cream-mute)]">
                <span className={`w-2 h-2 rounded-full ${PRIORITY_DOT[lead.priority]}`} />
                {priorityLabel}
              </span>
            </div>
            <p className="text-sm text-[var(--color-cream-dim)] mt-2">
              {TUNNEL_LABELS[lead.tunnel_type]} ·{' '}
              {SUBTUNNEL_LABELS[lead.sub_type] ?? lead.sub_type}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusSwitcher leadId={lead.id} current={lead.status} />
            <DeleteLeadButton leadId={lead.id} />
          </div>
        </div>

        {/* Contact grid */}
        <div className="mt-7 pt-6 border-t border-[var(--color-ink-line)] grid grid-cols-2 sm:grid-cols-4 gap-5">
          <ContactItem icon={Mail} label="Email" value={lead.email} href={`mailto:${lead.email}`} />
          <ContactItem icon={Phone} label="Téléphone" value={lead.phone} href={`tel:${lead.phone}`} />
          {lead.company_name ? (
            <ContactItem icon={Building2} label="Société" value={lead.company_name} />
          ) : (
            <ContactItem icon={Building2} label="Société" value="—" muted />
          )}
          <ContactItem icon={Calendar} label="Soumis le" value={formatDate(lead.created_at)} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scoring */}
        <div className="admin-card space-y-5">
          <h2 className="eyebrow eyebrow--single">Scoring interne</h2>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--color-cream-mute)] font-mono uppercase tracking-[0.18em]">
                Score global
              </span>
              <span className="text-[var(--color-gold-soft)] font-mono font-bold tabular-nums">
                {lead.score}/100
              </span>
            </div>
            <div className="h-1.5 bg-[var(--color-ink-raised)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${lead.score}%`,
                  background:
                    'linear-gradient(90deg, var(--color-gold-deep), var(--color-gold-soft))',
                }}
              />
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <Row label="Statut interne" value={INTERNAL_STATUS_LABELS[lead.internal_status]} />
            <Row
              label="Variante message"
              value={MESSAGE_VARIANT_LABELS[lead.message_variant]}
            />
            {amount && <Row label="Montant" value={formatEuro(amount)} />}
            {revenue && <Row label="CA annuel" value={formatEuro(revenue)} />}
            <Row label="RGPD" value={lead.consent_rgpd ? 'Consentement OK' : 'Manquant'} />
          </div>

          {lead.tags.length > 0 && (
            <div className="pt-3 border-t border-[var(--color-ink-line)]">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)] mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {lead.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-1 rounded-md border border-[var(--color-ink-line)] text-[var(--color-cream-dim)] bg-[rgba(201,168,76,0.04)] font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Answers */}
        <div className="lg:col-span-2 admin-card">
          <h2 className="eyebrow eyebrow--single mb-5">Réponses du tunnel</h2>
          {Object.keys(lead.answers).length === 0 ? (
            <p className="text-sm text-[var(--color-cream-mute)]">Aucune réponse enregistrée</p>
          ) : (
            <div className="divide-y divide-[var(--color-ink-line)]">
              {Object.entries(lead.answers).map(([key, value]) => (
                <div key={key} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                  <span className="text-[11px] font-mono text-[var(--color-cream-mute)] w-52 shrink-0 pt-0.5 uppercase tracking-[0.12em]">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm text-[var(--color-cream)] flex-1 break-words">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notes (interactive) */}
      <NotesEditor leadId={lead.id} initial={lead.notes ?? null} />
    </div>
  )
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
  muted,
}: {
  icon: React.ElementType
  label: string
  value: string
  href?: string
  muted?: boolean
}) {
  const body = (
    <p
      className={`text-sm mt-1.5 ${muted ? 'text-[var(--color-cream-mute)]' : 'text-[var(--color-cream)]'} ${href ? 'group-hover:text-[var(--color-gold-soft)] transition-colors' : ''} truncate`}
    >
      {value}
    </p>
  )

  return (
    <div className={href ? 'group' : ''}>
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)]">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      {href ? <a href={href}>{body}</a> : body}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--color-cream-mute)] text-xs font-mono uppercase tracking-[0.14em]">
        {label}
      </span>
      <span className="text-[var(--color-cream)] font-medium">{value}</span>
    </div>
  )
}
