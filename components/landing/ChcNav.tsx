'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const LINKS = [
  { href: '/expertises', label: 'Expertises' },
  { href: '/methode', label: 'Méthode' },
  { href: '/simulateur', label: 'Simulateur' },
  { href: '/le-cabinet', label: 'Le cabinet' },
]

/** Nav editorial Cap Horn (transparent → crème au scroll) + révélation au scroll. */
export function ChcNav({ active }: { active?: string }) {
  const navRef = useRef<HTMLElement>(null)

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

  return (
    <nav ref={navRef} className="chc-nav">
      <Link href="/" className="chc-nav__logo">
        <span className="chc-nav__mark">CH</span>
        <span className="chc-nav__name">Cap Horn<span>Conseils en financement</span></span>
      </Link>
      <div className="chc-nav__links">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} aria-current={active === l.href ? 'page' : undefined}>{l.label}</Link>
        ))}
      </div>
      <Link href="/tunnel" className="chc-nav__cta">Prendre contact</Link>
    </nav>
  )
}
