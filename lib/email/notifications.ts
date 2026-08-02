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
import { SITE_URL, LEGAL_ENTITY } from '@/lib/seo/config'
import { TUNNEL_LABELS, SUBTUNNEL_LABELS } from '@/lib/admin/labels'
import { sendEmail, notificationRecipient } from './client'
import { REFERRAL_PROJECT_LABELS } from '@/lib/types'
import type { LeadCaptureData, SimulatorEstimationPayload, ContactFormData, GuideRequestData, ReferralFormData, TunnelType, SubType } from '@/lib/types'

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

/* ── 5. Téléchargement d'un guide (aimant à prospects) ────────────────── */

export async function notifyGuideRequest(args: {
  data: GuideRequestData
  guideTitle: string
  sourcePage: string
}) {
  const { data, guideTitle, sourcePage } = args
  const fields: Field[] = [
    { label: 'Contact', value: escapeHtml(`${data.first_name} ${data.last_name}`.trim()) },
    { label: 'E-mail', value: escapeHtml(data.email), href: `mailto:${data.email}` },
    { label: 'Téléphone', value: escapeHtml(data.phone), href: `tel:${data.phone.replace(/\s/g, '')}` },
    { label: 'Guide', value: escapeHtml(guideTitle) },
    { label: 'Page', value: escapeHtml(sourcePage) },
  ]
  if (data.situation?.trim()) {
    fields.splice(3, 0, { label: 'Situation', value: escapeHtml(data.situation.trim()) })
  }

  const t: Template = {
    accent: '#56968D', // teal : contact entrant, chaud mais non finalisé
    kicker: 'Guide téléchargé',
    title: `${data.first_name} ${data.last_name} a téléchargé le guide`,
    intro:
      'Des coordonnées ont été laissées pour accéder à un guide. Le contact est en phase de réflexion : un appel dans les 48 h est souvent déterminant.',
    fields,
    ctaLabel: 'Voir les contacts',
    ctaUrl: adminUrl('/admin'),
  }
  return sendEmail({
    to: notificationRecipient(),
    subject: `Guide téléchargé — ${data.first_name} ${data.last_name}`,
    html: renderHtml(t),
    text: renderText(t),
    replyTo: data.email,
    tag: 'guide',
  })
}

/* ── 6. Parrainage / apport d'affaires ────────────────────────────────── */

/**
 * Un parrainage est le lead le plus chaud du site : quelqu'un a déjà fait le
 * travail de confiance à la place du cabinet. Le filleul attend un appel sous
 * 24 h — l'e-mail met donc SES coordonnées en avant, et le reply-to vise le
 * parrain, à qui l'on doit un accusé de réception.
 */
export async function notifyReferral(args: { data: ReferralFormData; sourcePage: string }) {
  const { data, sourcePage } = args
  const parrain = `${data.parrain_first_name} ${data.parrain_last_name}`.trim()
  const filleul = `${data.filleul_first_name} ${data.filleul_last_name}`.trim()

  const fields: Field[] = [
    { label: 'Filleul', value: escapeHtml(filleul) },
    { label: 'Téléphone filleul', value: escapeHtml(data.filleul_phone), href: `tel:${data.filleul_phone.replace(/\s/g, '')}` },
    { label: 'E-mail filleul', value: escapeHtml(data.filleul_email), href: `mailto:${data.filleul_email}` },
    { label: 'Projet', value: escapeHtml(REFERRAL_PROJECT_LABELS[data.project_type] ?? data.project_type) },
  ]
  if (data.project_details?.trim())
    fields.push({ label: 'Détail', value: escapeHtml(data.project_details.trim().slice(0, 800)) })
  fields.push(
    { label: 'Parrain', value: escapeHtml(parrain) },
    { label: 'Téléphone parrain', value: escapeHtml(data.parrain_phone), href: `tel:${data.parrain_phone.replace(/\s/g, '')}` },
    { label: 'E-mail parrain', value: escapeHtml(data.parrain_email), href: `mailto:${data.parrain_email}` },
  )
  if (data.parrain_relation?.trim())
    fields.push({ label: 'Lien déclaré', value: escapeHtml(data.parrain_relation.trim()) })
  fields.push({ label: 'Page d’origine', value: escapeHtml(sourcePage) })

  const t: Template = {
    accent: '#CAD178', // sauge : recommandation, entrée par le réseau
    kicker: 'Parrainage',
    title: `${parrain} vous recommande ${filleul}`,
    intro:
      'Une recommandation vient d’arriver depuis la page parrainage. Le filleul a donné son accord et attend un appel sous 24 h ; une prime est due au parrain si le financement se signe.',
    highlight: { label: 'À rappeler sous 24 h', value: filleul },
    fields,
    ctaLabel: 'Ouvrir les parrainages',
    ctaUrl: adminUrl('/admin/parrainage'),
  }
  return sendEmail({
    to: notificationRecipient(),
    subject: `Parrainage — ${parrain} recommande ${filleul}`,
    html: renderHtml(t),
    text: renderText(t),
    replyTo: data.parrain_email,
    tag: 'parrainage',
  })
}

