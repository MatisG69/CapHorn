import { ogImage, OG_SIZE } from '@/lib/seo/og'

export const alt = 'Le cabinet Cap Horn Conseils'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogImage({
    eyebrow: 'Le cabinet',
    title: 'Cap Horn Conseils, votre courtier indépendant',
    subtitle: 'Guillaume Horn · immatriculé ORIAS · Lille et Hauts-de-France',
  })
}
