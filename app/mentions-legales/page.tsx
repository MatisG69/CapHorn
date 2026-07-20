import { notFound } from 'next/navigation'
import { LegalPage } from '@/components/legal/LegalPage'
import { LEGAL_DESCRIPTIONS, LEGAL_SLUGS, getLegalDoc } from '@/lib/legal'

const doc = getLegalDoc('mentions')

export const metadata = {
  title: 'Mentions légales',
  description: LEGAL_DESCRIPTIONS.mentions,
  alternates: { canonical: LEGAL_SLUGS.mentions },
}

export default function Page() {
  if (!doc) notFound()
  return <LegalPage doc={doc} />
}
