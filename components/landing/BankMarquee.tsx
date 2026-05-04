const BANKS = [
  'BNP Paribas',
  'Crédit Agricole',
  'Société Générale',
  'BPCE',
  'Crédit Mutuel',
  'CIC',
  'La Banque Postale',
  'HSBC',
  'Caisse d’Épargne',
  'Banque Populaire',
  'LCL',
  'AXA Banque',
]

/**
 * Carousel premium des banques partenaires.
 * Pure CSS marquee (translate3d + keyframe), liste dupliquée pour boucle
 * sans soudure visible, masque dégradé sur les bords, pause au survol.
 */
export function BankMarquee() {
  return (
    <section className="bank-marquee-section">
      <div className="bank-marquee-section__eyebrow">
        <p className="eyebrow eyebrow--single">Réseau bancaire partenaire</p>
      </div>

      <div className="bank-marquee" aria-label="Banques partenaires de Cap Horn Conseils">
        <div className="bank-marquee__track">
          {[...BANKS, ...BANKS].map((bank, i) => (
            <span
              key={`${bank}-${i}`}
              className="bank-marquee__item"
              aria-hidden={i >= BANKS.length}
            >
              <span className="bank-marquee__name">{bank}</span>
              <span className="bank-marquee__sep" aria-hidden>
                ◆
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
