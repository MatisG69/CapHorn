import { pillarOgImage, OG_SIZE } from '@/lib/seo/og'

export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return pillarOgImage('financement-professions-liberales')
}
