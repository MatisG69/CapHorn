/** Mappe un chemin d'URL vers une « section » lisible. */
export function sectionFromPath(path: string): string {
  const clean = (path || '/').split('?')[0]
  if (clean === '/' || clean === '') return 'Accueil'
  const seg = clean.split('/').filter(Boolean)[0]
  const map: Record<string, string> = {
    blog: 'Blog',
    tunnel: 'Tunnel',
    simulateur: 'Simulateur assurance',
    'simulateur-credit-immobilier': 'Simulateur crédit',
    expertises: 'Expertises',
    methode: 'Méthode',
    'le-cabinet': 'Le cabinet',
    'financement-professions-liberales': 'Professions libérales',
    'financement-professions-sante': 'Professions santé',
    'financement-professions-juridiques': 'Professions juridiques',
    'financement-professions-chiffre': 'Professions chiffre',
    'financement-franchise': 'Franchise',
    'reprise-transmission': 'Reprise & transmission',
  }
  return map[seg] ?? seg
}

/** Détecte le type d'appareil depuis le User-Agent. */
export function deviceFromUA(ua: string): 'mobile' | 'tablet' | 'desktop' {
  const s = ua.toLowerCase()
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(s)) return 'tablet'
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/.test(s)) return 'mobile'
  return 'desktop'
}

export const DEVICE_LABELS: Record<string, string> = {
  mobile: 'Mobile',
  tablet: 'Tablette',
  desktop: 'Ordinateur',
}

/** Quelques pays fréquents (code ISO → nom FR). */
export const COUNTRY_NAMES: Record<string, string> = {
  FR: 'France', BE: 'Belgique', CH: 'Suisse', LU: 'Luxembourg', CA: 'Canada',
  GB: 'Royaume-Uni', US: 'États-Unis', DE: 'Allemagne', ES: 'Espagne', IT: 'Italie',
  PT: 'Portugal', NL: 'Pays-Bas', MA: 'Maroc', DZ: 'Algérie', TN: 'Tunisie',
}

export function countryName(code?: string | null): string {
  if (!code || code === 'XX') return 'Inconnu'
  return COUNTRY_NAMES[code] ?? code
}
