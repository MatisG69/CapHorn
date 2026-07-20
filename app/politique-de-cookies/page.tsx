import { notFound } from 'next/navigation'
import { LegalPage } from '@/components/legal/LegalPage'
import { LEGAL_DESCRIPTIONS, LEGAL_SLUGS, getLegalDoc } from '@/lib/legal'

const doc = getLegalDoc('cookies')

export const metadata = {
  title: 'Politique de cookies',
  description: LEGAL_DESCRIPTIONS.cookies,
  alternates: { canonical: LEGAL_SLUGS.cookies },
}

export default function Page() {
  if (!doc) notFound()
  return <LegalPage doc={doc} />
}
