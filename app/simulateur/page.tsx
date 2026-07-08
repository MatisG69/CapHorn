import { ArrowRight, Scale, Clock, ShieldCheck, FileCheck } from 'lucide-react'
import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import { CompassRose } from '@/components/landing/CompassRose'
import { LiquidButton } from '@/components/ui/LiquidButton'
import { AssuranceCalculator } from '@/components/simulateur/AssuranceCalculator'
import { getSimulatorSettings } from '@/lib/simulateur/settings'

export const metadata = {
  title: 'Simulateur d\'économies, Assurance emprunteur · Cap Horn Conseils',
  description:
    "Estimez en 30 secondes vos économies sur l'assurance emprunteur. Loi Lemoine, résiliation possible à tout moment, sans frais ni pénalité.",
}

const COORD = 'Marcq-en-Barœul'

const SPECS: { k: string; v: string; sup?: string }[] = [
  { k: 'Cadre légal', v: 'Loi Lemoine' },
  { k: 'Résiliation', v: 'À tout moment' },
  { k: 'Frais', v: 'Zéro' },
  { k: 'Étude', v: 'Sous 24', sup: 'h' },
  { k: 'Économie', v: 'Jusqu’à 50', sup: '%' },
]

const REASONS = [
  {
    n: '01', name: 'La loi Lemoine', feature: true, Icon: Scale,
    desc: 'Depuis septembre 2022, vous pouvez résilier votre assurance emprunteur à tout moment, sans frais ni pénalité. Un droit ouvert à tous les emprunteurs, et rarement exercé, faute d’être accompagné.',
  },
  {
    n: '02', name: 'Étude sous 24 h', Icon: Clock,
    desc: 'Votre dossier est analysé par un expert. Vous recevez une proposition complète et chiffrée sous 24 heures ouvrées.',
  },
  {
    n: '03', name: 'Garanties équivalentes', Icon: ShieldCheck,
    desc: 'Nos contrats respectent à la lettre les garanties exigées par votre banque. Aucune dégradation de couverture, jamais.',
  },
  {
    n: '04', name: 'Démarches prises en charge', Icon: FileCheck,
    desc: 'Nous gérons l’intégralité de la substitution auprès de votre banque : courriers, délais, formalisme. Vous n’avez rien à rédiger.',
  },
]

export default async function SimulateurPage() {
  const settings = await getSimulatorSettings()
  return (
    <div className="chc">
      <ChcNav active="/simulateur" />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <header className="chc-cab-hero">
        <CompassRose className="chc-cab-hero__rose" />
        <div className="chc-cab-hero__inner">
          <div className="r">
            <div className="chc-eyebrow">Module exclusif · Changement d’assurance emprunteur, Loi Lemoine</div>
            <h1 className="chc-cab-hero__title">Combien pourriez-vous<br /><em>économiser ?</em></h1>
            <p className="chc-cab-hero__lead">
              Estimez en 30 secondes les économies réalisables sur votre assurance emprunteur.
              Selon votre profil, vous pourriez réduire significativement le coût total de votre
              assurance, sans modifier les garanties exigées par votre banque.
            </p>
            <div className="chc-coord" style={{ marginTop: 30 }}>{COORD}</div>
          </div>

          <aside className="chc-cab-hero__aside r" data-d="1">
            {SPECS.map((s) => (
              <div className="chc-cab-spec__row" key={s.k}>
                <span className="chc-cab-spec__k">{s.k}</span>
                <span className="chc-cab-spec__v">{s.v}{s.sup && <span>{s.sup}</span>}</span>
              </div>
            ))}
          </aside>
        </div>
      </header>

      {/* ── CALCULATEUR, module sombre ──────────────────────── */}
      <section className="chc-dark">
        <CompassRose className="chc-cab-calc__rose" />
        <div className="chc-dark__inner">
          <div className="chc-cab-calc__head r">
            <div className="chc-eyebrow chc-eyebrow--light">Votre estimation, en direct</div>
            <h2 className="chc-cab-calc__title">Ajustez, comparez,<br /><em>chiffrez.</em></h2>
            <p className="chc-cab-calc__lead">
              Renseignez vos paramètres : l’estimation se recalcule instantanément.
              Un ordre de grandeur fiable, avant l’étude personnalisée qui fixera votre prime réelle.
            </p>
          </div>
          <div className="chc-cab-calc__body r" data-d="1">
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
                Lancez l’étude personnalisée : un expert Cap Horn calcule votre prime réelle
                et pilote toute la renégociation. Sans engagement, sans honoraire avant résultat.
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
