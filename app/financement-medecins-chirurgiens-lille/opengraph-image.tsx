import { ogImage, OG_SIZE } from '@/lib/seo/og'

export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogImage({
    eyebrow: 'Médecins & chirurgiens',
    title: 'Financer son installation, sa patientèle, sa SELARL.',
    subtitle:
      'Étude confidentielle avant votre premier rendez-vous bancaire. Lille & Hauts-de-France.',
  })
}
