import type { TrackingEvent } from './types'

const STORAGE_KEY = 'ch_events'

export function track(event: string, properties?: Record<string, string>): void {
  const entry: TrackingEvent = {
    event,
    step: properties?.step,
    value: properties?.value,
    timestamp: Date.now(),
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const events: TrackingEvent[] = raw ? JSON.parse(raw) : []
    events.push(entry)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-100)))
  } catch {
    // localStorage unavailable, silent fail
  }
}
