'use client'

import { ArrowLeft, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

interface TunnelLayoutProps {
  progress: number
  onBack?: () => void
  showBack: boolean
  stepKey: string
  children: React.ReactNode
}

export default function TunnelLayout({
  progress,
  onBack,
  showBack,
  stepKey,
  children,
}: TunnelLayoutProps) {
  return (
    <div className="chc chc-tunnel">
      {/* Lignes dorées décoratives en fond */}
      <svg className="chc-tunnel__deco chc-tunnel__deco--bl" viewBox="0 0 400 400" aria-hidden preserveAspectRatio="xMinYMax slice">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M -20 ${260 + i * 26} C 80 ${200 + i * 22}, 200 ${360 + i * 20}, 420 ${230 + i * 24}`} fill="none" stroke="#C9A45C" strokeWidth="1" opacity={0.18 - i * 0.02} />
        ))}
      </svg>
      <svg className="chc-tunnel__deco chc-tunnel__deco--tr" viewBox="0 0 400 400" aria-hidden preserveAspectRatio="xMaxYMin slice">
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M ${120 + i * 30} -20 C ${260 + i * 20} 60, ${180 + i * 18} 160, 420 ${120 + i * 26}`} fill="none" stroke="#C9A45C" strokeWidth="1" opacity={0.14 - i * 0.02} />
        ))}
      </svg>

      {/* Header — pilule flottante en verre liquide */}
      <header className="chc-tunnel__header">
        <div className="chc-tunnel__bar">
          <div className="chc-tunnel__headrow">
            {showBack ? (
              <button onClick={onBack} className="chc-tunnel__back" aria-label="Étape précédente">
                <ArrowLeft className="w-3.5 h-3.5" />
                Retour
              </button>
            ) : (
              <Link href="/" className="chc-tunnel__back" aria-label="Retour à l'accueil">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Accueil</span>
              </Link>
            )}

            <Link href="/" className="chc-tunnel__logo">
              <span className="chc-tunnel__mark">CH</span>
              <span className="chc-tunnel__brand">Cap Horn Conseils</span>
            </Link>

            <div className="chc-tunnel__prog">
              <span className="hidden sm:inline">Progression</span>
              <b>{progress}%</b>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="chc-tunnel__track">
            <div className="chc-tunnel__fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="chc-tunnel__main">
        <div key={stepKey} className="chc-tunnel__stage">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="chc-tunnel__footer">
        <ShieldCheck className="w-4 h-4 text-[var(--chc-gold)]" strokeWidth={1.8} />
        <span>Vos informations sont sécurisées et confidentielles<br className="hidden sm:block" /> et ne seront jamais partagées.</span>
      </footer>
    </div>
  )
}
