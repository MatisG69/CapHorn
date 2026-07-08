'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Deck de témoignages 3D en auto-play (style « card stack »).
 * Hauteur fixe (self-contained, pas de scroll-jacking) : les cartes du fond
 * restent visibles avec un effet 3D, et toutes les 3 s la carte du dessus
 * recule tout au fond pendant que la suivante avance. Pause au survol,
 * contrôles manuels + repli prefers-reduced-motion.
 * 100 % inline → insensible au cache CSS global. Charte Cap Horn.
 */

const DARK = '#0C0E12'
const WHITE = '#FFFFFF'
const CREAM = '#F7F4EF'
const GOLD = '#B8922A'
const GOLD_LIGHT = '#E3C173'
const GOLD_DEEP = '#8A6F2A'
const ESPRESSO = '#2A2106'
const BORDER = 'rgba(0,0,0,0.08)'
const MID = '#6B7280'
const SERIF = "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif"
const SANS = "var(--font-ibm-plex), 'Inter', system-ui, sans-serif"

// ⚠️ Témoignages de démonstration, à remplacer par de vrais avis clients.
const testimonials = [
  { testimonial: "Cap Horn a décroché un taux que ma banque refusait. Dossier bouclé en trois semaines.", by: 'Julie', role: 'Primo-accédante · Lille' },
  { testimonial: "Un seul interlocuteur du premier appel à la signature. Guillaume a tout négocié à ma place.", by: 'Marc', role: "Chef d'entreprise · Roubaix" },
  { testimonial: "On nous disait notre dossier impossible à financer. Ils ont trouvé la banque qui a dit oui.", by: 'Sophie & Karim', role: 'Investisseurs locatifs' },
  { testimonial: "Près de 18 000 € économisés sur l'assurance de mon prêt grâce à la délégation.", by: 'Antoine', role: 'Cadre · Marcq-en-Barœul' },
  { testimonial: "Réactivité impressionnante : rappelé sous 24 h, accompagné jusque chez le notaire.", by: 'Élodie', role: 'Résidence principale' },
  { testimonial: "Le financement de mon cabinet a été monté sur mesure. Un service vraiment haut de gamme.", by: 'Dr. Laurent', role: 'Chirurgien-dentiste' },
  { testimonial: "Conseil honnête : orienté vers la solution la plus saine, pas la plus chère pour moi.", by: 'Nadia', role: 'Regroupement de crédits' },
  { testimonial: "Reprise d'entreprise financée avec un effet de levier optimal. Bluffant de maîtrise.", by: 'Thomas', role: 'Repreneur' },
]

const N = testimonials.length
const INTERVAL = 3000
const CARD_H = 320
const TOP_PAD = 78
const MAX_VISIBLE = 4 // profondeur visible de la pile
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)' // settle doux

function initials(name: string) {
  return name.split(/[\s&]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function Stars() {
  return (
    <div style={{ display: 'flex', gap: 3 }} aria-label="Note : 5 sur 5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={15} height={15} viewBox="0 0 20 20" fill={GOLD} aria-hidden>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  )
}

function CardBody({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <>
      <span
        aria-hidden
        style={{ position: 'absolute', top: 0, left: 34, right: 34, height: 2, borderRadius: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, opacity: 0.7 }}
      />
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stars />
        <span style={{ fontFamily: SANS, fontSize: 9.5, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD_DEEP }}>
          Avis vérifié
        </span>
      </header>
      <p style={{ fontFamily: SERIF, fontSize: 'clamp(20px, 3.2vw, 26px)', fontWeight: 500, lineHeight: 1.35, color: DARK, margin: 0 }}>
        <span style={{ color: GOLD, fontSize: '1.4em', lineHeight: 0, verticalAlign: '-0.25em', marginRight: 2 }}>“</span>
        {t.testimonial}
      </p>
      <footer style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span
          style={{
            flexShrink: 0, width: 46, height: 46, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: SERIF, fontWeight: 600, fontSize: 16, color: ESPRESSO,
            background: `linear-gradient(150deg, ${GOLD_LIGHT}, ${GOLD})`, boxShadow: `0 4px 10px -4px ${GOLD_DEEP}`,
          }}
        >
          {initials(t.by)}
        </span>
        <div>
          <div style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 600, color: DARK }}>{t.by}</div>
          <div style={{ fontFamily: SANS, fontSize: 12.5, color: MID, marginTop: 1 }}>{t.role}</div>
        </div>
      </footer>
    </>
  )
}

const cardBase: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  height: CARD_H,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: 16,
  padding: '34px 34px',
  borderRadius: 22,
  background: `linear-gradient(170deg, ${WHITE} 0%, ${CREAM} 100%)`,
  border: `1px solid ${BORDER}`,
  boxShadow: `0 1px 0 rgba(255,255,255,0.7) inset, 0 30px 60px -32px rgba(12,14,18,0.55)`,
  backfaceVisibility: 'hidden',
}

