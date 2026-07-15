import { NextRequest, NextResponse } from 'next/server'
import { getPublishedPosts } from '@/lib/blog/queries'

/** Assistant du site, propulsé par Groq (API compatible OpenAI). */

/** Construit la base de connaissance « articles du blog » pour le prompt. */
async function buildBlogKnowledge(): Promise<string> {
  try {
    const posts = await getPublishedPosts()
    if (posts.length === 0) return ''
    const lines = posts
      .slice(0, 40)
      .map((p) => {
        const kw = p.keywords?.trim() ? ` — mots-clés : ${p.keywords.trim()}` : ''
        const ex = p.excerpt?.trim() ? ` — ${p.excerpt.trim()}` : ''
        return `- « ${p.title} » → /blog/${p.slug}${kw}${ex}`
      })
      .join('\n')
    return `\n\nBASE DE CONNAISSANCE, ARTICLES DU BLOG (uniquement ceux-ci existent) :\n${lines}\n\nQuand la question de l'utilisateur correspond au sujet ou aux mots-clés d'un de ces articles, propose-le explicitement en donnant son lien exact (/blog/slug). Ne recommande jamais un article qui ne figure pas dans cette liste et n'invente jamais de lien.`
  } catch {
    return ''
  }
}

interface ChatMsg {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de CAP HORN CONSEILS®, un cabinet de courtage en financement indépendant basé à Marcq-en-Barœul, fondé par Guillaume Horn.

Ton rôle : renseigner chaleureusement les visiteurs sur leurs projets de financement et les orienter vers une prise de contact.

Domaines d'expertise du cabinet :
- Immobilier (résidence principale, investissement locatif, SCI)
- Financement professionnel (trésorerie, matériel, locaux, croissance, transmission, professions libérales, franchise)
- Assurance emprunteur & prévoyance (loi Lemoine, délégation)
- Regroupement de crédits
- Expatriés & non-résidents
- Dossiers refusés ou atypiques (réétude)

Positionnement : indépendance totale (aucune banque de tutelle), réseau de près de 100 banques partenaires, honoraires au résultat, un interlocuteur unique du premier échange à la signature.

Règles :
- Réponds en français, ton professionnel, premium et rassurant.
- Sois CONCIS : 2 à 4 phrases maximum, sauf si on te demande explicitement plus de détail.
- Ne donne JAMAIS de taux précis, de montant garanti, de simulation chiffrée ni de conseil juridique ou fiscal définitif : cela dépend de l'étude du dossier.
- Rappelle, quand c'est pertinent, que l'étude est gratuite et sans engagement, et qu'un expert recontacte sous 24 h.
- Invite à qualifier le projet via l'outil en ligne (page « Qualifier mon projet ») ou à demander à être rappelé.
- Si la question sort du champ du financement, recentre poliment vers le métier du cabinet.
- N'invente jamais d'information sur le cabinet ; en cas de doute, propose de mettre en relation avec Guillaume.`

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API non configurée' }, { status: 500 })
    }

    const body = (await request.json()) as { messages?: ChatMsg[] }
    const incoming = Array.isArray(body.messages) ? body.messages : []

    // On ne conserve que les tours user/assistant, bornés aux 12 derniers.
    const history = incoming
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }))

    if (history.length === 0) {
      return NextResponse.json({ error: 'Message vide' }, { status: 400 })
    }

    const systemContent = SYSTEM_PROMPT + (await buildBlogKnowledge())

    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.5,
        max_tokens: 600,
        messages: [{ role: 'system', content: systemContent }, ...history],
      }),
    })

    if (!groqRes.ok) {
      const detail = await groqRes.text().catch(() => '')
      console.error('[chat] Groq error:', groqRes.status, detail)
      return NextResponse.json({ error: 'Service indisponible' }, { status: 502 })
    }

    const data = await groqRes.json()
    const reply: string | undefined = data?.choices?.[0]?.message?.content?.trim()

    if (!reply) {
      return NextResponse.json({ error: 'Réponse vide' }, { status: 502 })
    }

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('[chat] error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
