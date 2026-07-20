import type { Metadata } from 'next'
import HomeClient from '@/components/landing/HomeClient'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema } from '@/lib/seo/jsonld'

// Ce composant reste serveur afin de pouvoir exporter `metadata` :
// toute l'interface (état, animations) vit dans HomeClient.
export const metadata: Metadata = {
  title: 'Courtier en crédit à Lille et Hauts-de-France',
  description:
    "Courtier en crédit à Lille et dans les Hauts-de-France : crédit immobilier, financement professionnel et assurance emprunteur. Étude gratuite sous 24 h.",
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Courtier en crédit à Lille et Hauts-de-France · Cap Horn Conseils',
    description:
      "Crédit immobilier, financement professionnel et assurance emprunteur à Lille et dans les Hauts-de-France. Étude gratuite, réponse sous 24 h.",
    url: '/',
  },
}

export default function HomePage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema([{ name: 'Accueil', path: '/' }])} />
      <HomeClient />
    </>
  )
}
