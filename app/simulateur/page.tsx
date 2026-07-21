import { ArrowRight, Scale, Clock, ShieldCheck, FileCheck } from 'lucide-react'
import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import { CompassRose } from '@/components/landing/CompassRose'
import { SpecFlipCard, type Spec } from '@/components/landing/SpecFlipCard'
import { LiquidButton } from '@/components/ui/LiquidButton'
import { AssuranceCalculator } from '@/components/simulateur/AssuranceCalculator'
import { getSimulatorSettings } from '@/lib/simulateur/settings'

export const metadata = {
  title: 'Simulateur d\'économies, assurance emprunteur',
  description:
    "Estimez en 30 secondes vos économies sur l'assurance emprunteur. Loi Lemoine : résiliation possible à tout moment, sans frais ni pénalité. Simulation gratuite.",
  alternates: { canonical: '/simulateur' },
}

const COORD = 'Lille · Hauts-de-France'

const SPECS: Spec[] = [
  { k: 'Cadre légal', v: 'Loi Lemoine' },
  { k: 'Résiliation', v: 'À tout moment' },
  { k: 'Frais', v: 'Zéro' },
  { k: 'Étude', v: 'Sous 24', sup: 'h' },
  { k: 'Économie', v: 'Jusqu’à 50', sup: '%' },
]

const REASONS = [
  {
    n: '01', name: 'La loi Lemoine', feature: true, Icon: Scale,
    desc: 'Depuis septembre 2022, vous pouvez résilier votre assurance emprunteur à tout moment, sans frais ni pénalité, et votre banque ne peut pas s’y opposer si les garanties sont équivalentes. Un droit ouvert à tous, encore rarement exercé faute d’être accompagné. Chaque mois d’attente est de l’argent perdu.',
  },
  {
    n: '02', name: 'Étude sous 24 h', Icon: Clock,
    desc: 'Un expert reprend votre contrat ligne à ligne. Sous 24 heures ouvrées, vous recevez une proposition chiffrée : prime actuelle, prime nouvelle, économie totale sur la durée restante.',
  },
  {
    n: '03', name: 'Garanties équivalentes', Icon: ShieldCheck,
    desc: 'Nos contrats respectent à la lettre les garanties exigées par votre banque. Vous payez moins, vous n’êtes pas moins protégé. Aucune dégradation de couverture, jamais.',
  },
  {
    n: '04', name: 'Démarches prises en charge', Icon: FileCheck,
    desc: 'Courriers, délais légaux, formalisme, relances de votre banque : nous portons toute la substitution. Vous n’avez pas une seule lettre à rédiger.',
  },
]

export default async function SimulateurPage() {
  const settings = await getSimulatorSettings()
  return (
    <div className="chc">
      <ChcNav active="/simulateur" />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <header className="chc-cab-hero">
        <div className="chc-cab-hero__inner">
          <div className="r">
            <div className="chc-eyebrow">Module exclusif · Changement d’assurance emprunteur, Loi Lemoine</div>
            <h1 className="chc-cab-hero__title">Combien pourriez-vous<br /><em>économiser ?</em></h1>
            <p className="chc-cab-hero__lead">
              Trente secondes suffisent pour voir ce que votre assurance emprunteur vous coûte de
              trop. À garanties strictement identiques à celles exigées par votre banque, et sans un
              euro de frais de résiliation : la loi Lemoine vous en donne le droit.
            </p>
            <div className="chc-coord" style={{ marginTop: 30 }}>{COORD}</div>
          </div>

          {/* Cartouche retournable : le logo apparaît au survol. */}
          <aside className="chc-cab-hero__aside r" data-d="1">
            <SpecFlipCard head="Cap Horn Conseils" specs={SPECS} />
          </aside>
        </div>
      </header>

      {/* ── CALCULATEUR, module sombre ──────────────────────── */}
      <section className="chc-calcsec">
        <div className="chc-calcsec__inner">
          <header className="chc-calcsec__head r">
            <p className="chc-eyebrow">Votre estimation, en direct</p>
            <h2 className="chc-calcsec__title">Ajustez, comparez,<br /><em>chiffrez.</em></h2>
            <p className="chc-calcsec__lead">
              Renseignez vos paramètres : le montant se recalcule à chaque geste. Un ordre de
              grandeur fiable, avant l’étude personnalisée qui fixera votre prime réelle au centime.
            </p>
          </header>
          {/* `chc-calc` remappe localement les variables de l'ancienne charte
              or utilisées par le calculateur. L'admin partage ces classes :
              les redéfinir globalement l'aurait cassé. */}
          <div className="chc-calc r" data-d="1">
            <AssuranceCalculator settings={settings} />
          </div>
        </div>
      </section>

      {/* ── POURQUOI CHANGER, bento ─────────────────────────── */}
      <section className="chc-section chc-section--white">
        <div className="chc-wrap">
          <div className="r" style={{ maxWidth: 720 }}>
            <div className="chc-eyebrow">Pourquoi changer</div>
            <h2 className="chc-h2">Quatre raisons<br /><em>d’agir maintenant.</em></h2>
          </div>
          <div className="chc-cab-bento">
            {REASONS.map((v, i) => (
              <div className={`chc-cab-tile r${v.feature ? ' chc-cab-tile--feature' : ''}`} data-d={(i % 4).toString()} key={v.n}>
                <div className="chc-cab-tile__head">
                  <div className="chc-cab-tile__icon"><v.Icon className="w-5 h-5" strokeWidth={1.5} /></div>
                  <div className="chc-cab-tile__n">{v.n}</div>
                </div>
                <div className="chc-cab-tile__name">{v.name}</div>
                <p className="chc-cab-tile__desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONVICTION ───────────────────────────────────────── */}
      <section className="chc-cab-manifesto">
        <CompassRose className="chc-cab-manifesto__rose" />
        <div className="chc-cab-manifesto__inner r">
          <div className="chc-eyebrow chc-eyebrow--center" style={{ color: 'var(--chc-gold)' }}>Notre conviction</div>
          <p className="chc-cab-manifesto__text">
            Changer d’assurance est un <em>droit.</em><br />
            L’exercer, une <em>économie.</em>
          </p>
          <p className="chc-cab-manifesto__sub">
            Sur un prêt de 250 000 € sur 20 ans, la délégation représente en moyenne
            15 000 à 30 000 € d’économie cumulée. Nous la sécurisons pour vous, sans frais avant résultat.
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="chc-section">
        <div className="chc-wrap r">
          <div className="chc-cab-cta">
            <CompassRose className="chc-cab-cta__rose" />
            <div className="chc-cab-cta__inner">
              <div className="chc-eyebrow chc-eyebrow--center" style={{ color: 'var(--chc-gold)' }}>Passez à l’étude</div>
              <h2 className="chc-cab-cta__title">De l’estimation<br /><em>à l’économie réelle.</em></h2>
              <p className="chc-cab-cta__sub">
                Une estimation ne fait économiser personne. Lancez l’étude : un expert Cap Horn
                calcule votre prime réelle et pilote toute la substitution auprès de votre banque.
                Sans engagement, et sans honoraire tant que l’économie n’est pas actée.
              </p>
              <LiquidButton href="/tunnel?path=particulier&need=assurance_emprunteur" tone="dark" size="lg">
                Demander mon étude détaillée <ArrowRight className="w-4 h-4" />
              </LiquidButton>
            </div>
          </div>
        </div>
      </section>

      <ChcFooter />
    </div>
  )
}
