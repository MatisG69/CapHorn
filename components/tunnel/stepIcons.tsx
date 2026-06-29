import { createElement } from 'react'
import {
  UserPlus, Briefcase, Home, Handshake, Wallet, Wrench, Car, Repeat, Rocket,
  TrendingUp, Coins, Building2, Landmark, ShieldCheck, Network, Check, X,
  PenLine, Sparkles, Banknote, Store, Target, CircleDot, type LucideIcon,
} from 'lucide-react'
import type { TunnelStepDef } from '@/lib/types'

/** Icône ronde affichée en haut de chaque étape (selon l'étape). */
const STEP_ICON: Record<string, LucideIcon> = {
  entry: UserPlus,
  contact: UserPlus,
  capture: Sparkles,
  pro_need: Briefcase,
  particulier_need: Home,
  reseau_type: Handshake,
  common_revenue: TrendingUp,
  common_bank_refusal: ShieldCheck,
  bank_refusal_org: Landmark,
  bank_refusal_reason: ShieldCheck,
}

export function stepIcon(step: TunnelStepDef): LucideIcon {
  if (STEP_ICON[step.id]) return STEP_ICON[step.id]
  if (step.type === 'contact') return UserPlus
  if (step.type === 'finalize' || step.type === 'capture') return Sparkles
  if (step.type === 'result') return Check
  if (step.type === 'input') {
    return /amount|price|apport|_ca|revenue|montant|capital/.test(step.id) ? Banknote : PenLine
  }
  return Target
}

/** Icône ronde à gauche d'une carte de réponse (selon la valeur). */
const VALUE_ICON: [RegExp, LucideIcon][] = [
  [/handshake|recommand|apporteur|partenaire|courtier|reseau/, Handshake],
  [/(^|_)pro($|_)|chef|entreprise/, Briefcase],
  [/residence|immo|^owner$|first_buyer|renegociation/, Home],
  [/tresorerie|cash|fonds|roulement|working/, Wallet],
  [/materiel|equip|machinery|^it$|medical|restaurant|stock|premises/, Wrench],
  [/vehicule|utility|company_car|fleet|heavy|car/, Car],
  [/reprise|rachat|repreneur|searching|found|letter|signed/, Repeat],
  [/lancement|creation|launch|demarr|idea|^bp$|registered|launched/, Rocket],
  [/developp|croissance|growth|opening|hiring|digital|acquisition|export|seasonal/, TrendingUp],
  [/levee|equity|debt|invest|term_sheet|closing|preparing|conversations/, Coins],
  [/locatif|lmnp|sci|classic|commercial/, Building2],
  [/patrimo|patrimoine/, Landmark],
  [/assurance|emprunteur|prevoyance|new|garanties/, ShieldCheck],
  [/particulier/, Home],
  [/profitable|breakeven|loss|unknown|yes|profession/, Store],
  [/users|team|pipeline|tech|traction/, Network],
  [/^no$|sans_motif|^non$/, X],
  [/^yes$|^oui$|deck|quote|clients|bp/, Check],
]

export function optionIcon(value: string): LucideIcon {
  const v = (value || '').toLowerCase()
  for (const [re, ic] of VALUE_ICON) if (re.test(v)) return ic
  return CircleDot
}

/** Rend l'icône d'étape (via createElement → évite le rendu d'un composant variable). */
export function stepGlyph(step: TunnelStepDef, className = 'w-6 h-6') {
  return createElement(stepIcon(step), { className, strokeWidth: 1.7 })
}

/** Rend l'icône d'une option. */
export function optionGlyph(value: string, className = 'w-[22px] h-[22px]') {
  return createElement(optionIcon(value), { className, strokeWidth: 1.7 })
}
