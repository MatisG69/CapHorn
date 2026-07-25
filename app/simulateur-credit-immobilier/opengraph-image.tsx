import { ogImage, OG_SIZE } from '@/lib/seo/og'

export const alt = 'Simulateur de crédit immobilier — Cap Horn Conseils'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogImage({
    eyebrow: 'Simulateur',
    title: 'Calculez votre capacité d’emprunt immobilier',
    subtitle: 'Mensualités, taux d’endettement et faisabilité — en direct',
  })
}
