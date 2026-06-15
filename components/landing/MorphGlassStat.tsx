'use client'

import { Counter } from './Counter'

/**
 * Carte « morph glass » premium : verre dépoli + blobs dorés qui se déforment,
 * avec un grand nombre animé (count-up). Utilisée pour le teaser simulateur.
 */
export function MorphGlassStat() {
  return (
    <div className="ch-morph">
      <span className="ch-morph__blob" aria-hidden />
      <span className="ch-morph__blob ch-morph__blob--2" aria-hidden />
      <div className="ch-prodcard ch-glass">
        <div className="ch-prodcard__top">
          <span className="ch-prodcard__label">Exemple · prêt 250 000 €</span>
          <span className="ch-tag">Loi Lemoine</span>
        </div>
        <div className="ch-prodcard__value" style={{ color: 'var(--color-gold-soft)' }}>
          <Counter value={21600} suffix=" €" duration={1800} />
        </div>
        <p className="ch-prodcard__sub">économisés sur la durée totale du prêt</p>
        <div className="ch-prodcard__row">
          <div className="ch-mini">
            <div className="ch-mini__l">Avant</div>
            <div className="ch-mini__v" style={{ color: 'var(--color-cream-dim)' }}>230 € /mois</div>
          </div>
          <div className="ch-mini">
            <div className="ch-mini__l">Après</div>
            <div className="ch-mini__v"><Counter value={88} suffix=" € /mois" duration={1800} /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
