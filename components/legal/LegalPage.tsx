import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
import type { LegalDoc } from '@/lib/legal'
import { LEGAL_SLUGS } from '@/lib/legal'

/**
 * Rendu d'un document légal sur une URL propre et indexable.
 * Réutilise les classes du bloc légal existant (`.chc-legal-block`).
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <div className="chc">
      <JsonLd
        schema={breadcrumbSchema([
          { name: 'Accueil', path: '/' },
          { name: doc.title, path: LEGAL_SLUGS[doc.id] },
        ])}
      />
      <ChcNav />

      <header className="chc-pagehead">
        <div className="chc-pagehead__inner r">
          <div className="chc-eyebrow">Informations légales</div>
          {/* Titre de la modale (h2) promu en h1 : c'est ici la page entière. */}
          <h1 className="chc-pagehead__title">{doc.title}</h1>
          {doc.updated && (
            <p className="chc-pagehead__lead">Dernière mise à jour : {doc.updated}</p>
          )}
        </div>
      </header>

      <article className="chc-article__wrap r">
        {doc.blocks.map((b, i) => (
          <section className="chc-legal-block" key={i}>
            {b.heading && <h2 className="chc-legal-block__h">{b.heading}</h2>}
            {b.paragraphs?.map((p, j) => (
              <p className="chc-legal-block__p" key={j}>
                {p}
              </p>
            ))}
            {b.list && (
              <ul className="chc-legal-block__list">
                {b.list.map((li, j) => (
                  <li key={j}>{li}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>

      <ChcFooter />
    </div>
  )
}
