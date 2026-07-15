import { Fingerprint, ShieldCheck, Clock } from 'lucide-react'
import { listPasskeys } from '@/lib/admin/passkeys'
import { formatRelativeDate } from '@/lib/admin/labels'
import PasskeyActions from '@/components/admin/PasskeyActions'
import AddOwnPasskey from '@/components/admin/AddOwnPasskey'

export const dynamic = 'force-dynamic'

export default async function ParametresPage() {
  const passkeys = await listPasskeys()
  const pending = passkeys.filter((p) => p.status === 'pending')
  const approved = passkeys.filter((p) => p.status === 'approved')

  return (
    <div className="p-8 lg:p-10 space-y-8">
      <div className="page-header">
        <span className="page-header__index">04, Sécurité</span>
        <h1 className="page-header__title">Paramètres</h1>
        <p className="page-header__lead">
          Empreintes digitales autorisées à ouvrir l’espace admin. Validez une demande pour
          l’activer ; révoquez une empreinte pour couper son accès.
        </p>
      </div>

      <AddOwnPasskey />

      {/* Demandes en attente */}
      <section className="space-y-3">
        <h2 className="eyebrow eyebrow--single flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" /> Demandes en attente {pending.length > 0 ? `(${pending.length})` : ''}
        </h2>
        <div className="admin-card !p-0 overflow-hidden">
          {pending.length === 0 ? (
            <div className="py-10 text-center text-[var(--color-cream-mute)] text-sm">
              Aucune demande en attente.
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-ink-line)]">
              {pending.map((p) => (
                <div key={p.id} className="flex items-center gap-4 px-6 py-4">
                  <Fingerprint className="w-5 h-5 text-[var(--color-gold-soft)] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--color-cream)] truncate">{p.email}</div>
                    <div className="text-xs text-[var(--color-cream-mute)] mt-1">
                      {p.label ?? 'Empreinte'} · demandée {formatRelativeDate(p.created_at)}
                    </div>
                  </div>
                  <PasskeyActions id={p.id} status="pending" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Empreintes validées */}
      <section className="space-y-3">
        <h2 className="eyebrow eyebrow--single flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5" /> Empreintes validées {approved.length > 0 ? `(${approved.length})` : ''}
        </h2>
        <div className="admin-card !p-0 overflow-hidden">
          {approved.length === 0 ? (
            <div className="py-10 text-center text-[var(--color-cream-mute)] text-sm">
              Aucune empreinte validée pour l’instant.
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-ink-line)]">
              {approved.map((p) => (
                <div key={p.id} className="flex items-center gap-4 px-6 py-4">
                  <Fingerprint className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--color-cream)] truncate">{p.email}</div>
                    <div className="text-xs text-[var(--color-cream-mute)] mt-1">
                      {p.label ?? 'Empreinte'} · ajoutée {formatRelativeDate(p.created_at)}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.16em] px-2 py-0.5 rounded border border-emerald-300 text-emerald-700 bg-emerald-50">
                    Validée
                  </span>
                  <PasskeyActions id={p.id} status="approved" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
