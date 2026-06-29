'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export interface MethodStep {
  n: string
  name: string
  desc: string
  src: string
}

/**
 * Carrousel « méthode » — adaptation du composant circulaire (sans
 * framer-motion ni react-icons) : pile d'images en 3D (gauche/centre/droite),
 * autoplay, flèches, points. Thémé pour la section sombre.
 */
export default function MethodCarousel({ steps }: { steps: MethodStep[] }) {
  const [active, setActive] = useState(0)
  const len = steps.length
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const reduce = useRef(false)

  useEffect(() => {
    reduce.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const startAutoplay = useCallback(() => {
    if (timer.current) clearInterval(timer.current)
    if (reduce.current) return
    timer.current = setInterval(() => setActive((p) => (p + 1) % len), 5500)
  }, [len])

  useEffect(() => {
    startAutoplay()
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [startAutoplay])

  const go = (dir: 1 | -1) => {
    setActive((p) => (p + dir + len) % len)
    startAutoplay()
  }

  const imgStyle = (i: number): React.CSSProperties => {
    const isActive = i === active
    const isLeft = (active - 1 + len) % len === i
    const isRight = (active + 1) % len === i
    const base: React.CSSProperties = { transition: 'all 0.7s cubic-bezier(.4,2,.3,1)' }
    if (isActive) return { ...base, zIndex: 3, opacity: 1, transform: 'translateX(0) scale(1) rotateY(0deg)' }
    if (isLeft) return { ...base, zIndex: 2, opacity: 1, transform: 'translateX(-58px) translateY(-44px) scale(0.85) rotateY(15deg)' }
    if (isRight) return { ...base, zIndex: 2, opacity: 1, transform: 'translateX(58px) translateY(-44px) scale(0.85) rotateY(-15deg)' }
    return { ...base, zIndex: 1, opacity: 0 }
  }

  const step = steps[active]

  return (
    <div className="chc-method">
      <div className="chc-method__stage">
        {steps.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={s.src} src={s.src} alt={s.name} className="chc-method__img" style={imgStyle(i)} />
        ))}
      </div>

      <div className="chc-method__content">
        <div key={active} className="chc-method__anim">
          <div className="chc-method__n">Étape {step.n}</div>
          <div className="chc-method__name">{step.name}</div>
          <p className="chc-method__desc">{step.desc}</p>
        </div>

        <div className="chc-method__nav">
          <button className="chc-method__arrow" onClick={() => go(-1)} aria-label="Étape précédente">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button className="chc-method__arrow" onClick={() => go(1)} aria-label="Étape suivante">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="chc-method__dots">
          {steps.map((s, i) => (
            <button
              key={s.n}
              className={`chc-method__dot ${i === active ? 'is-active' : ''}`}
              onClick={() => { setActive(i); startAutoplay() }}
              aria-label={`Aller à l'étape ${s.n}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
