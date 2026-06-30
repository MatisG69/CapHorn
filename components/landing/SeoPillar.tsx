import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ChcNav } from './ChcNav'
import { ChcFooter } from './ChcFooter'
import { LiquidButton } from '@/components/ui/LiquidButton'

export interface PillarData {
  slug: string
  navActive?: string
  eyebrow: string
  titleTop: string
  titleEm: string
  lead: string
  intro: string[]
  projets?: { title: string; desc: string }[]
  professions?: string[]
  solutions?: { title: string; desc: string }[]
  parcours?: { n: string; name: string; desc: string }[]
  faq?: { q: string; a: string }[]
  related?: { href: string; label: string }[]
  metaTitle: string
  metaDescription: string
}

export function SeoPillar({ data }: { data: PillarData }) {
  return (
    <div className="chc">
      <ChcNav active={data.navActive} />

      <header className="chc-pagehead">
        <div className="chc-pagehead__inner r">
          <div className="chc-eyebrow">{data.eyebrow}</div>
          <h1 className="chc-pagehead__title">
            {data.titleTop}<br /><em>{data.titleEm}</em>
          </h1>
          <p className="chc-pagehead__lead">{data.lead}</p>
        </div>
      </header>

      {/* Intro */}
      <section className="chc-section">
        <div className="chc-wrap chc-intro">
          <div className="r">
            <div className="chc-eyebrow">En bref</div>
            <h2 className="chc-h2">Un financement <em>sur mesure,</em><br />pour chaque situation.</h2>
          </div>
          <div className="chc-intro__right r" data-d="1">
            {data.intro.map((p, i) => (<p key={i}>{p}</p>))}
            <LiquidButton href="/tunnel" tone="light" size="lg" style={{ marginTop: 8 }}>
              Étudier mon projet <ArrowRight className="w-4 h-4" />
            </LiquidButton>
          </div>
        </div>
      </section>

      {/* Projets finançables */}
      {data.projets && data.projets.length > 0 && (
        <section className="chc-section chc-section--white">
          <div className="chc-wrap">
            <div className="r" style={{ maxWidth: 760 }}>
              <div className="chc-eyebrow">Ce que nous finançons</div>
              <h2 className="chc-h2">Les projets <em>finançables.</em></h2>
            </div>
            <div className="chc-xgrid" style={{ marginTop: 40 }}>
              {data.projets.map((p, i) => (
                <article className="chc-xcell r" key={i}>
                  <div className="chc-xcell__num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="chc-xcell__name">{p.title}</div>
                  <p className="chc-xcell__desc">{p.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Professions accompagnées */}
      {data.professions && data.professions.length > 0 && (
        <section className="chc-section">
          <div className="chc-wrap chc-intro">
            <div className="r">
              <div className="chc-eyebrow">Qui nous accompagnons</div>
              <h2 className="chc-h2">Les profils <em>accompagnés.</em></h2>
              <p className="chc-lead" style={{ marginTop: 22 }}>
                Chaque activité a ses spécificités bancaires. Nous savons les présenter sous le bon angle.
              </p>
            </div>
            <div className="r" data-d="1">
              <ul className="chc-checklist">
                {data.professions.map((it) => (<li key={it}>{it}</li>))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Solutions */}
      {data.solutions && data.solutions.length > 0 && (
        <section className="chc-section chc-section--white">
          <div className="chc-wrap">
            <div className="r" style={{ maxWidth: 760 }}>
              <div className="chc-eyebrow">Solutions de financement</div>
              <h2 className="chc-h2">Comment nous <em>structurons.</em></h2>
            </div>
            <div className="chc-values" style={{ marginTop: 40 }}>
              {data.solutions.map((s, i) => (
                <div className="chc-value r" key={i}>
                  <div className="chc-value__n">{String(i + 1).padStart(2, '0')}</div>
                  <div className="chc-value__name">{s.title}</div>
                  <p className="chc-value__desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Parcours d'accompagnement */}
      {data.parcours && data.parcours.length > 0 && (
        <section className="chc-dark">
          <div className="chc-dark__inner">
            <div className="r">
              <div className="chc-eyebrow">Parcours d’accompagnement</div>
              <h2 className="chc-h2">De l’étude<br /><em>à la signature.</em></h2>
            </div>
            <div className="chc-steps">
              {data.parcours.map((s, i) => (
                <div className="chc-step r" key={s.n} data-d={String((i % 4) + 1)}>
                  <div className="chc-step__n">{s.n}</div>
                  <div className="chc-step__name">{s.name}</div>
                  <p className="chc-step__desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="chc-section">
          <div className="chc-wrap" style={{ maxWidth: 820 }}>
            <div className="r" style={{ textAlign: 'center', marginBottom: 36 }}>
              <div className="chc-eyebrow" style={{ justifyContent: 'center' }}>Questions fréquentes</div>
              <h2 className="chc-h2">Vos questions, <em>nos réponses.</em></h2>
            </div>
            <div className="chc-faq r">
              {data.faq.map((f, i) => (
                <details className="chc-faq__item" key={i}>
                  <summary className="chc-faq__q">{f.q}</summary>
                  <p className="chc-faq__a">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Liens connexes */}
      {data.related && data.related.length > 0 && (
        <section className="chc-section chc-section--white" style={{ paddingTop: 0 }}>
          <div className="chc-wrap r">
            <div className="chc-eyebrow">À explorer aussi</div>
            <div className="chc-related">
              {data.related.map((r) => (
                <Link key={r.href} href={r.href} className="chc-related__link">
                  {r.label} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ChcFooter />
    </div>
  )
}
