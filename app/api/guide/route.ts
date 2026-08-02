import { NextRequest, NextResponse } from 'next/server'
import { after } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { acknowledgeGuideRequest, notifyGuideRequest } from '@/lib/email/notifications'
import { DEFAULT_GUIDE_SLUG, GUIDES, resolveGuideFile } from '@/lib/guide'
import { absoluteUrl } from '@/lib/seo/config'
import type { GuideRequestData } from '@/lib/types'

/**
 * Téléchargement d'un guide contre coordonnées.
 *
 * Le lien du fichier n'est renvoyé qu'ici, jamais dans le HTML de la page :
 * sinon le formulaire ne serait qu'un péage contournable en lisant la source.
 *
 * Trois garde-fous délibérés :
 *   • un échec Supabase (table non migrée, base indisponible) n'empêche pas la
 *     personne d'obtenir son guide — les e-mails restent le filet ;
 *   • tant que le PDF n'est pas publié, le contact est enregistré et l'envoi
 *     manuel est annoncé honnêtement plutôt que de renvoyer vers un 404 ;
 *   • le visiteur reçoit toujours un accusé de réception : donner son numéro
 *     et ne rien recevoir est la pire première impression possible.
 */

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GuideRequestData & { guide_slug?: string }
    const { first_name, last_name, email, phone, situation, consent_rgpd } = body

    const slug = body.guide_slug ?? DEFAULT_GUIDE_SLUG
    const guide = GUIDES[slug]
    if (!guide) {
      return NextResponse.json({ error: 'Guide inconnu' }, { status: 400 })
    }
    if (!first_name?.trim() || !last_name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email ?? '')) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }
    if (!consent_rgpd) {
      return NextResponse.json({ error: 'Consentement RGPD requis' }, { status: 400 })
    }

    const data: GuideRequestData = {
      first_name: first_name.trim().slice(0, 120),
      last_name: last_name.trim().slice(0, 120),
      email: email.trim().slice(0, 200),
      phone: phone.trim().slice(0, 40),
      situation: situation?.trim().slice(0, 200) || undefined,
      consent_rgpd: true,
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } },
    )

    const { error } = await supabase.from('guide_requests').insert({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      situation: data.situation ?? null,
      guide_slug: slug,
      source_page: guide.sourcePage,
      consent_rgpd: true,
      status: 'new',
    })

    // Journalisé mais non bloquant : le contact part quand même par e-mail.
    if (error) console.error('[guide] Supabase error:', error.message)

    const file = resolveGuideFile(guide.fileBase)

    after(async () => {
      // Notification à Guillaume, puis accusé de réception au visiteur. Le
      // second échoue sans conséquence sur le premier.
      try {
        await notifyGuideRequest({ data, guideTitle: guide.title, sourcePage: guide.sourcePage })
      } catch (err) {
        console.error('[guide] Notification e-mail échouée:', err)
      }
      try {
        await acknowledgeGuideRequest({
          data,
          guideTitle: guide.title,
          fileUrl: file ? absoluteUrl(file) : undefined,
        })
      } catch (err) {
        console.error('[guide] Accusé de réception échoué:', err)
      }
    })

    if (!file) {
      return NextResponse.json({
        pending: true,
        message:
          'Merci, votre demande est enregistrée. Guillaume Horn vous adresse le guide par e-mail sous 24 h ouvrées. Vous recevez d’ici quelques instants un accusé de réception.',
      })
    }

    return NextResponse.json({ file })
  } catch (err) {
    console.error('[guide] Unexpected error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
