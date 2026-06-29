import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { ContactFormData } from '@/lib/types'

/** Demande de rendez-vous depuis le formulaire « Prendre contact ». */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactFormData
    const { first_name, last_name, email, phone, message, preferred_slot, consent_rgpd } = body

    if (!first_name?.trim() || !last_name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email ?? '')) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }
    if (!consent_rgpd) {
      return NextResponse.json({ error: 'Consentement RGPD requis' }, { status: 400 })
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } },
    )

    const { error } = await supabase.from('appointment_requests').insert({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message?.trim() || null,
      preferred_slot: preferred_slot?.trim() || null,
      consent_rgpd: true,
      status: 'new',
    })

    if (error) {
      console.error('[contact] Supabase error:', error)
      return NextResponse.json({ error: 'Erreur enregistrement' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact] Unexpected error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
