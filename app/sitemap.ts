import type { MetadataRoute } from 'next'
import { SEO_PAGES } from '@/lib/seo/content'
import { absoluteUrl } from '@/lib/seo/config'
import { getPublishedPosts } from '@/lib/blog/queries'

/** Le sitemap suit le rythme du blog : régénéré au plus toutes les 10 minutes. */
export const revalidate = 600

/**
 * `/tunnel` (entonnoir de conversion) et `/admin` sont volontairement absents :
 * ils portent un noindex et n'ont pas vocation à être explorés.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = (
    [
      { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
      { url: absoluteUrl('/expertises'), changeFrequency: 'monthly', priority: 0.9 },
      { url: absoluteUrl('/methode'), changeFrequency: 'monthly', priority: 0.7 },
      { url: absoluteUrl('/le-cabinet'), changeFrequency: 'monthly', priority: 0.7 },
      { url: absoluteUrl('/blog'), changeFrequency: 'weekly', priority: 0.6 },
      { url: absoluteUrl('/simulateur'), changeFrequency: 'monthly', priority: 0.8 },
      {
        url: absoluteUrl('/simulateur-credit-immobilier'),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
    ] satisfies MetadataRoute.Sitemap
  ).map((entry) => ({ ...entry, lastModified: now }))

  // Pages piliers : la page mère prime sur ses sous-pages.
  const pillarEntries: MetadataRoute.Sitemap = Object.keys(SEO_PAGES).map((slug) => ({
    url: absoluteUrl(`/${slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: slug === 'financement-professions-liberales' ? 0.9 : 0.8,
  }))

  const legalEntries: MetadataRoute.Sitemap = [
    '/mentions-legales',
    '/politique-de-confidentialite',
    '/politique-de-cookies',
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.2,
  }))

  // Si Supabase est indisponible, getPublishedPosts renvoie [] : le sitemap
  // reste servi avec les pages statiques plutôt que de renvoyer une erreur.
  const posts = await getPublishedPosts()
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updated_at ?? post.published_at),
    changeFrequency: 'yearly',
    priority: 0.5,
  }))

  return [...staticEntries, ...pillarEntries, ...legalEntries, ...postEntries]
}
