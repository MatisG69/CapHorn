import { Anchor, ShieldCheck, Database, Mail, Calendar, BarChart3, Building2 } from 'lucide-react'
import { getAdminSession } from '@/lib/admin/session'
import { ADMIN_EMAIL } from '@/lib/admin/auth'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const session = await getAdminSession()
  const email = session?.email ?? ADMIN_EMAIL

  return (
    <div className="p-8 lg:p-10 space-y-8 max-w-4xl">
      <div className="page-header">
        <span className="page-header__index">04 — Configuration</span>
        <h1 className="page-header__title">Paramètres</h1>
        <p className="page-header__lead">
          Configuration de votre espace Cap Horn et état des intégrations.
        </p>
      </div>

      {/* Compte */}
      <div className="admin-card space-y-5">
        <h2 className="eyebrow eyebrow--single">Compte connecté</h2>
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(180deg, var(--color-gold-soft), var(--color-gold))',
              boxShadow:
                '0 8px 18px -6px rgba(201, 168, 76, 0.45), inset 0 1px 0 rgba(255,255,255,0.4)',
            }}
          >
            <Anchor className="w-5 h-5 text-[var(--color-ink)]" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--color-cream)] truncate">
              {email}
            </p>
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-cream-mute)] mt-1">
              Administrateur · Cap Horn Conseils
            </p>
          </div>
        </div>
      </div>

      {/* Cabinet */}
      <div className="admin-card space-y-4">
        <h2 className="eyebrow eyebrow--single">Informations cabinet</h2>
        <div className="divide-y divide-[var(--color-ink-line)]">
          <SettingRow label="Nom du cabinet" value="Cap Horn Conseils" icon={Building2} />
          <SettingRow label="Secteur" value="Courtage & Financement" />
          <SettingRow label="Version logiciel" value="V1.0 — Production" />
        </div>
      </div>

      {/* Intégrations */}
      <div className="admin-card space-y-4">
        <h2 className="eyebrow eyebrow--single">Intégrations</h2>
        <div className="divide-y divide-[var(--color-ink-line)]">
          {[
            { name: 'Auth admin (mode dev)', status: 'Hardcodée', ok: true, icon: ShieldCheck },
            { name: 'Supabase Database', status: 'Actif', ok: true, icon: Database },
            { name: 'Email automatique', status: 'À configurer', ok: false, icon: Mail },
            { name: 'Calendly / Cal.com', status: 'À configurer', ok: false, icon: Calendar },
            { name: 'GA4 / Analytics', status: 'À configurer', ok: false, icon: BarChart3 },
          ].map(({ name, status, ok, icon: Icon }) => (
            <div key={name} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[rgba(201,168,76,0.06)] border border-[var(--color-ink-line)]">
                  <Icon className="w-4 h-4 text-[var(--color-gold-soft)]" strokeWidth={1.8} />
                </div>
                <span className="text-sm text-[var(--color-cream)]">{name}</span>
              </div>
              <span
                className={`text-[11px] font-mono uppercase tracking-[0.16em] px-2.5 py-1 rounded-full border ${
                  ok
                    ? 'bg-emerald-950/30 text-emerald-300 border-emerald-900/50'
                    : 'bg-[rgba(201,168,76,0.04)] text-[var(--color-cream-mute)] border-[var(--color-ink-line)]'
                }`}
              >
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SettingRow({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon?: React.ElementType
}) {
  return (
    <div className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-[var(--color-cream-mute)]" strokeWidth={1.8} />}
        <span className="text-xs font-mono uppercase tracking-[0.18em] text-[var(--color-cream-mute)]">
          {label}
        </span>
      </div>
      <span className="text-sm text-[var(--color-cream)] font-medium">{value}</span>
    </div>
  )
}
