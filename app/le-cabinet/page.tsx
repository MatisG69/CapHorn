import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import { Counter } from '@/components/landing/Counter'

export const metadata = {
  title: 'Le cabinet — Courtier indépendant à Marcq-en-Barœul · Cap Horn Conseils',
  description:
    "Cap Horn Conseils, cabinet de courtage indépendant fondé par Guillaume Horn à Marcq-en-Barœul. Indépendance, exigence et transparence au service de votre financement.",
}

const VALUES = [
  { n: '01', name: 'Indépendance', desc: 'Nous ne sommes liés à aucune banque. La solution recommandée est la meilleure pour vous — jamais la plus rémunératrice pour nous.' },
  { n: '02', name: 'Exigence', desc: 'Chaque dossier est travaillé comme un dossier premium : analyse fine, présentation soignée, négociation sur chaque paramètre.' },
  { n: '03', name: 'Transparence', desc: 'Pas d’honoraire avant résultat, des conditions claires, et un interlocuteur unique du premier appel à la signature.' },
]

export default function CabinetPage() {
  return (
    <div className="chc">
      <ChcNav active="/le-cabinet" />

      <header className="chc-pagehead">
        <div className="chc-pagehead__inner r">
          <div className="chc-eyebrow">Le cabinet</div>
          <h1 className="chc-pagehead__title">Lire un projet<br /><em>avant de le financer.</em></h1>
          <p className="chc-pagehead__lead">Cap Horn Conseils est un cabinet de courtage indépendant établi à Marcq-en-Barœul. Nous accompagnons particuliers, expatriés et chefs d’entreprise dans la construction de financements sur mesure.</p>
        </div>
      </header>

      {/* Fondateur */}
      <section className="chc-section">
        <div className="chc-wrap chc-about">
          <div className="chc-about__photo r">
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--chc-serif)', fontSize: 'clamp(80px,12vw,150px)', fontWeight: 300, color: 'rgba(184,146,42,0.35)' }}>GH</div>
            <div className="chc-about__badge">Disponible pour un premier échange</div>
          </div>
          <div className="r" data-d="1">
            <div className="chc-eyebrow">Le fondateur</div>
            <div className="chc-about__name">Guillaume Horn</div>
            <p className="chc-lead">Après plusieurs années au cœur du financement bancaire, Guillaume a fondé Cap Horn pour remettre le conseil au centre du courtage. Sa conviction : un bon financement commence par une lecture juste du projet et de la personne qui le porte.</p>
            <p className="chc-lead" style={{ marginTop: 18 }}>Cette approche, indépendante et exigeante, permet d’obtenir régulièrement des conditions supérieures aux grilles — y compris sur les dossiers jugés atypiques ailleurs.</p>
            <div className="chc-about__sign">— Guillaume Horn, fondateur</div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="chc-section chc-section--white">
        <div className="chc-wrap">
          <div className="r" style={{ maxWidth: 720 }}>
            <div className="chc-eyebrow">Nos valeurs</div>
            <h2 className="chc-h2">Trois principes<br /><em>non négociables.</em></h2>
          </div>
          <div className="chc-values" style={{ marginTop: 52 }}>
            {VALUES.map((v) => (
              <div className="chc-value r" key={v.n}>
                <div className="chc-value__n">{v.n}</div>
                <div className="chc-value__name">{v.name}</div>
                <p className="chc-value__desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chiffres */}
      <section className="chc-section">
        <div className="chc-wrap r">
          <div className="chc-proof">
            <div className="chc-proof__item">
              <div className="chc-proof__val"><Counter value={15} /><sup>+</sup></div>
              <div className="chc-proof__label">Banques &amp; assureurs</div>
            </div>
            <div className="chc-proof__item">
              <div className="chc-proof__val"><Counter value={500} /><sup>+</sup></div>
              <div className="chc-proof__label">Dossiers financés</div>
            </div>
            <div className="chc-proof__item">
              <div className="chc-proof__val"><Counter value={24} /><sup>h</sup></div>
              <div className="chc-proof__label">Premier retour</div>
            </div>
            <div className="chc-proof__item">
              <div className="chc-proof__val"><Counter value={98} /><sup>%</sup></div>
              <div className="chc-proof__label">Clients satisfaits</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }} className="r">
            <Link href="/tunnel" className="chc-btn chc-btn-gold">Travailler avec Cap Horn <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      <ChcFooter />
    </div>
  )
}
