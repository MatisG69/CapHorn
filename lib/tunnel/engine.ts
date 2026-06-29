import type { TunnelConfig, TunnelStepDef } from '../types'
import { TUNNEL_STEPS, FIRST_STEP } from './config'

/** Index id → étape. */
export function stepMap(config: TunnelConfig): Record<string, TunnelStepDef> {
  const map: Record<string, TunnelStepDef> = {}
  for (const s of config.steps) map[s.id] = s
  return map
}

/**
 * Étape suivante (routage déclaratif) — reproduit la logique getNext :
 *  - branch_on : route selon la réponse d'un champ antérieur (ex: 'entry').
 *  - choice    : route selon l'option choisie (next_step_id), sinon défaut.
 *  - autre     : default_next_step_id.
 */
export function nextStepId(
  map: Record<string, TunnelStepDef>,
  currentId: string,
  answers: Record<string, string>,
): string | null {
  const step = map[currentId]
  if (!step) return null

  if (step.branch_on) {
    const v = answers[step.branch_on]
    const opt = step.options.find((o) => o.value === v)
    return opt?.next_step_id ?? step.default_next_step_id ?? null
  }

  if (step.type === 'choice') {
    const v = answers[step.id]
    const opt = step.options.find((o) => o.value === v)
    return opt?.next_step_id ?? step.default_next_step_id ?? null
  }

  return step.default_next_step_id ?? null
}

/**
 * Convertit la config codée en dur (lib/tunnel/config.ts, avec getNext) en
 * config déclarative. Sert de FALLBACK quand la base est vide et de base pour
 * le « seed » initial de l'éditeur. Fidèle au graphe existant.
 */
export function toDefaultConfig(): TunnelConfig {
  const steps: TunnelStepDef[] = Object.values(TUNNEL_STEPS).map((s, idx) => {
    const def: TunnelStepDef = {
      id: s.id,
      type: s.type,
      title: s.title,
      subtitle: s.subtitle ?? null,
      progress: s.progressValue ?? 0,
      position: idx,
      inputType: s.inputType ?? null,
      inputLabel: s.inputLabel ?? null,
      inputPlaceholder: s.inputPlaceholder ?? null,
      inputSuffix: s.inputSuffix ?? null,
      options: [],
      default_next_step_id: null,
      branch_on: null,
    }

    if (s.id === 'contact') {
      // Routage spécial : selon le profil choisi à l'étape 'entry'
      def.branch_on = 'entry'
      def.options = (['pro', 'particulier', 'reseau'] as const).map((v, i) => ({
        value: v,
        label: v === 'pro' ? 'Professionnel' : v === 'particulier' ? 'Particulier' : 'Réseau',
        description: null,
        next_step_id: s.getNext({ entry: v }),
        position: i,
      })) as TunnelStepDef['options']
      def.default_next_step_id = null
    } else if (s.type === 'choice' && s.options) {
      def.options = s.options.map((o) => ({
        value: o.value,
        label: o.label,
        description: o.description ?? null,
        next_step_id: s.getNext({ [s.id]: o.value }),
      }))
      def.default_next_step_id = s.getNext({})
    } else {
      def.default_next_step_id = s.getNext({})
    }

    return def
  })

  return { firstStepId: FIRST_STEP, steps }
}
