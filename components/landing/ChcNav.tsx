'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ContactModal from './ContactModal'

const LINKS = [
  { href: '/expertises', label: 'Expertises' },
  { href: '/methode', label: 'Méthode' },
  { href: '/blog', label: 'Blog' },
  { href: '/simulateur', label: 'Simulateur' },
  { href: '/le-cabinet', label: 'Le cabinet' },
]

/** Nav editorial Cap Horn (transparent → crème au scroll) + menu mobile (burger animé). */
export function ChcNav({ active }: { active?: string }) {
  const navRef = useRef<HTMLElement>(null)
  const [contactOpen, setContactOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (navRef.current) navRef.current.classList.toggle('scrolled', window.scrollY > 60)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in') }),
      { threshold: 0.14, rootMargin: '0px 0px -7% 0px' }
    )
    document.querySelectorAll('.chc .r').forEach((el) => obs.observe(el))

    return () => { window.removeEventListener('scroll', onScroll); obs.disconnect() }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav ref={navRef} className="chc-nav">
        <Link href="/" className="chc-nav__logo" onClick={() => setMenuOpen(false)} aria-label="Cap Horn Conseils, accueil">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-caphorn.png" alt="Cap Horn Conseils" className="chc-nav__logo-img" />
        </Link>
        <div className="chc-nav__links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={active === l.href ? 'page' : undefined}>{l.label}</Link>
          ))}
        </div>
        <button type="button" className="chc-nav__cta" onClick={() => setContactOpen(true)}>Prendre contact</button>

        {/* Burger, mobile uniquement */}
        <button
          type="button"
          className={`chc-burger ${menuOpen ? 'is-open' : ''}`}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Menu mobile plein écran */}
      <div className={`chc-mobile-menu ${menuOpen ? 'is-open' : ''}`}>
        <nav className="chc-mobile-menu__links">
          <Link href="/" onClick={() => setMenuOpen(false)}>Accueil</Link>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={active === l.href ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="chc-mobile-menu__actions">
          <button type="button" className="chc-btn-link" onClick={() => { setMenuOpen(false); setContactOpen(true) }}>
            Prendre contact
          </button>
          <Link href="/tunnel" className="chc-btn chc-btn-gold" onClick={() => setMenuOpen(false)}>
            Démarrer mon étude <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}
