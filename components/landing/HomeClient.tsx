'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, X, Compass, Gem, Eye } from 'lucide-react'
import { Counter } from '@/components/landing/Counter'
import TestimonialsWall from '@/components/landing/TestimonialsWall'
import MethodCarousel from '@/components/landing/MethodCarousel'
import FinalCta from '@/components/landing/FinalCta'
import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import { LiquidButton } from '@/components/ui/LiquidButton'
import { CircularGallery, type GalleryItem } from '@/components/landing/CircularGallery'
import DossierLens from '@/components/landing/DossierLens'
import BankLogosMarquee from '@/components/landing/BankLogosMarquee'
import { LiquidMetalButton } from '@/components/ui/LiquidMetalButton'
import { SocialRail } from '@/components/landing/SocialRail'
import { SocialDock } from '@/components/landing/SocialDock'

type Svc = {
  n: string; name: string; tag: string; desc: string; lead: string; details: string
  photo: { url: string; by: string; pos?: string }
}

const SERVICES: Svc[] = [
  {
    n: '01', name: 'Immobilier', tag: 'Résidentiel & locatif',
    desc: 'Résidence principale, investissement locatif, SCI. Près de cent banques mises en concurrence sur votre dossier.',
    lead: 'Le taux n’est qu’une ligne du contrat. Nous négocions toutes les autres.',
    details: 'Résidence principale, investissement locatif, acquisition via SCI : nous construisons votre dossier avant de le présenter, puis nous mettons près de cent banques en concurrence. Sur les profils solides, nous obtenons régulièrement 0,20 à 0,40 % sous les grilles affichées, soit plusieurs milliers d’euros sur la durée. Et nous négocions aussi ce que personne ne regarde : assurance, garanties, modulation d’échéances, indemnités de remboursement anticipé.',
    photo: { url: '/Expertises/financement-immobilier-famille-nouvelle-maison-cap-horn-conseils.webp', by: '' },
  },
  {
    n: '02', name: 'Financement professionnel', tag: 'Entreprises',
    desc: 'Trésorerie, matériel, locaux, croissance externe, transmission, levée de fonds. Plusieurs lignes combinées, un seul pilote.',
    lead: 'Tous vos financements professionnels, pilotés par un seul interlocuteur.',
    details: 'Création, développement, matériel, trésorerie, croissance externe ou transmission : nous construisons la structure de financement avant d’aller la défendre. Notre indépendance nous permet de combiner plusieurs lignes (prêt bancaire, crédit-bail, garantie Bpifrance, dette privée) là où une banque seule ne vous proposera jamais que son propre produit.',
    photo: { url: '/Expertises/financement-professionnel-developpement-cabinet-liberal.webp', by: '' },
  },
  {
    n: '03', name: 'Assurance & Prévoyance', tag: 'Emprunteur • Homme clé',
    desc: 'Délégation et renégociation. Jusqu’à 50 % d’économie sur la prime, à garanties au moins équivalentes.',
    lead: 'Le même prêt, la même couverture, jusqu’à 30 000 € de moins.',
    details: 'La loi Lemoine vous autorise à changer d’assurance emprunteur à tout moment, sans frais ni pénalité. C’est un droit ouvert à tous, encore rarement exercé faute d’être accompagné. Nous confrontons votre contrat à plus de vingt assureurs, à garanties au moins équivalentes : sur un prêt de 250 000 € sur 20 ans, l’économie atteint couramment 15 000 à 30 000 €. Courriers, délais, formalisme auprès de votre banque : nous prenons tout en charge, vous n’avez rien à rédiger.',
    photo: { url: '/Expertises/assurance-emprunteur-protection-famille-cap-horn-conseils.webp', by: '' },
  },
  {
    n: '04', name: 'Regroupement de crédits', tag: 'Rééquilibrer votre budget',
    desc: 'Regroupement de crédits et reconstruction de la capacité d’emprunt. La solution la plus saine, pas la plus longue.',
    lead: 'Respirer à nouveau, sans hypothéquer les vingt prochaines années.',
    details: 'Quand les mensualités pèsent trop, ou avant de relancer un projet immobilier, le regroupement de crédits allège la charge et restaure votre capacité d’emprunt. Nous chiffrons plusieurs scénarios (durée, mensualité, taux, assurance, frais) et nous vous montrons le coût total de chacun, pas seulement la mensualité. Allonger la durée est toujours la solution la plus facile à vendre ; ce n’est presque jamais la meilleure pour vous.',
    photo: { url: '/Expertises/regroupement-credits-liberte-financiere.webp', by: '' },
  },
  {
    n: '05', name: 'Expatriés & Non-résidents', tag: 'France & International',
    desc: 'Solutions dédiées aux expatriés et non-résidents. Un dossier piloté à distance, jusqu’à la signature.',
    lead: 'Vivre ailleurs ne doit pas vous fermer l’immobilier français.',
    details: 'Revenus en devises, fiscalité étrangère, absence de domiciliation en France : la plupart des banques referment le dossier avant même de l’ouvrir. Nous travaillons avec le cercle restreint d’établissements qui financent réellement les non-résidents. Votre dossier est piloté à distance, en coordination avec votre notaire, jusqu’à la signature, qui peut être organisée par procuration sans que vous ayez à prendre l’avion.',
    photo: { url: '/Expertises/financement-expatries-achat-immobilier-hauts-de-france.webp', by: '' },
  },
  {
    n: '06', name: 'Votre banque a refusé ?', tag: 'Une seconde analyse',
    desc: 'Refus bancaire, profil atypique, antécédents. Reconstruire le dossier et trouver la banque qui dira oui.',
    lead: 'Un refus, c’est le plus souvent un dossier mal raconté.',
    details: 'CDD, profession atypique, séparation en cours, antécédent FICP, entrepreneur avec moins de trois bilans, levée de réserves : une banque qui dit non juge un dossier, pas un projet. Nous reprenons le vôtre depuis la première ligne, identifions les établissements dont les critères correspondent réellement à votre situation, et le présentons sous l’angle qui le rend finançable. Avant toute nouvelle démarche, jamais après.',
    photo: { url: '/Expertises/reetude-dossier-financement.webp', by: '' },
  },
]

