'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import type { TunnelStepDef } from '@/lib/types'
import { stepGlyph } from './stepIcons'

interface InputStepProps {
  step: TunnelStepDef
  onAnswer: (value: string) => void
}

export default function InputStep({ step, onAnswer }: InputStepProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(t)
  }, [step.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) onAnswer(value.trim())
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (step.inputType === 'number') {
      const raw = e.target.value.replace(/\s/g, '').replace(/\D/g, '')
      setValue(raw)
    } else {
      setValue(e.target.value)
    }
  }

  const displayValue =
    step.inputType === 'number' && value
      ? new Intl.NumberFormat('fr-FR').format(parseInt(value) || 0)
      : value

  const isEmpty = !value.trim()

  return (
    <form onSubmit={handleSubmit} className="chc-step-wrap">
      <span className="chc-tunnel__icon">{stepGlyph(step)}</span>
      <p className="chc-tunnel__eyebrow">Étape</p>
      <h1 className="chc-tunnel__title">{step.title}</h1>
      {step.subtitle && <p className="chc-tunnel__lead">{step.subtitle}</p>}

      <div className="chc-form">
        <div className="chc-field">
          {step.inputLabel && <label htmlFor="tunnel-input" className="chc-label">{step.inputLabel}</label>}
          <div className="chc-input-wrap">
            <input
              ref={inputRef}
              id="tunnel-input"
              type={step.inputType === 'number' ? 'text' : (step.inputType ?? 'text')}
              inputMode={step.inputType === 'number' ? 'numeric' : undefined}
              value={step.inputType === 'number' ? displayValue : value}
              onChange={handleChange}
              placeholder={step.inputPlaceholder ?? undefined}
              className={`chc-input ${step.inputSuffix ? 'chc-input--suffix' : ''}`}
              required
            />
            {step.inputSuffix && <span className="chc-input-suffix">{step.inputSuffix}</span>}
          </div>
        </div>

        <button type="submit" className="chc-btn chc-btn-gold" disabled={isEmpty}>
          Continuer
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  )
}
