import { stepMap, nextStepId } from './engine'
import type { TunnelConfig, TunnelStepDef } from '../types'

export interface WalkedOption {
  value: string
  label: string
  description?: string
  target: string
}

export interface WalkedStep {
  id: string
  title: string
  subtitle?: string
  type: TunnelStepDef['type']
  progress: number
  options: WalkedOption[]
  nextTitle?: string
}

export interface Parcours {
  group: string
  label: string
  seed: Record<string, string>
}

export const PARCOURS: Parcours[] = [
  { group: 'Particulier', label: 'Résidence principale', seed: { entry: 'particulier', particulier_need: 'residence_principale' } },
  { group: 'Particulier', label: 'Investissement locatif', seed: { entry: 'particulier', particulier_need: 'investissement_locatif' } },
  { group: 'Particulier', label: 'Financement patrimonial', seed: { entry: 'particulier', particulier_need: 'patrimoine' } },
  { group: 'Particulier', label: 'Assurance emprunteur', seed: { entry: 'particulier', particulier_need: 'assurance_emprunteur' } },

  { group: 'Professionnel', label: 'Trésorerie', seed: { entry: 'pro', pro_need: 'tresorerie' } },
  { group: 'Professionnel', label: 'Matériel & équipements', seed: { entry: 'pro', pro_need: 'materiel' } },
  { group: 'Professionnel', label: 'Véhicule professionnel', seed: { entry: 'pro', pro_need: 'vehicule' } },
  { group: 'Professionnel', label: "Reprise d'entreprise", seed: { entry: 'pro', pro_need: 'reprise' } },
  { group: 'Professionnel', label: "Lancement d'activité", seed: { entry: 'pro', pro_need: 'lancement' } },
  { group: 'Professionnel', label: 'Développement', seed: { entry: 'pro', pro_need: 'developpement' } },
  { group: 'Professionnel', label: 'Levée de fonds', seed: { entry: 'pro', pro_need: 'levee_fonds' } },

  { group: 'Apporteur / Réseau', label: 'Recommandation', seed: { entry: 'reseau', reseau_type: 'recommandation' } },
  { group: 'Apporteur / Réseau', label: "Apporteur d'affaires", seed: { entry: 'reseau', reseau_type: 'apporteur' } },
  { group: 'Apporteur / Réseau', label: 'Partenaire prescripteur', seed: { entry: 'reseau', reseau_type: 'partenaire' } },
  { group: 'Apporteur / Réseau', label: 'Confrère courtier', seed: { entry: 'reseau', reseau_type: 'courtier' } },
]

export const MISSING_PARCOURS = [
  'Particulier → Regroupement de crédits',
  'Particulier → Prévoyance',
  'Professionnel → Professions libérales (santé, juridique, chiffre)',
  'Professionnel → Financement de franchise',
]

/** Déroule un parcours sur la config courante (DB ou défaut). */
export function walkParcours(config: TunnelConfig, seed: Record<string, string>): WalkedStep[] {
  const map = stepMap(config)
  const titleOf = (id: string | null) => (id ? map[id]?.title ?? id : 'Fin du parcours')
  const answers: Record<string, string> = { ...seed }
  const out: WalkedStep[] = []
  const guard = new Set<string>()
  let stepId: string | null = config.firstStepId

  while (stepId) {
    const step: TunnelStepDef | undefined = map[stepId]
    if (!step || guard.has(stepId)) break
    guard.add(stepId)

    if (answers[step.id] === undefined) {
      if (step.type === 'choice' && step.options.length) answers[step.id] = step.options[0].value
      else if (step.type === 'input') answers[step.id] = '100000'
      else answers[step.id] = ''
    }

    const branchField = step.branch_on ?? step.id
    const options: WalkedOption[] = step.options.map((o) => ({
      value: o.value,
      label: o.label,
      description: o.description ?? undefined,
      target: titleOf(nextStepId(map, step.id, { ...answers, [branchField]: o.value })),
    }))

    const nId = nextStepId(map, step.id, answers)
    out.push({
      id: step.id,
      title: step.title,
      subtitle: step.subtitle ?? undefined,
      type: step.type,
      progress: step.progress,
      options,
      nextTitle: step.type === 'input' ? titleOf(nId) : undefined,
    })

    if (step.type === 'result') break
    stepId = nId
  }

  return out
}
