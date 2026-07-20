import { getTunnelConfig } from '@/lib/tunnel/loader'
import TunnelClient from '@/components/tunnel/TunnelClient'

export const dynamic = 'force-dynamic'

// Entonnoir de conversion : aucune valeur en résultat de recherche, et une
// page de formulaire indexée diluerait le maillage. On garde `follow` pour
// que les liens du pied de page continuent de transmettre leur autorité.
export const metadata = {
  title: 'Démarrer mon étude de financement',
  description:
    "Décrivez votre projet en 3 minutes. Un expert Cap Horn Conseils vous rappelle sous 24 h. Étude gratuite et sans engagement.",
  robots: { index: false, follow: true },
}

export default async function TunnelPage() {
  const { config } = await getTunnelConfig()
  return <TunnelClient config={config} />
}
