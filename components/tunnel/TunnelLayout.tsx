'use client'

import { ArrowLeft, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { ChcNav } from '@/components/landing/ChcNav'

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
      {/* Sillages décoratifs en fond, aux couleurs du logo */}
      <svg className="chc-tunnel__deco chc-tunnel__deco--bl" viewBox="0 0 400 400" aria-hidden preserveAspectRatio="xMinYMax slice">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M -20 ${260 + i * 26} C 80 ${200 + i * 22}, 200 ${360 + i * 20}, 420 ${230 + i * 24}`} fill="none" stroke="var(--chc-teal)" strokeWidth="1" opacity={0.3 - i * 0.04} />
        ))}
      </svg>
      <svg className="chc-tunnel__deco chc-tunnel__deco--tr" viewBox="0 0 400 400" aria-hidden preserveAspectRatio="xMaxYMin slice">
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M ${120 + i * 30} -20 C ${260 + i * 20} 60, ${180 + i * 18} 160, 420 ${120 + i * 26}`} fill="none" stroke="var(--chc-aqua)" strokeWidth="1" opacity={0.22 - i * 0.04} />
        ))}
      </svg>

      {/* La barre de navigation du site, à l'identique : quitter l'entonnoir
          pour vérifier une information ne doit pas être un cul-de-sac. */}
      <ChcNav />

      {/* Avancement : un filet en haut de fenêtre, qui ne consomme aucune
          hauteur et ne concurrence pas la pilule flottante de la nav. */}
      <div className="chc-tunnel__track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Avancement de l'étude">
        <div className="chc-tunnel__fill" style={{ width: `${progress}%` }} />
      </div>

      <header className="chc-tunnel__header">
        {showBack ? (
          <button onClick={onBack} className="chc-tunnel__back" aria-label="Étape précédente">
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
            Retour
          </button>
        ) : (
          <Link href="/" className="chc-tunnel__back" aria-label="Retour à l'accueil">
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
            Accueil
          </Link>
        )}

        <p className="chc-tunnel__prog">
          Étude <b>{progress}%</b>
        </p>
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
