/**
 * Notifications e-mail adressées à Guillaume à chaque nouveau lead.
 *
 * Trois déclencheurs, tous côté serveur :
 *   • un dossier tunnel est COMMENCÉ (coordonnées laissées, non finalisé) ;
 *   • un dossier tunnel est FINALISÉ (soumis) ;
 *   • une simulation d'assurance est envoyée ;
 *   • (bonus) une demande de contact « Prendre contact » arrive.
 *
 * Chaque e-mail est construit en HTML + texte brut, avec un reply-to pointant
 * vers le client : Guillaume clique « Répondre » et écrit directement au lead.
 */
import { SITE_URL } from '@/lib/seo/config'
import { TUNNEL_LABELS, SUBTUNNEL_LABELS } from '@/lib/admin/labels'
import { sendEmail, notificationRecipient } from './client'
import type { LeadCaptureData, SimulatorEstimationPayload, ContactFormData, TunnelType, SubType } from '@/lib/types'

/* ── Mise en forme ────────────────────────────────────────────────────── */

const euros = (n: number) => `${new Intl.NumberFormat('fr-FR').format(Math.round(n))} €`

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Lien admin vers la fiche du lead (ou la liste si pas d'id). */
function adminUrl(path = '/admin'): string {
  return `${SITE_URL}${path}`
}

/* ── Gabarit visuel partagé (couleurs du logo, CSS 100% en ligne) ─────── */

interface Field {
  label: string
  /** Valeur déjà échappée si HTML, sinon texte simple qu'on échappe. */
  value: string
  /** Rend la valeur cliquable (mailto:/tel:). */
  href?: string
}

interface Template {
  /** Bandeau de couleur en tête, selon le type d'événement. */
  accent: string
  /** Sur-titre discret au-dessus du titre. */
  kicker: string
  title: string
  intro: string
  fields: Field[]
  /** Bloc mis en avant (ex. économie estimée). */
  highlight?: { label: string; value: string }
  ctaLabel: string
  ctaUrl: string
}

const BRAND_INK = '#0E1821'
const BRAND_SLATE = '#30455E'
const BRAND_TEAL = '#56968D'
const TEXT = '#2b3640'
const MUTED = '#6a7783'
const BORDER = '#e6e2d8'
const CANVAS = '#f4f1ea'
const CARD = '#ffffff'

function renderHtml(t: Template): string {
  const rows = t.fields
    .map(
      (f) => `
      <tr>
        <td style="padding:11px 0;border-bottom:1px solid ${BORDER};font:600 12px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;letter-spacing:0.06em;text-transform:uppercase;color:${MUTED};white-space:nowrap;vertical-align:top;width:40%;">${escapeHtml(f.label)}</td>
        <td style="padding:11px 0;border-bottom:1px solid ${BORDER};font:500 15px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${TEXT};vertical-align:top;">${
          f.href ? `<a href="${f.href}" style="color:${BRAND_TEAL};text-decoration:none;font-weight:600;">${f.value}</a>` : f.value
        }</td>
      </tr>`,
    )
    .join('')

  const highlight = t.highlight
    ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 22px;">
        <tr><td style="background:${CANVAS};border:1px solid ${BORDER};border-radius:12px;padding:18px 20px;">
          <div style="font:600 11px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};">${escapeHtml(t.highlight.label)}</div>
          <div style="margin-top:4px;font:700 26px/1.2 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${BRAND_SLATE};">${escapeHtml(t.highlight.value)}</div>
        </td></tr>
      </table>`
    : ''

  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"></head>
<body style="margin:0;padding:0;background:${CANVAS};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(t.intro)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CANVAS};padding:28px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:${CARD};border:1px solid ${BORDER};border-radius:18px;overflow:hidden;">
        <tr><td style="height:5px;background:${t.accent};font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:30px 34px 8px;">
          <div style="font:600 11px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;letter-spacing:0.16em;text-transform:uppercase;color:${BRAND_TEAL};">${escapeHtml(t.kicker)}</div>
          <h1 style="margin:8px 0 0;font:600 23px/1.3 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${BRAND_INK};">${escapeHtml(t.title)}</h1>
          <p style="margin:10px 0 20px;font:400 15px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${MUTED};">${escapeHtml(t.intro)}</p>
        </td></tr>
        <tr><td style="padding:0 34px;">
          ${highlight}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
        </td></tr>
        <tr><td style="padding:26px 34px 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:10px;background:${BRAND_TEAL};">
            <a href="${t.ctaUrl}" style="display:inline-block;padding:13px 26px;font:600 14px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#ffffff;text-decoration:none;border-radius:10px;">${escapeHtml(t.ctaLabel)}</a>
          </td></tr></table>
        </td></tr>
        <tr><td style="padding:18px 34px 26px;border-top:1px solid ${BORDER};">
          <p style="margin:0;font:400 12px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${MUTED};">Notification automatique du site Cap Horn Conseils. Répondez à cet e-mail pour écrire directement au client.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

function renderText(t: Template): string {
  const lines: string[] = [t.title.toUpperCase(), '', t.intro, '']
  if (t.highlight) lines.push(`${t.highlight.label} : ${t.highlight.value}`, '')
  for (const f of t.fields) lines.push(`${f.label} : ${stripTags(f.value)}`)
  lines.push('', `${t.ctaLabel} : ${t.ctaUrl}`, '', '— Notification automatique du site Cap Horn Conseils.')
  return lines.join('\n')
}

function stripTags(s: string): string {
  return s.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
}

/* ── Champs communs à un lead tunnel ──────────────────────────────────── */

function tunnelTypeLabel(t: TunnelType): string {
  return TUNNEL_LABELS[t] ?? t
}
function subTypeLabel(s?: SubType | null): string {
  if (!s) return '—'
  return SUBTUNNEL_LABELS[s] ?? s
}

function contactFields(c: LeadCaptureData): Field[] {
  const fields: Field[] = [
    { label: 'Client', value: escapeHtml(`${c.first_name} ${c.last_name}`.trim()) },
    { label: 'E-mail', value: escapeHtml(c.email), href: `mailto:${c.email}` },
    { label: 'Téléphone', value: escapeHtml(c.phone), href: `tel:${c.phone.replace(/\s/g, '')}` },
  ]
  if (c.company_name) fields.push({ label: 'Société', value: escapeHtml(c.company_name) })
  if (c.siret) fields.push({ label: 'SIRET', value: escapeHtml(c.siret) })
  return fields
}

/* ── 1. Dossier tunnel COMMENCÉ (non finalisé) ────────────────────────── */

export async function notifyDossierStarted(args: {
  contact: LeadCaptureData
  tunnelType: TunnelType
  subType?: SubType | null
  progress: number
}) {
  const { contact, tunnelType, subType, progress } = args
  const t: Template = {
    accent: '#CAD178', // sauge : dossier en cours
    kicker: 'Dossier en cours',
    title: `${contact.first_name} ${contact.last_name} a commencé un dossier`,
    intro: `Un dossier a été entamé sur le tunnel (${progress}% complété) sans être finalisé. Les coordonnées ci-dessous permettent déjà de rappeler ce client.`,
    fields: [
      ...contactFields(contact),
      { label: 'Profil', value: escapeHtml(tunnelTypeLabel(tunnelType)) },
      { label: 'Besoin', value: escapeHtml(subTypeLabel(subType)) },
      { label: 'Avancement', value: `${progress}%` },
    ],
    ctaLabel: 'Ouvrir dans l’espace de suivi',
    ctaUrl: adminUrl('/admin'),
  }
  return sendEmail({
    to: notificationRecipient(),
    subject: `Dossier en cours — ${contact.first_name} ${contact.last_name} (${tunnelTypeLabel(tunnelType)})`,
    html: renderHtml(t),
    text: renderText(t),
    replyTo: contact.email,
    tag: 'dossier-started',
  })
}

/* ── 2. Dossier tunnel FINALISÉ (soumis) ──────────────────────────────── */

export async function notifyDossierSubmitted(args: {
  contact: LeadCaptureData
  tunnelType: TunnelType
  subType?: SubType | null
  scoreLabel?: string
  projectDetails?: string
  documentCount?: number
}) {
  const { contact, tunnelType, subType, scoreLabel, projectDetails, documentCount } = args
  const fields: Field[] = [
    ...contactFields(contact),
    { label: 'Profil', value: escapeHtml(tunnelTypeLabel(tunnelType)) },
    { label: 'Besoin', value: escapeHtml(subTypeLabel(subType)) },
  ]
  if (scoreLabel) fields.push({ label: 'Score', value: escapeHtml(scoreLabel) })
  if (documentCount && documentCount > 0)
    fields.push({ label: 'Pièces jointes', value: `${documentCount} document${documentCount > 1 ? 's' : ''}` })
  if (projectDetails?.trim())
    fields.push({ label: 'Projet', value: escapeHtml(projectDetails.trim().slice(0, 600)) })

  const t: Template = {
    accent: '#56968D', // teal : dossier complet
    kicker: 'Nouveau dossier finalisé',
    title: `${contact.first_name} ${contact.last_name} a soumis un dossier`,
    intro: 'Un dossier complet vient d’être finalisé sur le tunnel. Toutes les informations sont disponibles dans l’espace de suivi.',
    fields,
    ctaLabel: 'Voir le dossier complet',
    ctaUrl: adminUrl('/admin'),
  }
  return sendEmail({
    to: notificationRecipient(),
    subject: `Nouveau dossier — ${contact.first_name} ${contact.last_name} (${tunnelTypeLabel(tunnelType)})`,
    html: renderHtml(t),
    text: renderText(t),
    replyTo: contact.email,
    tag: 'dossier-submitted',
  })
}

/* ── 3. Simulation d'assurance envoyée ────────────────────────────────── */

export async function notifySimulation(args: {
  payload: Pick<SimulatorEstimationPayload, 'first_name' | 'email' | 'phone'>
  capital: number
  durationYears: number
  age: number
  currentPremium: number
  caphornPremium: number
  monthlySaving: number
  yearlySaving: number
  totalSaving: number
  savingsPercent: number
}) {
  const { payload } = args
  const fields: Field[] = [
    { label: 'Client', value: escapeHtml(payload.first_name) },
    { label: 'E-mail', value: escapeHtml(payload.email), href: `mailto:${payload.email}` },
  ]
  if (payload.phone)
    fields.push({ label: 'Téléphone', value: escapeHtml(payload.phone), href: `tel:${payload.phone.replace(/\s/g, '')}` })
  fields.push(
    { label: 'Capital', value: euros(args.capital) },
    { label: 'Durée', value: `${args.durationYears} ans` },
    { label: 'Âge', value: `${args.age} ans` },
    { label: 'Prime actuelle', value: `${euros(args.currentPremium)} / mois` },
    { label: 'Prime Cap Horn', value: `${euros(args.caphornPremium)} / mois` },
    { label: 'Économie mensuelle', value: euros(args.monthlySaving) },
  )

  const t: Template = {
    accent: '#9ED4D2', // aqua : simulation
    kicker: 'Simulation assurance emprunteur',
    title: `${payload.first_name} a demandé une étude d’assurance`,
    intro: 'Une simulation d’assurance emprunteur vient d’être envoyée depuis le site. Économie estimée ci-dessous.',
    highlight: { label: 'Économie estimée', value: `${euros(args.totalSaving)} sur la durée (${args.savingsPercent}%)` },
    fields,
    ctaLabel: 'Voir la simulation',
    ctaUrl: adminUrl('/admin'),
  }
  return sendEmail({
    to: notificationRecipient(),
    subject: `Simulation assurance — ${payload.first_name} · ${euros(args.yearlySaving)}/an d’économie`,
    html: renderHtml(t),
    text: renderText(t),
    replyTo: payload.email,
    tag: 'simulation',
  })
}

/* ── 4. Demande de contact « Prendre contact » ────────────────────────── */

export async function notifyContactRequest(args: { data: ContactFormData }) {
  const { data } = args
  const fields: Field[] = [
    { label: 'Client', value: escapeHtml(`${data.first_name} ${data.last_name}`.trim()) },
    { label: 'E-mail', value: escapeHtml(data.email), href: `mailto:${data.email}` },
    { label: 'Téléphone', value: escapeHtml(data.phone), href: `tel:${data.phone.replace(/\s/g, '')}` },
  ]
  if (data.preferred_slot?.trim()) fields.push({ label: 'Créneau souhaité', value: escapeHtml(data.preferred_slot.trim()) })
  if (data.message?.trim()) fields.push({ label: 'Message', value: escapeHtml(data.message.trim().slice(0, 800)) })

  const t: Template = {
    accent: '#30455E', // ardoise : demande directe
    kicker: 'Demande de contact',
    title: `${data.first_name} ${data.last_name} souhaite être recontacté`,
    intro: 'Une demande a été envoyée depuis le bouton « Prendre contact » du site.',
    fields,
    ctaLabel: 'Voir la demande',
    ctaUrl: adminUrl('/admin'),
  }
  return sendEmail({
    to: notificationRecipient(),
    subject: `Demande de contact — ${data.first_name} ${data.last_name}`,
    html: renderHtml(t),
    text: renderText(t),
    replyTo: data.email,
    tag: 'contact',
  })
}
