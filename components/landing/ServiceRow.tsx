'use client'

import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import type { Service } from './ServiceModal'

interface ServiceRowProps {
  service: Service
  delay: string
  onClick: () => void
}

/**
 * Ligne d'expertise cliquable sur la home (Immobilier, Financement Pro…).
 * Layout critique en inline styles + style colocalisé pour le hover, afin
 * de rester fonctionnel même quand le CSS global n'est pas rechargé par
 * le HMR Tailwind v4.
 */
const buttonStyle: CSSProperties = {
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  gap: '1.5rem',
  padding: '2rem 0.5rem',
  borderBottom: '1px solid var(--color-ink-line)',
  background: 'transparent',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background 280ms cubic-bezier(0.16, 1, 0.3, 1), padding-left 280ms cubic-bezier(0.16, 1, 0.3, 1)',
  position: 'relative',
}

const numberStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: 10,
  fontWeight: 500,
  color: 'var(--color-gold-deep)',
  width: '2.5rem',
  flexShrink: 0,
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '0.2em',
}

const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontWeight: 500,
  fontSize: '1.5rem',
  lineHeight: 1.15,
  color: 'var(--color-cream)',
  flex: 1,
  margin: 0,
  transition: 'color 300ms cubic-bezier(0.16, 1, 0.3, 1)',
}

const descStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-cream-dim)',
  fontSize: '0.875rem',
  lineHeight: 1.55,
  textAlign: 'right',
  maxWidth: '24rem',
}

const iconStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.25rem',
  height: '2.25rem',
  borderRadius: 999,
  background: 'rgba(201, 168, 76, 0.08)',
  color: 'var(--color-gold-soft)',
  border: '1px solid var(--color-ink-line)',
  flexShrink: 0,
  transition: 'background 280ms cubic-bezier(0.16, 1, 0.3, 1), border-color 280ms cubic-bezier(0.16, 1, 0.3, 1), transform 280ms cubic-bezier(0.16, 1, 0.3, 1), color 280ms cubic-bezier(0.16, 1, 0.3, 1)',
}

export function ServiceRow({ service, delay, onClick }: ServiceRowProps) {
  return (
    <>
      <style>{`
        @media (min-width: 1024px) {
          .service-row { gap: 3rem !important; padding: 2.5rem 1rem !important; }
          .service-row .service-row__title { font-size: 1.875rem !important; }
          .service-row .service-row__desc { max-width: 26rem !important; }
        }
        @media (max-width: 767px) {
          .service-row .service-row__desc { display: none !important; }
        }
        .service-row:hover {
          background: rgba(201, 168, 76, 0.05) !important;
          padding-left: 1.25rem !important;
        }
        .service-row:focus-visible {
          outline: none;
          background: rgba(201, 168, 76, 0.08) !important;
          box-shadow: inset 0 0 0 1px rgba(201, 168, 76, 0.3);
        }
        .service-row:hover .service-row__title,
        .service-row:focus-visible .service-row__title {
          color: var(--color-gold-soft) !important;
        }
        .service-row:hover .service-row__icon,
        .service-row:focus-visible .service-row__icon {
          background: linear-gradient(180deg, var(--color-gold-soft), var(--color-gold)) !important;
          color: var(--color-ink) !important;
          border-color: transparent !important;
          transform: translateX(4px) !important;
        }
      `}</style>
      <button
        type="button"
        data-reveal
        data-delay={delay}
        onClick={onClick}
        className="service-row"
        style={buttonStyle}
        aria-label={`Détails sur ${service.title}`}
      >
        <span className="service-row__number" style={numberStyle}>
          {service.number}
        </span>
        <h3 className="service-row__title" style={titleStyle}>
          {service.title}
        </h3>
        <p className="service-row__desc" style={descStyle}>
          {service.description}
        </p>
        <span className="service-row__icon" style={iconStyle} aria-hidden>
          <ArrowRight className="w-4 h-4" />
        </span>
      </button>
    </>
  )
}
