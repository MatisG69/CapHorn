import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { scoreLead } from '@/lib/scoring'
import type { LeadUpsertPayload } from '@/lib/types'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Enregistrement du tunnel — UPSERT par `session_id`.
 *
 * Appelé à CHAQUE étape (sauvegarde progressive) :
 *   • completed = false → le dossier est créé / mis à jour « en cours ».
 *     Guillaume voit l'avancement même si la personne n'a pas fini.
 *   • completed = true  → finalisation : scoring serveur + statut CRM « new ».
 *
 * Le scoring n'est jamais exposé tant que le dossier n'est pas finalisé.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LeadUpsertPayload

    const {
      session_id,
      tunnel_type,
      sub_type,
      answers,
      progress,
      current_step,
      completed,
      contact,
      project_details,
      documents,
    } = body

    if (!session_id || !UUID_RE.test(session_id)) {
      return NextResponse.json({ error: 'session_id invalide' }, { status: 400 })
    }
    if (!tunnel_type) {
      return NextResponse.json({ error: 'tunnel_type requis' }, { status: 400 })
    }

    // Finalisation : coordonnées + consentement obligatoires
    if (completed) {
      if (!contact || !sub_type) {
        return NextResponse.json({ error: 'Dossier incomplet' }, { status: 400 })
      }
      if (!contact.consent_rgpd) {
        return NextResponse.json({ error: 'Consentement RGPD requis' }, { status: 400 })
      }
    }

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

    // Colonnes communes à chaque sauvegarde.
    // On fournit TOUJOURS toutes les colonnes métier NOT NULL (avec des
    // valeurs sûres par défaut) pour ne jamais violer une contrainte, même
    // sur un brouillon (non scoré) ou face à des colonnes héritées de la base.
    const row: Record<string, unknown> = {
      session_id,
      tunnel_type,
      sub_type: sub_type ?? null,
      answers: answers ?? {},
      progress: Math.max(0, Math.min(100, Math.round(progress ?? 0))),
      current_step: current_step ?? null,
      completed: !!completed,
      last_activity_at: new Date().toISOString(),
      // Scoring / statut — valeurs par défaut (surchargées à la finalisation)
      score: 0,
      score_label: 'D',
      priority: 'low',
      internal_status: 'cold',
      tags: [],
      message_variant: 'neutral',
      status: 'new',
      // Colonne héritée NOT NULL présente dans la base existante
      internal_score_label: 'D',
    }

    // Coordonnées dès qu'on les a (étape « contact » placée tôt)
    if (contact) {
      row.first_name = contact.first_name
      row.last_name = contact.last_name
      row.email = contact.email
      row.phone = contact.phone
      row.company_name = contact.company_name ?? null
      row.siret = contact.siret ?? null
      row.consent_rgpd = !!contact.consent_rgpd
    }

    // Description libre du projet (max 3000 caractères) & pièces jointes
    if (typeof project_details === 'string') {
      row.project_details = project_details.slice(0, 3000)
    }
    if (Array.isArray(documents)) {
      row.documents = documents
        .filter((d) => d && typeof d.path === 'string' && typeof d.name === 'string')
        .slice(0, 6)
        .map((d) => ({
          name: String(d.name).slice(0, 255),
          path: String(d.path),
          size: typeof d.size === 'number' ? d.size : undefined,
        }))
    }

    // Scoring uniquement à la finalisation
    let scoring: ReturnType<typeof scoreLead> | null = null
    if (completed && sub_type) {
      scoring = scoreLead(answers ?? {}, sub_type)
      Object.assign(row, scoring)
      row.internal_score_label = scoring.score_label
      row.status = 'new'
    }

    const doUpsert = () =>
      supabase.from('leads').upsert(row, { onConflict: 'session_id' }).select('id').single()

    let { data, error } = await doUpsert()

    // Si la colonne héritée 'internal_score_label' n'existe pas sur cette base,
    // on la retire et on réessaie → compatible base héritée ET base propre.
    if (error && /internal_score_label/.test(error.message ?? '')) {
      delete row.internal_score_label
      ;({ data, error } = await doUpsert())
    }

    // Tolérance si les colonnes 'project_details' / 'documents' / 'siret'
    // n'ont pas encore été ajoutées à la base (migration non appliquée).
    for (const col of ['project_details', 'documents', 'siret']) {
      if (error && new RegExp(col).test(error.message ?? '')) {
        delete row[col]
        ;({ data, error } = await doUpsert())
      }
    }

    if (error || !data) {
      console.error('[leads] Supabase error:', JSON.stringify(error ? { message: error.message, code: error.code, details: error.details, hint: error.hint } : 'no data'))
      return NextResponse.json({ error: 'Erreur enregistrement' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      ...(scoring
        ? { score_label: scoring.score_label, message_variant: scoring.message_variant }
        : {}),
    })
  } catch (err) {
    console.error('[leads] Unexpected error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
