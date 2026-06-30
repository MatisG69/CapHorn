import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import { LiquidButton } from '@/components/ui/LiquidButton'

export const metadata = {
  title: 'Notre méthode — Étude, montage & négociation · Cap Horn Conseils',
  description:
    "La méthode Cap Horn : qualification en 3 minutes, échange personnalisé sous 24 h, montage du dossier et négociation auprès de plus de 15 banques partenaires. Transparent, sans frais avant résultat.",
}

const STEPS = [
  { n: '01', name: 'Qualifiez votre projet', desc: 'Notre outil en ligne analyse votre situation en 3 minutes — type de projet, montant, profil. Aucun document requis, aucune incidence sur votre dossier bancaire.' },
  { n: '02', name: 'Échange personnalisé', desc: 'Guillaume vous rappelle sous 24 h ouvrées pour affiner le dossier et comprendre vos objectifs patrimoniaux. Un vrai conseil, pas un script commercial.' },
  { n: '03', name: 'Montage & négociation', desc: 'Nous présentons un dossier solide aux banques susceptibles de l’accepter et négocions chaque paramètre : taux, marge, assurance, garantie.' },
  { n: '04', name: 'Signature & suivi', desc: 'Vous validez ; nous orchestrons jusqu’à la signature chez le notaire, en sécurisant les conditions annexes.' },
]

const INCLUDED = [
  'Comparaison de plus de 15 banques et 20 assureurs partenaires',
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
            <p className="chc-lead" style={{ marginTop: 22 }}>Vous n’avez qu’un projet à exprimer. Le reste — comparaison, montage, négociation, paperasse — c’est notre métier.</p>
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
