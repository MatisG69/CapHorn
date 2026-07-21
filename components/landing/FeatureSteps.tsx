'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * Étapes de la méthode, défilement automatique avec barre de progression.
 *
 * Adapté du composant d'origine :
 * — import depuis `motion/react` (le projet n'a pas `framer-motion`) ;
 * — les classes `bg-primary` / `text-muted-foreground` / `from-background`
 *   appartiennent à un thème shadcn absent d'ici : remplacées par les jetons
 *   Cap Horn, sinon les pastilles et le dégradé sortaient transparents ;
 * — une barre de progression rend l'attente lisible, et le clic permet de
 *   reprendre la main sur le défilement.
 */
export interface FeatureStep {
  step: string
  title?: string
  content: string
  image: string
}

interface FeatureStepsProps {
  features: FeatureStep[]
  className?: string
  autoPlayInterval?: number
}

export function FeatureSteps({
  features,
  className,
  autoPlayInterval = 5000,
}: FeatureStepsProps) {
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)
  const reduced = useReducedMotion()

  // La progression vit dans une ref : appeler `setCurrent` depuis l'updater de
  // `setProgress` rendait celui-ci impur. React invoquant un updater plusieurs
  // fois, l'étape avançait de +2 (1 → 3 → 1) au lieu de +1.
  const progressRef = useRef(0)

  useEffect(() => {
    // Pas de défilement auto en « animations réduites » : l'utilisateur choisit.
    if (reduced) return
    const tick = 50
    const stepSize = 100 / (autoPlayInterval / tick)

    const id = window.setInterval(() => {
      progressRef.current += stepSize
      if (progressRef.current >= 100) {
        progressRef.current = 0
        setCurrent((c) => (c + 1) % features.length)
      }
      setProgress(progressRef.current)
    }, tick)

    return () => window.clearInterval(id)
  }, [features.length, autoPlayInterval, reduced])

  const select = (i: number) => {
    progressRef.current = 0
    setCurrent(i)
    setProgress(0)
  }

  return (
    <div className={cn('chc-steps2', className)}>
      <div className="chc-steps2__grid">
        <ol className="chc-steps2__list">
          {features.map((f, i) => {
            const active = i === current
            return (
              <li key={f.step}>
                <button
                  type="button"
                  onClick={() => select(i)}
                  className={cn('chc-steps2__item', active && 'is-active')}
                  aria-current={active ? 'step' : undefined}
                >
                  <span className="chc-steps2__badge" aria-hidden>
                    {i < current ? '✓' : i + 1}
                  </span>
                  <span className="chc-steps2__body">
                    <span className="chc-steps2__title">{f.title ?? f.step}</span>
                    <span className="chc-steps2__text">{f.content}</span>
                    {/* Progression : uniquement sur l'étape en cours. */}
                    {active && !reduced && (
                      <span className="chc-steps2__progress" aria-hidden>
                        <span style={{ width: `${Math.min(100, progress)}%` }} />
                      </span>
                    )}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <div className="chc-steps2__media">
          <AnimatePresence mode="wait">
            {features.map((f, i) =>
              i === current ? (
                <motion.div
                  key={f.step}
                  className="chc-steps2__frame"
                  initial={reduced ? false : { y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduced ? undefined : { y: -60, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src={f.image}
                    alt={f.title ?? f.step}
                    width={1000}
                    height={700}
                    className="chc-steps2__img"
                    sizes="(max-width: 900px) 100vw, 520px"
                    priority={i === 0}
                  />
                  <span className="chc-steps2__veil" aria-hidden />
                  <span className="chc-steps2__caption">{f.step}</span>
                </motion.div>
              ) : null,
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
