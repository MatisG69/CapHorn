export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[--color-foreground]">Paramètres</h1>
        <p className="text-sm text-[--color-muted] mt-1">Configuration de votre espace Cap Horn</p>
      </div>

      <div className="bg-[--color-surface] rounded-xl border border-[--color-border-light] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[--color-foreground]">Informations cabinet</h2>
        <div className="space-y-4">
          <SettingRow label="Nom du cabinet" value="Cap Horn Conseils" />
          <SettingRow label="Secteur" value="Courtage & Financement" />
          <SettingRow label="Version logiciel" value="V1.0 — Production" />
        </div>
      </div>

      <div className="bg-[--color-surface] rounded-xl border border-[--color-border-light] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[--color-foreground]">Intégrations prévues (V2)</h2>
        <div className="space-y-3">
          {[
            { name: 'Supabase Auth', status: 'Actif', ok: true },
            { name: 'Supabase DB', status: 'Actif', ok: true },
            { name: 'Email automatique', status: 'À configurer', ok: false },
            { name: 'Calendly / Cal.com', status: 'À configurer', ok: false },
            { name: 'GA4 / Analytics', status: 'À configurer', ok: false },
            { name: 'Pappers (enrichissement SIRET)', status: 'À configurer', ok: false },
          ].map(({ name, status, ok }) => (
            <div
              key={name}
              className="flex items-center justify-between py-2.5 border-b border-[--color-border-light] last:border-0"
            >
              <span className="text-sm text-[--color-foreground]">{name}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full border ${
                  ok
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
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

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-[--color-border-light] last:border-0">
      <span className="text-sm text-[--color-muted]">{label}</span>
      <span className="text-sm font-medium text-[--color-foreground]">{value}</span>
    </div>
  )
}
