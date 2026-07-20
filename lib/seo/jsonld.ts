/**
 * Générateurs de données structurées schema.org (JSON-LD).
 *
 * Les objets produits ici sont injectés via <JsonLd /> (components/seo/JsonLd.tsx).
 * Référence : https://developers.google.com/search/docs/appearance/structured-data
 */
import {
  AREA_SERVED,
  BUSINESS_ADDRESS,
  LEGAL_ENTITY,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from './config'

/** Identifiants stables réutilisés en références croisées entre les graphes. */
export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

/**
 * L'entité principale : un courtier en crédit est un FinancialService,
 * lui-même sous-type de LocalBusiness — d'où l'éligibilité au SEO local.
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    '@id': ORG_ID,
    name: SITE_NAME,
    legalName: LEGAL_ENTITY.name,
    alternateName: LEGAL_ENTITY.brand,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/logo-caphorn.png'),
    },
    image: absoluteUrl('/opengraph-image.png'),
    description:
      "Cabinet de courtage en financement indépendant, basé dans les Hauts-de-France et intervenant à Lille et dans toute la métropole. Crédit immobilier, financement professionnel, assurance emprunteur et regroupement de crédits.",
    founder: {
      '@type': 'Person',
      name: LEGAL_ENTITY.founder,
      jobTitle: 'Fondateur, courtier en financement',
    },
    email: LEGAL_ENTITY.email,
    telephone: LEGAL_ENTITY.phone,
    // Adresse unique et réelle de l'entreprise (le local de Méteren).
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_ADDRESS.streetAddress,
      postalCode: BUSINESS_ADDRESS.postalCode,
      addressLocality: BUSINESS_ADDRESS.addressLocality,
      addressRegion: BUSINESS_ADDRESS.addressRegion,
      addressCountry: BUSINESS_ADDRESS.addressCountry,
    },
    // Zone de service : le courtier se déplace chez ses clients dans ces villes.
    areaServed: AREA_SERVED.map((name) => ({ '@type': 'Place', name })),
    priceRange: 'Étude gratuite, honoraires au succès',
    currenciesAccepted: 'EUR',
    // Identifiants réglementaires : signaux de confiance déterminants en YMYL.
    identifier: [
      { '@type': 'PropertyValue', name: 'SIRET', value: LEGAL_ENTITY.siret },
      { '@type': 'PropertyValue', name: 'ORIAS', value: LEGAL_ENTITY.orias },
    ],
    vatID: LEGAL_ENTITY.siren,
    knowsAbout: [
      'Crédit immobilier',
      'Financement professionnel',
      'Assurance emprunteur',
      'Regroupement de crédits',
      'Financement des professions libérales',
      'Reprise et transmission d’entreprise',
    ],
    serviceType: 'Courtage en opérations de banque et services de paiement',
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Immatriculation ORIAS',
      identifier: LEGAL_ENTITY.orias,
      recognizedBy: {
        '@type': 'Organization',
        name: 'ORIAS, Registre unique des intermédiaires en assurance, banque et finance',
        url: 'https://www.orias.fr',
      },
    },
  }
}

/** Le site lui-même, rattaché à l'organisation. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: 'fr-FR',
    publisher: { '@id': ORG_ID },
  }
}

/** Fil d'Ariane. Améliore l'affichage de l'URL dans les résultats Google. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

/**
 * FAQ. Depuis 2023 Google réserve les rich results FAQ aux sites
 * institutionnels ; le balisage reste utile à la compréhension du contenu
 * et à sa reprise dans les AI Overviews.
 */
export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

/** Page de service (pages piliers). */
export function servicePageSchema(input: {
  name: string
  description: string
  path: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { '@id': ORG_ID },
    areaServed: AREA_SERVED.map((name) => ({ '@type': 'Place', name })),
    serviceType: 'Courtage en financement',
  }
}

/** Article de blog. */
export function articleSchema(input: {
  title: string
  description?: string | null
  slug: string
  image?: string | null
  publishedAt: string
  updatedAt?: string | null
  author: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description ?? undefined,
    url: absoluteUrl(`/blog/${input.slug}`),
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(`/blog/${input.slug}`) },
    image: input.image ? [input.image] : undefined,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    author: { '@type': 'Person', name: input.author },
    publisher: { '@id': ORG_ID },
    inLanguage: 'fr-FR',
  }
}
