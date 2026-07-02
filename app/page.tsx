'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, X } from 'lucide-react'
import { Counter } from '@/components/landing/Counter'
import TestimonialsWall from '@/components/landing/TestimonialsWall'
import MethodCarousel from '@/components/landing/MethodCarousel'
import SectionWithMockup from '@/components/landing/SectionWithMockup'
import { ChcNav } from '@/components/landing/ChcNav'
import { ChcFooter } from '@/components/landing/ChcFooter'
import { LiquidButton } from '@/components/ui/LiquidButton'
import { CircularGallery, type GalleryItem } from '@/components/landing/CircularGallery'

type Svc = {
  n: string; name: string; tag: string; desc: string; lead: string; details: string
  photo: { url: string; by: string; pos?: string }
}

const SERVICES: Svc[] = [
  {
    n: '01', name: 'Immobilier', tag: 'Résidentiel & locatif',
    desc: 'Résidence principale, investissement locatif, SCI. Négociation des meilleures conditions auprès de près de cent banques partenaires.',
    lead: 'Acheter, investir, structurer via SCI — chaque dossier étudié individuellement.',
    details: 'Nous comparons les offres de près de cent banques partenaires, négocions les marges, optimisons l’assurance et la garantie. Sur les profils premium, nous obtenons régulièrement des taux 0,20 à 0,40 % en dessous des grilles publiques. Notre rôle ne s’arrête pas à la signature : nous sécurisons aussi les conditions annexes — modulation, transférabilité, indemnités de remboursement anticipé.',
    photo: { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80&auto=format&fit=crop', by: 'Frames For Your Heart' },
  },
  {
    n: '02', name: 'Financement professionnel', tag: 'Entreprises',
    desc: 'Trésorerie, matériel, locaux, croissance externe, transmission, levée de fonds. Une structure de financement sur mesure.',
    lead: 'Tous les financements liés à votre activité, sous un même pilotage.',
    details: 'Besoin en fonds de roulement, acquisition de matériel ou de locaux, croissance externe, transmission, levée de fonds bancaire ou alternative. Notre indépendance nous permet de combiner plusieurs lignes — court terme, moyen terme, leasing, affacturage — pour construire la structure la plus efficiente, y compris quand un seul interlocuteur bancaire ne suffit pas.',
    photo: { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80&auto=format&fit=crop', by: 'Sean Pollock' },
  },
  {
    n: '03', name: 'Assurance emprunteur', tag: 'Loi Lemoine',
    desc: 'Délégation et renégociation. Jusqu’à 50 % d’économie sur la prime, à garanties au moins équivalentes.',
    lead: 'La loi Lemoine vous autorise à changer d’assurance à tout moment, sans frais.',
    details: 'Nous comparons votre contrat actuel à plus de vingt assureurs partenaires et négocions des garanties au moins équivalentes. Sur un prêt de 250 000 € sur 20 ans, nous générons en moyenne 15 000 à 30 000 € d’économie cumulée. L’étude initiale est gratuite, et nous prenons en charge l’intégralité de la procédure de substitution auprès de votre banque.',
    photo: { url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80&auto=format&fit=crop', by: 'Kelly Sikkema' },
  },
  {
    n: '04', name: 'Équilibre financier', tag: 'Restructuration',
    desc: 'Regroupement de crédits et optimisation de la capacité d’emprunt, vers la solution la plus saine — pas la plus longue.',
    lead: 'Réduire la charge mensuelle et restaurer votre capacité d’emprunt.',
    details: 'Nous analysons chaque crédit en cours, simulons plusieurs scénarios — durée, taux, assurances, frais — et orientons vers la solution la plus saine. Pas systématiquement vers la plus longue : notre intérêt est aligné sur le vôtre, pas sur le montant emprunté.',
    photo: { url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80&auto=format&fit=crop', by: 'Markus Spiske' },
  },
  {
    n: '05', name: 'International', tag: 'Non-résidents',
    desc: 'Solutions dédiées aux expatriés et non-résidents. Financement immobilier en France piloté à distance.',
    lead: 'Investir en France depuis l’étranger, sans friction.',
    details: 'Nous travaillons avec un cercle restreint de banques spécialisées dans les profils non-résidents et expatriés, qui acceptent les revenus en devises et les structures patrimoniales transfrontalières. Le cabinet pilote l’intégralité du dossier à distance, en lien avec votre notaire en France ; la signature peut se faire par procuration.',
    photo: { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80&auto=format&fit=crop', by: 'NASA' },
  },
  {
    n: '06', name: 'Situations complexes', tag: 'Dossiers atypiques',
    desc: 'Refus bancaire, profil atypique, antécédents. Reconstruire le dossier et trouver la banque qui dira oui.',
    lead: 'Un refus n’est presque jamais une fatalité.',
    details: 'Profession atypique, CDD, séparation en cours, antécédent FICP, levée de réserves : notre rôle est de reconstruire le dossier, d’identifier les banques susceptibles de l’accepter et de présenter votre situation sous le bon angle. La majorité des dossiers refusés en agence trouvent une issue favorable lorsqu’ils sont repris par un courtier indépendant.',
    photo: { url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80&auto=format&fit=crop', by: 'Cytonn Photography' },
  },
]

const EXPERTISE_ITEMS: GalleryItem[] = SERVICES.map((s) => ({
  common: s.name,
  binomial: s.tag,
  photo: { url: s.photo.url, text: `${s.name} — ${s.tag}`, pos: s.photo.pos, by: s.photo.by },
}))

const METHOD_STEPS = [
  { n: '01', name: 'Qualifiez votre projet', desc: 'Notre outil analyse votre situation en 3 minutes. Aucun document requis à cette étape.', src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80&auto=format&fit=crop' },
  { n: '02', name: 'Échange personnalisé', desc: 'Guillaume vous rappelle sous 24 h pour affiner le dossier et identifier les meilleures pistes.', src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=80&auto=format&fit=crop' },
  { n: '03', name: 'Montage & négociation', desc: 'Nous constituons le dossier et négocions chaque paramètre auprès du bon réseau bancaire.', src: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80&auto=format&fit=crop' },
  { n: '04', name: 'Signature & suivi', desc: 'Nous orchestrons jusqu’à la signature chez le notaire, et sécurisons les conditions annexes.', src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900&q=80&auto=format&fit=crop' },
]

export default function HomePage() {
  const heroImgRef = useRef<HTMLImageElement>(null)
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
    const onScroll = () => {
      if (heroImgRef.current && window.scrollY < window.innerHeight) {
        heroImgRef.current.style.transform = `translateY(${window.scrollY * 0.22}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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

      {/* ─── HERO ────────────────────────────────────────────── */}
      <header className="chc-hero">
        <img
          ref={heroImgRef}
          className="chc-hero__img"
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=88&auto=format&fit=crop"
          alt="Cap Horn Conseils — cabinet de courtage"
        />
        <div className="chc-hero__overlay" />
        <div className="chc-hero__bottom">
          <div>
            <div className="chc-hero__brand r">CAP HORN</div>
            <div className="chc-hero__sub r" data-d="1">Cabinet de courtage indépendant · Marcq-en-Barœul</div>
          </div>
          <div className="chc-hero__stats r" data-d="2">
            <div className="chc-hero__stat">
              <div className="chc-hero__stat-val"><Counter value={500} prefix="+" /></div>
              <div className="chc-hero__stat-label">Dossiers financés</div>
            </div>
            <div className="chc-hero__stat-sep" />
            <div className="chc-hero__stat">
              <div className="chc-hero__stat-val">4,9<span style={{ opacity: 0.5 }}>/5</span></div>
              <div className="chc-hero__stat-label">Note clients</div>
            </div>
          </div>
        </div>
        <span className="chc-hero__cue" aria-hidden />
      </header>

      {/* ─── INTRO ───────────────────────────────────────────── */}
      <section className="chc-section">
        <div className="chc-wrap chc-intro">
          <div className="r">
            <div className="chc-eyebrow">Le cabinet</div>
            <h2 className="chc-intro__title">Lire un projet <em>avant</em><br />de le financer.</h2>
          </div>
          <div className="chc-intro__right r" data-d="1">
            <p>Cap Horn n’est pas un simple intermédiaire. Nous analysons chaque situation en profondeur avant de mobiliser notre réseau bancaire, pour construire le financement le plus juste — pour vous, pas pour une commission.</p>
            <p>Indépendance totale, exigence sur chaque dossier, et un interlocuteur unique du premier appel à la signature.</p>
            <LiquidButton href="/le-cabinet" tone="light" size="sm" uppercase={false} style={{ marginTop: 6 }}>Découvrir le cabinet</LiquidButton>
          </div>
        </div>
      </section>

      {/* ─── SERVICES — galerie circulaire 3D (ouvre la modale) ── */}
      <section id="services" className="chc-exp">
        <span className="chc-exp__glow" aria-hidden />
        <div className="chc-exp__head r">
          <div className="chc-eyebrow chc-eyebrow--light">Nos expertises</div>
          <h2 className="chc-h2">Un interlocuteur unique,<br /><em>pour chaque financement.</em></h2>
          <p className="chc-exp__lead">Six domaines d’intervention, une même exigence : lire le projet avant de le financer. Faites glisser la galerie pour explorer, puis ouvrez le détail.</p>
        </div>

        <div className="chc-exp__stage">
          <CircularGallery items={EXPERTISE_ITEMS} radius={galleryRadius} className="chc-exp__gallery" />
        </div>

        <div className="chc-exp__index r" data-d="1">
          {SERVICES.map((s) => (
            <button key={s.n} type="button" className="chc-exp__card" onClick={() => setOpen(s)} aria-label={`Détails — ${s.name}`}>
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

      {/* ─── MÉTHODE — section sombre ────────────────────────── */}
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

      {/* ─── PREUVE — témoignages clients (colonnes défilantes) ─── */}
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
            <div className="chc-eyebrow">Module exclusif · Loi Lemoine</div>
            <h2 className="chc-h2">Combien pourriez-vous <em>économiser ?</em></h2>
            <p className="chc-lead" style={{ marginTop: 22 }}>Estimez en 30 secondes le potentiel d’économie sur votre assurance emprunteur. Jusqu’à 50 % moins cher que la délégation initiale de votre banque.</p>
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
            <p className="chc-lead">Après plusieurs années au cœur du financement bancaire, Guillaume a fondé Cap Horn pour remettre le conseil au centre du courtage. Sa conviction : un bon financement commence par une lecture juste du projet et de la personne qui le porte.</p>
            <p className="chc-lead" style={{ marginTop: 18 }}>Cette approche, indépendante et exigeante, permet d’obtenir régulièrement des conditions supérieures aux grilles — y compris sur les dossiers jugés atypiques ailleurs.</p>
            <div className="chc-about__sign">— Guillaume Horn, fondateur</div>
          </div>
        </div>
      </section>

      {/* ─── CTA final fusionné (À votre disposition + Prêt à avancer) ── */}
      <div id="contact">
        <SectionWithMockup
          eyebrow="À votre disposition"
          title="Prêt à faire avancer"
          titleEm="votre projet ?"
          description="Notre outil qualifie votre projet en 3 minutes, puis un expert Cap Horn vous rappelle sous 24 h — sans engagement. Indépendance totale et un interlocuteur unique, du premier appel à la signature chez le notaire."
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
              <img src={open.photo.url} alt={`${open.name} — ${open.tag}`} style={{ objectPosition: open.photo.pos || 'center' }} />
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
