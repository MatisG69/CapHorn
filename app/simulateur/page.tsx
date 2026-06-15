import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import { AssuranceCalculator } from '@/components/simulateur/AssuranceCalculator'

export const metadata = {
  title: 'Simulateur d\'économies — Assurance emprunteur · Cap Horn Conseils',
  description:
    "Estimez en 30 secondes vos économies sur l'assurance emprunteur. Loi Lemoine — résiliation possible à tout moment, sans frais ni pénalité.",
}

const ARGS = [
  { n: '01', name: 'Loi Lemoine', desc: 'Depuis septembre 2022, vous pouvez résilier votre assurance emprunteur à tout moment, sans frais ni pénalité.' },
  { n: '02', name: 'Étude en 24 h', desc: 'Votre dossier est analysé par un expert. Vous recevez votre proposition complète sous 24 heures ouvrées.' },
  { n: '03', name: 'Garanties équivalentes', desc: 'Nos contrats respectent les garanties exigées par votre banque. Aucune dégradation de couverture.' },
]

export default function SimulateurPage() {
  return (
    <div className="chc">
      <ChcNav active="/simulateur" />

      <header className="chc-pagehead">
        <div className="chc-pagehead__inner r">
          <div className="chc-eyebrow">Module exclusif · Loi Lemoine</div>
          <h1 className="chc-pagehead__title">Combien pourriez-vous<br /><em>économiser ?</em></h1>
          <p className="chc-pagehead__lead">Estimez en 30 secondes le potentiel d’économie sur votre assurance emprunteur. Jusqu’à 50 % moins cher que la délégation initiale de votre banque.</p>
        </div>
      </header>

      {/* Calculateur — module sombre */}
      <section className="chc-dark">
        <div className="chc-dark__inner r">
          <AssuranceCalculator />
        </div>
      </section>

      {/* Arguments */}
      <section className="chc-section chc-section--white">
        <div className="chc-wrap">
          <div className="r" style={{ maxWidth: 720 }}>
            <div className="chc-eyebrow">Pourquoi changer ?</div>
            <h2 className="chc-h2">Trois raisons<br /><em>d’agir maintenant.</em></h2>
          </div>
          <div className="chc-values" style={{ marginTop: 52 }}>
            {ARGS.map((a) => (
              <div className="chc-value r" key={a.n}>
                <div className="chc-value__n">{a.n}</div>
                <div className="chc-value__name">{a.name}</div>
                <p className="chc-value__desc">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ChcFooter />
    </div>
  )
}
