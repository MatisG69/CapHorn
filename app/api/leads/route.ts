import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { scoreLead } from '@/lib/scoring'
import type { TunnelType, SubType, LeadCaptureData } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      tunnel_type,
      sub_type,
      answers,
      capture,
    }: {
      tunnel_type: TunnelType
      sub_type: SubType
      answers: Record<string, string>
      capture: LeadCaptureData
    } = body

    if (!tunnel_type || !sub_type || !answers || !capture) {
      return NextResponse.json({ error: 'Payload incomplet' }, { status: 400 })
    }

    if (!capture.consent_rgpd) {
      return NextResponse.json({ error: 'Consentement RGPD requis' }, { status: 400 })
    }

    // Scoring — côté serveur, jamais exposé au client
    const scoring = scoreLead(answers, sub_type)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => [],
          setAll: () => {},
        },
      },
    )

    const { data, error } = await supabase
      .from('leads')
      .insert({
        tunnel_type,
        sub_type,
        answers,
        first_name: capture.first_name,
        last_name: capture.last_name,
        email: capture.email,
        phone: capture.phone,
        company_name: capture.company_name ?? null,
        consent_rgpd: capture.consent_rgpd,
        ...scoring,
        status: 'new',
      })
      .select('id')
      .single()

    if (error) {
      console.error('[leads] Supabase error:', error)
      return NextResponse.json({ error: 'Erreur enregistrement' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      score_label: scoring.score_label,
      message_variant: scoring.message_variant,
    })
  } catch (err) {
    console.error('[leads] Unexpected error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
