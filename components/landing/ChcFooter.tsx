import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import LegalLinks from './LegalLinks'
import { LEGAL_ENTITY } from '@/lib/seo/config'

/**
 * Pied de page Cap Horn, « carte marine ».
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt="" aria-hidden className="chc-footer__logomark" />
            <Link href="/" className="chc-footer__wordmark">
              Cap Horn
              <span>Conseils, Courtage &amp; Financement</span>
            </Link>
            <p className="chc-footer__desc">
              Cabinet de courtage indépendant en financement et assurance, au service de Lille et des
              Hauts-de-France. Près de cent banques mises en concurrence, et aucun honoraire tant que
              votre financement n’est pas obtenu.
            </p>
          </div>

          {/* h3 et non h4 : les titres de colonnes suivent le h2 de la page,
              un h4 sauterait un niveau de hiérarchie. */}
          <nav className="chc-footer__col" aria-label="Expertises">
            <h3>Expertises</h3>
            <Link href="/financement-professions-liberales">Professions libérales</Link>
            {/* Sous-pages métier : sans lien depuis le pied de page elles
                restaient orphelines alors qu'elles visent les requêtes les
                plus qualifiées. */}
            <Link href="/financement-professions-sante">Professions de santé</Link>
            <Link href="/financement-professions-juridiques">Avocats &amp; notaires</Link>
            <Link href="/financement-professions-chiffre">Experts-comptables</Link>
            <Link href="/financement-franchise">Franchise</Link>
            <Link href="/reprise-transmission">Reprise &amp; transmission</Link>
            {/* Page locale : capte les requêtes « courtier crédit Lille ». */}
            <Link href="/courtier-credit-immobilier-lille">Courtier immobilier à Lille</Link>
            <Link href="/expertises">Toutes les expertises</Link>
          </nav>

          <nav className="chc-footer__col" aria-label="Cabinet">
            <h3>Cabinet</h3>
            <Link href="/methode">Méthode</Link>
            <Link href="/simulateur-credit-immobilier">Simulateur crédit immo</Link>
            <Link href="/simulateur">Simulateur assurance</Link>
            <Link href="/blog">Blog &amp; conseils</Link>
            <Link href="/le-cabinet">À propos</Link>
            <Link href="/tunnel">Démarrer une étude</Link>
          </nav>

          <div className="chc-footer__col chc-footer__col--contact">
            <h3>Contact</h3>
            <span>Lille · Hauts-de-France</span>
            {/* Téléphone et e-mail cliquables : signal NAP pour le référencement
                local et point de conversion direct. */}
            <a href={`tel:${LEGAL_ENTITY.phone}`}>{LEGAL_ENTITY.phoneDisplay}</a>
            <a href={`mailto:${LEGAL_ENTITY.email}`}>{LEGAL_ENTITY.email}</a>
          </div>
        </div>

        <div className="chc-footer__bottom">
          <span>
            {`© ${new Date().getFullYear()} Cap Horn Conseils · Courtage & Financement`}
            <span className="chc-footer__credit">
              {' · Site réalisé par '}
              <a href="https://mapa-developpement.fr" target="_blank" rel="noopener noreferrer">
                Mapa Développement
              </a>
            </span>
          </span>
          <LegalLinks />
        </div>
      </div>
    </footer>
  )
}
