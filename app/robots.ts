import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // L'admin et les routes API n'ont rien à faire dans l'index.
      // /tunnel porte en plus un noindex au niveau de la page.
      disallow: ['/admin', '/admin/', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
