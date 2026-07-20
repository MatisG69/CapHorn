import type { Metadata } from 'next'
import type { PillarData } from '@/components/landing/SeoPillar'

/**
 * Métadonnées d'une page pilier, dérivées de son contenu.
 *
 * Le suffixe de marque n'est pas répété ici : il est ajouté par
 * `title.template` défini dans app/layout.tsx.
 */
export function pillarMetadata(data: PillarData): Metadata {
  const path = `/${data.slug}`
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      title: `${data.metaTitle} · Cap Horn Conseils`,
      description: data.metaDescription,
      url: path,
      type: 'article',
    },
  }
}
