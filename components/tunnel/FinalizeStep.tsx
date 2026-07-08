'use client'

import { useRef, useState } from 'react'
import { ArrowRight, Sparkles, Paperclip, X, FileText, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { LeadCaptureData, LeadDocument, TunnelStepDef } from '@/lib/types'

interface FinalizeStepProps {
  step: TunnelStepDef
  contact: LeadCaptureData | null
  answers: Record<string, string>
  isSubmitting: boolean
  onFinalize: (extra: { projectDetails: string; documents: LeadDocument[] }) => void
}

const AMOUNT_KEYS = [
  'tresorerie_amount', 'materiel_amount', 'vehicule_amount', 'lancement_amount',
  'developpement_amount', 'levee_amount', 'reprise_price', 'immo_amount', 'assurance_amount',
]

const MAX_DETAILS = 3000
const MAX_FILE_MB = 10
const MAX_FILES = 6
const ACCEPTED = '.pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg'

function formatEuro(raw: string): string {
  const n = parseInt(raw.replace(/\D/g, ''))
  if (isNaN(n) || n === 0) return ''
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

function formatSize(bytes?: number): string {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

function sanitize(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
}

export default function FinalizeStep({ step, contact, answers, isSubmitting, onFinalize }: FinalizeStepProps) {
  const amountKey = AMOUNT_KEYS.find((k) => answers[k])
  const amount = amountKey ? formatEuro(answers[amountKey]) : ''
  const fullName = contact ? `${contact.first_name} ${contact.last_name}`.trim() : ''

  const [projectDetails, setProjectDetails] = useState('')
  const [documents, setDocuments] = useState<LeadDocument[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? [])
    if (picked.length === 0) return
    setUploadError(null)

    if (documents.length + picked.length > MAX_FILES) {
      setUploadError(`Vous pouvez joindre au maximum ${MAX_FILES} documents.`)
      if (fileRef.current) fileRef.current.value = ''
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const uploaded: LeadDocument[] = []
      for (const file of picked) {
        if (file.size > MAX_FILE_MB * 1024 * 1024) {
          setUploadError(`« ${file.name} » dépasse ${MAX_FILE_MB} Mo et n'a pas été ajouté.`)
          continue
        }
        const rand = Math.random().toString(36).slice(2, 10)
        const path = `${Date.now()}-${rand}-${sanitize(file.name)}`
        const { error } = await supabase.storage.from('lead-documents').upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        })
        if (error) {
          setUploadError(`Envoi impossible pour « ${file.name} » : ${error.message}`)
          continue
        }
        uploaded.push({ name: file.name, path, size: file.size })
      }
      if (uploaded.length) setDocuments((prev) => [...prev, ...uploaded])
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const removeDoc = (path: string) => {
    setDocuments((prev) => prev.filter((d) => d.path !== path))
  }

  const handleSubmit = () => {
    if (uploading) return
    onFinalize({ projectDetails: projectDetails.trim(), documents })
  }

  return (
    <div className="chc-step-wrap">
      <span className="chc-tunnel__icon"><Sparkles className="w-6 h-6" strokeWidth={1.7} /></span>
      <p className="chc-tunnel__eyebrow">Dernière étape</p>
      <h1 className="chc-tunnel__title">{step.title}</h1>
      {step.subtitle && <p className="chc-tunnel__lead">{step.subtitle}</p>}

      <div className="chc-recap">
        {fullName && (
          <div className="chc-recap__row">
            <span className="chc-recap__k">Contact</span>
            <span className="chc-recap__v">{fullName}</span>
          </div>
        )}
        {contact?.email && (
          <div className="chc-recap__row">
            <span className="chc-recap__k">Email</span>
            <span className="chc-recap__v">{contact.email}</span>
          </div>
        )}
        {contact?.phone && (
          <div className="chc-recap__row">
            <span className="chc-recap__k">Téléphone</span>
            <span className="chc-recap__v">{contact.phone}</span>
          </div>
        )}
        {contact?.company_name && (
          <div className="chc-recap__row">
            <span className="chc-recap__k">Société</span>
            <span className="chc-recap__v">{contact.company_name}</span>
          </div>
        )}
        {contact?.siret && (
          <div className="chc-recap__row">
            <span className="chc-recap__k">SIRET</span>
            <span className="chc-recap__v">{contact.siret}</span>
          </div>
        )}
        {amount && (
          <div className="chc-recap__row">
            <span className="chc-recap__k">Montant</span>
            <span className="chc-recap__v">{amount}</span>
          </div>
        )}
      </div>

      <div className="chc-form" style={{ marginTop: 24 }}>
        {/* Description libre du projet */}
        <div className="chc-field">
          <label className="chc-label" htmlFor="chc-project-details">
            Décrivez votre projet <span className="chc-label-opt">(facultatif)</span>
          </label>
          <textarea
            id="chc-project-details"
            className="chc-textarea"
            rows={5}
            maxLength={MAX_DETAILS}
            value={projectDetails}
            onChange={(e) => setProjectDetails(e.target.value)}
            placeholder="Contexte, objectifs, calendrier, montants, informations utiles à l'analyse de votre dossier…"
          />
          <p className="chc-counter">{projectDetails.length} / {MAX_DETAILS}</p>
        </div>

        {/* Upload de documents */}
        <div className="chc-field">
          <label className="chc-label">
            Vos documents <span className="chc-label-opt">(bilans, devis, pièces justificatives, facultatif)</span>
          </label>

          <input
            ref={fileRef}
            type="file"
            multiple
            accept={ACCEPTED}
            onChange={handleFiles}
            className="chc-file-input"
            id="chc-doc-upload"
            disabled={uploading || documents.length >= MAX_FILES}
          />
          <label htmlFor="chc-doc-upload" className="chc-dropzone" data-disabled={uploading || documents.length >= MAX_FILES}>
            {uploading ? (
              <><Loader2 className="w-4 h-4 chc-spin" /> Envoi en cours…</>
            ) : (
              <><Paperclip className="w-4 h-4" /> Ajouter des documents</>
            )}
          </label>
          <p className="chc-file-hint">PDF, Word, Excel, images · {MAX_FILE_MB} Mo max par fichier · {MAX_FILES} fichiers max</p>

          {uploadError && <p className="chc-error">{uploadError}</p>}

          {documents.length > 0 && (
            <ul className="chc-doclist">
              {documents.map((doc) => (
                <li key={doc.path} className="chc-doc">
                  <FileText className="w-4 h-4 chc-doc__icon" />
                  <span className="chc-doc__name">{doc.name}</span>
                  {doc.size ? <span className="chc-doc__size">{formatSize(doc.size)}</span> : null}
                  <button
                    type="button"
                    className="chc-doc__rm"
                    onClick={() => removeDoc(doc.path)}
                    aria-label={`Retirer ${doc.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="button" className="chc-btn chc-btn-gold" disabled={isSubmitting || uploading} onClick={handleSubmit}>
          {isSubmitting ? (
            <>
              <span className="chc-btn-spin" />
              Envoi en cours…
            </>
          ) : (
            <>
              Recevoir mon analyse gratuite
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
