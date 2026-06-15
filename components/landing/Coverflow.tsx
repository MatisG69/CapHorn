'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

export type CoverflowItem = string | { title: string; logo?: string }

interface CoverflowProps {
  items: CoverflowItem[]
  label?: string
  interval?: number
}

const stageStyle: CSSProperties = {
  position: 'relative',
  height: 360,
  perspective: '1700px',
  transformStyle: 'preserve-3d',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
const cardBase: CSSProperties = {
  position: 'absolute',
  width: 264,
  height: 340,
  borderRadius: 28,
  padding: 26,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  textAlign: 'left',
  cursor: 'pointer',
  overflow: 'hidden',
  background:
    'linear-gradient(160deg, rgba(255,255,255,0.13), rgba(255,255,255,0.04) 55%, rgba(255,255,255,0.02))',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'rgba(255,255,255,0.16)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.32), 0 44px 80px -34px rgba(0,0,0,0.92)',
  transition:
    'transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s, border-color 0.45s',
  willChange: 'transform, opacity',
}
const glowStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  background:
    'radial-gradient(130% 80% at 100% 0%, rgba(201,164,92,0.20), transparent 52%), radial-gradient(120% 90% at 0% 100%, rgba(255,255,255,0.06), transparent 55%)',
}
const labelStyle: CSSProperties = {
  position: 'relative',
  fontFamily: 'var(--font-ibm-plex), system-ui, sans-serif',
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.20em',
  textTransform: 'uppercase',
  color: '#E2C88A',
  padding: '6px 13px',
  borderRadius: 100,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'rgba(201,164,92,0.34)',
  background: 'rgba(201,164,92,0.10)',
}
const titleStyle: CSSProperties = {
  position: 'relative',
  fontFamily: 'var(--font-cormorant), system-ui, sans-serif',
  fontWeight: 700,
  fontSize: '1.7rem',
  lineHeight: 1.05,
  letterSpacing: '-0.025em',
  color: '#F4EFE6',
}
const logoTile: CSSProperties = {
  position: 'relative',
  alignSelf: 'center',
  width: 132,
  height: 124,
  borderRadius: 22,
  background: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  boxShadow: '0 10px 28px -12px rgba(0,0,0,0.6)',
}
const logoImg: CSSProperties = { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }

export function Coverflow({ items, label = 'Partenaire', interval = 2600 }: CoverflowProps) {
  const data = items.map((it) => (typeof it === 'string' ? { title: it } : it))
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = data.length
  const startX = useRef<number | null>(null)

  useEffect(() => {
    if (paused || interval <= 0 || n <= 1) return
    const id = setInterval(() => setActive((a) => (a + 1) % n), interval)
    return () => clearInterval(id)
  }, [paused, interval, n])

  const rel = (i: number) => {
    let d = i - active
    if (d > n / 2) d -= n
    if (d < -n / 2) d += n
    return d
  }
  const onDown = (x: number) => { startX.current = x }
  const onUp = (x: number) => {
    if (startX.current === null) return
    const dx = x - startX.current
    if (dx > 40) setActive((a) => (a - 1 + n) % n)
    else if (dx < -40) setActive((a) => (a + 1) % n)
    startX.current = null
  }

  return (
    <div
      style={{ position: 'relative', padding: '18px 0 6px', userSelect: 'none' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onMouseDown={(e) => onDown(e.clientX)}
      onMouseUp={(e) => onUp(e.clientX)}
      onTouchStart={(e) => onDown(e.touches[0].clientX)}
      onTouchEnd={(e) => onUp(e.changedTouches[0].clientX)}
    >
      <div style={stageStyle}>
        {data.map((it, i) => {
          const o = rel(i)
          const abs = Math.abs(o)
          const visible = abs <= 3
          const isActive = o === 0
          const style: CSSProperties = {
            ...cardBase,
            transform: `translateX(${o * 46}%) translateZ(${-abs * 130}px) rotateY(${o * -38}deg) scale(${1 - abs * 0.05})`,
            opacity: abs === 0 ? 1 : abs === 1 ? 0.92 : abs === 2 ? 0.6 : 0,
            zIndex: 100 - abs,
            pointerEvents: visible && abs <= 2 ? 'auto' : 'none',
            visibility: visible ? 'visible' : 'hidden',
            ...(isActive
              ? {
                  borderColor: 'rgba(201,164,92,0.55)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.4), 0 56px 96px -34px rgba(0,0,0,0.95), 0 0 60px -14px rgba(201,164,92,0.32)',
                }
              : {}),
          }
          return (
            <button
              key={i}
              type="button"
              style={style}
              onClick={() => !isActive && setActive(i)}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
            >
              <span style={glowStyle} aria-hidden />
              <span style={labelStyle}>{label}</span>
              {it.logo ? (
                <span style={logoTile}>
                  <img
                    src={it.logo}
                    alt={it.title}
                    loading="lazy"
                    style={logoImg}
                    onError={(e) => {
                      const tile = e.currentTarget.parentElement
                      if (tile) tile.style.display = 'none'
                    }}
                  />
                </span>
              ) : null}
              <span style={titleStyle}>{it.title}</span>
            </button>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
        {data.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Aller à la carte ${i + 1}`}
            style={{
              width: i === active ? 24 : 7,
              height: 7,
              borderRadius: 100,
              background: i === active ? '#C9A45C' : 'rgba(255,255,255,0.22)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'background 0.25s, width 0.25s',
            }}
          />
        ))}
      </div>
    </div>
  )
}
