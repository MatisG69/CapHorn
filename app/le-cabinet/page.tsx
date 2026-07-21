import { ArrowRight, Compass, Gem, Eye, BadgeEuro, UserRound } from 'lucide-react'
import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import { LiquidButton } from '@/components/ui/LiquidButton'
import { Counter } from '@/components/landing/Counter'
import { CompassRose } from '@/components/landing/CompassRose'
import { SpecFlipCard, type Spec } from '@/components/landing/SpecFlipCard'

export const metadata = {
  title: 'Le cabinet, courtier à Lille',
  description:
    "Cabinet de courtage indépendant fondé par Guillaume Horn, au service de Lille et des Hauts-de-France. Indépendance, exigence, transparence.",
  alternates: { canonical: '/le-cabinet' },
}

/* Zone desservie, affichée comme repère nautique du cabinet. */
const COORD = 'Lille · Hauts-de-France'

const SPECS: Spec[] = [
  { k: 'Statut', v: 'Indépendant' },
  { k: 'Fondateur', v: 'Guillaume Horn' },
  { k: 'Au service de', v: 'Lille & Hauts-de-France' },
  { k: 'Réseau', v: '100', sup: '+ banques' },
  { k: 'Honoraires', v: 'Au résultat' },
]

const VALUES = [
  {
    n: '01', name: 'Indépendance', feature: true, Icon: Compass,
    desc: 'Aucune exclusivité, aucun accord de volume, aucune banque au capital. Nous recommandons l’établissement qui vous sert, pas celui qui nous paie le mieux. C’est la seule condition d’un conseil qui n’a rien à cacher.',
  },
  {
    n: '02', name: 'Exigence', Icon: Gem,
    desc: 'Taux, marge, assurance, garanties, modulation, indemnités de remboursement : chaque ligne se négocie. Un dossier bien défendu vaut souvent plusieurs milliers d’euros de plus qu’un dossier simplement transmis.',
  },
  {
    n: '03', name: 'Transparence', Icon: Eye,
    desc: 'Le montant de nos honoraires vous est annoncé dès le premier échange, par écrit. Aucune ligne ne s’ajoute entre cet appel et la signature.',
  },
  {
    n: '04', name: 'Honoraires au résultat', Icon: BadgeEuro,
    desc: 'Vous ne payez rien tant que votre financement n’est pas obtenu. Si nous échouons, cela ne vous coûte rien : le risque est de notre côté, pas du vôtre.',
  },
  {
    n: '05', name: 'Interlocuteur unique', Icon: UserRound,
    desc: 'Pas de plateau téléphonique, pas de dossier qui change de mains. Guillaume suit le vôtre personnellement, du premier appel à la signature chez le notaire.',
  },
]

const CREDS = ['Ancien financeur bancaire', 'Courtier IOBSP indépendant', 'Sans exclusivité de réseau', 'Honoraires uniquement au résultat']

const STATS: { value: number; sup: string; label: string; duration?: number }[] = [
  { value: 100, sup: '+', label: 'Banques & assureurs' },
  { value: 500, sup: '+', label: 'Dossiers financés' },
  { value: 24, sup: 'h', label: 'Premier retour' },
  { value: 98, sup: '%', label: 'Clients satisfaits' },
]

