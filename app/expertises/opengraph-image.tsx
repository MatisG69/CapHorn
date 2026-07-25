import { ogImage, OG_SIZE } from '@/lib/seo/og'

export const alt = 'Nos expertises — Cap Horn Conseils'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogImage({
    eyebrow: 'Nos expertises',
    title: 'Toutes vos solutions de financement, réunies',
    subtitle: 'Immobilier · professionnel · assurance emprunteur · regroupement de crédits',
  })
}
