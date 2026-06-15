import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/** Footer editorial Cap Horn — bandeau CTA + colonnes + bas de page. */
export function ChcFooter() {
  return (
    <footer className="chc-footer">
      <div className="chc-footer__cta">
        <div className="chc-footer__cta-title">Prêt à faire avancer<br /><em>votre projet ?</em></div>
        <Link href="/tunnel" className="chc-btn chc-btn-gold">Démarrer mon étude gratuite <ArrowRight className="w-4 h-4" /></Link>
      </div>
      <div className="chc-footer__grid">
        <div className="chc-footer__brand">
          <span className="chc-nav__name" style={{ fontSize: 18 }}>Cap Horn Conseils</span>
          <p style={{ marginTop: 14, fontSize: 13, fontWeight: 300, lineHeight: 1.8, maxWidth: '34ch', color: 'rgba(255,255,255,0.5)' }}>
            Cabinet de courtage indépendant en financement et assurance. Architecture financière sur mesure, à Marcq-en-Barœul.
          </p>
        </div>
        <div>
          <h4>Expertises</h4>
          <Link href="/expertises">Immobilier</Link>
          <Link href="/expertises">Financement pro</Link>
          <Link href="/expertises">Assurance emprunteur</Link>
          <Link href="/simulateur">Simulateur</Link>
        </div>
        <div>
          <h4>Cabinet</h4>
          <Link href="/methode">Méthode</Link>
          <Link href="/le-cabinet">À propos</Link>
          <Link href="/tunnel">Démarrer une étude</Link>
        </div>
      </div>
      <div className="chc-footer__bottom">
        <span>© {new Date().getFullYear()} Cap Horn Conseils · Courtage &amp; Financement</span>
        <span>Données protégées · RGPD · Mentions légales · Marcq-en-Barœul</span>
      </div>
    </footer>
  )
}
