import { existsSync } from 'node:fs'
import path from 'node:path'
import Link from 'next/link'
import {
  ArrowRight,
  Banknote,
  Check,
  FileText,
  Handshake,
  Landmark,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Stethoscope,
  TriangleAlert,
} from 'lucide-react'
import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema, faqSchema, servicePageSchema } from '@/lib/seo/jsonld'
import { LEGAL_ENTITY } from '@/lib/seo/config'
import { isGuidePublished } from '@/lib/guide'
import GuideForm from './GuideForm'
import RdvButton from './RdvButton'
import { HdfMap } from './HdfMap'
import {
  CARRIERE,
  CAS_PRATIQUE,
  CRITERES,
  ENGAGEMENTS,
  ERREURS,
  FAISABILITE,
  FAQ,
  GUIDE,
  HERO,
  MEDECINS_META,
  MEDECINS_SLUG,
  METHODE,
  PREMIUM_BOX,
  PROXIMITE,
  RESSOURCES,
  SITUATIONS,
  SPECIALITES,
  STRUCTURES,
  VILLES,
  WHATSAPP_URL,
} from '@/lib/seo/medecins'

/**
 * Page « Financement des médecins & chirurgiens à Lille ».
 *
 * Composant serveur : seuls le formulaire du guide et le bouton de prise de
 * rendez-vous sont hydratés côté client. Le reste (≈ 4 000 mots) part en HTML
 * statique, ce qui est la raison d'être de la page.
 */

/* Les visuels propres à la page sont fournis par le cabinet. Tant qu'un
   fichier n'est pas déposé, on retombe sur un visuel existant plutôt que
   d'afficher une image cassée. */
const publicPath = (p: string) => path.join(process.cwd(), 'public', p)
const HERO_IMG = '/medecins/financement-medecin-chirurgien-lille-cap-horn-conseils.webp'
const QR_IMG = '/medecins/whatsapp-guillaume-horn-cap-horn-conseils.png'
const heroSrc = existsSync(publicPath(HERO_IMG))
  ? HERO_IMG
  : '/Expertises/financement-professionnel-developpement-cabinet-liberal.webp'
const hasQr = existsSync(publicPath(QR_IMG))

const ENGAGEMENT_ICONS = {
  stethoscope: Stethoscope,
  bank: Landmark,
  file: FileText,
  hand: Handshake,
} as const

/* La promesse du bloc « guide » suit l'état réel du fichier : téléchargement
   immédiat s'il est en ligne, envoi par e-mail sinon. Rien à modifier le jour
   où le PDF est déposé dans public/guides/. */
const guideReady = isGuidePublished()
const guideCopy = guideReady ? GUIDE.ready : GUIDE.pending

const PREUVES = [
  '15 ans d’expérience bancaire',
  'Plus de 100 partenaires bancaires',
  'Étude confidentielle avant toute demande',
  'Accompagnement jusqu’au déblocage des fonds',
]

/** FAQ répartie en deux colonnes équilibrées sur grand écran. */
const FAQ_HALF = Math.ceil(FAQ.length / 2)
const FAQ_COLS = [FAQ.slice(0, FAQ_HALF), FAQ.slice(FAQ_HALF)]

const tel = `tel:${LEGAL_ENTITY.phone}`

