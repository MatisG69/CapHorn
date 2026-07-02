import { createClient } from '../supabase/server'
import { DEFAULT_SIMULATOR_SETTINGS, type SimulatorSettings } from './estimate'

/**
 * Réglages du simulateur : depuis la base si présents, sinon FALLBACK sur les
 * valeurs par défaut codées. Ne jette jamais (le simulateur ne casse pas).
 *
 * Les valeurs stockées peuvent être partielles ; on les fusionne avec les
 * défauts et on ignore toute clé non numérique.
 */
export async function getSimulatorSettings(): Promise<SimulatorSettings> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('simulator_settings')
      .select('settings')
      .eq('id', 1)
      .maybeSingle()

    if (error || !data?.settings) return DEFAULT_SIMULATOR_SETTINGS
    return mergeSettings(data.settings as Record<string, unknown>)
  } catch {
    return DEFAULT_SIMULATOR_SETTINGS
  }
}

/** Fusionne un objet partiel/inconnu avec les défauts (numériques uniquement). */
export function mergeSettings(raw: Record<string, unknown>): SimulatorSettings {
  const out = { ...DEFAULT_SIMULATOR_SETTINGS }
  for (const key of Object.keys(out) as (keyof SimulatorSettings)[]) {
    const v = raw[key]
    if (typeof v === 'number' && Number.isFinite(v) && v >= 0) out[key] = v
  }
  return out
}
