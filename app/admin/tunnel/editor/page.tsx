import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getTunnelConfig } from '@/lib/tunnel/loader'
import TunnelEditor from '@/components/admin/TunnelEditor'

export const dynamic = 'force-dynamic'

export default async function TunnelEditorPage() {
  const { config, source } = await getTunnelConfig()

  return (
    <div className="p-8 space-y-6">
      <Link
        href="/admin/tunnel"
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[var(--color-cream-mute)] hover:text-[var(--color-gold-soft)] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Retour au tunnel
      </Link>
      <div>
        <p className="eyebrow eyebrow--single mb-3">Éditeur</p>
        <h1 className="display-serif text-4xl text-[var(--color-cream)] tracking-tight">Questions du tunnel</h1>
        <p className="text-sm text-[var(--color-cream-dim)] mt-2 max-w-2xl">
          Modifiez, ajoutez ou supprimez les questions et leurs réponses. Le routage « → étape suivante »
          détermine l’enchaînement. Les changements s’appliquent au tunnel public dès l’enregistrement.
        </p>
      </div>

      <TunnelEditor config={config} source={source} />
    </div>
  )
}
