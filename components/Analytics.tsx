'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

function getVisitorId(): string {
  try {
    let id = localStorage.getItem('ch_vid')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('ch_vid', id)
    }
    return id
  } catch {
    return ''
  }
}

/** Enregistre une vue de page à chaque navigation (hors admin). */
export default function Analytics() {
  const pathname = usePathname()
  const last = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return
    if (last.current === pathname) return
    last.current = pathname
    const visitor_id = getVisitorId()
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({ path: pathname, visitor_id }),
    }).catch(() => {})
  }, [pathname])

  return null
}
