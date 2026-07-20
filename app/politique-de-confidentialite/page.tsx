import { notFound } from 'next/navigation'
import { LegalPage } from '@/components/legal/LegalPage'
import { LEGAL_DESCRIPTIONS, LEGAL_SLUGS, getLegalDoc } from '@/lib/legal'

const doc = getLegalDoc('confidentialite')

export const metadata = {
  title: 'Politique de confidentialité',
  description: LEGAL_DESCRIPTIONS.confidentialite,
  alternates: { canonical: LEGAL_SLUGS.confidentialite },
}

export default function Page() {
  if (!doc) notFound()
  return <LegalPage doc={doc} />
}
