import { ogImage, OG_SIZE } from '@/lib/seo/og'

export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogImage({
    eyebrow: 'Parrainage',
    title: 'Recommandez un projet, soyez récompensé',
    subtitle:
      'Devenez apporteur d’affaires : une prime de parrainage dès que le financement est signé.',
  })
}
