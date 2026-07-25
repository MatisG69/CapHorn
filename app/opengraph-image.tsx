import { ogImage, OG_SIZE } from '@/lib/seo/og'

// Image par défaut de tout le site : elle se transmet à toute page qui n'a pas
// sa propre carte (pages SEO, financements…), pour qu'aucune n'affiche d'image
// piochée au hasard dans son contenu.
export const alt = 'Cap Horn Conseils, courtier en crédit à Lille et dans les Hauts-de-France'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogImage({
    eyebrow: 'Courtier en financement',
    title: 'Votre projet financé, à Lille et dans les Hauts-de-France',
    subtitle: 'Crédit immobilier · financement professionnel · assurance emprunteur',
  })
}