const CABINET_PILLARS = [
  { Icon: Compass, name: 'Indépendance', desc: 'Aucune exclusivité, aucun accord de volume. Nous recommandons la banque qui vous sert, pas celle qui nous paie le mieux.' },
  { Icon: Gem, name: 'Exigence', desc: 'Taux, assurance, garanties, indemnités de remboursement : chaque ligne est négociée, pas seulement celle que vous regardez.' },
  { Icon: Eye, name: 'Transparence', desc: 'Nos honoraires sont chiffrés dès le premier échange, et dus uniquement le jour où votre financement est obtenu.' },
]

const EXPERTISE_ITEMS: GalleryItem[] = SERVICES.map((s) => ({
  common: s.name,
  binomial: s.tag,
  photo: { url: s.photo.url, text: `${s.name}, ${s.tag}`, pos: s.photo.pos, by: s.photo.by },
}))

const METHOD_STEPS = [
  { n: '01', name: 'Qualifiez votre projet', desc: 'Trois minutes, quelques questions, aucun document à fournir. Vous repartez avec un premier avis de faisabilité.', src: '/methode/qualification-projet-financement.webp' },
  { n: '02', name: 'Échange personnalisé', desc: 'Un expert vous rappelle sous 24 h ouvrées. On creuse votre situation réelle, et la stratégie se décide ensemble.', src: '/methode/echange-conseiller-financement.webp' },
  { n: '03', name: 'Montage & négociation', desc: 'Nous montons le dossier à votre place et le défendons auprès des banques dont les critères collent à votre profil. Taux, assurance, garanties : tout se négocie.', src: '/methode/montage-dossier-negociation-bancaire.webp' },
  { n: '04', name: 'Signature & suivi', desc: 'Nous suivons chaque échéance jusqu’à la signature et au déblocage des fonds. Nos honoraires ne sont dus qu’à ce moment-là.', src: '/methode/signature-financement-accompagnement.webp' },
]

