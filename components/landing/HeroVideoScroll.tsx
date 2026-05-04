'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const VIDEO_PHASE = 0.78
const TEXT_REVEAL_START = 0.74

export function HeroVideoScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const rafRef = useRef<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const wrapper = wrapperRef.current
    if (!video || !wrapper) return

    const onMeta = () => {
      try {
        video.currentTime = 0.001
      } catch {}
      setReady(true)
    }
    if (video.readyState >= 1) onMeta()
    else video.addEventListener('loadedmetadata', onMeta)

    const update = () => {
      rafRef.current = null
      const w = wrapperRef.current
      const v = videoRef.current
      if (!w || !v || !v.duration || !isFinite(v.duration)) return

      const rect = w.getBoundingClientRect()
      const total = w.offsetHeight - window.innerHeight
      if (total <= 0) return

      const p = Math.max(0, Math.min(1, -rect.top / total))
      setProgress(p)

      const videoP = Math.min(1, p / VIDEO_PHASE)
      const target = videoP * v.duration

      if (Math.abs(v.currentTime - target) > 0.02) {
        try {
          v.currentTime = target
        } catch {}
      }
    }

    const onScroll = () => {
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      video.removeEventListener('loadedmetadata', onMeta)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const textP = Math.max(0, Math.min(1, (progress - TEXT_REVEAL_START) / (1 - TEXT_REVEAL_START)))
  const cueOpacity = Math.max(0, Math.min(1, 1 - progress * 4))

  // Caméra "se pose" : la vidéo s'assombrit à mesure que le texte apparaît.
  const videoBrightness = 1 - textP * 0.55
  const videoSaturate = 1 + textP * 0.1
  const scrimOpacity = 0.18 + textP * 0.62
  const spotlightOpacity = textP * 0.85

  return (
    <section ref={wrapperRef} className="hero-scroll-video" aria-label="Cap Horn Conseils">
      <div className="hero-scroll-video__sticky">
        <video
          ref={videoRef}
          className="hero-scroll-video__media"
          src="/entree.mp4"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden
          data-ready={ready ? 'true' : 'false'}
          style={{ filter: `brightness(${videoBrightness}) saturate(${videoSaturate})` }}
        />

        <div
          className="hero-scroll-video__scrim"
          style={{ opacity: scrimOpacity }}
          aria-hidden
        />
        <div
          className="hero-scroll-video__spotlight"
          style={{ opacity: spotlightOpacity }}
          aria-hidden
        />

        <div
          className="hero-scroll-video__copy"
          style={{
            opacity: textP,
            transform: `translateY(${(1 - textP) * 28}px)`,
            pointerEvents: textP > 0.6 ? 'auto' : 'none',
          }}
        >
          <p className="hero-scroll-video__eyebrow">
            <span className="hero-scroll-video__eyebrow-text">
              Cabinet Cap Horn Conseils — Marcq-en-Barœul
            </span>
          </p>

          <h1 className="hero-scroll-video__title">
            <span className="hero-scroll-video__welcome">
              <em>Bienvenue.</em>
            </span>
          </h1>

          <p className="hero-scroll-video__lead">
            Cabinet de courtage indépendant.<br />
            <span className="hero-scroll-video__lead-emphasis">
              Architecture financière sur mesure pour celles et ceux qui pensent à long terme.
            </span>
          </p>

          <div className="hero-scroll-video__cta">
            <Link href="/tunnel" className="btn-gold hero-scroll-video__btn">
              Démarrer mon étude
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="hero-scroll-video__meta">
              Sans engagement · Réponse sous 24h · RGPD
            </p>
          </div>
        </div>

        <div
          className="hero-scroll-video__cue"
          style={{ opacity: cueOpacity }}
          aria-hidden
        >
          <span className="hero-scroll-video__cue-label">Scroll</span>
          <span className="hero-scroll-video__cue-line" />
        </div>
      </div>
    </section>
  )
}
