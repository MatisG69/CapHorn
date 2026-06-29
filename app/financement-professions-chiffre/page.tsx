import { SeoPillar } from '@/components/landing/SeoPillar'
import { SEO_PAGES } from '@/lib/seo/content'

const data = SEO_PAGES['financement-professions-chiffre']

export const metadata = { title: data.metaTitle, description: data.metaDescription }

export default function Page() {
  return <SeoPillar data={data} />
}