export default function HomeClient() {
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

      {/* Rail vertical : prend le relais une fois le héros dépassé. */}
      <SocialRail />


      {/* ─── HERO, split éditorial « le cap » ─────────────────── */}
      <header className="chc-h">
        <span className="chc-h__glow" aria-hidden />
        <div className="chc-h__inner">
          {/* Colonne texte */}
          <div className="chc-h__text">
            <p className="chc-h__eyebrow chc-h-in" data-d="1">
              Courtage indépendant ·{' '}
              {/* insécable : sinon « Hauts-de-France » se coupait au trait d'union. */}
              <span style={{ whiteSpace: 'nowrap' }}>Lille &amp; Hauts-de-France</span>
            </p>
            <h1 className="chc-h__title">
              <span className="chc-h__title-line chc-h-in" data-d="2">Nous tenons le</span>
              <span className="chc-h__title-line chc-h-in" data-d="3">cap de votre</span>
              <span className="chc-h__title-line chc-h-in" data-d="4"><em>financement.</em></span>
            </h1>
            <p className="chc-h__lead chc-h-in" data-d="5">
              Immobilier, financement professionnel, assurance emprunteur. Nous construisons votre
              dossier avant de le présenter, puis nous mettons près de cent banques en concurrence.
              Vous ne payez rien tant que le financement n’est pas obtenu.
            </p>
            <div className="chc-h__actions chc-h-in" data-d="6">
              {/* Action principale : bouton « liquid metal » (shader WebGL). */}
              <LiquidMetalButton label="Qualifier mon projet" href="/tunnel" />
              <Link href="/methode" className="chc-h__textlink">
                Découvrir la méthode <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
            <p className="chc-h__reassure chc-h-in" data-d="6">
              3 minutes<span aria-hidden>·</span>aucun document<span aria-hidden>·</span>sans engagement<span aria-hidden>·</span>honoraires au résultat
            </p>
          </div>

          {/* Colonne média, loupe interactive sur les pièces d'un dossier */}
          <div className="chc-h__media chc-h-media-in">
            <DossierLens />
            {/* Réseaux, sous la carte : dans le flux, donc sans risque de
                recouvrir les chiffres du bas de page. */}
            <div className="chc-social">
              <SocialDock />
            </div>
          </div>

          {/* Les chiffres clés sortent de la colonne de texte pour occuper toute
              la largeur : c'est la preuve du cabinet, elle mérite la pleine
              mesure plutôt qu'un tiers de grille. */}
          <div className="chc-h__stats chc-h-in" data-d="7">
            <div className="chc-h__stat">
              <span className="chc-h__stat-val"><Counter value={500} prefix="+" /></span>
              <span className="chc-h__stat-lbl">Dossiers financés</span>
            </div>
            <div className="chc-h__stat">
              <span className="chc-h__stat-val"><Counter value={100} prefix="+" /></span>
              <span className="chc-h__stat-lbl">Banques &amp; assureurs</span>
            </div>
            <div className="chc-h__stat">
              <span className="chc-h__stat-val">4,9<i>/5</i></span>
              <span className="chc-h__stat-lbl">Note clients</span>
            </div>
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
                Un courtier compare des taux. CAP HORN CONSEILS® commence par comprendre ce que vous
                construisez. Car un même projet, selon la façon dont il est monté et présenté, peut
                se jouer à plusieurs dizaines de milliers d’euros.
              </p>
              <p className="chc-cabintro__p">
                Un seul interlocuteur, du premier appel jusqu’à la signature chez le notaire.
              </p>
              <LiquidButton href="/le-cabinet" tone="dark" size="sm" uppercase={false}>
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
          <p className="chc-exp__lead">Six expertises, une seule méthode : comprendre le projet avant d’aller chercher l’argent, puis négocier chaque ligne du contrat, pas seulement le taux.</p>
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
        <img className="chc-dark__bg" src="/methode/ciel-nuit-financement-cap-horn-conseils.webp" alt="" aria-hidden loading="lazy" decoding="async" />
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
            <p className="chc-lead" style={{ marginTop: 22 }}>Trente secondes suffisent pour voir ce que votre assurance actuelle vous coûte de trop. À garanties strictement identiques à celles exigées par votre banque, et sans un euro de frais de résiliation : la loi Lemoine vous en donne le droit.</p>
            <LiquidButton href="/simulateur" tone="dark" size="lg" style={{ marginTop: 28 }}>Lancer la simulation <ArrowRight className="w-4 h-4" /></LiquidButton>
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
            <p className="chc-lead">Guillaume Horn a passé plusieurs années de l’autre côté du bureau, à instruire et financer des dossiers en banque. Il sait donc précisément ce qui fait dire oui, et ce qui fait dire non. Il a fondé CAP HORN CONSEILS® pour mettre cette lecture au service des emprunteurs plutôt que des prêteurs.</p>
            <p className="chc-lead" style={{ marginTop: 18 }}>Aucune exclusivité, aucun accord de volume avec une banque. La recommandation qu’il vous fait est celle qu’il ferait pour lui-même.</p>
            <div className="chc-about__sign">Guillaume Horn, fondateur</div>
          </div>
        </div>
      </section>

      {/* ─── CTA final fusionné (À votre disposition + Prêt à avancer) ── */}
      <div id="contact">
        <FinalCta />
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
              <LiquidButton href="/tunnel" tone="dark" size="lg" className="chc-modal__cta">Étudier mon projet <ArrowRight className="w-4 h-4" /></LiquidButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
