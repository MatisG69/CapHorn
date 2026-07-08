import Link from 'next/link'
import { getLeads } from '@/lib/supabase/queries'
import { getTunnelConfig } from '@/lib/tunnel/loader'
import { stepLabel } from '@/lib/admin/labels'
import { PARCOURS, MISSING_PARCOURS, walkParcours, type WalkedStep } from '@/lib/tunnel/walk'
import { AlertTriangle, ChevronDown, CornerDownRight, Pencil } from 'lucide-react'

export const dynamic = 'force-dynamic'

const TYPE_LABEL: Record<string, string> = {
  choice: 'Choix',
  input: 'Saisie',
  contact: 'Coordonnées',
  finalize: 'Finalisation',
  capture: 'Finalisation',
  result: 'Résultat',
}

export default async function AdminTunnelPage() {
  const [inProgress, completed, { config, source }] = await Promise.all([
    getLeads({ completed: false }),
    getLeads({ completed: true }),
    getTunnelConfig(),
  ])

  const started = inProgress.length + completed.length
  const completionRate = started > 0 ? Math.round((completed.length / started) * 100) : 0

  // Analytics de décrochage : où s'arrêtent les dossiers non finis
  const dropMap = new Map<string, number>()
  for (const lead of inProgress) {
    const key = lead.current_step ?? 'inconnu'
    dropMap.set(key, (dropMap.get(key) ?? 0) + 1)
  }
  const drops = [...dropMap.entries()]
    .map(([step, count]) => ({ step, count }))
    .sort((a, b) => b.count - a.count)
  const maxDrop = drops[0]?.count ?? 1

  // Regroupe les parcours par profil
  const groups = [...new Set(PARCOURS.map((p) => p.group))]

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow eyebrow--single mb-3">Tunnel de conversion</p>
          <h1 className="display-serif text-4xl text-[var(--color-cream)] tracking-tight">Parcours &amp; décrochage</h1>
          <p className="text-sm text-[var(--color-cream-dim)] mt-2">
            Le déroulé de chaque parcours et l’endroit exact où les leads s’arrêtent, pour affiner vos questions.
            <span className="ml-2 text-[var(--color-cream-mute)] font-mono text-xs">
              · Config : {source === 'db' ? 'personnalisée' : 'par défaut'}
            </span>
          </p>
        </div>
        <Link href="/admin/tunnel/editor" className="btn-gold text-sm px-4 py-2.5">
          <Pencil className="w-4 h-4" /> Éditer les questions
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Dossiers démarrés', value: started },
          { label: 'Finalisés (100 %)', value: completed.length },
          { label: 'En cours', value: inProgress.length },
          { label: 'Taux de finalisation', value: `${completionRate}%` },
        ].map((k) => (
          <div key={k.label} className="admin-card">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)]">{k.label}</p>
            <p className="display-serif text-[2.5rem] text-[var(--color-gold-soft)] tabular-nums leading-none mt-3">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Décrochage */}
      <div className="admin-card">
        <h2 className="eyebrow eyebrow--single mb-1">Où les leads s’arrêtent</h2>
        <p className="text-xs text-[var(--color-cream-mute)] mb-5">
          Étapes où se trouvent les dossiers non finalisés. Une étape qui concentre beaucoup d’arrêts mérite d’être simplifiée.
        </p>
        {drops.length === 0 ? (
          <p className="text-sm text-[var(--color-cream-mute)]">Aucun dossier en cours pour le moment.</p>
        ) : (
          <div className="space-y-2.5">
            {drops.map((d) => (
              <div key={d.step} className="flex items-center gap-3">
                <span className="text-sm text-[var(--color-cream-dim)] w-64 truncate">{stepLabel(d.step)}</span>
                <div className="flex-1 h-2 bg-[var(--color-ink-raised)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.round((d.count / maxDrop) * 100)}%`,
                      background: 'linear-gradient(90deg, var(--color-gold-deep), var(--color-gold-soft))',
                    }}
                  />
                </div>
                <span className="text-xs font-mono tabular-nums text-[var(--color-cream-dim)] w-10 text-right">{d.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Parcours manquants */}
      <div className="admin-card border-amber-500/30">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <h2 className="eyebrow eyebrow--single">Parcours évoqués, à créer</h2>
        </div>
        <ul className="space-y-1.5">
          {MISSING_PARCOURS.map((m) => (
            <li key={m} className="text-sm text-[var(--color-cream-dim)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70" /> {m}
            </li>
          ))}
        </ul>
      </div>

      {/* Déroulé des parcours */}
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group}>
            <h2 className="eyebrow eyebrow--single mb-4">{group}</h2>
            <div className="space-y-3">
              {PARCOURS.filter((p) => p.group === group).map((p) => {
                const steps = walkParcours(config, p.seed)
                return (
                  <details key={p.label} className="admin-card !p-0 overflow-hidden group">
                    <summary className="flex items-center justify-between gap-3 px-6 py-4 cursor-pointer list-none select-none">
                      <span className="flex items-center gap-3 min-w-0">
                        <span className="text-sm font-medium text-[var(--color-cream)]">{p.label}</span>
                        <span className="text-xs text-[var(--color-cream-mute)] font-mono">{steps.length} étapes</span>
                      </span>
                      <ChevronDown className="w-4 h-4 text-[var(--color-cream-mute)] transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="border-t border-[var(--color-ink-line)] divide-y divide-[var(--color-ink-line)]">
                      {steps.map((s, i) => (
                        <StepRow key={`${s.id}-${i}`} step={s} index={i} />
                      ))}
                    </div>
                  </details>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepRow({ step, index }: { step: WalkedStep; index: number }) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="w-6 h-6 shrink-0 rounded-full border border-[var(--color-gold-deep)] flex items-center justify-center text-[11px] font-mono text-[var(--color-gold-soft)]">
          {index + 1}
        </span>
        <span className="text-sm text-[var(--color-cream)] font-medium">{step.title}</span>
        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--color-cream-mute)] border border-[var(--color-ink-line)] rounded px-1.5 py-0.5">
          {TYPE_LABEL[step.type] ?? step.type}
        </span>
        <span className="text-[10px] font-mono text-[var(--color-cream-mute)] ml-auto">{step.progress}%</span>
      </div>

      {step.options.length > 0 && (
        <div className="mt-3 ml-9 space-y-1.5">
          {step.options.map((o) => (
            <div key={o.value} className="flex items-start gap-2 text-xs">
              <CornerDownRight className="w-3 h-3 text-[var(--color-cream-mute)] mt-0.5 shrink-0" />
              <span className="text-[var(--color-cream-dim)]">{o.label}</span>
              <span className="text-[var(--color-cream-mute)]">→ {o.target}</span>
            </div>
          ))}
        </div>
      )}
      {step.type === 'input' && step.nextTitle && (
        <div className="mt-2 ml-9 flex items-center gap-2 text-xs text-[var(--color-cream-mute)]">
          <CornerDownRight className="w-3 h-3 shrink-0" /> Saisie → {step.nextTitle}
        </div>
      )}
    </div>
  )
}
