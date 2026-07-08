'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, X, Compass, Gem, Eye } from 'lucide-react'
import { Counter } from '@/components/landing/Counter'
import TestimonialsWall from '@/components/landing/TestimonialsWall'
import MethodCarousel from '@/components/landing/MethodCarousel'
import SectionWithMockup from '@/components/landing/SectionWithMockup'
import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import { LiquidButton } from '@/components/ui/LiquidButton'
import { CircularGallery, type GalleryItem } from '@/components/landing/CircularGallery'
import DossierLens from '@/components/landing/DossierLens'
import BankLogosMarquee from '@/components/landing/BankLogosMarquee'

type Svc = {
  n: string; name: string; tag: string; desc: string; lead: string; details: string
  photo: { url: string; by: string; pos?: string }
}

const SERVICES: Svc[] = [
  {
    n: '01', name: 'Immobilier', tag: 'Résidentiel & locatif',
    desc: 'Résidence principale, investissement locatif, SCI. Négociation des meilleures conditions auprès de près de cent banques partenaires.',
    lead: 'Acheter, investir, structurer via SCI, chaque dossier étudié individuellement.',
    details: 'Nous analysons votre projet dans sa globalité avant de mobiliser notre réseau bancaire. Notre objectif n’est pas seulement d’obtenir de bonnes conditions, mais de construire un financement durable en négociant le taux, l’assurance, les garanties et les clauses qui protégeront vos intérêts pendant toute la durée du crédit.',
    photo: { url: '/Expertises/financement-immobilier-famille-nouvelle-maison-cap-horn-conseils.jpg', by: '' },
  },
  {
    n: '02', name: 'Financement professionnel', tag: 'Entreprises',
    desc: 'Trésorerie, matériel, locaux, croissance externe, transmission, levée de fonds. Une structure de financement sur mesure.',
    lead: 'Tous les financements liés à votre activité, sous un même pilotage.',
    details: 'Création, développement, acquisition, trésorerie ou transmission : nous analysons vos besoins avant de structurer la solution de financement la plus adaptée. Notre indépendance nous permet de mobiliser les partenaires et les solutions les plus pertinents pour accompagner durablement la croissance de votre entreprise.',
    photo: { url: '/Expertises/financement-professionnel-developpement-cabinet-liberal.png', by: '' },
  },
  {
    n: '03', name: 'Assurance & Prévoyance', tag: 'Emprunteur • Homme clé',
    desc: 'Délégation et renégociation. Jusqu’à 50 % d’économie sur la prime, à garanties au moins équivalentes.',
    lead: 'Changer d’assurance ne signifie pas seulement payer moins cher.',
    details: 'Nous analysons votre contrat, comparons les garanties et recherchons une solution plus avantageuse, sans compromis sur votre protection. Selon votre profil et les caractéristiques de votre prêt, le changement d’assurance peut représenter jusqu’à 15 000 à 30 000 € d’économies sur la durée du crédit. Nous prenons en charge l’ensemble des démarches auprès de votre banque.',
    photo: { url: '/Expertises/assurance-emprunteur-protection-famille-cap-horn-conseils.png', by: '' },
  },
  {
    n: '04', name: 'Regroupement de crédits', tag: 'Rééquilibrer votre budget',
    desc: 'Regroupement de crédits et optimisation de la capacité d’emprunt, vers la solution la plus saine, pas la plus longue.',
    lead: 'Réduire la charge mensuelle et restaurer votre capacité d’emprunt.',
    details: 'Nous analysons chaque crédit en cours, simulons plusieurs scénarios de regroupement, durée, mensualités, taux, assurances et frais, afin de construire la solution la plus adaptée à votre situation. Notre objectif n’est pas d’allonger systématiquement votre financement, mais de préserver durablement votre équilibre financier et votre capacité d’emprunt.',
    photo: { url: '/Expertises/regroupement-credits-liberte-financiere.png', by: '' },
  },
  {
    n: '05', name: 'Expatriés & Non-résidents', tag: 'France & International',
    desc: 'Solutions dédiées aux expatriés et non-résidents. Financement immobilier en France piloté à distance.',
    lead: 'Investir en France depuis l’étranger, sans friction.',
    details: 'Nous analysons votre situation avant de mobiliser notre réseau de banques spécialisées dans le financement des expatriés et des non-résidents. Revenus en devises, SCI ou patrimoine international : nous pilotons votre dossier à distance, en coordination avec votre notaire, jusqu’à la signature, y compris lorsque celle-ci peut être organisée par procuration.',
    photo: { url: '/Expertises/financement-expatries-achat-immobilier-hauts-de-france.png', by: '' },
  },
  {
    n: '06', name: 'Votre banque a refusé ?', tag: 'Une seconde analyse',
    desc: 'Refus bancaire, profil atypique, antécédents. Reconstruire le dossier et trouver la banque qui dira oui.',
    lead: 'Un refus n’est presque jamais une fatalité.',
    details: 'Profession atypique, CDD, séparation, antécédent FICP, entrepreneur avec moins de 3 bilans ou levée de réserves : nous réétudions votre dossier, identifions les établissements les plus adaptés à votre situation et construisons une stratégie de financement avant toute nouvelle présentation.',
    photo: { url: '/Expertises/reetude-dossier-financement.png', by: '' },
  },
]

