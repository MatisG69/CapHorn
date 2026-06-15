'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface TunnelLayoutProps {
  progress: number
  onBack?: () => void
  showBack: boolean
  direction: 'forward' | 'back'
  stepKey: string
  children: React.ReactNode
}

export default function TunnelLayout({
  progress,
  onBack,
  showBack,
  direction,
  stepKey,
  children,
}: TunnelLayoutProps) {
  const animClass = direction === 'forward' ? 'animate-enter-right' : 'animate-enter-left'

  return (
    <div className="tunnel-shell min-h-dvh flex flex-col">
      <div className="tunnel-shell__grain" aria-hidden />

      {/* Header */}
      <header className="tunnel-shell__header sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          {showBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)] hover:text-[var(--color-gold-soft)] transition-colors"
              aria-label="Étape précédente"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Retour
            </button>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)] hover:text-[var(--color-gold-soft)] transition-colors"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Accueil</span>
            </Link>
          )}

          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--color-gold-soft)]"
                 style={{ background: 'linear-gradient(150deg, var(--color-ink-raised), var(--color-ink-soft))', border: '1px solid rgba(201,164,92,0.42)', fontFamily: 'var(--font-cormorant)', fontWeight: 800, fontSize: '0.72rem' }}>
              CH
            </div>
            <span className="text-sm font-semibold tracking-wide text-[var(--color-cream)]">
              Cap Horn Conseils
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)] tabular-nums">
            <span>Progression</span>
            <span className="text-[var(--color-gold-soft)] font-semibold">{progress}%</span>
          </div>
          <div className="sm:hidden text-[10px] font-mono text-[var(--color-gold-soft)] tabular-nums">
            {progress}%
          </div>
        </div>

        {/* Progress bar — filet doré */}
        <div className="h-[1px] bg-[var(--color-ink-line)] relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 transition-[width] duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--color-gold-deep), var(--color-gold-soft))',
              boxShadow: '0 0 10px rgba(201, 164, 92, 0.5)',
            }}
          />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-[1]">
        <div key={stepKey} className={`w-full max-w-xl ${animClass}`}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center relative z-[1]">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)]">
          Cap Horn Conseils · Données protégées · RGPD · Sans engagement
        </p>
      </footer>
    </div>
  )
}
