import { getLead } from '@/lib/supabase/queries'
import {
  TUNNEL_LABELS,
  SUBTUNNEL_LABELS,
  SCORE_BG,
  LEAD_STATUS_BG,
  LEAD_STATUS_LABELS,
  INTERNAL_STATUS_LABELS,
  MESSAGE_VARIANT_LABELS,
  PRIORITY_DOT,
  formatDate,
  formatEuro,
} from '@/lib/admin/labels'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Building2, Calendar } from 'lucide-react'

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

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      {/* Back */}
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-2 text-sm text-[--color-muted] hover:text-[--color-foreground] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux leads
      </Link>

      {/* Header */}
      <div className="bg-[--color-surface] rounded-xl border border-[--color-border-light] p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-[--color-foreground]">
                {lead.first_name} {lead.last_name}
              </h1>
              <span className={`text-sm font-bold px-2 py-0.5 rounded border ${SCORE_BG[lead.score_label]}`}>
                {lead.score_label}
              </span>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${PRIORITY_DOT[lead.priority]}`} />
              </div>
            </div>
            <p className="text-sm text-[--color-muted] mt-1">
              {TUNNEL_LABELS[lead.tunnel_type]} · {SUBTUNNEL_LABELS[lead.sub_type] ?? lead.sub_type}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-sm px-3 py-1.5 rounded-lg border ${LEAD_STATUS_BG[lead.status]}`}>
              {LEAD_STATUS_LABELS[lead.status]}
            </span>
          </div>
        </div>

        {/* Contact grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <InfoItem icon={Mail} label="Email" value={lead.email} />
          <InfoItem icon={Phone} label="Téléphone" value={lead.phone} />
          {lead.company_name && <InfoItem icon={Building2} label="Société" value={lead.company_name} />}
          <InfoItem icon={Calendar} label="Soumis le" value={formatDate(lead.created_at)} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scoring */}
        <div className="bg-[--color-surface] rounded-xl border border-[--color-border-light] p-6 space-y-5">
          <h2 className="text-sm font-semibold text-[--color-foreground]">Scoring interne</h2>

          {/* Score bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[--color-muted]">
              <span>Score global</span>
              <span className="font-bold text-[--color-foreground] tabular-nums">{lead.score}/100</span>
            </div>
            <div className="h-2 bg-[--color-muted-bg] rounded-full overflow-hidden">
              <div
                className="h-full bg-[--color-navy] rounded-full"
                style={{ width: `${lead.score}%` }}
              />
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <Row label="Statut interne" value={INTERNAL_STATUS_LABELS[lead.internal_status]} />
            <Row label="Variante message" value={MESSAGE_VARIANT_LABELS[lead.message_variant]} />
            {amount && <Row label="Montant" value={formatEuro(amount)} />}
            {revenue && <Row label="CA annuel" value={formatEuro(revenue)} />}
          </div>

          {lead.tags.length > 0 && (
            <div className="pt-2">
              <p className="text-xs text-[--color-muted] mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {lead.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-[--color-muted-bg] text-[--color-muted] rounded-md border border-[--color-border-light]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Answers */}
        <div className="lg:col-span-2 bg-[--color-surface] rounded-xl border border-[--color-border-light] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[--color-foreground]">Réponses du tunnel</h2>
          <div className="space-y-2">
            {Object.entries(lead.answers).map(([key, value]) => (
              <div
                key={key}
                className="flex gap-3 py-2.5 border-b border-[--color-border-light] last:border-0"
              >
                <span className="text-xs font-mono text-[--color-muted] w-48 shrink-0 pt-0.5">{key}</span>
                <span className="text-sm text-[--color-foreground]">{value}</span>
              </div>
            ))}
            {Object.keys(lead.answers).length === 0 && (
              <p className="text-sm text-[--color-muted]">Aucune réponse enregistrée</p>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      {lead.notes && (
        <div className="bg-[--color-surface] rounded-xl border border-[--color-border-light] p-6">
          <h2 className="text-sm font-semibold text-[--color-foreground] mb-3">Notes</h2>
          <p className="text-sm text-[--color-foreground] whitespace-pre-wrap leading-relaxed">
            {lead.notes}
          </p>
        </div>
      )}
    </div>
  )
}

function InfoItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-[--color-muted]">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <p className="text-sm font-medium text-[--color-foreground]">{value}</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[--color-muted]">{label}</span>
      <span className="font-medium text-[--color-foreground]">{value}</span>
    </div>
  )
}
