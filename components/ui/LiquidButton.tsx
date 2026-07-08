'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Bouton « Liquid Glass » façon Apple, 100 % inline (insensible au cache CSS),
 * sans dépendance (ni cva ni radix). Effet : anneau de verre (inset shadows) +
 * réfraction du fond via le filtre SVG #container-glass (monté dans le layout).
 *
 * On garde la couleur de base du composant (pas de jaune) : fond transparent,
 * texte adaptatif selon le fond environnant via `tone`.
 *   - tone="light" : posé sur un fond clair  → texte foncé, anneau sombre
 *   - tone="dark"  : posé sur un fond sombre  → texte clair, anneau lumineux
 */

type Tone = 'light' | 'dark'
type Size = 'sm' | 'md' | 'lg' | 'nav' | 'icon'

// Anneaux de verre (convertis depuis le composant source).
const RIM_ON_LIGHT =
  '0 0 6px rgba(0,0,0,0.03), 0 2px 6px rgba(0,0,0,0.08), inset 3px 3px 0.5px -3px rgba(0,0,0,0.9), inset -3px -3px 0.5px -3px rgba(0,0,0,0.85), inset 1px 1px 1px -0.5px rgba(0,0,0,0.6), inset -1px -1px 1px -0.5px rgba(0,0,0,0.6), inset 0 0 6px 6px rgba(0,0,0,0.12), inset 0 0 2px 2px rgba(0,0,0,0.06), 0 0 12px rgba(255,255,255,0.15)'
const RIM_ON_DARK =
  '0 0 8px rgba(0,0,0,0.03), 0 2px 6px rgba(0,0,0,0.08), inset 3px 3px 0.5px -3.5px rgba(255,255,255,0.09), inset -3px -3px 0.5px -3.5px rgba(255,255,255,0.85), inset 1px 1px 1px -0.5px rgba(255,255,255,0.6), inset -1px -1px 1px -0.5px rgba(255,255,255,0.6), inset 0 0 6px 6px rgba(255,255,255,0.12), inset 0 0 2px 2px rgba(255,255,255,0.06), 0 0 12px rgba(0,0,0,0.15)'

const SANS = "var(--font-ibm-plex), 'Inter', system-ui, sans-serif"

const SIZES: Record<Size, React.CSSProperties> = {
  sm: { padding: '9px 16px', fontSize: 11.5 },
  md: { padding: '13px 26px', fontSize: 12 },
  lg: { padding: '16px 34px', fontSize: 12.5 },
  nav: { padding: '9px 15px', fontSize: 12.5 },
  icon: { width: 42, height: 42, padding: 0 },
}

export interface LiquidButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  tone?: Tone
  size?: Size
  /** Si fourni, rend un <Link> Next au lieu d'un <button>. */
  href?: string
  /** Majuscules + interlettrage (style CTA de la charte). true par défaut. */
  uppercase?: boolean
  /** Élément de nav courant (souligne légèrement). */
  active?: boolean
}

export const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ tone = 'light', size = 'md', href, uppercase = true, active = false, className, style, children, ...props }, ref) => {
    const [hover, setHover] = React.useState(false)
    const dark = tone === 'dark'
    const radius = 999

    const rootStyle: React.CSSProperties = {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      borderRadius: radius,
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      textDecoration: 'none',
      fontFamily: SANS,
      fontWeight: 600,
      letterSpacing: uppercase ? '0.1em' : '0.01em',
      textTransform: uppercase ? 'uppercase' : 'none',
      color: dark ? '#F5F0E5' : '#1A1A1A',
      transform: hover ? 'translateY(-1px) scale(1.04)' : 'none',
      transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), color 0.2s ease',
      WebkitTapHighlightColor: 'transparent',
      ...SIZES[size],
      ...style,
    }

    const layerBase: React.CSSProperties = {
      position: 'absolute',
      inset: 0,
      borderRadius: radius,
      pointerEvents: 'none',
    }

    const inner = (
      <>
        {/* Anneau de verre */}
        <span
          aria-hidden
          style={{
            ...layerBase,
            boxShadow: dark ? RIM_ON_DARK : RIM_ON_LIGHT,
            transition: 'box-shadow 0.25s ease',
          }}
        />
        {/* Réfraction du fond, flou de verre propre (sans déplacement/bruit) */}
        <span
          aria-hidden
          style={{
            ...layerBase,
            overflow: 'hidden',
            WebkitBackdropFilter: 'blur(2px) saturate(1.4)',
            backdropFilter: 'blur(2px) saturate(1.4)',
          }}
        />
        {/* Surbrillance au survol */}
        <span
          aria-hidden
          style={{
            ...layerBase,
            background: dark
              ? 'linear-gradient(to top, transparent, rgba(255,255,255,0.10))'
              : 'linear-gradient(to top, transparent, rgba(255,255,255,0.45))',
            opacity: hover ? 1 : 0,
            transition: 'opacity 0.25s ease',
          }}
        />
        <span
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 9,
            borderBottom: active ? `1.5px solid ${dark ? '#F5F0E5' : '#1A1A1A'}` : '1.5px solid transparent',
            paddingBottom: active ? 1 : 0,
          }}
        >
          {children}
        </span>
      </>
    )

    const shared = {
      className: cn('liquid-btn', className),
      style: rootStyle,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
    }

    if (href) {
      return (
        <Link href={href} {...shared} {...(props as Record<string, unknown>)}>
          {inner}
        </Link>
      )
    }

    return (
      <button ref={ref} type={props.type ?? 'button'} {...shared} {...props}>
        {inner}
      </button>
    )
  },
)

LiquidButton.displayName = 'LiquidButton'
