'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const LINKS = [
  { href: '/expertises', label: 'Expertises' },
  { href: '/methode', label: 'Méthode' },
  { href: '/simulateur', label: 'Simulateur' },
  { href: '/le-cabinet', label: 'Le cabinet' },
]

/** Barre de navigation premium partagée — monogramme, liens pages, verre au scroll. */
export function SiteNav({ active }: { active?: string }) {
  const navRef = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (navRef.current) navRef.current.classList.toggle('is-scrolled', window.scrollY > 12)
      if (progressRef.current) {
        const h = document.documentElement
        const max = h.scrollHeight - h.clientHeight
        const pct = max > 0 ? (h.scrollTop / max) * 100 : 0
        progressRef.current.style.width = `${pct}%`
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    let raf = 0
    const onMove = (e: MouseEvent) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const g = glowRef.current
        if (g) {
          g.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
          g.classList.add('is-on')
        }
      })
    }
    const onLeave = () => glowRef.current?.classList.remove('is-on')
    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <>
      <span ref={progressRef} className="ch-progress" aria-hidden />
      <div ref={glowRef} className="ch-cursor-glow" aria-hidden />
      <nav ref={navRef} className="ch-nav">
      <div className="ch-container ch-nav__inner">
        <Link href="/" className="ch-brand" aria-label="Cap Horn Conseils — accueil">
          <span className="ch-brand__mark">CH</span>
          <span className="ch-brand__name">Cap Horn <span>Conseils</span></span>
        </Link>
        <div className="ch-nav__links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={active === l.href ? 'page' : undefined}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="ch-nav__right">
          <Link href="/tunnel" className="ch-btn ch-btn--primary" style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
            Démarrer <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      </nav>
    </>
  )
}
