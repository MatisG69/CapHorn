'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SQRT_5000 = Math.sqrt(5000)

// Couleurs de la charte (en dur → indépendant du CSS global / du cache).
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

// ⚠️ Témoignages de démonstration — à remplacer par de vrais avis clients.
const testimonials = [
  { tempId: 0, testimonial: "Cap Horn a décroché un taux que ma banque refusait. Dossier bouclé en trois semaines.", by: 'Julie · Primo-accédante, Lille' },
  { tempId: 1, testimonial: "Un seul interlocuteur du premier appel à la signature. Guillaume a tout négocié à ma place.", by: 'Marc · Chef d’entreprise, Roubaix' },
  { tempId: 2, testimonial: "On nous disait notre dossier impossible à financer. Ils ont trouvé la banque qui a dit oui.", by: 'Sophie & Karim · Investisseurs locatifs' },
  { tempId: 3, testimonial: "Près de 18 000 € économisés sur l’assurance de mon prêt grâce à la délégation.", by: 'Antoine · Cadre, Marcq-en-Barœul' },
  { tempId: 4, testimonial: "Réactivité impressionnante : rappelé sous 24 h, accompagné jusque chez le notaire.", by: 'Élodie · Résidence principale' },
  { tempId: 5, testimonial: "Le financement de mon cabinet a été monté sur mesure. Un service vraiment haut de gamme.", by: 'Dr. Laurent · Chirurgien-dentiste' },
  { tempId: 6, testimonial: "Conseil honnête : orienté vers la solution la plus saine, pas la plus chère pour moi.", by: 'Nadia · Regroupement de crédits' },
  { tempId: 7, testimonial: "Reprise d’entreprise financée avec un effet de levier optimal. Bluffant de maîtrise.", by: 'Thomas · Repreneur' },
]

function initials(by: string) {
  const name = by.split('·')[0].trim()
  return name.split(/[\s&]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

interface CardProps {
  position: number
  testimonial: (typeof testimonials)[0]
  handleMove: (steps: number) => void
  cardSize: number
}

const TestimonialCard: React.FC<CardProps> = ({ position, testimonial, handleMove, cardSize }) => {
  const isCenter = position === 0
  return (
    <div
      onClick={() => handleMove(position)}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        cursor: 'pointer',
        width: cardSize,
        height: cardSize,
        padding: 28,
        borderWidth: 2,
        borderStyle: 'solid',
        zIndex: isCenter ? 10 : 0,
        clipPath:
          'polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)',
        background: isCenter ? `linear-gradient(155deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)` : WHITE,
        color: isCenter ? ESPRESSO : DARK,
        borderColor: isCenter ? GOLD_DEEP : BORDER,
        transform: `translate(-50%, -50%) translateX(${(cardSize / 1.5) * position}px) translateY(${
          isCenter ? -65 : position % 2 ? 15 : -15
        }px) rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)`,
        boxShadow: isCenter ? `0px 8px 0px 4px ${GOLD_DEEP}` : '0 10px 30px -18px rgba(12,14,18,0.35)',
        transition: 'all 0.5s ease-in-out',
      }}
    >
      <span
        style={{
          position: 'absolute',
          display: 'block',
          transformOrigin: 'top right',
          transform: 'rotate(45deg)',
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
          background: isCenter ? 'rgba(42,33,6,0.18)' : BORDER,
        }}
      />
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 56,
          background: isCenter ? 'rgba(255,255,255,0.6)' : CREAM,
          color: isCenter ? GOLD_DEEP : GOLD,
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 18,
          boxShadow: `3px 3px 0px ${isCenter ? 'rgba(138,111,42,0.4)' : BORDER}`,
        }}
      >
        {initials(testimonial.by)}
      </div>
      <h3 style={{ fontFamily: SERIF, fontSize: cardSize > 300 ? 19 : 16, fontWeight: 500, lineHeight: 1.35, margin: 0 }}>
        “{testimonial.testimonial}”
      </h3>
      <p
        style={{
          position: 'absolute',
          bottom: 28,
          left: 28,
          right: 28,
          fontSize: 12.5,
          fontStyle: 'italic',
          color: isCenter ? 'rgba(42,33,6,0.72)' : MID,
          margin: 0,
        }}
      >
        — {testimonial.by}
      </p>
    </div>
  )
}

function NavBtn({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={label}
      style={{
        width: 52,
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: hover ? GOLD : WHITE,
        color: hover ? '#fff' : GOLD_DEEP,
        border: `2px solid ${GOLD}`,
        cursor: 'pointer',
        transition: 'background 0.2s, color 0.2s',
      }}
    >
      {children}
    </button>
  )
}

export default function StaggerTestimonials() {
  const [cardSize, setCardSize] = useState(340)
  const [list, setList] = useState(testimonials)

  const handleMove = (steps: number) => {
    const newList = [...list]
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift()
        if (!item) return
        newList.push({ ...item, tempId: Math.random() })
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop()
        if (!item) return
        newList.unshift({ ...item, tempId: Math.random() })
      }
    }
    setList(newList)
  }

  useEffect(() => {
    const update = () => setCardSize(window.matchMedia('(min-width: 640px)').matches ? 340 : 260)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 560,
        overflow: 'hidden',
        borderRadius: 18,
        background: 'linear-gradient(180deg, #FCFAF6, #F3EEE4)',
        border: `1px solid ${BORDER}`,
      }}
    >
      {list.map((t, index) => {
        const position = list.length % 2 ? index - (list.length + 1) / 2 : index - list.length / 2
        return <TestimonialCard key={t.tempId} testimonial={t} handleMove={handleMove} position={position} cardSize={cardSize} />
      })}
      <div style={{ position: 'absolute', left: '50%', bottom: 22, transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 20 }}>
        <NavBtn onClick={() => handleMove(-1)} label="Témoignage précédent"><ChevronLeft className="w-6 h-6" /></NavBtn>
        <NavBtn onClick={() => handleMove(1)} label="Témoignage suivant"><ChevronRight className="w-6 h-6" /></NavBtn>
      </div>
    </div>
  )
}
