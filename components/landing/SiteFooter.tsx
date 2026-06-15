import Link from 'next/link'

/** Pied de page premium partagé. */
export function SiteFooter() {
  return (
    <footer className="ch-footer">
      <div className="ch-container">
        <div className="ch-footer__grid">
          <div className="ch-footer__brand">
            <Link href="/" className="ch-brand">
              <span className="ch-brand__mark">CH</span>
              <span className="ch-brand__name">Cap Horn Conseils</span>
            </Link>
            <p className="fdesc">
              Cabinet de courtage indépendant en financement et assurance. Architecture
              financière sur mesure, à Marcq-en-Barœul.
            </p>
          </div>
          <div>
            <h4>Expertises</h4>
            <ul>
              <li><Link href="/expertises">Immobilier</Link></li>
              <li><Link href="/expertises">Financement pro</Link></li>
              <li><Link href="/expertises">Assurance emprunteur</Link></li>
              <li><Link href="/simulateur">Simulateur</Link></li>
            </ul>
          </div>
          <div>
            <h4>Cabinet</h4>
            <ul>
              <li><Link href="/methode">Méthode</Link></li>
              <li><Link href="/le-cabinet">À propos</Link></li>
              <li><Link href="/tunnel">Démarrer une étude</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href="https://cap-horn-conseils.com" target="_blank" rel="noopener noreferrer">cap-horn-conseils.com</a></li>
              <li>Marcq-en-Barœul</li>
            </ul>
          </div>
        </div>
        <div className="ch-footer__bottom">
          <span>© {new Date().getFullYear()} Cap Horn Conseils · Courtage &amp; Financement</span>
          <span>Données protégées · RGPD · Mentions légales</span>
        </div>
      </div>
    </footer>
  )
}
