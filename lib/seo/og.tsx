import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { SITE_URL } from './config'
import { SEO_PAGES } from './content'

/**
 * Fabrique d'images Open Graph (les vignettes des partages sur les réseaux).
 *
 * Une carte de marque UNIQUE, déclinée par page via un simple titre : plus
 * jamais Facebook ne pioche une image au hasard dans le contenu (c'est ce qui
 * faisait apparaître un logo de banque partenaire). Chaque page fournit sa
 * propre image générée, sur fond sombre aux couleurs du logo.
 *
 * Rendu par Satori (next/og) : le texte n'apparaît QUE si une police est
 * embarquée — d'où le chargement des .woff Jost / IBM Plex depuis assets/.
 * Runtime Node.js (readFile) : ne pas forcer edge.
 */
export const OG_SIZE = { width: 1200, height: 630 }

// Chemins STATIQUES via import.meta.url : le file-tracer de Next sait alors
// exactement quels fichiers embarquer (sinon un chemin dynamique fait tracer
// tout le projet et alourdit la fonction serverless).
const read = (url: URL) => readFile(url)

/** Le domaine sans le protocole, pour le pied de carte. */
const DOMAIN = SITE_URL.replace(/^https?:\/\//, '')

export interface OgFields {
  /** Sur-titre court en capitales (la rubrique). */
  eyebrow: string
  /** Titre principal, 1 à 2 lignes. */
  title: string
  /** Ligne d'appui sous le titre. */
  subtitle: string
}

export async function ogImage({ eyebrow, title, subtitle }: OgFields) {
  const [jost500, jost600, plex400, logo] = await Promise.all([
    read(new URL('../../assets/fonts/jost-500.woff', import.meta.url)),
    read(new URL('../../assets/fonts/jost-600.woff', import.meta.url)),
    read(new URL('../../assets/fonts/plex-400.woff', import.meta.url)),
    read(new URL('../../public/logo-caphorn-dark.png', import.meta.url)),
  ])
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

  // Barres de « voile », reprises du logo (sauge / aqua / teal / sauge).
  const bars = [
    { h: 30, c: '#CAD178' },
    { h: 54, c: '#56968D' },
    { h: 42, c: '#9ED4D2' },
    { h: 22, c: '#CAD178' },
  ]

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '68px 80px',
          background: 'linear-gradient(135deg, #0E1821 0%, #16232F 100%)',
          color: '#E8EEF2',
          fontFamily: 'Plex',
          position: 'relative',
        }}
      >
        {/* Halo teal en haut à droite, pour la profondeur */}
        <div
          style={{
            position: 'absolute',
            top: -160,
            right: -120,
            width: 560,
            height: 560,
            borderRadius: '50%',
            background:
              'radial-gradient(closest-side, rgba(86,150,141,0.30), rgba(86,150,141,0))',
          }}
        />

        {/* En-tête : logo + barres */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} height={58} alt="" />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
            {bars.map((b, i) => (
              <div key={i} style={{ width: 8, height: b.h, borderRadius: 3, background: b.c }} />
            ))}
          </div>
        </div>

        {/* Bloc central */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Jost',
              fontWeight: 600,
              fontSize: 24,
              letterSpacing: 8,
              textTransform: 'uppercase',
              color: '#9ED4D2',
              marginBottom: 22,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Jost',
              fontWeight: 600,
              fontSize: 66,
              lineHeight: 1.06,
              color: '#F3F6F4',
              maxWidth: 940,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              lineHeight: 1.4,
              color: 'rgba(232,238,242,0.66)',
              marginTop: 26,
              maxWidth: 860,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Pied : domaine + zone */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', fontFamily: 'Jost', fontWeight: 500, fontSize: 27, color: '#E8EEF2' }}>
            {DOMAIN}
          </div>
          <div style={{ display: 'flex', fontSize: 22, color: 'rgba(232,238,242,0.5)' }}>
            Lille · Hauts-de-France
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Jost', data: jost500, weight: 500, style: 'normal' },
        { name: 'Jost', data: jost600, weight: 600, style: 'normal' },
        { name: 'Plex', data: plex400, weight: 400, style: 'normal' },
      ],
    },
  )
}

/**
 * Carte OG d'une page pilier, dérivée de son contenu (une seule source de
 * vérité : SEO_PAGES). Chaque page SEO a ainsi sa propre vignette titrée.
 */
export function pillarOgImage(slug: string) {
  const d = SEO_PAGES[slug]
  if (!d) {
    return ogImage({
      eyebrow: 'Cap Horn Conseils',
      title: 'Courtier en financement',
      subtitle: 'Lille et Hauts-de-France',
    })
  }
  const title = `${d.titleTop} ${d.titleEm}`.replace(/\s+/g, ' ').trim()
  // Le sous-titre reprend la meta description, tronquée au dernier mot entier
  // pour tenir sur la carte sans couper au milieu d'un mot.
  const subtitle =
    d.metaDescription.length > 108
      ? `${d.metaDescription.slice(0, 105).replace(/\s+\S*$/, '')}…`
      : d.metaDescription
  return ogImage({ eyebrow: d.eyebrow, title, subtitle })
}
