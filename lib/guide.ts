import { existsSync } from 'node:fs'
import path from 'node:path'
import { GUIDE, MEDECINS_SLUG } from '@/lib/seo/medecins'

/**
 * Registre des guides téléchargeables (aimants à prospects des pages métier).
 *
 * Module serveur uniquement (node:fs) : il est partagé par la page, qui doit
 * savoir quelle promesse afficher, et par /api/guide, qui sert le fichier. Les
 * deux lisent la même source, donc le libellé du bouton ne peut jamais mentir
 * sur ce qui se passera réellement après l'envoi du formulaire.
 */

export interface GuideDefinition {
  title: string
  /** Chemin public SANS extension : voir resolveGuideFile. */
  fileBase: string
  sourcePage: string
}

export const DEFAULT_GUIDE_SLUG = 'installation-medicale'

export const GUIDES: Record<string, GuideDefinition> = {
  [DEFAULT_GUIDE_SLUG]: {
    title: GUIDE.title,
    fileBase: GUIDE.fileBase,
    sourcePage: `/${MEDECINS_SLUG}`,
  },
}

/**
 * Extensions acceptées, par ordre de préférence : un guide est normalement un
 * PDF, mais une version image reste servable. La liste est fermée pour qu'un
 * fichier déposé par erreur dans public/guides/ ne devienne pas téléchargeable.
 */
const EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'] as const

/** Chemin public du guide réellement présent sur le disque, sinon null. */
export function resolveGuideFile(fileBase: string): string | null {
  for (const ext of EXTENSIONS) {
    const candidate = `${fileBase}${ext}`
    if (existsSync(path.join(process.cwd(), 'public', candidate))) return candidate
  }
  return null
}

/**
 * Le guide est-il en ligne ?
 *
 * Tant qu'il ne l'est pas, la page promet un envoi par e-mail plutôt qu'un
 * téléchargement immédiat. Le jour où le PDF est déposé, la page bascule seule
 * sur « Télécharger » : aucune modification de code n'est nécessaire.
 */
export function isGuidePublished(slug: string = DEFAULT_GUIDE_SLUG): boolean {
  const guide = GUIDES[slug]
  return !!guide && resolveGuideFile(guide.fileBase) !== null
}
