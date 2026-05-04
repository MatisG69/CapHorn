'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Anchor } from 'lucide-react'
import { HeroVideoScroll } from '@/components/landing/HeroVideoScroll'
import { BankMarquee } from '@/components/landing/BankMarquee'
import { PartnersMarquee } from '@/components/landing/PartnersMarquee'
import { ServiceModal, type Service } from '@/components/landing/ServiceModal'
import { ServiceRow } from '@/components/landing/ServiceRow'

const SERVICES: Service[] = [
  {
    number: '01',
    title: 'Immobilier',
    description: 'Résidence principale, investissement locatif, SCI. Négociation des meilleures conditions auprès de nos partenaires bancaires.',
    details: 'Que vous achetiez votre résidence principale, financiez un investissement locatif ou structuriez une acquisition via SCI, nous étudions chaque dossier individuellement. Nous comparons les offres de plus de quinze banques partenaires, négocions les marges, optimisons l’assurance et la garantie. Sur les profils premium, nous obtenons régulièrement des taux 0,20 à 0,40 % en dessous des grilles publiques. Notre rôle ne s’arrête pas à la signature : nous sécurisons aussi les conditions annexes (modulation, transférabilité, indemnités de remboursement anticipé).',
  },
  {
    number: '02',
    title: 'Financement professionnel',
    description: 'Trésorerie, matériel, véhicule, reprise, création, développement, levée de fonds.',
    details: 'Nous accompagnons les chefs d’entreprise dans tous les financements liés à leur activité : besoin en fonds de roulement, acquisition de matériel ou de locaux, opération de croissance externe, transmission, levée de fonds bancaire ou alternative. Notre indépendance nous permet de combiner plusieurs lignes (court terme, moyen terme, leasing, affacturage) pour construire la structure la plus efficiente — y compris quand un seul interlocuteur bancaire ne suffit pas.',
  },
  {
    number: '03',
    title: 'Assurance emprunteur',
    description: 'Délégation d’assurance, renégociation. Jusqu’à 50 % d’économies sur votre prime annuelle.',
    details: 'La loi Lemoine vous autorise à changer d’assurance emprunteur à tout moment, sans frais ni pénalité. Nous comparons votre contrat actuel à plus de vingt assureurs partenaires et négocions des garanties au moins équivalentes. Sur un prêt de 250 000 € sur 20 ans, nous générons en moyenne 15 000 à 30 000 € d’économie cumulée sur la durée totale. L’étude initiale est gratuite, et nous prenons en charge la totalité de la procédure de substitution auprès de votre banque.',
  },
  {
    number: '04',
    title: 'Équilibre financier',
    description: 'Restructuration de dettes, regroupement de crédits, optimisation de votre capacité d’emprunt.',
    details: 'Lorsque les mensualités pèsent trop, ou avant un nouveau projet immobilier, le regroupement de crédits permet de réduire la charge mensuelle, restaurer la capacité d’emprunt et reprendre la main sur le budget. Nous analysons chaque crédit en cours, simulons plusieurs scénarios — durée, taux, assurances, frais — et orientons vers la solution la plus saine. Pas systématiquement vers la plus longue : notre intérêt est aligné sur le vôtre, pas sur le montant emprunté.',
  },
  {
    number: '05',
    title: 'International',
    description: 'Solutions dédiées aux expatriés et non-résidents. Financement immobilier en France depuis l’étranger.',
    details: 'Vivre à l’étranger ne doit pas vous priver d’investir en France. Nous travaillons avec un cercle restreint de banques spécialisées dans les profils non-résidents et expatriés, qui acceptent les revenus en devises, les contrats de travail internationaux et les structures patrimoniales transfrontalières. Notre cabinet pilote l’intégralité du dossier à distance, en lien avec votre notaire en France et votre conseiller patrimonial local. La signature peut se faire à distance par procuration.',
  },
  {
    number: '06',
    title: 'Situations complexes',
    description: 'Refus bancaire, dossiers atypiques. Notre indépendance nous permet de trouver des solutions là où d’autres échouent.',
    details: 'Refus bancaire, profession atypique, contrat en CDD, séparation en cours, antécédent FICP, levée de réserves : un refus n’est presque jamais une fatalité. Notre rôle est de reconstruire le dossier, identifier les banques susceptibles de l’accepter et présenter votre situation sous le bon angle, avec les bons éléments de preuve. La majorité des dossiers refusés en agence trouvent une issue favorable lorsqu’ils sont repris par un courtier indépendant qui connaît les politiques de risque réelles de chaque établissement.',
  },
]

