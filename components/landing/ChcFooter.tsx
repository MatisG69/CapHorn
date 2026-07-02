import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

/**
 * Pied de page Cap Horn — « carte marine ».
 * Bandeau d'appel éditorial (facultatif) + colonnes de liens en texte plein +
 * relevé de position (coordonnées du cap Horn) comme signature de marque.
 * Aucun bouton « liquid glass » : liens sobres, à l'image d'un cabinet discret.
 */
export function ChcFooter({ showCta = true }: { showCta?: boolean }) {
  return (
    <footer className="chc-footer">
      <div className="chc-footer__inner">
        {showCta && (
          <div className="chc-footer__cta">
            <p className="chc-footer__cta-title">
              Prêt à faire avancer<br />
              <em>votre projet ?</em>
            </p>
            <Link href="/tunnel" className="chc-footer__cta-link">
              Démarrer mon étude gratuite
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        )}

        <div className="chc-footer__grid">
          <div className="chc-footer__brand">
            <Link href="/" className="chc-footer__wordmark">
              Cap Horn
              <span>Conseils — Courtage &amp; Financement</span>
            </Link>
            <p className="chc-footer__desc">
              Cabinet de courtage indépendant en financement et assurance.
              Architecture financière sur mesure, à Marcq-en-Barœul.
            </p>
            <p className="chc-footer__coords" aria-label="Cap Horn, relevé de position">
              55°58′ S — 67°16′ O
            </p>
          </div>

          <nav className="chc-footer__col" aria-label="Expertises">
            <h4>Expertises</h4>
            <Link href="/financement-professions-liberales">Professions libérales</Link>
            <Link href="/financement-franchise">Franchise</Link>
            <Link href="/reprise-transmission">Reprise &amp; transmission</Link>
            <Link href="/simulateur-credit-immobilier">Simulateur crédit immo</Link>
            <Link href="/simulateur">Simulateur assurance</Link>
            <Link href="/expertises">Toutes les expertises</Link>
          </nav>

          <nav className="chc-footer__col" aria-label="Cabinet">
            <h4>Cabinet</h4>
            <Link href="/methode">Méthode</Link>
            <Link href="/blog">Blog &amp; conseils</Link>
            <Link href="/le-cabinet">À propos</Link>
            <Link href="/tunnel">Démarrer une étude</Link>
          </nav>

          <div className="chc-footer__col chc-footer__col--contact">
            <h4>Contact</h4>
            <span>Marcq-en-Barœul</span>
            <a href="https://cap-horn-conseils.com" target="_blank" rel="noopener noreferrer">
              cap-horn-conseils.com
              <ArrowUpRight className="w-3 h-3" style={{ display: 'inline', marginLeft: 4, verticalAlign: 'middle' }} aria-hidden />
            </a>
          </div>
        </div>

        <div className="chc-footer__bottom">
          <span>© {new Date().getFullYear()} Cap Horn Conseils · Courtage &amp; Financement</span>
          <span className="chc-footer__legal">
            <span>Données protégées · RGPD</span>
            <span>Mentions légales · Marcq-en-Barœul</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
