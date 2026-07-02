import { ArrowRight, Compass, Gem, Eye, BadgeEuro, UserRound } from 'lucide-react'
import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import { LiquidButton } from '@/components/ui/LiquidButton'
import { Counter } from '@/components/landing/Counter'
import { CompassRose } from '@/components/landing/CompassRose'

export const metadata = {
  title: 'Le cabinet — Courtier indépendant à Marcq-en-Barœul · Cap Horn Conseils',
  description:
    "Cap Horn Conseils, cabinet de courtage indépendant fondé par Guillaume Horn à Marcq-en-Barœul. Indépendance, exigence et transparence au service de votre financement.",
}

/* Coordonnées de Marcq-en-Barœul — motif de repère nautique du cabinet. */
const COORD = '50.6795° N · 3.0972° E — Marcq-en-Barœul'

const SPECS: { k: string; v: string; sup?: string }[] = [
  { k: 'Statut', v: 'Indépendant' },
  { k: 'Fondateur', v: 'Guillaume Horn' },
  { k: 'Établi à', v: 'Marcq-en-Barœul' },
  { k: 'Réseau', v: '100', sup: '+ banques' },
  { k: 'Honoraires', v: 'Au résultat' },
]

const VALUES = [
  {
    n: '01', name: 'Indépendance', feature: true, Icon: Compass,
    desc: 'Nous ne sommes liés à aucune banque. La solution que nous recommandons est la meilleure pour vous — jamais la plus rémunératrice pour nous. C’est la condition d’un conseil qui n’a rien à cacher.',
  },
  {
    n: '02', name: 'Exigence', Icon: Gem,
    desc: 'Chaque dossier est travaillé comme un dossier premium : analyse fine, présentation soignée, négociation sur chaque paramètre.',
  },
  {
    n: '03', name: 'Transparence', Icon: Eye,
    desc: 'Des conditions claires, un chiffrage annoncé d’avance, aucune zone d’ombre entre le premier appel et la signature.',
  },
  {
    n: '04', name: 'Honoraires au résultat', Icon: BadgeEuro,
    desc: 'Aucun honoraire tant que le financement n’est pas obtenu. Notre rémunération est alignée sur votre réussite, pas sur le montant emprunté.',
  },
  {
    n: '05', name: 'Interlocuteur unique', Icon: UserRound,
    desc: 'Un seul contact, du premier échange à la signature chez le notaire. Guillaume suit personnellement chaque dossier.',
  },
]

const CREDS = ['Ancien financeur bancaire', 'Courtier IOBSP indépendant', 'Sans exclusivité de réseau']

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
              Cap Horn Conseils est un cabinet de courtage indépendant établi à Marcq-en-Barœul.
              Nous accompagnons particuliers, expatriés et chefs d’entreprise dans la construction
              de financements sur mesure — en tenant la barre, du premier échange à la signature.
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
              «&nbsp;Un bon financement commence par une <b>lecture juste</b>&nbsp;du projet — et de la personne qui le porte.&nbsp;»
            </blockquote>
            <div className="chc-cab-founder__name">Guillaume Horn</div>
            <p className="chc-lead" style={{ marginTop: 14 }}>
              Après plusieurs années au cœur du financement bancaire, Guillaume a fondé Cap Horn pour
              remettre le conseil au centre du courtage. De l’autre côté du guichet, il a vu trop de bons
              projets se heurter à des grilles rigides — et trop de dossiers atypiques abandonnés faute d’être défendus.
            </p>
            <p className="chc-lead" style={{ marginTop: 16 }}>
              Son approche, indépendante et exigeante, permet d’obtenir régulièrement des conditions supérieures
              aux grilles — y compris sur les dossiers jugés inclassables ailleurs.
            </p>
            <div className="chc-cab-creds">
              {CREDS.map((c) => (
                <span className="chc-cab-cred" key={c}>{c}</span>
              ))}
            </div>
            <div className="chc-cab-sign">— Guillaume Horn, fondateur</div>
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
            C’est pourquoi nous refusons toute exclusivité et ne facturons rien tant que le financement
            n’est pas obtenu. Notre seul intérêt, c’est le vôtre — négocié dossier par dossier, banque par banque.
          </p>
        </div>
      </section>

      {/* ── VALEURS — bento ──────────────────────────────────── */}
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
                Qualifiez votre projet en trois minutes. Guillaume vous rappelle sous 24 h — sans engagement,
                et sans le moindre honoraire avant résultat.
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