export default function CabinetPage() {
  return (
    <div className="chc">
      <ChcNav active="/le-cabinet" />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <header className="chc-cab-hero">
        <CompassRose className="chc-cab-hero__rose" />
        <div className="chc-cab-hero__inner">
          <div className="r">
            <div className="chc-eyebrow">Le cabinet</div>
            <h1 className="chc-cab-hero__title">Lire un projet<br /><em>avant de le financer.</em></h1>
            <p className="chc-cab-hero__lead">
              Cap Horn Conseils est un cabinet de courtage indépendant au service de Lille et des
              Hauts-de-France. Particuliers, expatriés, chefs d’entreprise : plus de 500 dossiers
              financés, et une règle qui ne bouge pas. Nous tenons la barre du premier appel jusqu’à
              la signature, et nous ne facturons rien avant l’accord de la banque.
            </p>
            <div className="chc-coord" style={{ marginTop: 30 }}>{COORD}</div>
          </div>

          {/* Cartouche : la plaque d'identité du cabinet, dans le vocabulaire
              de la carte marine (rose des vents, losange de report). */}
          {/* Cartouche retournable : le logo apparaît au survol. */}
          <aside className="chc-cab-hero__aside r" data-d="1">
            <SpecFlipCard head="Cap Horn Conseils" specs={SPECS} />
          </aside>
        </div>
      </header>

      {/* ── LE FONDATEUR ─────────────────────────────────────── */}
      <section className="chc-section">
        <div className="chc-wrap chc-cab-founder">
          <div className="chc-cab-portrait r">
            <div className="chc-cab-portrait__frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/guillaume-horn.jpg" alt="Guillaume Horn, fondateur de Cap Horn Conseils" />
              <div className="chc-cab-portrait__badge">Disponible pour un premier échange</div>
            </div>
            <div className="chc-coord chc-cab-portrait__cap">Guillaume Horn · Fondateur</div>
          </div>

          <div className="r" data-d="1">
            <div className="chc-eyebrow">Le fondateur</div>
            <blockquote className="chc-cab-quote">
              «&nbsp;Un bon financement commence par une <b>lecture juste</b>&nbsp;du projet, et de la personne qui le porte.&nbsp;»
            </blockquote>
            <div className="chc-cab-founder__name">Guillaume Horn</div>
            <p className="chc-lead" style={{ marginTop: 14 }}>
              Guillaume Horn a passé plusieurs années de l’autre côté du bureau, à instruire et
              financer des dossiers en banque. Il sait donc précisément ce qui fait dire oui, et ce
              qui fait dire non, souvent pour des raisons qui n’ont rien à voir avec la qualité du
              projet. Il a fondé CAP HORN CONSEILS® pour mettre cette lecture au service des
              emprunteurs plutôt que des prêteurs.
            </p>
            <p className="chc-lead" style={{ marginTop: 16 }}>
              Aucune exclusivité, aucun accord de volume avec une banque. La recommandation qu’il
              vous fait est celle qu’il ferait pour lui-même.
            </p>
            <div className="chc-cab-creds">
              {CREDS.map((c) => (
                <span className="chc-cab-cred" key={c}>{c}</span>
              ))}
            </div>
            <div className="chc-cab-sign">Guillaume Horn, fondateur</div>
          </div>
        </div>
      </section>

      {/* ── MANIFESTE ────────────────────────────────────────── */}
      <section className="chc-cab-manifesto">
        <CompassRose className="chc-cab-manifesto__rose" />
        <div className="chc-cab-manifesto__inner r">
          <div className="chc-eyebrow chc-eyebrow--center" style={{ color: 'var(--chc-gold)' }}>Notre conviction</div>
          <p className="chc-cab-manifesto__text">
            Un courtier ne devrait jamais vous <em>vendre</em> une banque.<br />
            Il devrait vous en rendre <em>libre.</em>
          </p>
          <p className="chc-cab-manifesto__sub">
            C’est pourquoi nous refusons toute exclusivité et ne facturons rien tant que le
            financement n’est pas obtenu. Si nous n’obtenons rien, vous ne payez rien. Notre seul
            intérêt, c’est le vôtre : négocié dossier par dossier, banque par banque.
          </p>
        </div>
      </section>

      {/* ── VALEURS, bento ──────────────────────────────────── */}
      <section className="chc-section chc-section--white">
        <div className="chc-wrap">
          <div className="r" style={{ maxWidth: 720 }}>
            <div className="chc-eyebrow">Nos valeurs</div>
            <h2 className="chc-h2">Cinq principes<br /><em>non négociables.</em></h2>
          </div>
          <div className="chc-cab-bento">
            {VALUES.map((v, i) => (
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

      {/* ── REPÈRES ──────────────────────────────────────────── */}
      <section className="chc-section">
        <div className="chc-wrap">
          <div className="r" style={{ maxWidth: 720 }}>
            <div className="chc-eyebrow">Repères</div>
            <h2 className="chc-h2">Ce que valent<br /><em>nos engagements.</em></h2>
          </div>
          <div className="chc-cab-stats r" data-d="1">
            {STATS.map((s) => (
              <div className="chc-cab-stat" key={s.label}>
                <div className="chc-cab-stat__val"><Counter value={s.value} /><sup>{s.sup}</sup></div>
                <div className="chc-cab-stat__label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="chc-coord r" data-d="2" style={{ marginTop: 26, justifyContent: 'center', display: 'flex' }}>{COORD}</div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="chc-section">
        <div className="chc-wrap r">
          <div className="chc-cab-cta">
            <CompassRose className="chc-cab-cta__rose" />
            <div className="chc-cab-cta__inner">
              <div className="chc-eyebrow chc-eyebrow--center" style={{ color: 'var(--chc-gold)' }}>Mettez le cap</div>
              <h2 className="chc-cab-cta__title">Prêt à faire avancer<br /><em>votre projet ?</em></h2>
              <p className="chc-cab-cta__sub">
                Trois minutes pour décrire votre projet, aucun document à fournir. Un expert
                CAP HORN CONSEILS® vous rappelle sous 24 h ouvrées avec un premier avis. Sans
                engagement, et sans le moindre honoraire tant que votre financement n’est pas obtenu.
              </p>
              <LiquidButton href="/tunnel" tone="dark" size="lg">Travailler avec Cap Horn <ArrowRight className="w-4 h-4" /></LiquidButton>
            </div>
          </div>
        </div>
      </section>

      <ChcFooter />
    </div>
  )
}
