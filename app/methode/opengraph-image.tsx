import { ogImage, OG_SIZE } from '@/lib/seo/og'

export const alt = 'Notre méthode — Cap Horn Conseils'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogImage({
    eyebrow: 'Notre méthode',
    title: 'Un accompagnement clair, de la première étude à la signature',
    subtitle: 'Un interlocuteur unique, un dossier maîtrisé, aucune mauvaise surprise',
  })
}
