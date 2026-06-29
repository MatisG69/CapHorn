import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { LiquidGlassFilter } from '@/components/LiquidGlassFilter'
import ChatWidget from '@/components/chat/ChatWidget'
import Analytics from '@/components/Analytics'

// ── Direction « Cap Horn — editorial premium » ─────────────────────────
// Deux familles, conformément au design system : Inter (corps + display
// massif 900) et Cormorant Garamond (titres de section serif, italiques).
// Variables CSS conservées (--font-ibm-plex = Inter, --font-cormorant =
// Cormorant) pour ne casser aucune référence existante.
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  variable: '--font-ibm-plex',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
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
    <html lang="fr" className={`${inter.variable} ${cormorant.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans">
        <LiquidGlassFilter />
        {children}
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  )
}
