import { createClient } from '../supabase/server'
import { toDefaultConfig } from './engine'
import type { TunnelConfig, TunnelStepDef, TunnelOptionDef, StepType } from '../types'

interface StepRow {
  id: string
  type: string
  title: string
  subtitle: string | null
  progress: number
  position: number
  is_first: boolean
  input_type: string | null
  input_label: string | null
  input_placeholder: string | null
  input_suffix: string | null
  default_next_step_id: string | null
  branch_on: string | null
}
interface OptionRow {
  id: string
  step_id: string
  value: string
  label: string
  description: string | null
  next_step_id: string | null
  position: number
}

function assemble(steps: StepRow[], options: OptionRow[]): TunnelConfig {
  const byStep: Record<string, TunnelOptionDef[]> = {}
  for (const o of options) {
    ;(byStep[o.step_id] ??= []).push({
      value: o.value,
      label: o.label,
      description: o.description,
      next_step_id: o.next_step_id,
    })
  }
  const defs: TunnelStepDef[] = steps.map((s) => ({
    id: s.id,
    type: s.type as StepType,
    title: s.title,
    subtitle: s.subtitle,
    progress: s.progress,
    position: s.position,
    inputType: (s.input_type as TunnelStepDef['inputType']) ?? null,
    inputLabel: s.input_label,
    inputPlaceholder: s.input_placeholder,
    inputSuffix: s.input_suffix,
    options: byStep[s.id] ?? [],
    default_next_step_id: s.default_next_step_id,
    branch_on: s.branch_on,
  }))
  const first = steps.find((s) => s.is_first)?.id ?? steps[0]?.id ?? 'entry'
  return { firstStepId: first, steps: defs }
}

/**
 * Config du tunnel : depuis la base si elle existe, sinon FALLBACK sur la
 * config par défaut codée. Ne jette jamais (le tunnel ne casse pas).
 */
export async function getTunnelConfig(): Promise<{ config: TunnelConfig; source: 'db' | 'default' }> {
  try {
    const supabase = await createClient()
    const { data: steps, error } = await supabase
      .from('tunnel_steps')
      .select('*')
      .order('position', { ascending: true })
    if (error || !steps || steps.length === 0) {
      return { config: toDefaultConfig(), source: 'default' }
    }
    const { data: options } = await supabase
      .from('tunnel_options')
      .select('*')
      .order('position', { ascending: true })
    return { config: assemble(steps as StepRow[], (options ?? []) as OptionRow[]), source: 'db' }
  } catch {
    return { config: toDefaultConfig(), source: 'default' }
  }
}
