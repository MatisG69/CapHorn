import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ChcNav } from '@/components/landing/ChcNav'
import { FeatureSteps, type FeatureStep } from '@/components/landing/FeatureSteps'
import { ChcFooter } from '@/components/landing/ChcFooter'
import { LiquidButton } from '@/components/ui/LiquidButton'

export const metadata = {
  title: 'Notre méthode, étude, montage & négociation',
  description:
    "Qualification en 3 minutes, échange sous 24 h, montage du dossier et négociation auprès de près de 100 banques partenaires. Sans frais avant résultat.",
  alternates: { canonical: '/methode' },
}

const STEPS: FeatureStep[] = [
  { step: 'Étape 01', title: 'Qualifiez votre projet', content: 'Trois minutes, quelques questions, aucun document à fournir. Vous repartez avec un premier avis de faisabilité.', image: '/methode/qualification-projet-financement.webp' },
  { step: 'Étape 02', title: 'Échange personnalisé', content: 'Un expert vous rappelle sous 24 h ouvrées. On creuse votre situation réelle, et la stratégie se décide ensemble.', image: '/methode/echange-conseiller-financement.webp' },
  { step: 'Étape 03', title: 'Montage & négociation', content: 'Nous montons le dossier à votre place et le défendons auprès des banques dont les critères collent à votre profil. Taux, assurance, garanties : tout se négocie.', image: '/methode/montage-dossier-negociation-bancaire.webp' },
  { step: 'Étape 04', title: 'Signature & suivi', content: 'Nous suivons chaque échéance jusqu’à la signature et au déblocage des fonds. Nos honoraires ne sont dus qu’à ce moment-là.', image: '/methode/signature-financement-accompagnement.webp' },
]

const INCLUDED = [
  'Près de 100 banques et 20 assureurs mis en concurrence sur votre dossier',
  'Négociation du taux, de la marge bancaire et de l’assurance emprunteur',
  'Conditions annexes travaillées : modulation, transférabilité, indemnités de remboursement anticipé',
  'Dossier constitué, argumenté et présenté aux banques à votre place',
  'Coordination avec votre notaire jusqu’au déblocage des fonds',
  'Zéro honoraire tant que votre financement n’est pas obtenu',
]

export default function MethodePage() {
  return (
    <div className="chc">
      <ChcNav active="/methode" />

      <header className="chc-pagehead">
        <div className="chc-pagehead__inner r">
          <div className="chc-eyebrow">Méthodologie</div>
          <h1 className="chc-pagehead__title">Simple pour vous,<br /><em>exigeant en coulisses.</em></h1>
          <p className="chc-pagehead__lead">Quatre temps, et une répartition claire : vous gardez la décision et la visibilité, nous absorbons la complexité, la paperasse et le rapport de force avec les banques.</p>
        </div>
      </header>

      <section className="chc-dark">
        <img className="chc-dark__bg" src="/methode/ciel-nuit-financement-cap-horn-conseils.webp" alt="" aria-hidden loading="lazy" decoding="async" />
        <div className="chc-dark__inner">
          <FeatureSteps features={STEPS} />
        </div>
      </section>

      <section className="chc-section chc-section--white">
        <div className="chc-wrap chc-intro">
          <div className="r">
            <div className="chc-eyebrow">Ce que nous gérons</div>
            <h2 className="chc-h2">Tout,<br /><em>de bout en bout.</em></h2>
            <p className="chc-lead" style={{ marginTop: 22 }}>Vous n’avez qu’une chose à faire : nous raconter votre projet. Comparaison, montage, négociation, relances, paperasse : c’est notre métier, et vous ne le payez que s’il aboutit.</p>
            <LiquidButton href="/tunnel" tone="dark" size="lg" style={{ marginTop: 28 }}>Démarrer mon étude <ArrowRight className="w-4 h-4" /></LiquidButton>
          </div>
          <div className="r" data-d="1">
            <ul className="chc-checklist">
              {INCLUDED.map((it) => (<li key={it}>{it}</li>))}
            </ul>
          </div>
        </div>
      </section>

      <ChcFooter />
    </div>
  )
}
