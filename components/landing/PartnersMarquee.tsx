import type { CSSProperties } from 'react'

const PARTNERS = [
  'Banquiers',
  'Notaires',
  'Conseillers en patrimoine',
  'Experts-comptables',
  'Agents immobiliers',
  'Avocats fiscalistes',
  'Family officers',
  'Gestionnaires d’actifs',
]

/**
 * Carousel discret des typologies d'apporteurs / partenaires.
 * Layout critique en inline styles pour rester robuste face au HMR
 * de Tailwind v4 + Next 16 ; la signature visuelle (couleurs, hover)
 * vient de globals.css via .partners-marquee*.
 */
const wrapperStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  WebkitMaskImage:
    'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
  maskImage:
    'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
}

const trackStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'nowrap',
  width: 'max-content',
  alignItems: 'center',
  animation: 'partners-marquee-scroll 38s linear infinite',
  willChange: 'transform',
}

const itemStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.85rem',
  padding: '0 1.5rem',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  fontFamily: 'var(--font-sans)',
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: 'var(--color-cream-dim)',
}

const dotStyle: CSSProperties = {
  display: 'inline-block',
  width: 4,
  height: 4,
  borderRadius: 999,
  background: 'var(--color-gold)',
  flexShrink: 0,
}

export function PartnersMarquee() {
  return (
    <>
      <style>{`
        @keyframes partners-marquee-scroll {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        .partners-marquee:hover .partners-marquee__track,
        .partners-marquee:focus-within .partners-marquee__track {
          animation-play-state: paused;
        }
        .partners-marquee__item:hover .partners-marquee__name {
          color: var(--color-cream);
        }
        @media (prefers-reduced-motion: reduce) {
          .partners-marquee__track {
            animation-play-state: paused !important;
          }
        }
      `}</style>
      <div
        className="partners-marquee"
        style={wrapperStyle}
        aria-label="Réseau de partenaires Cap Horn Conseils"
      >
        <div className="partners-marquee__track" style={trackStyle}>
          {[...PARTNERS, ...PARTNERS].map((partner, i) => (
            <span
              key={`${partner}-${i}`}
              className="partners-marquee__item"
              style={itemStyle}
              aria-hidden={i >= PARTNERS.length}
            >
              <span className="partners-marquee__dot" style={dotStyle} aria-hidden />
              <span
                className="partners-marquee__name"
                style={{ transition: 'color 240ms cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                {partner}
              </span>
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
