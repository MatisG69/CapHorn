'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Phone } from 'lucide-react'
import { LEGAL_ENTITY } from '@/lib/seo/config'

/**
 * Section de clôture de la page d'accueil.
 *
 * Remplace `SectionWithMockup`, qui codait en dur l'or (#C9A45C), le
 * quasi-noir (#0A0A0A), le serif Cormorant et une emphase en italique — soit
 * exactement les partis pris retirés de la charte. Tout passe désormais par
 * les jetons, donc la section suivra les évolutions du design system.
 *
 * Composition : la page s'ouvre sur trois chiffres marqués par les barres du
 * logo, elle se referme sur trois réassurances marquées de la même façon.
 * Ces trois points sont les objections réelles d'un emprunteur ; ils méritent
 * d'être structurels plutôt que dilués dans un paragraphe.
 */
const REASSURANCES = [
  { k: '3 minutes', v: 'pour décrire votre projet, sans aucun document.' },
  { k: 'Réponse sous 24 h', v: 'un expert vous rappelle, jours ouvrés.' },
  { k: 'Honoraires au résultat', v: 'rien à payer tant que le financement n’est pas obtenu.' },
]

export default function FinalCta() {
  return (
    <section className="chc-final">
      <div className="chc-final__inner">
        <div className="chc-final__text r">
          <p className="chc-eyebrow">À votre disposition</p>
          <h2 className="chc-final__title">
            Votre projet mérite mieux<br />
            <em>qu’un taux de guichet.</em>
          </h2>

          <ul className="chc-final__list">
            {REASSURANCES.map((r) => (
              <li key={r.k}>
                <span className="chc-final__bar" aria-hidden />
                <span>
                  <b>{r.k}</b> {r.v}
                </span>
              </li>
            ))}
          </ul>

          <div className="chc-final__actions">
            <Link href="/tunnel" className="chc-btn chc-btn-gold">
              Démarrer mon étude gratuite <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            {/* Dernier bloc avant le pied de page : c'est ici qu'un appel
                direct a le plus de valeur. */}
            <a href={`tel:${LEGAL_ENTITY.phone}`} className="chc-final__call">
              <Phone className="w-4 h-4" aria-hidden />
              {LEGAL_ENTITY.phoneDisplay}
            </a>
          </div>

          <p className="chc-final__meta">Lille &amp; Hauts-de-France · financezmonprojet.fr</p>
        </div>

        <div className="chc-final__media r" data-d="1">
          <Image
            src="/methode/echange-conseiller-financement.webp"
            alt="Un conseiller Cap Horn Conseils étudie un dossier de financement"
            width={900}
            height={1100}
            sizes="(max-width: 900px) 100vw, 460px"
            className="chc-final__img"
          />
          <span className="chc-final__veil" aria-hidden />
        </div>
      </div>
    </section>
  )
}
