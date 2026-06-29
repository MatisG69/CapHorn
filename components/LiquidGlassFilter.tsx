/**
 * Filtre SVG « liquid glass » (verre liquide façon Apple).
 *
 * Une couche de turbulence douce sert de carte de déplacement appliquée au
 * `backdrop-filter` des barres (nav du site + en-tête du tunnel) : le contenu
 * situé derrière la barre est légèrement réfracté, ce qui donne l'effet de
 * verre épais/liquide. Monté une seule fois dans le layout racine ; référencé
 * en CSS via `backdrop-filter: url(#liquid-nav) …`.
 *
 * Le SVG est invisible (0×0) — il ne sert qu'à exposer la définition du filtre.
 */
export function LiquidGlassFilter() {
  return (
    <svg className="lg-filter-svg" aria-hidden="true" focusable="false">
      <defs>
        <filter
          id="liquid-nav"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.007 0.012"
            numOctaves="2"
            seed="11"
            result="turb"
          />
          <feGaussianBlur in="turb" stdDeviation="2.6" result="soft" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft"
            scale="22"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  )
}
