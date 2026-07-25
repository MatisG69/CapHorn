import { ogImage, OG_SIZE } from '@/lib/seo/og'

export const alt = 'Blog — Cap Horn Conseils'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogImage({
    eyebrow: 'Blog',
    title: 'Conseils et actualités du financement',
    subtitle: 'Crédit immobilier, assurance emprunteur, financement professionnel',
  })
}
