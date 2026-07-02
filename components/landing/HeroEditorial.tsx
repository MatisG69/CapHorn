import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { TempleIllustration } from './TempleIllustration'

/**
 * Hero éditorial Cap Horn — mise en page « dossier d'architecte ».
 *
 * Composition fidèle au mockup blueprint :
 *   · Cadre L-corners aux 4 coins de la page (signature dossier classé)
 *   · En-tête : marque gauche + dossier/adresse droite (style référence
 *     d'archive notariale)
 *   · 2 colonnes : titre éditorial + lead + CTA à gauche, élévation
 *     SVG du temple à droite (cabinet incarné comme édifice)
 *   · Bandeau de pied : 4 chiffres-clés alignés en stat-tiles
 *   · Mentions de pied : EST. MMXIX gauche, ARCHITECTURE droite
 *
 * 100 % statique, aucune animation au chargement, pure mise en scène
 * éditoriale. Lecture verticale pour mobile (illustration sous le texte
 * ou cachée selon breakpoint).
 */
export function HeroEditorial() {
  return (
    <section className="hero-blueprint">
      {/* Cadre L-corners — signature de dossier classé */}
      <CornerFrame />

      <div className="hero-blueprint__inner">
        {/* En-tête dossier : marque + numéro/adresse */}
        <header className="hero-blueprint__header">
          <div className="hero-blueprint__brand">
            <h2 className="hero-blueprint__brand-name">
              <span className="hero-blueprint__brand-cap">CAP HORN</span>
              <span className="hero-blueprint__brand-sep" aria-hidden />
              <span className="hero-blueprint__brand-suffix">CONSEILS</span>
            </h2>
            <p className="hero-blueprint__brand-sub">Cabinet de courtage indépendant</p>
          </div>

          <div className="hero-blueprint__dossier" aria-hidden>
            <p>Dossier&nbsp;N°&nbsp;XI · MMXXVI</p>
            <p>11 rue de la Finance</p>
            <p>Marcq-en-Barœul · Hauts-de-France</p>
          </div>
        </header>

        {/* Filet horizontal de dossier */}
        <div className="hero-blueprint__rule" aria-hidden />

        {/* Corps : 2 colonnes texte / illustration */}
        <div className="hero-blueprint__body">
          <div className="hero-blueprint__copy">
            <h1 className="hero-blueprint__title">
              <span className="hero-blueprint__line">Un projet</span>
              <span className="hero-blueprint__line">se signe</span>
              <span className="hero-blueprint__line hero-blueprint__line--accent">
                <em>un jour.</em>
              </span>
            </h1>

            <p className="hero-blueprint__lead">
              Il se vit pendant des années. Architecture financière sur mesure pour entrepreneurs,
              particuliers exigeants et apporteurs d&apos;affaires.
            </p>

            <div className="hero-blueprint__cta">
              <Link href="/tunnel" className="btn-blueprint">
                <span className="btn-blueprint__label">Démarrer mon étude</span>
                <ArrowRight className="btn-blueprint__icon" aria-hidden />
              </Link>
              <p className="hero-blueprint__meta">
                Sans engagement · Réponse sous 24h · RGPD
              </p>
            </div>
          </div>

          <div className="hero-blueprint__illustration" aria-hidden>
            <TempleIllustration className="hero-blueprint__svg" />
          </div>
        </div>

        {/* Filet horizontal avant les stats */}
        <div className="hero-blueprint__rule hero-blueprint__rule--bottom" aria-hidden />

        {/* Bandeau stats — 4 chiffres clés */}
        <dl className="hero-blueprint__stats">
          {[
            { label: 'Projets accompagnés', value: '300+' },
            { label: 'Banques partenaires', value: '100+' },
            { label: 'Délai de réponse', value: '24h' },
            { label: 'Indépendant', value: '100%' },
          ].map((s) => (
            <div key={s.label} className="hero-blueprint__stat">
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>

        {/* Pied de cadre : EST. + tagline */}
        <footer className="hero-blueprint__footer">
          <p>EST. MMXIX · CAP HORN CONSEILS</p>
          <p className="hero-blueprint__footer-right">
            Architecture financière · Courtage · Conseil
          </p>
        </footer>
      </div>
    </section>
  )
}

/**
 * Cadre L décoratif aux 4 coins. Signature visuelle du « dossier classé ».
 * Pur SVG, taille fixe (32 px), couleur or champagne, opacité 0.55.
 */
function CornerFrame() {
  const Bracket = ({ rotate }: { rotate: number }) => (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    >
      <path
        d="M 1 16 L 1 1 L 16 1"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="1.4"
        opacity="0.55"
      />
    </svg>
  )

  return (
    <div className="hero-blueprint__corners" aria-hidden>
      <span className="hero-blueprint__corner hero-blueprint__corner--tl">
        <Bracket rotate={0} />
      </span>
      <span className="hero-blueprint__corner hero-blueprint__corner--tr">
        <Bracket rotate={90} />
      </span>
      <span className="hero-blueprint__corner hero-blueprint__corner--bl">
        <Bracket rotate={270} />
      </span>
      <span className="hero-blueprint__corner hero-blueprint__corner--br">
        <Bracket rotate={180} />
      </span>
    </div>
  )
}
