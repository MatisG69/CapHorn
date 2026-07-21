import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import { LiquidButton } from '@/components/ui/LiquidButton'
import { SERVICES } from '@/components/landing/landingData'

export const metadata = {
  title: 'Nos expertises, courtage immobilier, pro & assurance',
  description:
    "Immobilier, financement professionnel, assurance emprunteur, regroupement de crédits et dossiers complexes. Cabinet de courtage à Lille et Hauts-de-France.",
  alternates: { canonical: '/expertises' },
}

export default function ExpertisesPage() {
  return (
    <div className="chc">
      <ChcNav active="/expertises" />

      <header className="chc-pagehead">
        <div className="chc-pagehead__inner r">
          <div className="chc-eyebrow">Nos expertises</div>
          <h1 className="chc-pagehead__title">Tous vos financements,<br /><em>un seul interlocuteur.</em></h1>
          <p className="chc-pagehead__lead">Immobilier, entreprise, assurance, situations bloquées : Cap Horn couvre tout le spectre du financement des particuliers et des entreprises. Et applique partout la même méthode : comprendre le projet, construire le dossier, puis mettre les banques en concurrence.</p>
        </div>
      </header>

      <section className="chc-section">
        <div className="chc-wrap">
          <div className="chc-xgrid">
            {SERVICES.map((s) => (
              <article className="chc-xcell r" key={s.number}>
                <div className="chc-xcell__num">Expertise {s.number}</div>
                <div className="chc-xcell__name">{s.title}</div>
                <p className="chc-xcell__desc">{s.details}</p>
              </article>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 52 }} className="r">
            <LiquidButton href="/tunnel" tone="dark" size="lg">Qualifier mon projet en 3 minutes <ArrowRight className="w-4 h-4" /></LiquidButton>
          </div>
        </div>
      </section>

      <ChcFooter />
    </div>
  )
}
