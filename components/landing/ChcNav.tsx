'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, Phone } from 'lucide-react'
import ContactModal from './ContactModal'
import { LEGAL_ENTITY } from '@/lib/seo/config'

const LINKS = [
  { href: '/expertises', label: 'Expertises' },
  { href: '/methode', label: 'Méthode' },
  { href: '/blog', label: 'Blog' },
  { href: '/simulateur', label: 'Simulateur' },
  { href: '/le-cabinet', label: 'Le cabinet' },
]

/** Pages de financement : sur mobile elles n'étaient atteignables que par le
 *  pied de page, avec des cibles tactiles de 20 px. On les remonte ici. */
const FINANCEMENTS = [
  { href: '/financement-professions-liberales', label: 'Professions libérales' },
  { href: '/financement-professions-sante', label: 'Professions de santé' },
  { href: '/financement-professions-juridiques', label: 'Avocats & notaires' },
  { href: '/financement-professions-chiffre', label: 'Experts-comptables' },
  { href: '/financement-franchise', label: 'Franchise' },
  { href: '/reprise-transmission', label: 'Reprise & transmission' },
]

/** Nav editorial Cap Horn (transparent → crème au scroll) + menu mobile (burger animé). */
export function ChcNav({ active }: { active?: string }) {
  const navRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const [contactOpen, setContactOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (navRef.current) navRef.current.classList.toggle('scrolled', window.scrollY > 60)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Reveal au scroll. threshold 0 : un ratio plus élevé n'est jamais atteint par un
  // bloc plus haut que le viewport (corps d'article), qui resterait alors invisible.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) }
      }),
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    )
    document.querySelectorAll('.chc .r:not(.in)').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [pathname])

  // `menu-open` sur <body> : verrouille le défilement et masque le widget de
  // chat, qui flottait au-dessus du menu et recouvrait le bouton principal.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    document.body.classList.toggle('menu-open', menuOpen)
    return () => {
      document.body.style.overflow = ''
      document.body.classList.remove('menu-open')
    }
  }, [menuOpen])

  // Fermeture au clavier : le menu est une surface plein écran.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <>
      <nav ref={navRef} className="chc-nav">
        <Link href="/" className="chc-nav__logo" onClick={() => setMenuOpen(false)} aria-label="Cap Horn Conseils, accueil">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* Variante sombre : le lettrage est repeint en crème, le pictogramme
              garde ses couleurs. Un simple filtre d'inversion aurait effacé
              la sauge, le teal et l'aqua des barres. */}
          <img src="/logo-caphorn-dark.png" alt="Cap Horn Conseils" className="chc-nav__logo-img" />
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
          aria-controls="chc-mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="chc-burger__box"><span /><span /><span /></span>
        </button>
      </nav>

      {/* Menu mobile plein écran — surface encre, inversée par rapport au site */}
      <div
        id="chc-mobile-menu"
        className={`chc-mobile-menu ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="chc-mobile-menu__scroll">
          <nav className="chc-mobile-menu__links" aria-label="Navigation principale">
            <Link href="/" onClick={() => setMenuOpen(false)}>Accueil</Link>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} aria-current={active === l.href ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="chc-mobile-menu__group">
            <p className="chc-mobile-menu__label">Financements</p>
            <nav className="chc-mobile-menu__grid" aria-label="Pages de financement">
              {FINANCEMENTS.map((l) => (
                <Link key={l.href} href={l.href} aria-current={active === l.href ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Dock de contact : appeler est la première action utile sur mobile. */}
        <div className="chc-mobile-menu__dock">
          <a href={`tel:${LEGAL_ENTITY.phone}`} className="chc-mobile-menu__call">
            <Phone className="w-4 h-4" aria-hidden />
            <span>
              <span className="chc-mobile-menu__call-label">Appeler le cabinet</span>
              <span className="chc-mobile-menu__call-num">{LEGAL_ENTITY.phoneDisplay}</span>
            </span>
          </a>
          <Link href="/tunnel" className="chc-mobile-menu__cta" onClick={() => setMenuOpen(false)}>
            Démarrer mon étude <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
          <button type="button" className="chc-mobile-menu__alt" onClick={() => { setMenuOpen(false); setContactOpen(true) }}>
            Écrire un message
          </button>
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}
