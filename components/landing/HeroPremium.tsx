'use client'

import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/**
 * Hero premium « private banking » — vidéo d'entrée en plein écran (entrée.mp4)
 * voilée par un dégradé bleu nuit. La mise en page critique (vidéo plein écran,
 * voile, conteneur, lisibilité du texte) est en styles inline pour être
 * robuste quelle que soit la compilation du CSS global. Pattern background-video
 * premium inspiré de 21st.dev, réadapté au stack (React 19 / Next 16).
 */

const sectionStyle: CSSProperties = {
  position: 'relative',
  minHeight: '100svh',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  isolation: 'isolate',
  background: '#0A0907',
}
const videoStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 0,
}
const scrimStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  pointerEvents: 'none',
  background:
    'linear-gradient(180deg, rgba(8,7,5,0.68) 0%, rgba(8,7,5,0.40) 32%, rgba(10,9,7,0.76) 76%, #0A0907 100%)',
}
const vignetteStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  pointerEvents: 'none',
  background:
    'radial-gradient(120% 90% at 50% 35%, transparent 45%, rgba(0,0,0,0.6) 100%)',
}
// Grade doré : tinte subtilement la vidéo vers le chaud (signature de marque).
const gradeStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  pointerEvents: 'none',
  background:
    'linear-gradient(120deg, rgba(201,164,92,0.22), transparent 55%), radial-gradient(80% 60% at 70% 20%, rgba(226,200,138,0.16), transparent 60%)',
  mixBlendMode: 'soft-light',
}
const innerStyle: CSSProperties = {
  position: 'relative',
  zIndex: 2,
  width: '100%',
  maxWidth: 1200,
  margin: '0 auto',
  padding: '110px 24px 0',
}
const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-display), system-ui, sans-serif',
  fontWeight: 800,
  letterSpacing: '-0.035em',
  lineHeight: 0.98,
  color: '#F7F2E9',
  margin: '22px 0 0',
  maxWidth: '15ch',
  fontSize: 'clamp(2.9rem, 7vw, 6rem)',
  textShadow: '0 2px 44px rgba(0,0,0,0.55)',
}
const leadStyle: CSSProperties = {
  margin: '26px 0 0',
  maxWidth: '46ch',
  color: '#CDC4B3',
  fontSize: 'clamp(1.05rem, 1.5vw, 1.3rem)',
  lineHeight: 1.62,
  textShadow: '0 1px 24px rgba(0,0,0,0.55)',
}

export function HeroPremium() {
  return (
    <header style={sectionStyle} aria-label="Cap Horn Conseils — cabinet de courtage">
      <video style={videoStyle} src="/entree.mp4" autoPlay loop muted playsInline preload="auto" aria-hidden />
      <div style={gradeStyle} aria-hidden />
      <div style={scrimStyle} aria-hidden />
      <div style={vignetteStyle} aria-hidden />

      <div style={innerStyle}>
        <div style={{ maxWidth: 940 }}>
          <span className="ch-eyebrow ch-eyebrow--ondark ch-vhero-in" style={{ animationDelay: '60ms' }}>
            <span className="ch-eyebrow__dot" />Cabinet indépendant · Marcq-en-Barœul
          </span>

          <h1 style={titleStyle}>
            <span className="ch-line ch-line--1"><span>L’art de financer</span></span>
            <span className="ch-line ch-line--2"><span style={{ color: 'var(--color-gold-soft, #E2C88A)' }}>les grands projets.</span></span>
          </h1>

          <p style={leadStyle} className="ch-vhero-in" data-d="2">
            Immobilier, professionnel, assurance emprunteur. Cap Horn lit votre projet,
            structure le dossier et négocie pour vous les meilleures conditions — sans frais avant résultat.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 36 }} className="ch-vhero-in" data-d="3">
            <Link href="/tunnel" className="ch-btn ch-btn--primary">
              Démarrer mon étude <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/simulateur" className="ch-btn ch-btn--glass">
              Simuler mes économies
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 40 }} className="ch-vhero-in" data-d="4">
            <div className="ch-avatars">
              <span>SL</span><span>MD</span><span>AK</span><span>JR</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.88rem', color: '#CCD8F0', lineHeight: 1.4 }}>
              <span style={{ color: '#E2C88A', letterSpacing: '2px', fontSize: '0.8rem' }}>★★★★★</span>
              <span><b style={{ color: '#F4EFE6', fontWeight: 600 }}>+500 projets</b> financés · note 4,9/5</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ch-vhero__cue" aria-hidden style={{ position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
        <span className="ch-vhero__cue-line" />
      </div>
    </header>
  )
}