export function MedecinsPage() {
  return (
    <div className="chc">
      <JsonLd
        schema={breadcrumbSchema([
          { name: 'Accueil', path: '/' },
          { name: 'Professions libérales', path: '/financement-professions-liberales' },
          { name: 'Professions de santé', path: '/financement-professions-sante' },
          { name: MEDECINS_META.short, path: `/${MEDECINS_SLUG}` },
        ])}
      />
      <JsonLd
        schema={servicePageSchema({
          name: 'Financement des médecins et chirurgiens à Lille',
          description: MEDECINS_META.description,
          path: `/${MEDECINS_SLUG}`,
        })}
      />
      <JsonLd schema={faqSchema(FAQ)} />

      <ChcNav />

      {/* ── HÉROS ───────────────────────────────────────────────────── */}
      <header className="med-hero">
        <div className="med-hero__glow" aria-hidden />
        <div className="med-hero__inner">
          <div className="med-hero__text">
            <div className="chc-eyebrow">{HERO.eyebrow}</div>
            <p className="med-hero__chapo">{HERO.chapo}</p>
            <h1 className="med-hero__title">{HERO.h1}</h1>
            <p className="med-hero__claim">{HERO.claim}</p>
            {HERO.paragraphs.map((p, i) => (
              <p className="med-hero__p" key={i}>
                {p}
              </p>
            ))}

            <p className="med-hero__cta-title">{HERO.ctaTitle}</p>
            <p className="med-hero__reassure">
              Prenons 30 minutes pour analyser votre projet avant votre premier rendez-vous
              bancaire.
            </p>
            <div className="med-hero__actions">
              <Link href="/mon-etude" className="med-btn med-btn--accent">
                Demander une étude confidentielle <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <a
                className="med-btn med-btn--ghost"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4" aria-hidden /> Écrire à Guillaume Horn sur
                WhatsApp
              </a>
            </div>

            <ul className="med-engagements">
              {ENGAGEMENTS.map((e) => {
                const Icon = ENGAGEMENT_ICONS[e.icon]
                return (
                  <li key={e.text}>
                    <span className="med-engagements__icon" aria-hidden>
                      <Icon className="w-[18px] h-[18px]" />
                    </span>
                    <span>{e.text}</span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="med-hero__aside">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="med-hero__img"
              src={heroSrc}
              alt="Guillaume Horn, courtier Cap Horn Conseils, en rendez-vous avec un médecin pour préparer le financement de son installation."
              width={1200}
              height={960}
            />
            <aside className="med-premium">
              <h2 className="med-premium__title">{PREMIUM_BOX.title}</h2>
              <ul className="med-premium__list">
                {PREMIUM_BOX.items.map((it) => (
                  <li key={it}>
                    <Check className="w-4 h-4" aria-hidden />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </header>

      {/* ── FRISE DE CARRIÈRE ───────────────────────────────────────── */}
      <section className="chc-section">
        <div className="chc-wrap">
          <div className="r" style={{ maxWidth: 820 }}>
            <div className="chc-eyebrow">Votre carrière</div>
            <h2 className="chc-h2">
              À quelle étape de votre carrière <em>êtes-vous aujourd’hui ?</em>
            </h2>
            <p className="chc-lead" style={{ marginTop: 22 }}>
              La carrière d’un médecin évolue constamment. Les besoins de financement ne sont pas
              les mêmes au moment de l’installation, lors d’une association avec un confrère ou
              lorsque vient le temps d’investir dans un plateau technique ou de préparer la
              transmission de son activité.
            </p>
            <p className="chc-lead" style={{ marginTop: 16 }}>
              Notre rôle n’est pas simplement de rechercher un financement. Nous vous aidons à
              construire un projet cohérent, à choisir la stratégie la plus adaptée à votre
              situation et à présenter un dossier solide aux établissements bancaires.
            </p>
          </div>

          <ol className="med-timeline r" data-d="1">
            {CARRIERE.map(({ icon: Icon, label }, i) => (
              <li className="med-timeline__step" key={label}>
                <span className="med-timeline__icon" aria-hidden>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="med-timeline__label">{label}</span>
                <span className="med-timeline__n">{String(i + 1).padStart(2, '0')}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CARTES SITUATIONS ───────────────────────────────────────── */}
      <section className="chc-section chc-section--white">
        <div className="chc-wrap">
          <div className="r" style={{ maxWidth: 760 }}>
            <div className="chc-eyebrow">Votre situation</div>
            <h2 className="chc-h2">
              Où en êtes-vous <em>dans votre projet ?</em>
            </h2>
          </div>

          <div className="med-cards" style={{ marginTop: 44 }}>
            {SITUATIONS.map(({ icon: Icon, title, body, cta }, i) => (
              <article className="med-card r" key={title} data-d={String((i % 3) + 1)}>
                <span className="med-card__icon" aria-hidden>
                  <Icon className="w-[22px] h-[22px]" />
                </span>
                <h3 className="med-card__title">{title}</h3>
                {body.map((p, j) => (
                  <p className="med-card__text" key={j}>
                    {p}
                  </p>
                ))}
                <Link className="med-card__cta" href="/mon-etude">
                  {cta} <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                </Link>
              </article>
            ))}
          </div>

          <aside className="med-note r" style={{ marginTop: 44 }}>
            <div className="med-note__label">
              <Lightbulb className="w-4 h-4" aria-hidden /> Bon à savoir
            </div>
            <p className="med-note__lead">
              Le meilleur financement n’est pas toujours celui qui affiche le taux le plus faible.
            </p>
            <p className="med-note__text">
              Le choix de la durée, le niveau d’apport, les garanties demandées, la conservation de
              votre trésorerie, la structure juridique retenue et la souplesse du contrat peuvent
              avoir un impact bien plus important sur votre activité à long terme. C’est pourquoi
              chaque projet mérite une approche globale.
            </p>
          </aside>
        </div>
      </section>

      {/* ── POURQUOI LES BANQUES FINANCENT ──────────────────────────── */}
      <section className="chc-section">
        <div className="chc-wrap chc-intro">
          <div className="r">
            <div className="chc-eyebrow">Le regard des banques</div>
            <h2 className="chc-h2">
              Pourquoi les banques financent-elles <em>les professions médicales ?</em>
            </h2>
          </div>
          <div className="chc-intro__right r" data-d="1">
            <p>
              Les professions médicales bénéficient généralement d’une excellente image auprès des
              établissements bancaires. La stabilité de l’activité, le caractère réglementé de la
              profession, le niveau de qualification et les perspectives de revenus constituent des
              éléments rassurants pour les prêteurs.
            </p>
            <p>Pour autant, un financement n’est jamais automatique.</p>
            <p>
              Une banque analyse la cohérence globale de votre projet : votre spécialité, votre
              expérience, votre mode d’exercice, le montant des investissements, votre capacité de
              remboursement, la structure juridique retenue ainsi que la qualité du dossier
              présenté.
            </p>
            <p>
              C’est précisément sur ces points que se joue la différence entre un dossier simplement
              déposé… et un dossier réellement préparé.
            </p>
          </div>
        </div>

        <div className="chc-wrap">
          <ul className="med-proof r" data-d="2">
            {PREUVES.map((p) => (
              <li key={p}>
                <Check className="w-4 h-4" aria-hidden />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── STRUCTURES JURIDIQUES ───────────────────────────────────── */}
      <section className="chc-section chc-section--white">
        <div className="chc-wrap">
          <div className="r" style={{ maxWidth: 820 }}>
            <div className="chc-eyebrow">Structures d’exercice</div>
            <h2 className="chc-h2">
              Les structures juridiques <em>que nous accompagnons.</em>
            </h2>
            <p className="chc-lead" style={{ marginTop: 22 }}>
              Le choix de votre structure d’exercice influence votre organisation, votre fiscalité,
              votre protection sociale et les conditions dans lesquelles votre projet pourra être
              financé. Qu’il s’agisse d’une première installation, d’une évolution de votre activité
              ou de l’arrivée d’un nouvel associé, il est essentiel de choisir une structure
              cohérente avec vos objectifs. Nous intervenons notamment sur les projets portés par les
              structures suivantes.
            </p>
          </div>

          <div className="med-structs" style={{ marginTop: 40 }}>
            {STRUCTURES.map((s, i) => (
              <article className="med-struct r" key={s.sigle} data-d={String((i % 3) + 1)}>
                <div className="med-struct__sigle">{s.sigle}</div>
                <div className="med-struct__nom">{s.nom}</div>
                <p className="med-struct__text">{s.body}</p>
                {s.points && (
                  <ul className="med-struct__points">
                    {s.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>

          <aside className="med-note r" style={{ marginTop: 44 }}>
            <div className="med-note__label">
              <Lightbulb className="w-4 h-4" aria-hidden /> Bon à savoir
            </div>
            <p className="med-note__lead">
              Le choix d’une structure juridique ne doit jamais être dicté uniquement par des
              considérations bancaires.
            </p>
            <p className="med-note__text">
              Chaque projet mérite une réflexion globale associant les aspects juridiques, fiscaux,
              patrimoniaux et financiers. Nous travaillons en lien avec votre expert-comptable et
              votre avocat.
            </p>
          </aside>
        </div>
      </section>

      {/* ── SPÉCIALITÉS ─────────────────────────────────────────────── */}
      <section className="chc-section">
        <div className="chc-wrap">
          <div className="r" style={{ maxWidth: 760 }}>
            <div className="chc-eyebrow">Spécialités</div>
            <h2 className="chc-h2">
              Les spécialités médicales <em>que nous accompagnons.</em>
            </h2>
            <p className="chc-lead" style={{ marginTop: 22 }}>
              Chaque spécialité possède ses propres contraintes, son rythme d’installation, ses
              investissements et ses perspectives de développement. Nous adaptons notre
              accompagnement à votre exercice.
            </p>
          </div>

          <ul className="med-specs r" data-d="1" style={{ marginTop: 40 }}>
            {SPECIALITES.map(({ icon: Icon, label }) => (
              <li className="med-spec" key={label}>
                <span className="med-spec__icon" aria-hidden>
                  <Icon className="w-[18px] h-[18px]" />
                </span>
                <span className="med-spec__label">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── IMPLANTATION ────────────────────────────────────────────── */}
      <section className="chc-section chc-section--white">
        <div className="chc-wrap med-geo">
          <div className="r">
            <div className="med-map">
              <HdfMap />
            </div>
            <ul className="med-geo__pins">
              {VILLES.map((v) => (
                <li key={v}>
                  <MapPin className="w-3.5 h-3.5" aria-hidden /> {v}
                </li>
              ))}
            </ul>
          </div>

          <div className="r" data-d="1">
            <div className="chc-eyebrow">Hauts-de-France</div>
            <h2 className="chc-h2">
              Pourquoi choisir un cabinet <em>implanté dans les Hauts-de-France ?</em>
            </h2>
            <ul className="chc-checklist" style={{ marginTop: 28 }}>
              {PROXIMITE.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="chc-lead" style={{ marginTop: 26 }}>
              Nous accompagnons les médecins et chirurgiens de la métropole lilloise comme de
              l’ensemble de la région, en présentiel ou à distance, selon vos contraintes de
              consultation.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA INTERMÉDIAIRE ───────────────────────────────────────── */}
      <section className="med-cta">
        <div className="med-cta__inner">
          <div className="med-cta__text">
            <h2 className="med-cta__title">
              Votre projet mérite une analyse <em>avant toute démarche bancaire.</em>
            </h2>
            <p className="med-cta__lead">
              Que vous soyez interne, remplaçant, médecin installé ou associé, une première étude
              permet souvent d’anticiper les points de vigilance et de présenter un dossier plus
              solide.
            </p>
            <div className="med-cta__actions">
              <Link href="/mon-etude" className="med-btn med-btn--accent">
                Demander une étude confidentielle <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <a className="med-btn med-btn--ghost" href={tel}>
                <Phone className="w-4 h-4" aria-hidden /> {LEGAL_ENTITY.phoneDisplay}
              </a>
            </div>
          </div>

          {hasQr && (
            <a className="med-qr" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={QR_IMG} alt="" aria-hidden width={320} height={320} />
              <span className="med-qr__label">
                <MessageCircle className="w-4 h-4" aria-hidden />
                Scanner ou cliquer pour écrire à Guillaume Horn sur WhatsApp
              </span>
            </a>
          )}
        </div>
      </section>

      {/* ── ERREURS ─────────────────────────────────────────────────── */}
      <section className="chc-section">
        <div className="chc-wrap">
          <div className="r" style={{ maxWidth: 820 }}>
            <div className="chc-eyebrow">Points de vigilance</div>
            <h2 className="chc-h2">
              Les erreurs qui peuvent ralentir <em>le financement d’un médecin.</em>
            </h2>
            <p className="chc-lead" style={{ marginTop: 22 }}>
              Un projet médical bien construit inspire confiance. À l’inverse, certaines erreurs
              peuvent compliquer l’analyse d’un dossier ou allonger les délais d’obtention d’un
              financement. Ces situations peuvent généralement être anticipées lorsqu’elles sont
              identifiées suffisamment tôt.
            </p>
          </div>

          <div className="med-errors" style={{ marginTop: 40 }}>
            {ERREURS.map((e, i) => (
              <article className="med-error r" key={e.title} data-d={String((i % 2) + 1)}>
                <span className="med-error__icon" aria-hidden>
                  <TriangleAlert className="w-[18px] h-[18px]" />
                </span>
                <div>
                  <h3 className="med-error__title">{e.title}</h3>
                  {e.body.map((p, j) => (
                    <p className="med-error__text" key={j}>
                      {p}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÉTHODE ─────────────────────────────────────────────────── */}
      <section className="chc-dark">
        <div className="chc-dark__inner">
          <div className="r" style={{ maxWidth: 700 }}>
            <div className="chc-eyebrow">Notre méthode</div>
            <h2 className="chc-h2">
              Une approche <em>simple.</em>
            </h2>
          </div>
          <ol className="med-method">
            {METHODE.map((m, i) => (
              <li className="med-method__step r" key={m.n} data-d={String((i % 4) + 1)}>
                <div className="med-method__n">{m.n}</div>
                <h3 className="med-method__title">{m.title}</h3>
                {m.body && <p className="med-method__text">{m.body}</p>}
                {m.details && (
                  <ul className="med-method__list">
                    {m.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── GUIDE ───────────────────────────────────────────────────── */}
      <section className="chc-section chc-section--white" id="guide">
        <div className="chc-wrap med-guide">
          <div className="r">
            <div className="med-book" aria-hidden>
              <div className="med-book__pages" />
              <div className="med-book__cover">
                <span className="med-book__spine" />
                <span className="med-book__eyebrow">Guide Cap Horn Conseils</span>
                <span className="med-book__title">{GUIDE.title}</span>
                <span className="med-book__rule" />
                <span className="med-book__foot">Médecins &amp; chirurgiens · Hauts-de-France</span>
              </div>
            </div>
          </div>

          <div className="r" data-d="1">
            <div className="chc-eyebrow">{guideCopy.eyebrow}</div>
            <h2 className="chc-h2">{guideCopy.heading}</h2>
            {/* Le titre du guide reste un intertitre : le H2 porte l'action,
                le H3 porte le nom du document. */}
            <h3 className="med-guide__name">{GUIDE.title}</h3>
            <p className="chc-lead">{GUIDE.lead}</p>
            {!guideReady && <p className="med-guide__promise">{GUIDE.pending.lead}</p>}
            <p className="med-guide__intro">{GUIDE.intro}</p>
            <ul className="med-guide__points">
              {GUIDE.points.map((p) => (
                <li key={p}>
                  <Check className="w-4 h-4" aria-hidden />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <GuideForm label={guideCopy.cta} note={guideCopy.note} />
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="chc-section">
        <div className="chc-wrap">
          <div className="r" style={{ maxWidth: 780 }}>
            <div className="chc-eyebrow">Questions fréquentes</div>
            <h2 className="chc-h2">
              Les questions <em>les plus fréquentes.</em>
            </h2>
            <p className="chc-lead" style={{ marginTop: 22 }}>
              Les médecins qui nous contactent se posent souvent les mêmes questions avant leur
              installation, leur association ou la reprise d’une activité. Retrouvez ici les réponses
              aux principales interrogations.
            </p>
          </div>

          <div className="med-faq r" data-d="1" style={{ marginTop: 40 }}>
            {FAQ_COLS.map((col, ci) => (
              <div className="chc-faq" key={ci}>
                {col.map((f) => (
                  <details className="chc-faq__item" key={f.q}>
                    <summary className="chc-faq__q">{f.q}</summary>
                    <p className="chc-faq__a">{f.a}</p>
                  </details>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA + COORDONNÉES ───────────────────────────────────────── */}
      <section className="chc-section chc-section--white">
        <div className="chc-wrap med-contact">
          <div className="r">
            <div className="chc-eyebrow">Parlons de votre projet</div>
            <h2 className="chc-h2">
              Vous préparez <em>une décision importante ?</em>
            </h2>
            <p className="chc-lead" style={{ marginTop: 22 }}>
              Qu’il s’agisse d’une première installation, d’un rachat de patientèle, d’une
              association ou d’un investissement dans votre cabinet, une décision bien préparée
              facilite souvent la suite du projet.
            </p>
            <p className="chc-lead" style={{ marginTop: 16 }}>
              Nous prenons le temps d’analyser votre situation, de répondre à vos questions et de
              construire une stratégie de financement adaptée à votre exercice.
            </p>
            <div className="med-cta__actions" style={{ marginTop: 30 }}>
              <Link href="/mon-etude" className="med-btn med-btn--accent">
                Demander mon étude confidentielle <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <RdvButton />
            </div>
          </div>

          <address className="med-coords r" data-d="1">
            <a href={tel}>
              <Phone className="w-4 h-4" aria-hidden />
              <span>{LEGAL_ENTITY.phoneDisplay}</span>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4" aria-hidden />
              <span>WhatsApp — Mr Guillaume Horn</span>
            </a>
            <a href={`mailto:${LEGAL_ENTITY.email}`}>
              <Mail className="w-4 h-4" aria-hidden />
              <span>{LEGAL_ENTITY.email}</span>
            </a>
            <p>
              <MapPin className="w-4 h-4" aria-hidden />
              <span>Métropole lilloise — intervention dans toute la France</span>
            </p>
            <p className="med-coords__legal">
              <ShieldCheck className="w-4 h-4" aria-hidden />
              <span>
                {LEGAL_ENTITY.brand} — courtier immatriculé à l’ORIAS sous le n°{' '}
                {LEGAL_ENTITY.orias}. Étude gratuite, honoraires dus uniquement en cas de
                financement obtenu.
              </span>
            </p>
          </address>
        </div>
      </section>

      {/* ── CRITÈRES BANCAIRES ──────────────────────────────────────── */}
      <section className="chc-section">
        <div className="chc-wrap">
          <div className="r" style={{ maxWidth: 820 }}>
            <div className="chc-eyebrow">Analyse bancaire</div>
            <h2 className="chc-h2">
              Quels critères les banques analysent-elles <em>avant de financer un médecin ?</em>
            </h2>
            <p className="chc-lead" style={{ marginTop: 22 }}>
              Contrairement aux idées reçues, une banque n’accorde pas un financement uniquement
              parce que vous exercez une profession médicale. Chaque projet fait l’objet d’une
              analyse approfondie afin d’évaluer sa cohérence, sa viabilité et sa capacité de
              remboursement. Voici les principaux critères étudiés.
            </p>
          </div>

          <div className="med-criteres" style={{ marginTop: 40 }}>
            {CRITERES.map((c, i) => (
              <article className="med-critere r" key={c.title} data-d={String((i % 3) + 1)}>
                <div className="med-critere__n">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="med-critere__title">{c.title}</h3>
                <ul>
                  {c.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                {c.note && <p className="med-critere__note">{c.note}</p>}
              </article>
            ))}
          </div>

          <p className="med-outro r" style={{ marginTop: 36 }}>
            Notre rôle consiste à présenter un dossier clair, argumenté et cohérent afin de répondre
            aux attentes des établissements bancaires avant même le premier rendez-vous.
          </p>
        </div>
      </section>

      {/* ── CAS PRATIQUE ────────────────────────────────────────────── */}
      <section className="chc-section chc-section--white">
        <div className="chc-wrap">
          <div className="r" style={{ maxWidth: 780 }}>
            <div className="chc-eyebrow">Cas pratique</div>
            <h2 className="chc-h2">
              Financer <em>une installation médicale.</em>
            </h2>
          </div>

          <div className="med-case" style={{ marginTop: 40 }}>
            {[CAS_PRATIQUE.contexte, CAS_PRATIQUE.enjeux, CAS_PRATIQUE.intervention].map(
              (block, i) => (
                <article className="med-case__col r" key={block.title} data-d={String(i + 1)}>
                  <div className="med-case__step">{`Étape ${i + 1}`}</div>
                  <h3 className="med-case__title">{block.title}</h3>
                  <p className="med-case__text">{block.body}</p>
                  {block.items.length > 0 && (
                    <ul className="med-case__list">
                      {block.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ),
            )}
          </div>

          <p className="med-disclaimer r" style={{ marginTop: 32 }}>
            <Banknote className="w-4 h-4" aria-hidden /> {CAS_PRATIQUE.disclaimer}
          </p>
        </div>
      </section>

      {/* ── FAISABILITÉ ─────────────────────────────────────────────── */}
      <section className="chc-section">
        <div className="chc-wrap chc-intro">
          <div className="r">
            <div className="chc-eyebrow">Première étude</div>
            <h2 className="chc-h2">
              Mon projet <em>est-il finançable ?</em>
            </h2>
            <p className="chc-lead" style={{ marginTop: 22 }}>
              Avant de rechercher une banque, la première question est souvent beaucoup plus simple.
              Votre projet est-il finançable dans les conditions que vous envisagez ? Une étude
              réalisée en amont permet souvent d’identifier les points de vigilance et d’éviter
              certaines difficultés.
            </p>
          </div>

          <div className="r" data-d="1">
            <p className="med-sub">En quelques minutes, nous analysons notamment :</p>
            <ul className="chc-checklist">
              {FAISABILITE.analyse.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            <p className="med-sub" style={{ marginTop: 30 }}>
              À l’issue de cette première étude, vous repartez avec :
            </p>
            <ul className="chc-checklist">
              {FAISABILITE.resultat.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            <div className="med-cta__actions" style={{ marginTop: 32 }}>
              <Link href="/mon-etude" className="med-btn med-btn--accent">
                Demander une étude confidentielle <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <a className="med-btn med-btn--ghost" href={tel}>
                <Phone className="w-4 h-4" aria-hidden /> {LEGAL_ENTITY.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIENS CONNEXES & RESSOURCES ─────────────────────────────── */}
      <section className="chc-section chc-section--white" style={{ paddingTop: 0 }}>
        <div className="chc-wrap r">
          <div className="chc-eyebrow">À explorer aussi</div>
          <div className="chc-related">
            <Link href="/financement-professions-sante" className="chc-related__link">
              Professions de santé <ArrowRight className="w-3.5 h-3.5" aria-hidden />
            </Link>
            <Link href="/financement-professions-liberales" className="chc-related__link">
              Toutes les professions libérales <ArrowRight className="w-3.5 h-3.5" aria-hidden />
            </Link>
            <Link href="/reprise-transmission" className="chc-related__link">
              Reprise &amp; transmission <ArrowRight className="w-3.5 h-3.5" aria-hidden />
            </Link>
            <Link href="/courtier-credit-immobilier-lille" className="chc-related__link">
              Courtier immobilier à Lille <ArrowRight className="w-3.5 h-3.5" aria-hidden />
            </Link>
            <Link href="/mon-etude" className="chc-related__link">
              Démarrer mon étude <ArrowRight className="w-3.5 h-3.5" aria-hidden />
            </Link>
          </div>

          <div className="med-sources">
            <span>Références officielles :</span>
            {RESSOURCES.map((rlink) => (
              <a key={rlink.href} href={rlink.href} target="_blank" rel="noopener noreferrer">
                {rlink.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <ChcFooter />
    </div>
  )
}
