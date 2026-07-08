'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  seedDefaultAction,
  upsertStepAction,
  deleteStepAction,
  reorderStepsAction,
} from '@/app/admin/tunnel/editor/actions'
import type { TunnelConfig, TunnelStepDef, TunnelOptionDef } from '@/lib/types'
import { Plus, Trash2, ChevronUp, ChevronDown, Save, Loader2, RotateCcw, X } from 'lucide-react'

const STEP_TYPES = [
  { v: 'choice', l: 'Choix (réponses)' },
  { v: 'input', l: 'Saisie libre' },
  { v: 'contact', l: 'Coordonnées' },
  { v: 'finalize', l: 'Finalisation' },
  { v: 'result', l: 'Résultat' },
]
const INPUT_TYPES = ['text', 'number', 'email', 'tel']

export default function TunnelEditor({ config, source }: { config: TunnelConfig; source: 'db' | 'default' }) {
  const router = useRouter()
  const [steps, setSteps] = useState<TunnelStepDef[]>(config.steps)
  const [seeding, startSeed] = useTransition()
  const isDb = source === 'db'

  const allIds = steps.map((s) => s.id)
  const originalIds = new Set(config.steps.map((s) => s.id))

  const seed = () => startSeed(async () => { await seedDefaultAction(); router.refresh() })

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= steps.length) return
    const next = [...steps]
    ;[next[i], next[j]] = [next[j], next[i]]
    setSteps(next)
    reorderStepsAction(next.map((s) => s.id)).catch(() => {})
  }

  const addStep = () => {
    const id = `etape_${steps.length + 1}`
    setSteps([
      ...steps,
      { id, type: 'choice', title: 'Nouvelle question', subtitle: '', progress: 50, position: steps.length, options: [], default_next_step_id: null, branch_on: null },
    ])
  }

  if (!isDb) {
    return (
      <div className="space-y-6">
        <div className="admin-card border-amber-500/30">
          <h2 className="display-serif text-xl text-[var(--color-cream)] mb-2">Activer l’édition</h2>
          <p className="text-sm text-[var(--color-cream-dim)] mb-4 max-w-2xl">
            Le tunnel utilise actuellement le <strong>parcours par défaut</strong> (codé dans l’application).
            Pour pouvoir modifier les questions et réponses, importez-le d’abord dans la base. Le tunnel
            continuera de fonctionner exactement à l’identique, vous pourrez ensuite l’éditer librement.
          </p>
          <button onClick={seed} disabled={seeding} className="btn-gold text-sm px-4 py-2.5">
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
            Importer le parcours par défaut
          </button>
        </div>

        <div className="admin-card !p-0 overflow-hidden">
          <div className="px-6 py-3 border-b border-[var(--color-ink-line)] text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)]">
            Aperçu, {steps.length} étapes (lecture seule)
          </div>
          <div className="divide-y divide-[var(--color-ink-line)]">
            {steps.map((s) => (
              <div key={s.id} className="px-6 py-3 flex items-center gap-3">
                <span className="text-[11px] font-mono text-[var(--color-cream-mute)] w-40 truncate">{s.id}</span>
                <span className="text-sm text-[var(--color-cream-dim)] flex-1 truncate">{s.title}</span>
                <span className="text-[10px] font-mono text-[var(--color-cream-mute)]">{s.progress}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-[var(--color-cream-dim)]">
          {steps.length} étapes · les modifications s’appliquent au tunnel public après enregistrement.
        </p>
        <div className="flex gap-2">
          <button onClick={addStep} className="btn-gold text-sm px-4 py-2">
            <Plus className="w-4 h-4" /> Ajouter une étape
          </button>
          <ResetButton onReset={seed} pending={seeding} />
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => (
          <StepCard
            key={step.id + i}
            step={step}
            allIds={allIds}
            isFirst={step.id === config.firstStepId}
            isNew={!originalIds.has(step.id)}
            canUp={i > 0}
            canDown={i < steps.length - 1}
            onMove={(dir) => move(i, dir)}
            onLocalRemove={() => setSteps(steps.filter((_, k) => k !== i))}
          />
        ))}
      </div>
    </div>
  )
}

function ResetButton({ onReset, pending }: { onReset: () => void; pending: boolean }) {
  const [confirm, setConfirm] = useState(false)
  if (confirm) {
    return (
      <span className="inline-flex items-center gap-2">
        <button onClick={onReset} disabled={pending} className="text-xs px-3 py-2 rounded-lg border border-red-200 text-red-600 bg-red-50">
          {pending ? 'Réinitialisation…' : 'Confirmer la réinitialisation'}
        </button>
        <button onClick={() => setConfirm(false)} className="text-xs text-[var(--color-cream-mute)]">Annuler</button>
      </span>
    )
  }
  return (
    <button onClick={() => setConfirm(true)} className="text-xs px-3 py-2 rounded-lg border border-[var(--color-ink-line)] text-[var(--color-cream-dim)] hover:text-[var(--color-cream)] inline-flex items-center gap-1.5">
      <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser au défaut
    </button>
  )
}

function StepCard({
  step: initial,
  allIds,
  isFirst,
  isNew,
  canUp,
  canDown,
  onMove,
  onLocalRemove,
}: {
  step: TunnelStepDef
  allIds: string[]
  isFirst: boolean
  isNew: boolean
  canUp: boolean
  canDown: boolean
  onMove: (dir: -1 | 1) => void
  onLocalRemove: () => void
}) {
  const router = useRouter()
  const [s, setS] = useState<TunnelStepDef>(initial)
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<string | null>(null)

  const set = <K extends keyof TunnelStepDef>(k: K, v: TunnelStepDef[K]) => setS((p) => ({ ...p, [k]: v }))

  const setOpt = (idx: number, k: keyof TunnelOptionDef, v: string) =>
    setS((p) => ({ ...p, options: p.options.map((o, i) => (i === idx ? { ...o, [k]: v } : o)) }))
  const addOpt = () =>
    setS((p) => ({ ...p, options: [...p.options, { value: `option_${p.options.length + 1}`, label: '', description: '', next_step_id: null }] }))
  const removeOpt = (idx: number) => setS((p) => ({ ...p, options: p.options.filter((_, i) => i !== idx) }))

  const save = () => {
    setMsg(null)
    start(async () => {
      try {
        await upsertStepAction(s, isFirst)
        setMsg('Enregistré')
        router.refresh()
      } catch (e) {
        setMsg(e instanceof Error ? e.message : 'Erreur')
      }
    })
  }
  const remove = () => start(async () => { await deleteStepAction(s.id); onLocalRemove(); router.refresh() })

  const showOptions = s.type === 'choice' || s.type === 'contact'

  return (
    <details className="admin-card !p-0 overflow-hidden group">
      <summary className="flex items-center gap-3 px-5 py-3.5 cursor-pointer list-none">
        <span className="flex flex-col gap-0.5">
          <button type="button" onClick={(e) => { e.preventDefault(); onMove(-1) }} disabled={!canUp} className="text-[var(--color-cream-mute)] hover:text-[var(--color-gold-soft)] disabled:opacity-20"><ChevronUp className="w-3.5 h-3.5" /></button>
          <button type="button" onClick={(e) => { e.preventDefault(); onMove(1) }} disabled={!canDown} className="text-[var(--color-cream-mute)] hover:text-[var(--color-gold-soft)] disabled:opacity-20"><ChevronDown className="w-3.5 h-3.5" /></button>
        </span>
        <span className="font-mono text-[11px] text-[var(--color-cream-mute)] w-40 truncate">{s.id}{isFirst && ' ·1re'}</span>
        <span className="text-sm text-[var(--color-cream)] flex-1 truncate">{s.title || '—'}</span>
        <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--color-cream-mute)] border border-[var(--color-ink-line)] rounded px-1.5 py-0.5">{s.type}</span>
        <ChevronDown className="w-4 h-4 text-[var(--color-cream-mute)] transition-transform group-open:rotate-180" />
      </summary>

      <div className="border-t border-[var(--color-ink-line)] p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Identifiant (slug)">
            <input className="tunnel-input text-sm font-mono" value={s.id} disabled={!isNew} onChange={(e) => set('id', e.target.value.replace(/[^a-z0-9_]/g, ''))} />
          </Field>
          <Field label="Type">
            <select className="tunnel-input text-sm" value={s.type} onChange={(e) => set('type', e.target.value as TunnelStepDef['type'])}>
              {STEP_TYPES.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}
            </select>
          </Field>
          <Field label="Progression (%)">
            <input type="number" min={0} max={100} className="tunnel-input text-sm" value={s.progress} onChange={(e) => set('progress', parseInt(e.target.value) || 0)} />
          </Field>
        </div>

        <Field label="Question / titre">
          <input className="tunnel-input text-sm" value={s.title} onChange={(e) => set('title', e.target.value)} />
        </Field>
        <Field label="Sous-titre (optionnel)">
          <textarea className="tunnel-input text-sm resize-y" rows={2} value={s.subtitle ?? ''} onChange={(e) => set('subtitle', e.target.value)} />
        </Field>

        {s.type === 'input' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Field label="Type de champ">
              <select className="tunnel-input text-sm" value={s.inputType ?? 'text'} onChange={(e) => set('inputType', e.target.value as TunnelStepDef['inputType'])}>
                {INPUT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Libellé"><input className="tunnel-input text-sm" value={s.inputLabel ?? ''} onChange={(e) => set('inputLabel', e.target.value)} /></Field>
            <Field label="Placeholder"><input className="tunnel-input text-sm" value={s.inputPlaceholder ?? ''} onChange={(e) => set('inputPlaceholder', e.target.value)} /></Field>
            <Field label="Suffixe"><input className="tunnel-input text-sm" value={s.inputSuffix ?? ''} onChange={(e) => set('inputSuffix', e.target.value)} /></Field>
          </div>
        )}

        {/* Routage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Étape suivante par défaut">
            <NextSelect ids={allIds} value={s.default_next_step_id ?? ''} onChange={(v) => set('default_next_step_id', v || null)} />
          </Field>
          {s.type === 'contact' && (
            <Field label="Brancher selon le champ (avancé)">
              <input className="tunnel-input text-sm font-mono" value={s.branch_on ?? ''} onChange={(e) => set('branch_on', e.target.value || null)} placeholder="entry" />
            </Field>
          )}
        </div>

        {/* Options / réponses */}
        {showOptions && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)]">
                {s.type === 'contact' ? 'Règles de routage' : 'Réponses'}
              </p>
              <button onClick={addOpt} className="text-xs text-[var(--color-gold-soft)] inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Ajouter</button>
            </div>
            {s.options.map((o, idx) => (
              <div key={idx} className="rounded-lg border border-[var(--color-ink-line)] p-3 grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_1.4fr_auto] gap-2 items-start">
                <input className="tunnel-input text-xs font-mono" value={o.value} onChange={(e) => setOpt(idx, 'value', e.target.value)} placeholder="valeur" />
                <input className="tunnel-input text-xs" value={o.label} onChange={(e) => setOpt(idx, 'label', e.target.value)} placeholder="libellé affiché" />
                <NextSelect ids={allIds} value={o.next_step_id ?? ''} onChange={(v) => setOpt(idx, 'next_step_id', v)} small />
                <button onClick={() => removeOpt(idx)} className="text-[var(--color-cream-mute)] hover:text-red-600 justify-self-end p-1.5"><X className="w-4 h-4" /></button>
                {s.type === 'choice' && (
                  <input className="tunnel-input text-xs sm:col-span-4" value={o.description ?? ''} onChange={(e) => setOpt(idx, 'description', e.target.value)} placeholder="description (optionnelle)" />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-1">
          <DeleteStep onDelete={remove} pending={pending} />
          <div className="flex items-center gap-3">
            {msg && <span className={`text-xs ${msg === 'Enregistré' ? 'text-emerald-700' : 'text-red-600'}`}>{msg}</span>}
            <button onClick={save} disabled={pending} className="btn-gold text-xs px-4 py-2">
              {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Enregistrer
            </button>
          </div>
        </div>
      </div>
    </details>
  )
}

function DeleteStep({ onDelete, pending }: { onDelete: () => void; pending: boolean }) {
  const [c, setC] = useState(false)
  return c ? (
    <span className="inline-flex items-center gap-2 text-xs">
      <button onClick={onDelete} disabled={pending} className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 bg-red-50 inline-flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5" /> Supprimer</button>
      <button onClick={() => setC(false)} className="text-[var(--color-cream-mute)]">Annuler</button>
    </span>
  ) : (
    <button onClick={() => setC(true)} className="text-xs text-[var(--color-cream-mute)] hover:text-red-600 inline-flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5" /> Supprimer l’étape</button>
  )
}

function NextSelect({ ids, value, onChange, small }: { ids: string[]; value: string; onChange: (v: string) => void; small?: boolean }) {
  return (
    <select className={`tunnel-input ${small ? 'text-xs' : 'text-sm'}`} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">— Fin du parcours —</option>
      {ids.map((id) => <option key={id} value={id}>{id}</option>)}
    </select>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--color-cream-mute)]">{label}</label>
      {children}
    </div>
  )
}