function NavBtn({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={label}
      style={{
        width: 44, height: 44, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '50%', cursor: 'pointer', color: hover ? '#fff' : GOLD_DEEP,
        background: hover ? GOLD : WHITE, border: `1.5px solid ${GOLD}`,
        transition: 'background 0.2s ease, color 0.2s ease',
      }}
    >
      {children}
    </button>
  )
}

export default function StackedTestimonials() {
  const [front, setFront] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const next = useCallback(() => setFront((f) => (f + 1) % N), [])
  const prev = useCallback(() => setFront((f) => (f - 1 + N) % N), [])

  // Auto-play (sauf pause / reduced-motion).
  useEffect(() => {
    if (paused || reduce) return
    const id = window.setInterval(next, INTERVAL)
    return () => window.clearInterval(id)
  }, [paused, reduce, next])

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 20px' }}>
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        role="group"
        aria-roledescription="carrousel"
        aria-label="Témoignages clients"
        style={{
          position: 'relative',
          height: TOP_PAD + CARD_H + 24,
          perspective: 1600,
        }}
      >
        {testimonials.map((t, i) => {
          // Position depuis le dessus : 0 = front, croissant vers le fond.
          const pos = (i - front + N) % N
          const k = Math.min(pos, MAX_VISIBLE)
          const ty = TOP_PAD - k * 20
          const scale = 1 - k * 0.06
          const tz = -k * 60
          const opacity = pos > MAX_VISIBLE ? 0 : Math.max(0, 1 - pos * 0.24)
          const isFront = pos === 0

          return (
            <article
              key={i}
              aria-hidden={!isFront}
              style={{
                ...cardBase,
                zIndex: N - pos,
                opacity,
                transform: `translateY(${ty}px) translateZ(${tz}px) scale(${scale.toFixed(4)})`,
                transition: reduce ? 'none' : `transform 0.6s ${EASE}, opacity 0.6s ${EASE}`,
                pointerEvents: isFront ? 'auto' : 'none',
                willChange: 'transform, opacity',
              }}
            >
              <CardBody t={t} />
            </article>
          )
        })}
      </div>

      {/* Contrôles : flèches + points */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginTop: 22 }}>
        <NavBtn onClick={prev} label="Témoignage précédent"><ChevronLeft className="w-5 h-5" /></NavBtn>

        <div style={{ display: 'flex', gap: 7 }} role="tablist" aria-label="Choisir un témoignage">
          {testimonials.map((_, i) => {
            const isActive = i === front
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Témoignage ${i + 1}`}
                onClick={() => setFront(i)}
                style={{
                  height: 8,
                  width: isActive ? 24 : 8,
                  padding: 0,
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  background: isActive ? GOLD : 'rgba(0,0,0,0.16)',
                  transition: 'width 0.3s ease, background 0.3s ease',
                }}
              />
            )
          })}
        </div>

        <NavBtn onClick={next} label="Témoignage suivant"><ChevronRight className="w-5 h-5" /></NavBtn>
      </div>
    </div>
  )
}
