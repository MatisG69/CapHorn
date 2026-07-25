import { ogImage, OG_SIZE } from '@/lib/seo/og'

export const alt = 'Simulateur d’assurance emprunteur — Cap Horn Conseils'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogImage({
    eyebrow: 'Assurance emprunteur',
    title: 'Simulez vos économies d’assurance de prêt',
    subtitle: 'Loi Lemoine · résiliation à tout moment · jusqu’à 50 % d’économie',
  })
}
