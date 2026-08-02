import { NextRequest, NextResponse } from 'next/server'
import { after } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { notifyReferral } from '@/lib/email/notifications'
import { REFERRAL_PROJECT_LABELS, type ReferralFormData, type ReferralProjectType } from '@/lib/types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PROJECT_TYPES = Object.keys(REFERRAL_PROJECT_LABELS) as ReferralProjectType[]

/** Parrainage déposé depuis /parrainage-apporteur-affaires. */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ReferralFormData

    const clean = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
    const parrain_first_name = clean(body.parrain_first_name)
    const parrain_last_name = clean(body.parrain_last_name)
    const parrain_email = clean(body.parrain_email)
    const parrain_phone = clean(body.parrain_phone)
    const filleul_first_name = clean(body.filleul_first_name)
    const filleul_last_name = clean(body.filleul_last_name)
    const filleul_email = clean(body.filleul_email)
    const filleul_phone = clean(body.filleul_phone)

    if (
      !parrain_first_name || !parrain_last_name || !parrain_phone ||
      !filleul_first_name || !filleul_last_name || !filleul_phone
    ) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }
    if (!EMAIL_RE.test(parrain_email)) {
      return NextResponse.json({ error: 'E-mail du parrain invalide' }, { status: 400 })
    }
    if (!EMAIL_RE.test(filleul_email)) {
      return NextResponse.json({ error: 'E-mail du filleul invalide' }, { status: 400 })
    }
    if (!body.consent_rgpd) {
      return NextResponse.json({ error: 'Consentement RGPD requis' }, { status: 400 })
    }
    // Transmettre les coordonnées d'un tiers sans son accord n'est pas
    // défendable : la politique RLS le refuserait de toute façon, on renvoie
    // ici un message clair plutôt qu'une erreur d'enregistrement.
    if (!body.consent_filleul) {
      return NextResponse.json({ error: 'Accord préalable du filleul requis' }, { status: 400 })
    }

    const project_type: ReferralProjectType = PROJECT_TYPES.includes(body.project_type)
      ? body.project_type
      : 'autre'
    const source_page = clean(body.source_page).slice(0, 300) || '/parrainage-apporteur-affaires'

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } },
    )

    const { error } = await supabase.from('referrals').insert({
      parrain_first_name,
      parrain_last_name,
      parrain_email,
      parrain_phone,
      parrain_relation: clean(body.parrain_relation) || null,
      filleul_first_name,
      filleul_last_name,
      filleul_email,
      filleul_phone,
      project_type,
      project_details: clean(body.project_details).slice(0, 2000) || null,
      consent_rgpd: true,
      consent_filleul: true,
      source_page,
      status: 'new',
    })

    if (error) {
      console.error('[parrainage] Supabase error:', error)
      return NextResponse.json({ error: 'Erreur enregistrement' }, { status: 500 })
    }

    // Notification à Guillaume après la réponse : un échec d'envoi ne doit
    // jamais faire perdre le parrainage déjà enregistré.
    after(async () => {
      try {
        await notifyReferral({
          data: {
            parrain_first_name,
            parrain_last_name,
            parrain_email,
            parrain_phone,
            parrain_relation: clean(body.parrain_relation) || undefined,
            filleul_first_name,
            filleul_last_name,
            filleul_email,
            filleul_phone,
            project_type,
            project_details: clean(body.project_details) || undefined,
            consent_rgpd: true,
            consent_filleul: true,
          },
          sourcePage: source_page,
        })
      } catch (err) {
        console.error('[parrainage] Notification e-mail échouée:', err)
      }
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[parrainage] Unexpected error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
