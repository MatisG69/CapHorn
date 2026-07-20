'use client'

import { useEffect, useRef } from 'react'

/** Filet doré en haut de page : progression de lecture de l'article. */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = document.getElementById(targetId)
    if (!el) return

    let frame = 0
    const update = () => {
      frame = 0
      // getBoundingClientRect plutôt qu'offsetTop : indépendant de l'offsetParent.
      const rect = el.getBoundingClientRect()
      const span = rect.height - window.innerHeight * 0.75
      const done = span <= 0 ? 1 : -rect.top / span
      const pct = Math.min(1, Math.max(0, done))
      if (barRef.current) barRef.current.style.transform = `scaleX(${pct})`
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [targetId])

  return (
    <div className="chc-progress" aria-hidden="true">
      <div ref={barRef} className="chc-progress__bar" />
    </div>
  )
}
