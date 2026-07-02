import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { computeEstimation, parseFrNumber } from '@/lib/simulateur/estimate'
import { getSimulatorSettings } from '@/lib/simulateur/settings'
import type { SimulatorEstimationPayload } from '@/lib/types'

/**
 * Envoi d'une estimation « à Guillaume » depuis le simulateur public.
 *
 * On NE fait PAS confiance aux chiffres calculés par le navigateur : on
 * reprend les paramètres saisis (capital, durée, âge, prime) et on recalcule
 * l'estimation côté serveur avec les réglages de Guillaume avant insertion.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SimulatorEstimationPayload
    const { first_name, email, phone, consent_rgpd } = body

    if (!first_name?.trim()) {
      return NextResponse.json({ error: 'Prénom requis' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email ?? '')) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }
    if (!consent_rgpd) {
      return NextResponse.json({ error: 'Consentement RGPD requis' }, { status: 400 })
    }

    const capital = parseFrNumber(body.capital)
    const durationYears = parseFrNumber(body.duration_years)
    const age = parseFrNumber(body.age)
    const currentPremium = parseFrNumber(body.current_premium)

    const settings = await getSimulatorSettings()
    const result = computeEstimation({ capital, durationYears, age, currentPremium }, settings)

    if (!result) {
      return NextResponse.json({ error: 'Paramètres d\'estimation incomplets' }, { status: 400 })
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } },
    )

    const { error } = await supabase.from('simulator_estimations').insert({
      first_name: first_name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      consent_rgpd: true,
      status: 'new',
      capital,
      duration_years: durationYears,
      age,
      current_premium: currentPremium,
      caphorn_premium: Math.round(result.caphornPremium),
      monthly_saving: Math.round(result.monthlySaving),
      yearly_saving: Math.round(result.yearlySaving),
      total_saving: Math.round(result.totalSaving),
      savings_percent: Math.round(result.savingsPercent),
    })

    if (error) {
      console.error('[simulateur] Supabase error:', error)
      return NextResponse.json({ error: 'Erreur enregistrement' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[simulateur] Unexpected error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
