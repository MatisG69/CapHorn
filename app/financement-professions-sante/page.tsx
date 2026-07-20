import { SeoPillar } from '@/components/landing/SeoPillar'
import { SEO_PAGES } from '@/lib/seo/content'
import { pillarMetadata } from '@/lib/seo/metadata'

const data = SEO_PAGES['financement-professions-sante']

export const metadata = pillarMetadata(data)

export default function Page() {
  return <SeoPillar data={data} />
}
