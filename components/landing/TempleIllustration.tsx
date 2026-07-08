/**
 * Élévation architecturale Cap Horn, façade principale style temple
 * néo-classique. Trait or, dessin technique sur fond noir, cotations à
 * la marge, échelle bas-droite. Pure SVG, accessible et résolution-libre.
 *
 * Volonté plastique : asseoir la métaphore « architecte de la finance »
 * affichée par le titre. Lecture du dessin = blueprint d'un cabinet de
 * conseil. Niveau de détail dosé pour rester lisible à 50 % de hauteur.
 */
export function TempleIllustration({ className }: { className?: string }) {
  // Stroke gold + ink fond, encre d'or sur papier vergé sombre.
  const gold = '#C9A84C'
  const goldSoft = '#E2C97E'
  const goldDeep = '#8A6F2A'

  return (
    <svg
      viewBox="0 0 800 940"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Élévation architecturale du cabinet Cap Horn Conseils"
    >
      <defs>
        <linearGradient id="th-pediment" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={goldSoft} stopOpacity="0.9" />
          <stop offset="100%" stopColor={gold} stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* ── Cotations marges à droite ──────────────────────────────── */}
      <g stroke={gold} strokeWidth="0.6" fill="none" opacity="0.55">
        {/* Ligne d'élévation droite */}
        <line x1="720" y1="200" x2="720" y2="60" />
        <line x1="715" y1="200" x2="725" y2="200" />
        <line x1="715" y1="60" x2="725" y2="60" />
        <line x1="720" y1="650" x2="720" y2="510" />
        <line x1="715" y1="650" x2="725" y2="650" />
        <line x1="715" y1="510" x2="725" y2="510" />
      </g>
      <g
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="11"
        letterSpacing="0.18em"
        fill={goldSoft}
        opacity="0.85"
      >
        <text x="735" y="135" textAnchor="start">— ÉLÉVATION · N° XI</text>
        <text x="735" y="152" textAnchor="start" opacity="0.75">FAÇADE PRINCIPALE</text>
        <text x="735" y="588" textAnchor="start">— PORTE · 11</text>
      </g>

      {/* ── Acrotère + fronton ─────────────────────────────────────── */}
      <g stroke={gold} strokeWidth="1.1" fill="none" strokeLinejoin="round">
        {/* Akroterion central minimal (croix architecturale) */}
        <circle cx="400" cy="74" r="3.5" fill={goldSoft} stroke="none" />
        <line x1="400" y1="60" x2="400" y2="92" />
        <line x1="392" y1="84" x2="408" y2="84" />

        {/* Fronton triangulaire */}
        <path d="M 200 200 L 400 92 L 600 200 Z" />
        {/* Corniche du fronton (filet inférieur) */}
        <line x1="195" y1="200" x2="605" y2="200" strokeWidth="1.5" />
        {/* Tympan : ancre Cap Horn */}
        <g transform="translate(400 158)" stroke={goldSoft} strokeWidth="0.9">
          <circle cx="0" cy="-10" r="4" fill="none" />
          <line x1="0" y1="-6" x2="0" y2="20" />
          <path d="M -14 14 Q -14 24 0 24 Q 14 24 14 14" />
          <line x1="-7" y1="0" x2="7" y2="0" />
        </g>
      </g>

      {/* ── Architrave + frise (CAP HORN CONSEILS) ─────────────────── */}
      <g stroke={gold} strokeWidth="1" fill="none">
        <line x1="180" y1="208" x2="620" y2="208" />
        <line x1="180" y1="218" x2="620" y2="218" />
        {/* Frise, lettrage central */}
        <rect x="180" y="218" width="440" height="44" />
        <line x1="180" y1="262" x2="620" y2="262" />
      </g>
      <text
        x="400"
        y="247"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="14"
        letterSpacing="0.4em"
        fill={goldSoft}
      >
        CAP HORN CONSEILS
      </text>

      {/* ── Triglyphes / mutules (au-dessus de la frise) ───────────── */}
      <g stroke={gold} strokeWidth="0.7" fill="none" opacity="0.8">
        {Array.from({ length: 13 }).map((_, i) => {
          const x = 188 + i * 33
          return (
            <g key={`tri-${i}`}>
              <line x1={x + 6} y1="262" x2={x + 6} y2="282" />
              <line x1={x + 16} y1="262" x2={x + 16} y2="282" />
            </g>
          )
        })}
      </g>
      <line x1="180" y1="282" x2="620" y2="282" stroke={gold} strokeWidth="1" />

      {/* ── Loggia : fenêtre haute en losanges ─────────────────────── */}
      <g stroke={gold} strokeWidth="0.7" fill="none" opacity="0.85">
        <rect x="320" y="296" width="160" height="68" />
        {/* Maillage diamants */}
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 9 }).map((_, col) => {
            const cx = 332 + col * 18
            const cy = 308 + row * 12
            return (
              <path
                key={`dm-${row}-${col}`}
                d={`M ${cx} ${cy - 6} L ${cx + 9} ${cy} L ${cx} ${cy + 6} L ${cx - 9} ${cy} Z`}
                strokeWidth="0.45"
              />
            )
          })
        )}
      </g>

      {/* ── Bandeau « 11 » sous la loggia ───────────────────────────── */}
      <g stroke={gold} strokeWidth="0.9" fill="none">
        <rect x="280" y="380" width="240" height="28" />
        <circle cx="298" cy="394" r="3" fill={gold} stroke="none" />
        <circle cx="502" cy="394" r="3" fill={gold} stroke="none" />
      </g>
      <text
        x="400"
        y="402"
        textAnchor="middle"
        fontFamily="ui-sans-serif, serif"
        fontSize="16"
        letterSpacing="0.3em"
        fill={goldSoft}
      >
        11
      </text>

      {/* ── Colonnes (6 colonnes corinthiennes simplifiées) ────────── */}
      <g stroke={gold} strokeWidth="1" fill="none" strokeLinecap="round">
        {[210, 286, 362, 438, 514, 590].map((x, i) => {
          const w = 24
          return (
            <g key={`col-${i}`}>
              {/* Chapiteau */}
              <rect x={x - w / 2 - 4} y="200" width={w + 8} height="8" />
              <rect x={x - w / 2 - 2} y="208" width={w + 4} height="6" />
              {/* Fût avec cannelures */}
              <rect x={x - w / 2} y="214" width={w} height="406" />
              {[-7, 0, 7].map((dx) => (
                <line
                  key={`fl-${i}-${dx}`}
                  x1={x + dx}
                  y1="218"
                  x2={x + dx}
                  y2="616"
                  strokeWidth="0.5"
                  opacity="0.7"
                />
              ))}
              {/* Base */}
              <rect x={x - w / 2 - 6} y="620" width={w + 12} height="10" />
            </g>
          )
        })}
      </g>

      {/* ── Embrasure de porte (entre les 2 colonnes centrales) ─────── */}
      <g stroke={gold} strokeWidth="1.1" fill="none">
        {/* Cadre extérieur de la porte */}
        <rect x="350" y="430" width="100" height="190" />
        {/* Vantaux */}
        <line x1="400" y1="430" x2="400" y2="620" strokeWidth="0.8" />
        <line x1="375" y1="525" x2="375" y2="595" strokeWidth="0.5" />
        <line x1="425" y1="525" x2="425" y2="595" strokeWidth="0.5" />
        {/* Imposte horizontale */}
        <line x1="350" y1="455" x2="450" y2="455" />
        {/* Poignées discrètes */}
        <circle cx="395" cy="540" r="1.5" fill={goldSoft} stroke="none" />
        <circle cx="405" cy="540" r="1.5" fill={goldSoft} stroke="none" />
      </g>

      {/* ── Stylobate + emmarchements ──────────────────────────────── */}
      <g stroke={gold} strokeWidth="1" fill="none">
        <line x1="170" y1="630" x2="630" y2="630" />
        <line x1="160" y1="640" x2="640" y2="640" />
        <line x1="150" y1="650" x2="650" y2="650" />
      </g>

      {/* ── Échelle + mention typo « encre d'or · papier vergé » ─────── */}
      <g
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="10"
        letterSpacing="0.18em"
        fill={goldSoft}
        opacity="0.7"
      >
        <text x="510" y="685">ÉCHELLE 1:50</text>
        <text x="510" y="700" opacity="0.7">ENCRE D&apos;OR · PAPIER VERGÉ</text>
      </g>
      <g stroke={gold} strokeWidth="0.8" fill="none">
        <line x1="510" y1="720" x2="660" y2="720" />
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={`tick-${i}`}
            x1={510 + i * 30}
            y1="715"
            x2={510 + i * 30}
            y2="725"
          />
        ))}
      </g>
      <g
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="9"
        letterSpacing="0.1em"
        fill={goldSoft}
        opacity="0.7"
      >
        <text x="506" y="740">0</text>
        <text x="654" y="740">5 m</text>
      </g>

      {/* ── Trame discrète façon papier millimétré (très basse opacité) ─── */}
      <g stroke={gold} strokeWidth="0.4" opacity="0.07">
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`gh-${i}`} x1="0" y1={80 + i * 80} x2="800" y2={80 + i * 80} />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`gv-${i}`} x1={80 + i * 80} y1="0" x2={80 + i * 80} y2="940" />
        ))}
      </g>

      {/* Filaments décoratifs au sommet pour ancrer la composition */}
      <g stroke={gold} strokeWidth="0.5" fill="none" opacity="0.45">
        <path d="M 100 200 L 195 200" />
        <path d="M 605 200 L 700 200" />
        <path d="M 80 220 L 80 660" strokeDasharray="2 4" />
      </g>

      {/* Pediment fill (très subtil pour le poids visuel) */}
      <path d="M 200 200 L 400 92 L 600 200 Z" fill="url(#th-pediment)" opacity="0.04" />
      {/* Voile (ne pas distraire des traits) */}
      <rect x="0" y="0" width="800" height="940" fill="none" stroke={goldDeep} strokeWidth="0" />
    </svg>
  )
}
