'use client'

import { useEffect, useRef, useState } from 'react'
import { SocialDock } from '@/components/landing/SocialDock'

/**
 * Rail social vertical, à gauche.
 *
 * Il n'apparaît qu'une fois le héros dépassé : sur le premier écran, les
 * réseaux sont déjà présents sous la carte « lecture du dossier », et un rail
 * simultané ferait doublon visuel. Tant qu'il est masqué, il est aussi retiré
 * de l'arbre d'accessibilité pour ne pas dupliquer les liens au lecteur
 * d'écran.
 */
export function SocialRail() {
  const [shown, setShown] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = document.querySelector('.chc-h')
    if (!hero) return
    const obs = new IntersectionObserver(
      ([entry]) => setShown(!entry.isIntersecting),
      { rootMargin: '-120px 0px 0px 0px' },
    )
    obs.observe(hero)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`chc-rail ${shown ? 'is-shown' : ''}`}
      aria-hidden={!shown}
      inert={!shown}
    >
      <SocialDock orientation="vertical" />
    </div>
  )
}
