'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import type { StepConfig } from '@/lib/types'

interface InputStepProps {
  step: StepConfig
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
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="space-y-4">
        <p className="eyebrow eyebrow--single text-[var(--color-gold-soft)]">Étape</p>
        <h1
          className="display-serif text-[var(--color-cream)] leading-[1.04]"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}
        >
          {step.title}
        </h1>
        {step.subtitle && (
          <p className="text-[var(--color-cream-dim)] text-[0.95rem] leading-relaxed max-w-lg">
            {step.subtitle}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {step.inputLabel && (
          <label
            htmlFor="tunnel-input"
            className="block text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)]"
          >
            {step.inputLabel}
          </label>
        )}

        <div className="relative">
          <input
            ref={inputRef}
            id="tunnel-input"
            type={step.inputType === 'number' ? 'text' : (step.inputType ?? 'text')}
            inputMode={step.inputType === 'number' ? 'numeric' : undefined}
            value={step.inputType === 'number' ? displayValue : value}
            onChange={handleChange}
            placeholder={step.inputPlaceholder}
            className="tunnel-input"
            style={step.inputSuffix ? { paddingRight: '52px' } : undefined}
            required
          />
          {step.inputSuffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-gold)] font-medium text-base pointer-events-none">
              {step.inputSuffix}
            </span>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="btn-gold w-full justify-center"
        disabled={isEmpty}
      >
        Continuer
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  )
}