const CABINET_PILLARS = [
  { Icon: Compass, name: 'Indépendance', desc: 'Liés à aucune banque, la solution la plus juste pour vous, jamais la plus rémunératrice.' },
  { Icon: Gem, name: 'Exigence', desc: 'Chaque dossier travaillé comme un dossier premium, négocié sur chaque paramètre.' },
  { Icon: Eye, name: 'Transparence', desc: 'Un chiffrage annoncé d’avance, aucune zone d’ombre jusqu’à la signature.' },
]

const EXPERTISE_ITEMS: GalleryItem[] = SERVICES.map((s) => ({
  common: s.name,
  binomial: s.tag,
  photo: { url: s.photo.url, text: `${s.name}, ${s.tag}`, pos: s.photo.pos, by: s.photo.by },
}))

const METHOD_STEPS = [
  { n: '01', name: 'Qualifiez votre projet', desc: 'Notre outil préqualifie votre projet en moins de trois minutes. Aucun document n’est nécessaire à cette étape.', src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80&auto=format&fit=crop' },
  { n: '02', name: 'Échange personnalisé', desc: 'Un expert vous rappelle sous 24 h afin d’affiner votre projet et de définir la stratégie de financement la plus adaptée.', src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=80&auto=format&fit=crop' },
  { n: '03', name: 'Montage & négociation', desc: 'Nous constituons votre dossier et négocions chaque paramètre auprès des établissements les plus adaptés à votre projet.', src: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80&auto=format&fit=crop' },
  { n: '04', name: 'Signature & suivi', desc: 'Nous coordonnons chaque étape jusqu’à la signature et sécurisons les conditions qui protégeront durablement vos intérêts.', src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900&q=80&auto=format&fit=crop' },
]

export default function HomePage() {
  const [open, setOpen] = useState<Svc | null>(null)
  const [galleryRadius, setGalleryRadius] = useState(560)

  useEffect(() => {
    const setRadius = () => {
      const w = window.innerWidth
      setGalleryRadius(w < 560 ? 300 : w < 1024 ? 440 : 560)
    }
    setRadius()
    window.addEventListener('resize', setRadius)
    return () => window.removeEventListener('resize', setRadius)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null) }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open])

  return (
    <div className="chc">
      <ChcNav />

      {/* ─── HERO, split éditorial « le cap » ─────────────────── */}
      <header className="chc-h">
        <span className="chc-h__glow" aria-hidden />
        <div className="chc-h__inner">
          {/* Colonne texte */}
          <div className="chc-h__text">
            <p className="chc-h__eyebrow chc-h-in" data-d="1">
              <span className="chc-h__eyebrow-rule" aria-hidden /> Courtage indépendant · Marcq-en-Barœul
            </p>
            <h1 className="chc-h__title">
              <span className="chc-h__title-line chc-h-in" data-d="2">Nous tenons le</span>
              <span className="chc-h__title-line chc-h-in" data-d="3">cap de votre</span>
              <span className="chc-h__title-line chc-h-in" data-d="4"><em>financement.</em></span>
            </h1>
            <p className="chc-h__lead chc-h-in" data-d="5">
              Immobilier, financement professionnel, assurance emprunteur. Nous lisons chaque projet
              en profondeur avant de mobiliser notre réseau, pour des conditions négociées au plus
              juste. Honoraires au résultat.
            </p>
            <div className="chc-h__actions chc-h-in" data-d="6">
              <LiquidButton href="/tunnel" tone="light" size="md" uppercase={false}>
                Qualifier mon projet
              </LiquidButton>
              <Link href="/methode" className="chc-h__textlink">
                Découvrir la méthode <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
            <div className="chc-h__stats chc-h-in" data-d="7">
              <div className="chc-h__stat">
                <span className="chc-h__stat-val"><Counter value={500} prefix="+" /></span>
                <span className="chc-h__stat-lbl">Dossiers financés</span>
              </div>
              <span className="chc-h__stat-sep" aria-hidden />
              <div className="chc-h__stat">
                <span className="chc-h__stat-val"><Counter value={100} prefix="+" /></span>
                <span className="chc-h__stat-lbl">Banques &amp; assureurs</span>
              </div>
              <span className="chc-h__stat-sep" aria-hidden />
              <div className="chc-h__stat">
                <span className="chc-h__stat-val">4,9<i>/5</i></span>
                <span className="chc-h__stat-lbl">Note clients</span>
              </div>
            </div>
          </div>

          {/* Colonne média, loupe interactive sur les pièces d'un dossier */}
          <div className="chc-h__media chc-h-media-in">
            <DossierLens />
          </div>
        </div>
      </header>

      {/* ─── BANQUES PARTENAIRES ─────────────────────────────── */}
      <BankLogosMarquee />

      {/* ─── LE CABINET ──────────────────────────────────────── */}
      <section className="chc-section chc-cabintro">
        <span className="chc-cabintro__glow" aria-hidden />
        <div className="chc-wrap">
          <div className="chc-cabintro__top">
            <div className="r chc-cabintro__head">
              <div className="chc-eyebrow">Le cabinet</div>
              <h2 className="chc-intro__title">Lire un projet <em>avant</em><br />de le financer.</h2>
            </div>
            <div className="chc-cabintro__body r" data-d="1">
              <p className="chc-cabintro__lead">
                CAP HORN CONSEILS® n’est pas un simple courtier. Avant de consulter notre réseau
                bancaire, nous analysons votre projet dans sa globalité afin de bâtir une stratégie
                de financement réellement adaptée à vos objectifs.
              </p>
              <p className="chc-cabintro__p">
                Un interlocuteur unique à vos côtés, du premier échange jusqu’à la signature.
              </p>
              <LiquidButton href="/le-cabinet" tone="light" size="sm" uppercase={false}>
                Découvrir le cabinet
              </LiquidButton>
            </div>
          </div>

          <div className="chc-cabintro__pillars r" data-d="2">
            {CABINET_PILLARS.map((p) => (
              <div className="chc-pillar" key={p.name}>
                <span className="chc-pillar__icon" aria-hidden>
                  <p.Icon className="w-5 h-5" strokeWidth={1.4} />
                </span>
                <div className="chc-pillar__txt">
                  <div className="chc-pillar__name">{p.name}</div>
                  <p className="chc-pillar__desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES, galerie circulaire 3D (ouvre la modale) ── */}
      <section id="services" className="chc-exp">
        <span className="chc-exp__glow" aria-hidden />
        <div className="chc-exp__head r">
          <div className="chc-eyebrow chc-eyebrow--light">Nos expertises</div>
          <h2 className="chc-h2">Un interlocuteur unique,<br /><em>pour chaque financement.</em></h2>
          <p className="chc-exp__lead">Six expertises, une seule méthode : comprendre votre projet avant de construire la stratégie de financement la plus adaptée à vos objectifs.</p>
        </div>

        <div className="chc-exp__stage">
          <CircularGallery items={EXPERTISE_ITEMS} radius={galleryRadius} className="chc-exp__gallery" />
        </div>

        <div className="chc-exp__index r" data-d="1">
          {SERVICES.map((s) => (
            <button key={s.n} type="button" className="chc-exp__card" onClick={() => setOpen(s)} aria-label={`Détails, ${s.name}`}>
              <span className="chc-exp__card-num">{s.n}</span>
              <span className="chc-exp__card-body">
                <span className="chc-exp__card-name">{s.name}</span>
                <span className="chc-exp__card-tag">{s.tag}</span>
              </span>
              <ArrowRight className="chc-exp__card-arrow w-4 h-4" aria-hidden />
            </button>
          ))}
        </div>
      </section>

      {/* ─── MÉTHODE, section sombre ────────────────────────── */}
      <section id="methode" className="chc-dark">
        <img className="chc-dark__bg" src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=70&auto=format&fit=crop" alt="" />
        <div className="chc-dark__inner">
          <div className="r">
            <div className="chc-eyebrow">Méthodologie</div>
            <h2 className="chc-h2">Simple pour vous,<br /><em>exigeant en coulisses.</em></h2>
          </div>
          <div className="r" data-d="1">
            <MethodCarousel steps={METHOD_STEPS} />
          </div>
        </div>
      </section>

      {/* ─── PREUVE, témoignages clients (colonnes défilantes) ─── */}
      <section className="chc-section">
        <div className="chc-wrap r" style={{ marginBottom: 28 }}>
          <div style={{ maxWidth: 760 }}>
            <div className="chc-eyebrow">Ils nous font confiance</div>
            <h2 className="chc-h2">La preuve, <em>côté clients.</em></h2>
          </div>
        </div>
        <div className="chc-wrap">
          <TestimonialsWall />
        </div>
      </section>

      {/* ─── SIMULATEUR teaser ───────────────────────────────── */}
      <section className="chc-section chc-section--white">
        <div className="chc-wrap chc-sim">
          <div className="r">
            <div className="chc-eyebrow">Module exclusif · Changement d’assurance emprunteur, Loi Lemoine</div>
            <h2 className="chc-h2">Combien pourriez-vous <em>économiser ?</em></h2>
            <p className="chc-lead" style={{ marginTop: 22 }}>Estimez en 30 secondes les économies réalisables sur votre assurance emprunteur. Selon votre profil, vous pourriez réduire significativement le coût total de votre assurance, sans modifier les garanties exigées par votre banque.</p>
            <LiquidButton href="/simulateur" tone="light" size="lg" style={{ marginTop: 28 }}>Lancer la simulation <ArrowRight className="w-4 h-4" /></LiquidButton>
          </div>
          <div className="r" data-d="1">
            <div className="chc-sim__card">
              <div className="chc-eyebrow chc-eyebrow--light" style={{ marginBottom: 14 }}>Exemple · prêt 250 000 €</div>
              <div className="chc-sim__big"><Counter value={21600} suffix=" €" duration={1800} /></div>
              <div className="chc-sim__sub">économisés sur la durée totale du prêt</div>
              <div className="chc-sim__row">
                <div className="chc-sim__metric"><div className="v">230 €</div><div className="l">Avant / mois</div></div>
                <div className="chc-sim__metric"><div className="v" style={{ color: 'var(--chc-gold)' }}>88 €</div><div className="l">Après / mois</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT ───────────────────────────────────────────── */}
      <section id="about" className="chc-section">
        <div className="chc-wrap chc-about">
          <div className="chc-about__photo r">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/guillaume-horn.jpg" alt="Guillaume Horn, fondateur de Cap Horn Conseils" />
            <div className="chc-about__badge">Disponible pour un premier échange</div>
          </div>
          <div className="r" data-d="1">
            <div className="chc-eyebrow">Le fondateur</div>
            <div className="chc-about__name">Guillaume Horn</div>
            <p className="chc-lead">Après plusieurs années dans le financement bancaire et le courtage en crédit, Guillaume Horn a fondé CAP HORN CONSEILS® avec une conviction simple : un bon financement commence par une compréhension approfondie du projet et de la personne qui le porte.</p>
            <p className="chc-lead" style={{ marginTop: 18 }}>Chaque recommandation repose sur une analyse indépendante, une stratégie adaptée et une négociation menée dans le seul intérêt du client.</p>
            <div className="chc-about__sign">Guillaume Horn, fondateur</div>
          </div>
        </div>
      </section>

      {/* ─── CTA final fusionné (À votre disposition + Prêt à avancer) ── */}
      <div id="contact">
        <SectionWithMockup
          eyebrow="À votre disposition"
          title="Prêt à faire avancer"
          titleEm="votre projet ?"
          description="Qualifiez votre projet en moins de trois minutes. Un expert CAP HORN CONSEILS® vous recontacte sous 24 h pour construire avec vous la stratégie de financement la plus adaptée, sans engagement."
          contact="Marcq-en-Barœul · cap-horn-conseils.com"
          primaryImageSrc="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=85&auto=format&fit=crop"
          secondaryImageSrc="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=85&auto=format&fit=crop"
        />
      </div>

      <ChcFooter showCta={false} />

      {/* ─── MODALE détail expertise (visuel + éditorial) ─────── */}
      {open && (
        <div className="chc-modal-backdrop" onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          <div className="chc-modal" onClick={(e) => e.stopPropagation()}>
            <button className="chc-modal__close" onClick={() => setOpen(null)} aria-label="Fermer"><X className="w-4 h-4" /></button>
            <div className="chc-modal__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={open.photo.url} alt={`${open.name}, ${open.tag}`} style={{ objectPosition: open.photo.pos || 'center' }} />
              <div className="chc-modal__media-grad" />
              <div className="chc-modal__media-cap">
                <span className="chc-modal__num">Expertise {open.n}</span>
                <h3 className="chc-modal__title">{open.name}</h3>
                <span className="chc-modal__tag">{open.tag}</span>
              </div>
            </div>
            <div className="chc-modal__content">
              <p className="chc-modal__lead">{open.lead}</p>
              <div className="chc-modal__rule" />
              <p className="chc-modal__body">{open.details}</p>
              <LiquidButton href="/tunnel" tone="light" size="lg" className="chc-modal__cta">Étudier mon projet <ArrowRight className="w-4 h-4" /></LiquidButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
