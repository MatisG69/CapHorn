'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertAdminSession } from '@/lib/admin/session'
import { toDefaultConfig } from '@/lib/tunnel/engine'
import type { TunnelStepDef } from '@/lib/types'

function revalidate() {
  revalidatePath('/tunnel')
  revalidatePath('/admin/tunnel')
  revalidatePath('/admin/tunnel/editor')
}

function stepRow(step: TunnelStepDef, isFirst: boolean) {
  return {
    id: step.id,
    type: step.type,
    title: step.title,
    subtitle: step.subtitle || null,
    progress: Math.max(0, Math.min(100, Math.round(step.progress || 0))),
    position: step.position ?? 0,
    is_first: isFirst,
    input_type: step.inputType || null,
    input_label: step.inputLabel || null,
    input_placeholder: step.inputPlaceholder || null,
    input_suffix: step.inputSuffix || null,
    default_next_step_id: step.default_next_step_id || null,
    branch_on: step.branch_on || null,
  }
}

/** Importe la config par défaut dans la base (remplace tout). */
export async function seedDefaultAction(): Promise<void> {
  await assertAdminSession()
  const supabase = await createClient()
  const cfg = toDefaultConfig()

  await supabase.from('tunnel_options').delete().neq('step_id', '___none___')
  await supabase.from('tunnel_steps').delete().neq('id', '___none___')

  const steps = cfg.steps.map((s, i) => stepRow({ ...s, position: i }, s.id === cfg.firstStepId))
  const { error: e1 } = await supabase.from('tunnel_steps').insert(steps)
  if (e1) throw new Error(e1.message)

  const opts = cfg.steps.flatMap((s) =>
    s.options.map((o, i) => ({
      step_id: s.id,
      value: o.value,
      label: o.label,
      description: o.description || null,
      next_step_id: o.next_step_id || null,
      position: i,
    })),
  )
  if (opts.length) {
    const { error: e2 } = await supabase.from('tunnel_options').insert(opts)
    if (e2) throw new Error(e2.message)
  }
  revalidate()
}

/** Crée / met à jour une étape + remplace ses options. */
export async function upsertStepAction(step: TunnelStepDef, isFirst: boolean): Promise<void> {
  await assertAdminSession()
  if (!step.id.trim()) throw new Error('Identifiant requis')
  const supabase = await createClient()

  const { error: e1 } = await supabase.from('tunnel_steps').upsert(stepRow(step, isFirst), { onConflict: 'id' })
  if (e1) throw new Error(e1.message)

  await supabase.from('tunnel_options').delete().eq('step_id', step.id)
  if (step.options.length) {
    const { error: e2 } = await supabase.from('tunnel_options').insert(
      step.options.map((o, i) => ({
        step_id: step.id,
        value: o.value,
        label: o.label,
        description: o.description || null,
        next_step_id: o.next_step_id || null,
        position: i,
      })),
    )
    if (e2) throw new Error(e2.message)
  }
  revalidate()
}

export async function deleteStepAction(id: string): Promise<void> {
  await assertAdminSession()
  const supabase = await createClient()
  const { error } = await supabase.from('tunnel_steps').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidate()
}

/** Réordonne les étapes (positions = ordre du tableau). */
export async function reorderStepsAction(orderedIds: string[]): Promise<void> {
  await assertAdminSession()
  const supabase = await createClient()
  for (let i = 0; i < orderedIds.length; i++) {
    await supabase.from('tunnel_steps').update({ position: i }).eq('id', orderedIds[i])
  }
  revalidate()
}