const STEPS = [
  {
    number: '01',
    title: 'Qualifiez votre projet',
    description: 'Notre outil analyse votre situation en 3 minutes. Aucun document requis à cette étape.',
  },
  {
    number: '02',
    title: 'Échange personnalisé',
    description: 'Guillaume vous rappelle sous 24h pour affiner votre dossier et identifier les meilleures pistes.',
  },
  {
    number: '03',
    title: 'Montage & négociation',
    description: 'Nous constituons votre dossier et négocions pour vous les meilleures conditions de financement.',
  },
]

export default function HomePage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed')
          e.target.classList.add('is-visible')
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    )
    document.querySelectorAll('[data-reveal], [data-reveal-v2]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="landing-root min-h-dvh">

      {/* ─── Hero scroll-driven video (entrée.mp4 pilotée par scroll) ──── */}
      <HeroVideoScroll />

      {/* ─── Trust strip : carousel premium des banques partenaires ───── */}
      <BankMarquee />

      {/* ─── Services — liste éditoriale, chaque ligne ouvre une fiche ── */}
      <section className="py-32 lg:py-44">
        <div className="max-w-7xl mx-auto px-6">
          <div data-reveal className="mb-16 lg:mb-24 max-w-3xl mx-auto text-center">
            <p className="eyebrow eyebrow--single mb-6">Expertise</p>
            <h2
              className="display-serif text-[var(--color-cream)]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5.25rem)' }}
            >
              Nos domaines
              <br />
              <span className="display-serif-italic text-[var(--color-gold-soft)]">d&apos;intervention.</span>
            </h2>
          </div>

          <div className="border-t border-[var(--color-ink-line)]">
            {SERVICES.map((service, i) => (
              <ServiceRow
                key={service.number}
                service={service}
                delay={String(Math.min((i % 3) + 1, 4))}
                onClick={() => setSelectedService(service)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Simulateur teaser — module mis en avant ───────────── */}
      <section className="relative py-28 lg:py-36 border-y border-[var(--color-ink-line)]">
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <div
            className="absolute"
            style={{
              top: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '900px',
              height: '500px',
              background:
                'radial-gradient(ellipse, rgba(201, 168, 76, 0.10) 0%, transparent 70%)',
            }}
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <p data-reveal className="eyebrow eyebrow--single mb-7">Module exclusif</p>
          <h2
            data-reveal
            data-delay="1"
            className="display-serif text-[var(--color-cream)] mb-7"
            style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4.25rem)' }}
          >
            Simulez vos économies
            <br />
            <span className="display-serif-italic text-[var(--color-gold-soft)]">d&apos;assurance emprunteur.</span>
          </h2>
          <p
            data-reveal
            data-delay="2"
            className="text-[var(--color-cream-dim)] text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10"
          >
            Évaluez en 30 secondes le potentiel d&apos;économie sur votre prime annuelle. Jusqu&apos;à 50 % moins
            cher que la délégation initiale de votre banque.
          </p>
          <Link href="/simulateur" data-reveal data-delay="3" className="btn-gold">
            Lancer la simulation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ─── Processus — En 3 étapes ─────────────────────────── */}
      <section className="py-32 lg:py-44">
        <div className="max-w-7xl mx-auto px-6">
          <div data-reveal className="mb-16 lg:mb-24 max-w-3xl mx-auto text-center">
            <p className="eyebrow eyebrow--single mb-6">Méthode</p>
            <h2
              className="display-serif text-[var(--color-cream)]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5.25rem)' }}
            >
              En trois étapes,
              <br />
              <span className="display-serif-italic text-[var(--color-gold-soft)]">votre projet avance.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {STEPS.map(({ number, title, description }, i) => (
              <div
                key={number}
                data-reveal
                data-delay={String(i + 1)}
                className="gold-card"
              >
                <div className="display-serif text-6xl text-[var(--color-gold-deep)] leading-none mb-8 select-none">
                  {number}
                </div>
                <h3 className="display-serif text-2xl text-[var(--color-cream)] mb-3">{title}</h3>
                <p className="text-[var(--color-cream-dim)] leading-relaxed text-sm">{description}</p>
              </div>
            ))}
          </div>

          <div data-reveal className="mt-16 text-center">
            <Link href="/tunnel" className="btn-gold">
              Démarrer maintenant — c&apos;est gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Philosophie + carousel partenaires ──────────────── */}
      <section className="relative py-32 lg:py-44 border-y border-[var(--color-ink-line)] overflow-hidden">
        <div
          className="absolute pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '1200px',
            height: '600px',
            background: 'radial-gradient(ellipse, rgba(201, 168, 76, 0.08) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6">
          <div data-reveal className="space-y-10 text-center">
            <p className="eyebrow eyebrow--single">Notre approche</p>
            <blockquote
              className="display-serif-italic text-[var(--color-cream)] leading-[1.05]"
              style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4.25rem)' }}
            >
              « Lire un projet
              <br />
              avant de le financer. »
            </blockquote>
            <p className="text-[var(--color-cream-dim)] leading-relaxed max-w-2xl mx-auto text-base sm:text-lg">
              Chez Cap Horn Conseils, nous ne sommes pas de simples intermédiaires. Nous analysons
              en profondeur chaque situation avant de mobiliser notre réseau. L&apos;indépendance,
              c&apos;est la liberté de choisir la meilleure solution pour vous — pas pour notre commission.
            </p>
          </div>
        </div>
        <div data-reveal className="relative mt-16">
          <PartnersMarquee />
        </div>
      </section>

      {/* ─── CTA final ───────────────────────────────────────── */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-100px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '500px',
            background: 'radial-gradient(ellipse, rgba(201, 168, 76, 0.14) 0%, transparent 70%)',
          }}
        />
        <div data-reveal className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
          <p className="eyebrow eyebrow--single">À votre disposition</p>
          <h2
            className="display-serif text-[var(--color-cream)] leading-[0.95]"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            Votre projet mérite
            <br />
            <span className="display-serif-italic text-[var(--color-gold-soft)]">la meilleure solution.</span>
          </h2>
          <p className="text-[var(--color-cream-dim)] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Notre outil qualifie votre projet en 3 minutes. Un expert vous rappelle sous 24 h.
          </p>
          <div className="pt-4">
            <Link href="/tunnel" className="btn-gold">
              Démarrer mon étude gratuite
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────── */}
      <footer className="py-10 border-t border-[var(--color-ink-line)] bg-[var(--color-ink-soft)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Anchor className="w-4 h-4 text-[var(--color-gold)]" />
            <span className="text-sm text-[var(--color-cream-mute)] font-mono uppercase tracking-[0.18em]">
              Cap Horn Conseils · Courtage & Financement
            </span>
          </div>
          <div className="flex gap-6 text-[10px] text-[var(--color-cream-mute)] font-mono uppercase tracking-[0.22em]">
            <a
              href="https://cap-horn-conseils.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-gold-soft)] transition-colors"
            >
              cap-horn-conseils.com
            </a>
            <span>Marcq-en-Barœul</span>
          </div>
        </div>
      </footer>

      <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
    </div>
  )
}
