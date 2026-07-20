import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import CreditSimulator from '@/components/simulateur/CreditSimulator'

export const metadata = {
  title: 'Simulateur de crédit immobilier 2026, mensualité & taux',
  description:
    "Estimez votre mensualité et le coût de votre crédit immobilier selon les taux 2026. Montant, apport, durée : simulation gratuite et non contractuelle.",
  alternates: { canonical: '/simulateur-credit-immobilier' },
}

export default function SimulateurCreditPage() {
  return (
    <div className="chc">
      <ChcNav active="/simulateur-credit-immobilier" />

      <header className="chc-pagehead">
        <div className="chc-pagehead__inner r">
          <div className="chc-eyebrow">Simulateur · crédit immobilier</div>
          <h1 className="chc-pagehead__title">Votre mensualité,<br /><em>en quelques secondes.</em></h1>
          <p className="chc-pagehead__lead">
            Estimez votre mensualité et le coût total de votre crédit selon les taux 2026. Cap Horn négocie
            ensuite, sur les profils premium, des conditions souvent inférieures aux grilles affichées.
          </p>
        </div>
      </header>

      <section className="chc-section">
        <div className="chc-wrap r">
          <CreditSimulator />
        </div>
      </section>

      <ChcFooter />
    </div>
  )
}
