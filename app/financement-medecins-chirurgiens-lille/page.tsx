import type { Metadata } from 'next'
import { MedecinsPage } from '@/components/landing/medecins/MedecinsPage'
import { MEDECINS_META, MEDECINS_SLUG } from '@/lib/seo/medecins'

/**
 * Le titre est déclaré en `absolute` : le gabarit de app/layout.tsx ajoute
 * « · Cap Horn Conseils » à chaque page, ce qui pousserait celui-ci à plus de
 * 100 caractères et le ferait tronquer en résultat de recherche.
 */
export const metadata: Metadata = {
  title: { absolute: MEDECINS_META.title },
  description: MEDECINS_META.description,
  alternates: { canonical: `/${MEDECINS_SLUG}` },
  openGraph: {
    title: MEDECINS_META.title,
    description: MEDECINS_META.description,
    url: `/${MEDECINS_SLUG}`,
    type: 'article',
  },
  keywords: [
    'financement médecin Lille',
    'financement chirurgien',
    'prêt médecin',
    'installation médecin libéral',
    'rachat patientèle',
    'droit de présentation à patientèle',
    'SELARL médecin',
    'SELAS médecin',
    'achat cabinet médical',
    'SCI cabinet médical',
    'financement matériel médical',
    'courtier médecin',
    'financement professions médicales',
    'Hauts-de-France',
  ],
}

export default function Page() {
  return <MedecinsPage />
}
