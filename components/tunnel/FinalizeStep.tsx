'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import type { LeadCaptureData, TunnelStepDef } from '@/lib/types'

interface FinalizeStepProps {
  step: TunnelStepDef
  contact: LeadCaptureData | null
  answers: Record<string, string>
  isSubmitting: boolean
  onFinalize: () => void
}

const AMOUNT_KEYS = [
  'tresorerie_amount', 'materiel_amount', 'vehicule_amount', 'lancement_amount',
  'developpement_amount', 'levee_amount', 'reprise_price', 'immo_amount', 'assurance_amount',
]

function formatEuro(raw: string): string {
  const n = parseInt(raw.replace(/\D/g, ''))
  if (isNaN(n) || n === 0) return ''
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

export default function FinalizeStep({ step, contact, answers, isSubmitting, onFinalize }: FinalizeStepProps) {
  const amountKey = AMOUNT_KEYS.find((k) => answers[k])
  const amount = amountKey ? formatEuro(answers[amountKey]) : ''
  const fullName = contact ? `${contact.first_name} ${contact.last_name}`.trim() : ''

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
        {amount && (
          <div className="chc-recap__row">
            <span className="chc-recap__k">Montant</span>
            <span className="chc-recap__v">{amount}</span>
          </div>
        )}
      </div>

      <div className="chc-form" style={{ marginTop: 24 }}>
        <button type="button" className="chc-btn chc-btn-gold" disabled={isSubmitting} onClick={onFinalize}>
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
