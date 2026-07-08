'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { LiquidButton } from '@/components/ui/LiquidButton'

interface SectionWithMockupProps {
  eyebrow?: string
  title: string
  titleEm?: string
  description: string
  contact?: string
  ctaHref?: string
  ctaLabel?: string
  primaryImageSrc: string
  secondaryImageSrc: string
  /** false (défaut) = texte à gauche / visuel à droite */
  reverseLayout?: boolean
}

const BLACK = '#0A0A0A'
const GREY = '#8A8F97'
const GOLD = '#C9A45C'
const SERIF = "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif"
const SANS = "var(--font-ibm-plex), 'Inter', system-ui, sans-serif"
const EASE = 'cubic-bezier(0.16,1,0.3,1)'
const SWAP_INTERVAL = 2000

/** Section CTA + deck de 2 images qui se permutent toutes les 2 s. 100% inline → insensible au cache CSS. */
export default function SectionWithMockup({
  eyebrow,
  title,
  titleEm,
  description,
  contact,
  ctaHref = '/tunnel',
  ctaLabel = 'Démarrer mon étude gratuite',
  primaryImageSrc,
  secondaryImageSrc,
  reverseLayout = false,
}: SectionWithMockupProps) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [isWide, setIsWide] = useState(false)
  const [reduce, setReduce] = useState(false)
  const [front, setFront] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const mq = () => setIsWide(window.matchMedia('(min-width: 880px)').matches)
    mq()
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    window.addEventListener('resize', mq)
    const el = ref.current
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.2 },
    )
    if (el) obs.observe(el)
    return () => { window.removeEventListener('resize', mq); obs.disconnect() }
  }, [])

  // Permutation auto des deux images (sauf pause / reduced-motion).
  useEffect(() => {
    if (reduce || paused) return
    const id = window.setInterval(() => setFront((f) => (f === 0 ? 1 : 0)), SWAP_INTERVAL)
    return () => window.clearInterval(id)
  }, [reduce, paused])

  const reveal = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView || reduce ? 'none' : 'translateY(40px)',
    transition: `opacity 0.8s ${EASE} ${delay}s, transform 0.85s ${EASE} ${delay}s`,
  })

  const images = [primaryImageSrc, secondaryImageSrc]

  return (
    <section ref={ref} style={{ position: 'relative', overflow: 'hidden', background: BLACK, padding: isWide ? 'clamp(96px,13vh,150px) 52px' : '72px 24px' }}>
      <div
        style={{
          maxWidth: 1180, margin: '0 auto', display: 'grid',
          gridTemplateColumns: isWide ? '1fr 1fr' : '1fr',
          gap: isWide ? 40 : 52, alignItems: 'center',
        }}
      >
        {/* Texte, à gauche par défaut */}
        <div style={{ maxWidth: 540, order: isWide && reverseLayout ? 2 : 1, ...reveal(0) }}>
          {eyebrow && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD }}>
              {eyebrow}<span style={{ width: 40, height: 1, background: GOLD, opacity: 0.5 }} />
            </div>
          )}
          <h2 style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 'clamp(34px,5vw,56px)', lineHeight: 1.05, letterSpacing: '-0.01em', color: '#fff', margin: 0 }}>
            {title} {titleEm && <em style={{ fontStyle: 'italic', color: GOLD }}>{titleEm}</em>}
          </h2>
          <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 'clamp(15px,1.5vw,16.5px)', lineHeight: 1.85, color: GREY, marginTop: 22 }}>{description}</p>
          {contact && <p style={{ fontFamily: SANS, fontSize: 13, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.62)', marginTop: 18 }}>{contact}</p>}
          <LiquidButton href={ctaHref} tone="dark" size="lg" style={{ marginTop: 30 }}>
            {ctaLabel} <ArrowRight className="w-4 h-4" />
          </LiquidButton>
        </div>

        {/* Visuel, deck de 2 images qui se permutent (à droite par défaut) */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            position: 'relative', width: '100%', maxWidth: 472, margin: '0 auto',
            aspectRatio: '472 / 600', order: isWide && reverseLayout ? 1 : 2,
            perspective: 1600, ...reveal(0.1),
          }}
        >
          {images.map((src, i) => {
            const isFront = i === front
            // Carte du dessus : pleine. Carte du fond : reculée en haut-droite, atténuée.
            const transform = isFront
              ? 'translate(0%, 0%) translateZ(0px) scale(1) rotate(0deg)'
              : 'translate(9%, -5%) translateZ(-90px) scale(0.9) rotate(2.5deg)'
            return (
              <div
                key={i}
                aria-hidden={!isFront}
                style={{
                  position: 'absolute', inset: 0, borderRadius: 30, overflow: 'hidden',
                  zIndex: isFront ? 10 : 5,
                  backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center',
                  border: '1px solid rgba(255,255,255,0.10)',
                  boxShadow: isFront
                    ? '0 40px 90px -30px rgba(0,0,0,0.85)'
                    : '0 24px 50px -28px rgba(0,0,0,0.8)',
                  filter: isFront ? 'none' : 'brightness(0.6) saturate(0.9)',
                  opacity: isFront ? 1 : 0.92,
                  transform,
                  transformOrigin: 'center center',
                  transition: reduce ? 'none' : `transform 0.85s ${EASE}, opacity 0.85s ease, filter 0.85s ease, box-shadow 0.85s ease`,
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Reflet verre, plus marqué sur la carte du dessus */}
                <div
                  aria-hidden
                  style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'linear-gradient(150deg, rgba(255,255,255,0.12) 0%, transparent 38%), linear-gradient(to top, rgba(10,10,10,0.5), transparent 45%)',
                    opacity: isFront ? 1 : 0.4, transition: reduce ? 'none' : 'opacity 0.85s ease',
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Filet lumineux doré */}
      <div aria-hidden style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 1, background: 'radial-gradient(50% 50% at 50% 50%, rgba(201,164,92,0.4) 0%, rgba(255,255,255,0) 100%)' }} />
    </section>
  )
}
