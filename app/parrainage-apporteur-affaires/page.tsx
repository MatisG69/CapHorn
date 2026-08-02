import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import ReferralForm from '@/components/landing/ReferralForm'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, faqSchema, servicePageSchema } from '@/lib/seo/jsonld'
import { REFERRAL_OFFER_ARTICLE, isReferralOfferLive } from '@/lib/parrainage'

const PATH = '/parrainage-apporteur-affaires'

const META_TITLE =
  "Parrainage & Recommandation : Devenez Apporteur d'Affaires | Cap Horn Conseils"
const META_DESCRIPTION =
  'Recommandez un proche ou un client pour son projet immobilier ou professionnel dans les Hauts-de-France. Découvrez notre offre de parrainage Cap Horn Conseils.'

/**
 * Le titre fourni par le client porte déjà la marque : `absolute` court-circuite
 * le `title.template` du layout, sinon le suffixe serait ajouté une seconde fois.
 */
export const metadata: Metadata = {
  title: { absolute: META_TITLE },
  description: META_DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    url: PATH,
    type: 'website',
  },
}

/**
 * L'encart d'offre doit disparaître seul le 25 septembre au matin (voir
 * lib/parrainage.ts). La page est donc régénérée au plus toutes les 15 minutes :
 * l'encart s'efface sans redéploiement, et sans rendre la page dynamique.
 */
export const revalidate = 900

const STEPS = [
  {
    n: '01',
    name: 'Vous nous recommandez',
    desc: 'Remplissez le formulaire ci-dessous avec vos coordonnées et celles de votre filleul (avec son accord préalable).',
  },
  {
    n: '02',
    name: 'Nous accompagnons le projet',
    desc: 'Guillaume Horn et son équipe prennent contact avec votre recommandation sous 24 h pour une étude de financement sur-mesure.',
  },
  {
    n: '03',
    name: 'Vous êtes récompensé',
    desc: 'Si le dossier de votre filleul aboutit et que le financement est signé, vous percevez votre prime de parrainage.',
  },
]

const FAQ = [
  {
    q: 'Qui peut devenir apporteur d’affaires chez Cap Horn Conseils ?',
    a: "Tout le monde : un ancien client, un proche, un confrère, un agent immobilier, un expert-comptable ou un partenaire du cabinet. Aucun statut particulier n’est exigé pour recommander un projet. Seule la personne recommandée doit être informée et d’accord avant que vous ne transmettiez ses coordonnées.",
  },
  {
    q: 'Quand la prime de parrainage est-elle versée ?',
    a: "La prime est due lorsque le dossier de votre filleul aboutit, c’est-à-dire une fois le financement signé et débloqué. Tant qu’aucun financement n’est signé, aucune rétribution n’est due, exactement comme les honoraires du cabinet qui ne sont facturés qu’en cas de succès.",
  },
  {
    q: 'Combien de personnes puis-je recommander ?',
    a: "Autant que vous le souhaitez. Chaque recommandation est suivie séparément dans notre outil de gestion, et chaque financement signé donne lieu à sa propre prime de parrainage.",
  },
  {
    q: 'Que se passe-t-il après l’envoi du formulaire ?',
    a: "Votre recommandation arrive directement au cabinet. Guillaume Horn contacte votre filleul sous 24 h ouvrées pour une première étude de faisabilité, gratuite et sans engagement. Vous êtes tenu informé de l’avancement du dossier jusqu’à la signature.",
  },
]

