/**
 * Source unique de vérité pour l'identité SEO du site.
 *
 * Toute donnée NAP (Name, Address, Phone) doit provenir d'ici et de lib/legal.ts
 * uniquement : Google pénalise les incohérences d'adresse entre le site, les
 * mentions légales et Google Business Profile.
 */

/**
 * Domaine canonique de déploiement, sans slash final (les URLs sont composées
 * par concaténation). C'est le domaine qui sert le site : les canoniques, le
 * sitemap, le robots.txt et les URL des données structurées en découlent tous.
 * Surchargeable via NEXT_PUBLIC_SITE_URL (ex. domaine de préproduction).
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://financezmonprojet.fr'

export const SITE_NAME = 'Cap Horn Conseils'
export const SITE_TITLE_SUFFIX = 'Cap Horn Conseils'

/** Entité juridique éditrice, alignée sur lib/legal.ts (mentions légales). */
export const LEGAL_ENTITY = {
  name: 'GAH CONSULTING',
  brand: 'CAP HORN CONSEILS',
  founder: 'Guillaume Horn',
  siret: '939 507 190 00014',
  siren: '939 507 190',
  vatOrRcs: 'RCS Dunkerque 939 507 190',
  /** Immatriculation ORIAS : obligatoire et déterminante pour la confiance (YMYL). */
  orias: '25001212',
  apeCode: '66.19B',
  email: 'contact@cap-horn-conseils.com',
  phone: '+33628718395',
  phoneDisplay: '06 28 71 83 95',
} as const

/**
 * Adresse réelle et unique de l'entreprise (le local de Méteren), alignée sur
 * les mentions légales. C'est l'adresse publiée dans le schema et celle qui
 * doit figurer sur la fiche Google Business Profile.
 *
 * Cap Horn est une « entreprise avec zone de service » (Service Area Business) :
 * le courtier est basé ici mais se déplace chez ses clients à Lille et dans les
 * Hauts-de-France. La proximité (Lille = zone desservie) est portée par
 * `AREA_SERVED`, pas par une seconde adresse — en inventer une serait une
 * violation des règles Google et fragiliserait la fiche.
 */
export const BUSINESS_ADDRESS = {
  streetAddress: '97 T rue Nationale',
  postalCode: '59270',
  addressLocality: 'Méteren',
  addressRegion: 'Hauts-de-France',
  addressCountry: 'FR',
} as const

/**
 * Zones géographiques ciblées, de la plus prioritaire à la plus large.
 * Lille et les Hauts-de-France sont la cible SEO principale ; les communes de
 * la métropole lilloise captent les requêtes locales à forte intention.
 */
/**
 * Réseaux sociaux.
 *
 * `linkedin` est le profil personnel de Guillaume Horn (et non une page
 * entreprise) : il est donc déclaré sur la Person « fondateur » des données
 * structurées, pas sur l'Organization, ce qui correspond à la réalité.
 *
 * Facebook est volontairement absent tant que l'URL n'est pas connue : un
 * lien vers une page inexistante nuit plus qu'il ne sert.
 */
export const SOCIALS = {
  linkedin: 'https://www.linkedin.com/in/guillaume-horn/',
} as const

export const AREA_SERVED = [
  'Lille',
  'Métropole Européenne de Lille',
  'Roubaix',
  'Tourcoing',
  'Villeneuve-d’Ascq',
  'Marcq-en-Barœul',
  'Hauts-de-France',
  'France',
] as const

/** Libellé de la zone desservie, pour les textes visibles et les métadonnées. */
export const SERVICE_AREA_LONG = 'Lille et les Hauts-de-France'
/** Variante courte (fil d'ariane visuel, coordonnées, contact). */
export const SERVICE_AREA_SHORT = 'Lille · Hauts-de-France'

/** Image de partage par défaut (Open Graph / Twitter). */
export const OG_IMAGE = {
  url: '/opengraph-image.png',
  width: 1200,
  height: 630,
  alt: 'Cap Horn Conseils, courtier en crédit à Lille et dans les Hauts-de-France',
} as const

/** Construit une URL absolue à partir d'un chemin racine. */
export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
