/**
 * Envoi d'e-mails transactionnels via Resend (API REST directe, sans SDK).
 *
 * On appelle l'API HTTP plutôt que le paquet `resend` : une dépendance de
 * moins, et un contrôle total sur la charge utile (headers anti-spam, texte
 * brut, reply-to). La clé vit UNIQUEMENT côté serveur (RESEND_API_KEY) et
 * n'est jamais exposée au navigateur.
 *
 * Règle d'or : l'échec d'un e-mail ne doit JAMAIS faire échouer l'action
 * métier qui l'a déclenché (enregistrement d'un lead). Ces fonctions ne
 * lèvent donc pas : elles renvoient { ok } et journalisent l'erreur.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

export interface SendEmailInput {
  to: string | string[]
  subject: string
  html: string
  text: string
  /** Réponse dirigée vers le client : Guillaume répond, le lead reçoit. */
  replyTo?: string
  /** Étiquette Resend pour filtrer les envois dans le tableau de bord. */
  tag?: string
}

export interface SendEmailResult {
  ok: boolean
  id?: string
  error?: string
  /** Vrai si l'envoi a été ignoré faute de configuration (clé absente). */
  skipped?: boolean
}

/**
 * Expéditeur : DOIT être une adresse d'un domaine vérifié dans Resend
 * (SPF + DKIM), sinon l'e-mail part en spam ou est refusé. On utilise le
 * domaine du site, pas resend.dev.
 */
function fromAddress(): string {
  return process.env.LEADS_EMAIL_FROM ?? 'Cap Horn Conseils <notifications@financezmonprojet.fr>'
}

/** Destinataire des notifications : Guillaume. Surchargeable par env. */
export function notificationRecipient(): string {
  return process.env.LEADS_EMAIL_TO ?? 'contact@cap-horn-conseils.com'
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Pas de clé → on n'envoie rien, mais on ne casse rien non plus.
    console.warn('[email] RESEND_API_KEY absente : notification ignorée.')
    return { ok: false, skipped: true }
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: Array.isArray(input.to) ? input.to : [input.to],
        subject: input.subject,
        html: input.html,
        // Le pendant texte brut est un signal anti-spam majeur : un e-mail
        // multipart (HTML + texte) est nettement mieux noté qu'un HTML seul.
        text: input.text,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
        ...(input.tag ? { tags: [{ name: 'type', value: input.tag }] } : {}),
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error(`[email] Resend ${res.status}: ${detail}`)
      return { ok: false, error: `Resend ${res.status}` }
    }

    const data = (await res.json().catch(() => ({}))) as { id?: string }
    return { ok: true, id: data.id }
  } catch (err) {
    console.error('[email] Échec envoi Resend:', err)
    return { ok: false, error: 'network' }
  }
}
