/**
 * Programme de parrainage — paramètres susceptibles de bouger.
 *
 * Tout ce qui relève de l'OFFRE (et non du principe du parrainage) est isolé
 * ici : le montant, les conditions et la date de retrait de l'encart changent
 * plus vite que la page elle-même.
 */

/**
 * Retrait automatique de l'encart « Offre de parrainage ».
 *
 * Demandé par le client : suppression le 25 septembre au matin. La date est
 * exprimée avec son fuseau (Europe/Paris, UTC+2 en septembre) pour ne pas
 * dépendre du fuseau du serveur, qui est en UTC sur Vercel.
 *
 * La page qui affiche l'encart déclare `revalidate` : l'encart disparaît donc
 * tout seul, sans redéploiement, au plus tard une fenêtre de revalidation
 * après cette date. Passé le 25 septembre, ces lignes et le bloc `offer` de la
 * page peuvent être supprimés purement et simplement.
 */
export const REFERRAL_OFFER_ENDS_AT = '2026-09-25T08:00:00+02:00'

/** Vrai tant que l'encart d'offre doit rester affiché. */
export function isReferralOfferLive(now: number = Date.now()): boolean {
  return now < Date.parse(REFERRAL_OFFER_ENDS_AT)
}

/** Article détaillant les conditions de l'offre (blog Cap Horn). */
export const REFERRAL_OFFER_ARTICLE = '/blog/recommander-un-projet-immobilier'
