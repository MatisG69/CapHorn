import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import { SERVICES } from '@/components/landing/landingData'

export const metadata = {
  title: 'Nos expertises — Courtage immobilier, pro & assurance · Cap Horn Conseils',
  description:
    "Immobilier, financement professionnel, assurance emprunteur, regroupement de crédits, non-résidents, dossiers complexes. Les expertises de Cap Horn Conseils, cabinet de courtage indépendant à Marcq-en-Barœul.",
}

export default function ExpertisesPage() {
  return (
    <div className="chc">
      <ChcNav active="/expertises" />

      <header className="chc-pagehead">
        <div className="chc-pagehead__inner r">
          <div className="chc-eyebrow">Nos expertises</div>
          <h1 className="chc-pagehead__title">Tous vos financements,<br /><em>un seul interlocuteur.</em></h1>
          <p className="chc-pagehead__lead">Cap Horn intervient sur l’ensemble du spectre du financement des particuliers et des entreprises. Pour chaque dossier, la même méthode : analyser en profondeur, structurer, puis négocier auprès du bon réseau bancaire.</p>
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
            <Link href="/tunnel" className="chc-btn chc-btn-gold">Qualifier mon projet en 3 minutes <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      <ChcFooter />
    </div>
  )
}
