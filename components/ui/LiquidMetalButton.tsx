'use client'

import { liquidMetalFragmentShader, ShaderMount } from '@paper-design/shaders'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * Bouton « liquid metal » : un shader WebGL anime la bordure métallique.
 *
 * Deux écarts assumés par rapport au composant d'origine :
 * — le remplissage noir (#202020 → #000) et le libellé gris (#666) donnaient
 *   ~3:1 de contraste, sous le seuil AA, sur le principal bouton de
 *   conversion du site. On garde l'effet métal mais le fond passe à
 *   l'ardoise de la marque et le libellé en crème.
 * — largeur figée à 142 px : elle coupait « Qualifier mon projet ». Elle
 *   s'adapte désormais au texte.
 *
 * Le shader est monté après le premier rendu et détruit au démontage : il ne
 * bloque pas l'affichage initial (le bouton est utilisable sans WebGL).
 */
interface LiquidMetalButtonProps {
  label?: string
  href?: string
  onClick?: () => void
  className?: string
}

export function LiquidMetalButton({
  label = 'Qualifier mon projet',
  href,
  onClick,
  className,
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])
  const shaderRef = useRef<HTMLDivElement>(null)
  const shaderMount = useRef<{ destroy?: () => void; setSpeed?: (n: number) => void } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const rippleId = useRef(0)
  const router = useRouter()

  // La largeur suit le libellé (≈ 8,4 px par caractère + rembourrage).
  const dims = useMemo(() => {
    const width = Math.max(150, Math.round(label.length * 8.4) + 56)
    return { width, height: 52 }
  }, [label])

  useEffect(() => {
    const styleId = 'chc-liquid-metal-style'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        .chc-lm__shader canvas {
          width: 100% !important; height: 100% !important;
          display: block !important; position: absolute !important;
          top: 0 !important; left: 0 !important; border-radius: 100px !important;
        }
        @keyframes chc-lm-ripple {
          0%   { transform: translate(-50%, -50%) scale(0); opacity: 0.55; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }`
      document.head.appendChild(style)
    }

    // Respecte « animations réduites » : pas de shader animé en continu.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !shaderRef.current) return

    try {
      shaderMount.current = new ShaderMount(
        shaderRef.current,
        liquidMetalFragmentShader,
        {
          u_repetition: 4, u_softness: 0.5, u_shiftRed: 0.3, u_shiftBlue: 0.3,
          u_distortion: 0, u_contour: 0, u_angle: 45, u_scale: 8, u_shape: 1,
          u_offsetX: 0.1, u_offsetY: -0.1,
        },
        undefined,
        0.6,
      )
    } catch {
      // Sans WebGL, le bouton reste parfaitement fonctionnel.
    }

    return () => {
      shaderMount.current?.destroy?.()
      shaderMount.current = null
    }
  }, [])

  const speed = (v: number) => shaderMount.current?.setSpeed?.(v)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    speed(2.4)
    setTimeout(() => speed(isHovered ? 1 : 0.6), 300)

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const ripple = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: rippleId.current++ }
      setRipples((prev) => [...prev, ripple])
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== ripple.id)), 600)
    }

    onClick?.()
    if (href) router.push(href)
  }

  const layer: React.CSSProperties = {
    position: 'absolute', top: 0, left: 0,
    width: dims.width, height: dims.height, transformStyle: 'preserve-3d',
    transition: 'all 0.8s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.15s ease',
  }
  const press = isPressed ? 'translateY(1px) scale(0.985)' : 'translateY(0) scale(1)'

  return (
    <div className={className} style={{ perspective: 1000 }}>
      <div style={{ position: 'relative', width: dims.width, height: dims.height, transformStyle: 'preserve-3d' }}>
        {/* Libellé */}
        <div
          style={{
            ...layer, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, transform: 'translateZ(20px)', zIndex: 30, pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--chc-display)', fontSize: 12.5, fontWeight: 600,
              letterSpacing: '0.09em', textTransform: 'uppercase',
              color: '#EDF3F2', textShadow: '0 1px 3px rgba(0,0,0,0.55)', whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
        </div>

        {/* Remplissage intérieur, ardoise de la marque */}
        <div style={{ ...layer, transform: `translateZ(10px) ${press}`, zIndex: 20 }}>
          <div
            style={{
              width: dims.width - 4, height: dims.height - 4, margin: 2, borderRadius: 100,
              background: 'linear-gradient(180deg, #24404E 0%, #0F1C26 100%)',
              boxShadow: isPressed ? 'inset 0 2px 5px rgba(0,0,0,0.45)' : 'none',
              transition: 'box-shadow 0.15s ease',
            }}
          />
        </div>

        {/* Anneau métallique animé */}
        <div style={{ ...layer, transform: `translateZ(0px) ${press}`, zIndex: 10 }}>
          <div
            style={{
              width: dims.width, height: dims.height, borderRadius: 100,
              boxShadow: isPressed
                ? '0 0 0 1px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)'
                : isHovered
                  ? '0 0 0 1px rgba(111,179,168,0.35), 0 10px 24px -10px rgba(0,0,0,0.6)'
                  : '0 0 0 1px rgba(0,0,0,0.35), 0 16px 30px -16px rgba(0,0,0,0.55)',
              transition: 'box-shadow 0.2s ease',
            }}
          >
            <div
              ref={shaderRef}
              className="chc-lm__shader"
              style={{ width: dims.width, height: dims.height, borderRadius: 100, overflow: 'hidden', position: 'relative' }}
            />
          </div>
        </div>

        <button
          ref={buttonRef}
          type="button"
          onClick={handleClick}
          onMouseEnter={() => { setIsHovered(true); speed(1) }}
          onMouseLeave={() => { setIsHovered(false); setIsPressed(false); speed(0.6) }}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          style={{
            ...layer, background: 'transparent', border: 'none', cursor: 'pointer',
            outline: 'none', zIndex: 40, transform: 'translateZ(25px)',
            overflow: 'hidden', borderRadius: 100,
          }}
        >
          <span className="sr-only">{label}</span>
          {ripples.map((r) => (
            <span
              key={r.id}
              aria-hidden
              style={{
                position: 'absolute', left: r.x, top: r.y, width: 20, height: 20, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(158,212,210,0.5) 0%, rgba(158,212,210,0) 70%)',
                pointerEvents: 'none', animation: 'chc-lm-ripple 0.6s ease-out',
              }}
            />
          ))}
        </button>
      </div>
    </div>
  )
}
