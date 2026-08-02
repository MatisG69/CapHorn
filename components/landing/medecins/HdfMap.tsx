/**
 * Carte simplifiée des Hauts-de-France avec les repères où le cabinet
 * intervient auprès des médecins.
 *
 * Le tracé est une simplification du contour régional : les sommets sont de
 * vraies coordonnées (longitude, latitude) projetées linéairement, avec une
 * correction de 0,643 sur l'axe des longitudes (cos 50°) — sans elle la région
 * paraîtrait étirée d'un tiers en largeur. Ce n'est pas une carte de
 * précision : c'est un repère visuel, d'où l'absence de frontières internes.
 *
 * SVG inline plutôt qu'une image : aucun octet réseau, net sur tout écran, et
 * les couleurs suivent les jetons du thème.
 */

/** Fenêtre géographique (lon min/max, lat min/max) du cadrage. */
const LON0 = 1.35
const LAT1 = 51.12
const SX = 380 / 2.95
const SY = 464 / 2.32

const px = (lon: number) => (lon - LON0) * SX
const py = (lat: number) => (LAT1 - lat) * SY

/** Contour régional simplifié, sens horaire depuis la frontière belge côtière. */
const OUTLINE: [number, number][] = [
  [2.55, 51.09], [2.38, 51.03], [1.85, 50.97], [1.58, 50.87], [1.6, 50.72],
  [1.55, 50.42], [1.6, 50.22], [1.37, 50.06], [1.55, 49.85], [1.72, 49.5],
  [1.9, 49.3], [2.2, 49.1], [2.6, 49.05], [3.1, 48.98], [3.4, 48.85],
  [3.65, 49.1], [4.05, 49.45], [4.25, 49.75], [4.2, 50.0], [4.15, 50.13],
  [3.95, 50.35], [3.7, 50.3], [3.65, 50.5], [3.25, 50.53], [3.05, 50.75],
  [2.85, 50.75], [2.6, 50.95],
]

/** Repères. `anchor` place l'étiquette quand la ville en porte une. */
const PINS: { name: string; lon: number; lat: number; label?: 'left' | 'right' }[] = [
  { name: 'Dunkerque', lon: 2.38, lat: 51.03, label: 'right' },
  { name: 'Bailleul', lon: 2.74, lat: 50.74 },
  { name: 'Armentières', lon: 2.88, lat: 50.69 },
  { name: 'Tourcoing', lon: 3.16, lat: 50.72 },
  { name: 'Roubaix', lon: 3.17, lat: 50.69 },
  { name: 'Marcq-en-Barœul', lon: 3.09, lat: 50.67 },
  { name: 'Villeneuve-d’Ascq', lon: 3.14, lat: 50.62 },
  { name: 'Lille', lon: 3.06, lat: 50.63, label: 'left' },
]

const path = `${OUTLINE.map(([lon, lat], i) => `${i === 0 ? 'M' : 'L'}${px(lon).toFixed(1)} ${py(lat).toFixed(1)}`).join(' ')} Z`

export function HdfMap() {
  return (
    <svg
      className="med-map__svg"
      viewBox="-14 -14 408 492"
      role="img"
      aria-label="Carte simplifiée des Hauts-de-France situant Lille, Roubaix, Tourcoing, Villeneuve-d’Ascq, Marcq-en-Barœul, Dunkerque, Armentières et Bailleul."
    >
      <defs>
        <linearGradient id="med-map-fill" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#56968D" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#30455E" stopOpacity="0.14" />
        </linearGradient>
        <pattern id="med-map-grid" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M26 0H0V26" fill="none" stroke="rgba(232,238,242,0.06)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect x="-14" y="-14" width="408" height="492" fill="url(#med-map-grid)" />

      {/* Ombre portée douce, puis la région */}
      <path d={path} fill="rgba(8,17,26,0.5)" transform="translate(3 6)" />
      <path
        d={path}
        fill="url(#med-map-fill)"
        stroke="#6FB3A8"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {PINS.map((p) => {
        const x = px(p.lon)
        const y = py(p.lat)
        return (
          <g key={p.name}>
            <circle cx={x} cy={y} r="9" fill="rgba(158,212,210,0.16)" />
            <circle cx={x} cy={y} r="4" fill="#9ED4D2" stroke="#0E1821" strokeWidth="1.4" />
            {p.label && (
              <text
                x={p.label === 'left' ? x - 12 : x + 12}
                y={y + 4}
                textAnchor={p.label === 'left' ? 'end' : 'start'}
                className="med-map__label"
              >
                {p.name}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