export default function Page() {
  const offerLive = isReferralOfferLive()

  return (
    <div className="chc">
      <JsonLd
        schema={breadcrumbSchema([
          { name: 'Accueil', path: '/' },
          { name: 'Parrainage', path: PATH },
        ])}
      />
      <JsonLd
        schema={servicePageSchema({
          name: 'Parrainage et apport d’affaires',
          description: META_DESCRIPTION,
          path: PATH,
        })}
      />
      <JsonLd schema={faqSchema(FAQ)} />

      <ChcNav />

      <header className="chc-pagehead">
        <div className="chc-pagehead__inner r">
          <div className="chc-eyebrow">Parrainage &amp; recommandation</div>
          <h1 className="chc-pagehead__title">
            Recommandez un projet et soyez récompensé<br />
            <em>pour votre confiance</em>
          </h1>
          <p className="chc-pagehead__lead">
            Vous avez apprécié l’accompagnement de Cap Horn Conseils ? Vous connaissez un proche, un
            confrère ou un client qui cherche à financer un projet immobilier ou professionnel ?
          </p>
          <p className="chc-pagehead__lead">
            Devenez apporteur d’affaires. Mettez-nous en relation et bénéficiez de notre programme de
            parrainage exclusif dès que le financement est débloqué.
          </p>
          <Link href="#formulaire" className="chc-btn chc-btn-gold" style={{ marginTop: 30 }}>
            Recommander un projet <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Fonctionnement, en trois temps */}
      <section className="chc-section chc-section--white">
        <div className="chc-wrap">
          <div className="r" style={{ maxWidth: 780 }}>
            <div className="chc-eyebrow">Le principe</div>
            <h2 className="chc-h2">
              Comment fonctionne le parrainage <em>chez Cap Horn Conseils ?</em>
            </h2>
          </div>

          <div className="chc-values" style={{ marginTop: 40 }}>
            {STEPS.map((s, i) => (
              <div className="chc-value r" key={s.n} data-d={String(i + 1)}>
                <div className="chc-value__n">{s.n}</div>
                <div className="chc-value__name">{s.name}</div>
                <p className="chc-value__desc">{s.desc}</p>
                {s.n === '01' && (
                  <p className="chc-value__desc" style={{ marginTop: 14 }}>
                    <Link href="/mon-etude" className="chc-btn-link">
                      Démarrer une étude
                    </Link>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          ENCART D'OFFRE — retrait programmé au 25 septembre au matin.
          La condition et la date vivent dans lib/parrainage.ts ; passé cette
          date, ce bloc peut être supprimé définitivement.
         ───────────────────────────────────────────────────────────────── */}
      {offerLive && (
        <section className="chc-section" style={{ paddingTop: 0 }}>
          <div className="chc-wrap">
            <div className="chc-offer r">
              <div className="chc-offer__tag">
                <Sparkles className="w-3.5 h-3.5" aria-hidden /> L’offre de parrainage
              </div>
              <p className="chc-offer__text">
                Pour toute recommandation aboutissant à la signature d’un financement, nous vous
                offrons une rétribution financière.
              </p>
              <p className="chc-offer__note">
                Les conditions détaillées sont disponibles sur notre article dédié :{' '}
                <Link href={REFERRAL_OFFER_ARTICLE} className="chc-offer__link">
                  Recommander un projet immobilier
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Formulaire de parrainage */}
      <section id="formulaire" className="chc-section chc-section--white">
        <div className="chc-wrap chc-intro">
          <div className="r">
            <div className="chc-eyebrow">Votre recommandation</div>
            <h2 className="chc-h2">
              Mettez-nous <em>en relation.</em>
            </h2>
            <p className="chc-lead" style={{ marginTop: 22 }}>
              Deux minutes suffisent. Nous contactons votre filleul sous 24 h ouvrées pour une étude
              de faisabilité gratuite. Vos coordonnées et les siennes ne servent qu’à ce dossier.
            </p>
            <ul className="chc-checklist" style={{ marginTop: 30 }}>
              <li>Étude gratuite et sans engagement pour votre filleul.</li>
              <li>Près de cent banques mises en concurrence sur son projet.</li>
              <li>Aucun honoraire tant que le financement n’est pas obtenu.</li>
            </ul>
          </div>
          <div className="r" data-d="1">
            <ReferralForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="chc-section">
        <div className="chc-wrap" style={{ maxWidth: 820 }}>
          <div className="r" style={{ textAlign: 'center', marginBottom: 36 }}>
            <div className="chc-eyebrow chc-eyebrow--center">Questions fréquentes</div>
            <h2 className="chc-h2">
              Le parrainage, <em>en clair.</em>
            </h2>
          </div>
          <div className="chc-faq r">
            {FAQ.map((f, i) => (
              <details className="chc-faq__item" key={i}>
                <summary className="chc-faq__q">{f.q}</summary>
                <p className="chc-faq__a">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Liens connexes */}
      <section className="chc-section chc-section--white" style={{ paddingTop: 0 }}>
        <div className="chc-wrap r">
          <div className="chc-eyebrow">À explorer aussi</div>
          <div className="chc-related">
            <Link href="/mon-etude" className="chc-related__link">
              Démarrer mon étude <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href={REFERRAL_OFFER_ARTICLE} className="chc-related__link">
              Recommander un projet immobilier <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/expertises" className="chc-related__link">
              Toutes nos expertises <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/le-cabinet" className="chc-related__link">
              Le cabinet <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <ChcFooter />
    </div>
  )
}
