import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import { LiquidButton } from '@/components/ui/LiquidButton'

export const metadata = {
  title: 'Notre méthode, Étude, montage & négociation · Cap Horn Conseils',
  description:
    "La méthode Cap Horn : qualification en 3 minutes, échange personnalisé sous 24 h, montage du dossier et négociation auprès de près de 100 banques partenaires. Transparent, sans frais avant résultat.",
}

const STEPS = [
  { n: '01', name: 'Qualifiez votre projet', desc: 'Notre outil préqualifie votre projet en moins de trois minutes. Aucun document n’est nécessaire à cette étape.' },
  { n: '02', name: 'Échange personnalisé', desc: 'Un expert vous rappelle sous 24 h afin d’affiner votre projet et de définir la stratégie de financement la plus adaptée.' },
  { n: '03', name: 'Montage & négociation', desc: 'Nous constituons votre dossier et négocions chaque paramètre auprès des établissements les plus adaptés à votre projet.' },
  { n: '04', name: 'Signature & suivi', desc: 'Nous coordonnons chaque étape jusqu’à la signature et sécurisons les conditions qui protégeront durablement vos intérêts.' },
]

const INCLUDED = [
  'Comparaison de près de 100 banques et 20 assureurs partenaires',
  'Négociation du taux, de la marge et de l’assurance emprunteur',
  'Optimisation des conditions annexes (modulation, transférabilité, IRA)',
  'Constitution et présentation du dossier à votre place',
  'Accompagnement jusqu’à la signature, en lien avec votre notaire',
  'Aucun honoraire avant l’obtention de votre financement',
]

export default function MethodePage() {
  return (
    <div className="chc">
      <ChcNav active="/methode" />

      <header className="chc-pagehead">
        <div className="chc-pagehead__inner r">
          <div className="chc-eyebrow">Méthodologie</div>
          <h1 className="chc-pagehead__title">Simple pour vous,<br /><em>exigeant en coulisses.</em></h1>
          <p className="chc-pagehead__lead">Une démarche claire en quatre temps. Vous gardez la main et la visibilité ; nous prenons en charge la complexité, la constitution du dossier et la négociation.</p>
        </div>
      </header>

      <section className="chc-dark">
        <img className="chc-dark__bg" src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=70&auto=format&fit=crop" alt="" />
        <div className="chc-dark__inner">
          <div className="chc-steps">
            {STEPS.map((s, i) => (
              <div className="chc-step r" key={s.n} data-d={String((i % 4) + 1)}>
                <div className="chc-step__n">{s.n}</div>
                <div className="chc-step__name">{s.name}</div>
                <p className="chc-step__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="chc-section chc-section--white">
        <div className="chc-wrap chc-intro">
          <div className="r">
            <div className="chc-eyebrow">Ce que nous gérons</div>
            <h2 className="chc-h2">Tout,<br /><em>de bout en bout.</em></h2>
            <p className="chc-lead" style={{ marginTop: 22 }}>Vous n’avez qu’un projet à exprimer. Le reste, comparaison, montage, négociation, paperasse, c’est notre métier.</p>
            <LiquidButton href="/tunnel" tone="light" size="lg" style={{ marginTop: 28 }}>Démarrer mon étude <ArrowRight className="w-4 h-4" /></LiquidButton>
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