/* ── Accusé de réception adressé au VISITEUR (guide) ──────────────────── */

/**
 * Le seul e-mail de ce fichier qui parte au client et non à Guillaume.
 *
 * Il existe parce qu'un aimant à prospects sans accusé de réception laisse la
 * personne devant le vide après avoir donné son téléphone. Le gabarit interne
 * (renderHtml) ne convient pas : il se termine par « notification automatique,
 * répondez pour écrire au client ». D'où ce rendu dédié, sobre et signé.
 *
 * `reply-to` pointe vers Guillaume : une réponse du médecin lui arrive
 * directement, et il peut joindre le PDF à la main tant qu'il n'est pas en
 * ligne — exactement le fonctionnement prévu au démarrage.
 */
export async function acknowledgeGuideRequest(args: {
  data: GuideRequestData
  guideTitle: string
  /** URL absolue du guide si publié ; sinon envoi manuel annoncé. */
  fileUrl?: string
}) {
  const { data, guideTitle, fileUrl } = args
  const prenom = escapeHtml(data.first_name.trim())
  const titre = escapeHtml(guideTitle)

  const corps = fileUrl
    ? `Votre guide est disponible en téléchargement immédiat via le bouton ci-dessous.`
    : `Guillaume Horn vous l’adresse personnellement par e-mail sous 24 h ouvrées.`

  const bouton = fileUrl
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 6px;"><tr><td style="border-radius:10px;background:${BRAND_TEAL};">
         <a href="${fileUrl}" style="display:inline-block;padding:13px 26px;font:600 14px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#ffffff;text-decoration:none;border-radius:10px;">Télécharger le guide</a>
       </td></tr></table>`
    : ''

  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"></head>
<body style="margin:0;padding:0;background:${CANVAS};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${titre}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CANVAS};padding:28px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:${CARD};border:1px solid ${BORDER};border-radius:18px;overflow:hidden;">
        <tr><td style="height:5px;background:${BRAND_TEAL};font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:32px 34px 30px;">
          <div style="font:600 11px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;letter-spacing:0.16em;text-transform:uppercase;color:${BRAND_TEAL};">Cap Horn Conseils</div>
          <h1 style="margin:10px 0 0;font:600 23px/1.35 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${BRAND_INK};">${titre}</h1>
          <p style="margin:16px 0 0;font:400 15px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${TEXT};">Bonjour ${prenom},</p>
          <p style="margin:12px 0 0;font:400 15px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${TEXT};">Merci pour votre demande. ${corps}</p>
          ${bouton}
          <p style="margin:20px 0 0;font:400 15px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${TEXT};">Si vous préparez une installation, une reprise de patientèle ou une association, répondez simplement à cet e-mail : votre message m’arrive directement et nous pouvons échanger sur votre projet, sans engagement.</p>
          <p style="margin:22px 0 0;font:600 15px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${BRAND_INK};">Guillaume Horn</p>
          <p style="margin:2px 0 0;font:400 13px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${MUTED};">Cap Horn Conseils · ${LEGAL_ENTITY.phoneDisplay}</p>
        </td></tr>
        <tr><td style="padding:18px 34px 26px;border-top:1px solid ${BORDER};">
          <p style="margin:0;font:400 12px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${MUTED};">${LEGAL_ENTITY.brand} — courtier immatriculé à l’ORIAS sous le n° ${LEGAL_ENTITY.orias}. Vos coordonnées ne sont transmises à aucun tiers. Pour ne plus être contacté, répondez « STOP » à cet e-mail.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

  const text = [
    `Bonjour ${data.first_name.trim()},`,
    '',
    `Merci pour votre demande concernant « ${guideTitle} ».`,
    fileUrl
      ? `Votre guide est disponible ici : ${fileUrl}`
      : 'Guillaume Horn vous l’adresse personnellement par e-mail sous 24 h ouvrées.',
    '',
    'Si vous préparez une installation, une reprise de patientèle ou une association, répondez simplement à cet e-mail.',
    '',
    `Guillaume Horn — Cap Horn Conseils — ${LEGAL_ENTITY.phoneDisplay}`,
    `${LEGAL_ENTITY.brand}, courtier immatriculé à l'ORIAS sous le n° ${LEGAL_ENTITY.orias}.`,
  ].join('\n')

  return sendEmail({
    to: data.email,
    subject: `Votre guide — ${guideTitle}`,
    html,
    text,
    replyTo: notificationRecipient(),
    tag: 'guide-ack',
  })
}
