import { getSimulatorEstimations } from '@/lib/supabase/queries'
import { getSimulatorSettings } from '@/lib/simulateur/settings'
import SimulatorSettingsForm from '@/components/admin/SimulatorSettingsForm'
import EstimationCard from '@/components/admin/EstimationCard'

export const dynamic = 'force-dynamic'

export default async function AdminSimulatorPage() {
  const [settings, estimations] = await Promise.all([
    getSimulatorSettings(),
    getSimulatorEstimations(),
  ])
  const newCount = estimations.filter((e) => e.status === 'new').length

  return (
    <div className="p-8 space-y-8">
      <div>
        <p className="eyebrow eyebrow--single mb-3">Simulateur</p>
        <h1 className="display-serif text-4xl text-[var(--color-cream)] tracking-tight">Simulateur d’assurance</h1>
        <p className="text-sm text-[var(--color-cream-dim)] mt-2">
          Réglez les paramètres de l’estimation côté client, et consultez les estimations envoyées par les visiteurs.
        </p>
      </div>

      {/* Paramètres */}
      <SimulatorSettingsForm initial={settings} />

      {/* Estimations reçues */}
      <div>
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <h2 className="text-[15px] font-semibold text-[var(--color-cream)]">Estimations envoyées</h2>
          <p className="text-sm text-[var(--color-cream-dim)]">
            {estimations.length} estimation{estimations.length !== 1 ? 's' : ''}
            {newCount > 0 && <span className="text-[var(--color-gold-soft)]"> · {newCount} à traiter</span>}
          </p>
        </div>

        {estimations.length === 0 ? (
          <div className="admin-card py-20 text-center text-[var(--color-cream-mute)] text-sm">
            Aucune estimation pour le moment. Celles envoyées via le bouton « Envoyer cette estimation à Guillaume »
            depuis le simulateur apparaîtront ici.
          </div>
        ) : (
          <div className="space-y-4">
            {estimations.map((e) => (
              <EstimationCard key={e.id} est={e} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
