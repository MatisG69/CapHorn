import type { Metadata } from 'next'
import { IBM_Plex_Sans, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const ibmPlex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex',
  display: 'swap',
})

// Serif display éditorial pour les titres premium. Cormorant Garamond
// porte le caractère « cabinet de conseil financier durable » mieux qu'un
// Playfair plus moderne ou un Didone trop rigide.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Cap Horn Conseils — Cabinet de courtage indépendant',
  description:
    "Architecture financière premium. Immobilier, professionnel, assurance emprunteur. Cabinet de courtage indépendant à Marcq-en-Barœul.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${ibmPlex.variable} ${cormorant.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  )
}
