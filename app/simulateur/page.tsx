import Link from 'next/link'
import { ArrowLeft, Anchor, ShieldCheck, Clock, Award } from 'lucide-react'
import { AssuranceCalculator } from '@/components/simulateur/AssuranceCalculator'

export const metadata = {
  title: 'Simulateur d\'économies — Assurance emprunteur · Cap Horn Conseils',
  description:
    "Estimez en 30 secondes vos économies sur l'assurance emprunteur. Loi Lemoine — résiliation possible à tout moment.",
}

const ARGUMENTS = [
  {
    Icon: ShieldCheck,
    title: 'Loi Lemoine',
    body: 'Depuis septembre 2022, vous pouvez résilier votre assurance emprunteur à tout moment, sans frais ni pénalité.',
  },
  {
    Icon: Clock,
    title: 'Étude en 24 h',
    body: 'Votre dossier est analysé par un expert. Vous recevez votre proposition complète sous 24 heures ouvrées.',
  },
  {
    Icon: Award,
    title: 'Garanties équivalentes',
    body: 'Nos contrats respectent les garanties exigées par votre banque. Aucune dégradation de couverture.',
  },
]

export default function SimulateurPage() {
  return (
    <div className="landing-root min-h-dvh">
      {/* ── Nav minimaliste ─────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[var(--color-ink)]/92 backdrop-blur-md border-b border-[var(--color-ink-line)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)] hover:text-[var(--color-gold-soft)] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Accueil
          </Link>

          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                 style={{ background: 'linear-gradient(180deg, var(--color-gold-soft), var(--color-gold))' }}>
              <Anchor className="w-3.5 h-3.5 text-[var(--color-ink)]" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-[var(--color-cream)]">
              Cap Horn Conseils
            </span>
          </Link>

          <div className="w-20" />
        </div>
      </nav>

      {/* ── En-tête ─────────────────────────────────────────── */}
      <section className="pt-20 pb-12 lg:pt-28 lg:pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="eyebrow eyebrow--single mb-7">Module exclusif · Loi Lemoine</p>
          <h1
            className="display-serif text-[var(--color-cream)] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            Combien pourriez-vous
            <br />
            <span className="display-serif-italic text-[var(--color-gold-soft)]">économiser ?</span>
          </h1>
          <p className="text-[var(--color-cream-dim)] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Estimez en 30 secondes le potentiel d&apos;économie sur votre assurance emprunteur.
            Jusqu&apos;à 50 % moins cher que la délégation initiale de votre banque.
          </p>
        </div>
      </section>

      {/* ── Calculateur ────────────────────────────────────── */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <AssuranceCalculator />
        </div>
      </section>

      {/* ── Trois arguments ────────────────────────────────── */}
      <section className="py-24 lg:py-32 border-t border-[var(--color-ink-line)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="eyebrow eyebrow--single mb-5">Pourquoi changer ?</p>
            <h2
              className="display-serif text-[var(--color-cream)]"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
            >
              Trois raisons d&apos;agir maintenant.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {ARGUMENTS.map(({ Icon, title, body }) => (
              <div key={title} className="gold-card">
                <Icon className="w-6 h-6 text-[var(--color-gold)] mb-5" />
                <h3 className="display-serif text-xl text-[var(--color-cream)] mb-3">{title}</h3>
                <p className="text-[var(--color-cream-dim)] text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="py-10 border-t border-[var(--color-ink-line)] bg-[var(--color-ink-soft)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Anchor className="w-4 h-4 text-[var(--color-gold)]" />
            <span className="text-sm text-[var(--color-cream-mute)] font-mono uppercase tracking-[0.18em]">
              Cap Horn Conseils · Courtage & Financement
            </span>
          </div>
          <span className="text-[10px] text-[var(--color-cream-mute)] font-mono uppercase tracking-[0.22em]">
            Marcq-en-Barœul
          </span>
        </div>
      </footer>
    </div>
  )
}
