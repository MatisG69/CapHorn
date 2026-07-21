import type { Metadata } from 'next'
import { Jost, IBM_Plex_Sans } from 'next/font/google'
import './globals.css'
import { LiquidGlassFilter } from '@/components/LiquidGlassFilter'
import ChatWidget from '@/components/chat/ChatWidget'
import Analytics from '@/components/Analytics'
import { JsonLd } from '@/components/seo/JsonLd'
import { OG_IMAGE, SITE_NAME, SITE_TITLE_SUFFIX, SITE_URL } from '@/lib/seo/config'
import { organizationSchema, websiteSchema } from '@/lib/seo/jsonld'

// ── Direction typographique, dérivée du logo ──────────────────────────
// Le logo Cap Horn est intégralement en sans-serif géométrique : lettrage
// « CAP'HORN » gras et resserré, « conseils » léger et très tracké. On adopte
// donc cette langue-là, au lieu du serif (Cormorant) qui n'a aucun lien
// avec la marque.
//
// Jost — géométrique de lignée Futura : O circulaires, A à sommet pointu,
// terminaisons horizontales. C'est le plus proche du lettrage du logo.
const display = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jost',
  display: 'swap',
})

// IBM Plex Sans — corps de texte : neutre, très lisible en petites tailles,
// avec ce qu'il faut de caractère technique pour un métier de la finance.
const body = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-plex',
  display: 'swap',
})

export const metadata: Metadata = {
  // Indispensable : sans metadataBase, tout chemin relatif (canonique, image
  // Open Graph) casse le build et les URLs partagées.
  metadataBase: new URL(SITE_URL),
  // `template` permet à chaque page de ne porter qu'un titre court et unique :
  // le suffixe de marque est ajouté ici, une seule fois.
  title: {
    default: 'Courtier en crédit à Lille et Hauts-de-France · Cap Horn Conseils',
    template: `%s · ${SITE_TITLE_SUFFIX}`,
  },
  description:
    "Courtier en crédit indépendant à Lille et dans les Hauts-de-France : crédit immobilier, financement professionnel et assurance emprunteur.",
  applicationName: SITE_NAME,
  authors: [{ name: 'Guillaume Horn' }],
  creator: 'Guillaume Horn',
  publisher: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Courtier en crédit à Lille et Hauts-de-France · Cap Horn Conseils',
    description:
      "Crédit immobilier, financement professionnel et assurance emprunteur. Étude gratuite, réponse sous 24 h.",
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Courtier en crédit à Lille · Cap Horn Conseils',
    description:
      "Crédit immobilier, financement professionnel et assurance emprunteur. Étude gratuite, réponse sous 24 h.",
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Autorise les extraits longs et les grandes vignettes en SERP.
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  formatDetection: { telephone: true, address: true, email: true },
  category: 'finance',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${body.variable} ${display.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans">
        {/* Identité de l'entité, rattachée à toutes les pages via @id. */}
        <JsonLd schema={organizationSchema()} />
        <JsonLd schema={websiteSchema()} />
        <LiquidGlassFilter />
        {children}
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  )
}
