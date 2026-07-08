/**
 * Rose des vents gravée, signature graphique Cap Horn.
 * Trait fin, sans remplissage : sert de filigrane discret (opacité gérée
 * en CSS via la couleur/opacité du conteneur). Composant pur (server-safe).
 */
export function CompassRose({ className }: { className?: string }) {
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5)
  const diag = [45, 135, 225, 315]
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" stroke="currentColor" aria-hidden focusable="false">
      <circle cx="100" cy="100" r="96" strokeWidth="0.75" />
      <circle cx="100" cy="100" r="73" strokeWidth="0.6" />
      <circle cx="100" cy="100" r="30" strokeWidth="0.6" />
      {ticks.map((deg) => {
        const major = deg % 45 === 0
        const mid = deg % 15 === 0
        const a = ((deg - 90) * Math.PI) / 180
        const outer = 73
        const inner = major ? 58 : mid ? 65 : 69
        return (
          <line
            key={deg}
            x1={(100 + outer * Math.cos(a)).toFixed(2)} y1={(100 + outer * Math.sin(a)).toFixed(2)}
            x2={(100 + inner * Math.cos(a)).toFixed(2)} y2={(100 + inner * Math.sin(a)).toFixed(2)}
            strokeWidth={major ? 1 : 0.5}
          />
        )
      })}
      {diag.map((deg) => {
        const a = ((deg - 90) * Math.PI) / 180
        return (
          <line key={deg} x1="100" y1="100" x2={(100 + 73 * Math.cos(a)).toFixed(2)} y2={(100 + 73 * Math.sin(a)).toFixed(2)} strokeWidth="0.5" />
        )
      })}
      {/* étoile à quatre branches */}
      <polygon points="100,18 107,100 100,182 93,100" fill="currentColor" fillOpacity="0.22" stroke="none" />
      <polygon points="18,100 100,93 182,100 100,107" fill="currentColor" fillOpacity="0.14" stroke="none" />
      <polygon points="100,18 106,100 94,100" fill="currentColor" fillOpacity="0.5" stroke="none" />
    </svg>
  )
}
