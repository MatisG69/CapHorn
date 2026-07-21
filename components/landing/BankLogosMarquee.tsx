/**
 * Carousel des banques partenaires de Cap Horn.
 * Logos réels (public/banques/*), chacun posé dans une carte blanche uniforme
 * pour homogénéiser les formats (tuiles carrées, wordmarks larges, fonds variés).
 * Marquee CSS pur : piste dupliquée pour une boucle sans couture, pause au survol,
 * masque dégradé sur les bords. Défilement désactivé si prefers-reduced-motion.
 */
const BANKS = [
  { src: '/banques/bnp-paribas.jpg', name: 'BNP Paribas' },
  { src: '/banques/societe-generale.png', name: 'Société Générale' },
  { src: '/banques/caisse-epargne.jpg', name: "Caisse d'Épargne" },
  { src: '/banques/banque-populaire.jpg', name: 'Banque Populaire' },
  { src: '/banques/la-banque-postale.jpg', name: 'La Banque Postale' },
  { src: '/banques/ccf.png', name: 'CCF' },
  { src: '/banques/palatine.jpg', name: 'Banque Palatine' },
  { src: '/banques/banque-transatlantique.png', name: 'Banque Transatlantique' },
  { src: '/banques/milleis.png', name: 'Milleis' },
]

export default function BankLogosMarquee() {
  return (
    <section className="bank-logos" aria-label="Banques partenaires de Cap Horn Conseils">
      <p className="bank-logos__eyebrow">
        Nos banques partenaires
      </p>

      <div className="bank-logos__viewport">
        <div className="bank-logos__track">
          {[...BANKS, ...BANKS].map((b, i) => (
            <div className="bank-logos__card" key={`${b.name}-${i}`} aria-hidden={i >= BANKS.length}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.src}
                alt={i < BANKS.length ? b.name : ''}
                className="bank-logos__logo"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
