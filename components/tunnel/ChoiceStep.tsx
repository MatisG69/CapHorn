'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { StepConfig } from '@/lib/types'

interface ChoiceStepProps {
  step: StepConfig
  onAnswer: (value: string) => void
}

export default function ChoiceStep({ step, onAnswer }: ChoiceStepProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (value: string) => {
    if (selected) return
    setSelected(value)
    setTimeout(() => onAnswer(value), 200)
  }

  return (
    <div className="space-y-10">
      {/* Question */}
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

      {/* Options */}
      <div className="space-y-3">
        {step.options?.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            disabled={selected !== null && selected !== option.value}
            className={`tunnel-choice group ${selected === option.value ? 'is-selected' : ''}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0 text-left">
                <div className="font-medium text-[1rem] leading-snug transition-colors text-[var(--color-cream)] group-hover:text-[var(--color-gold-soft)]">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-[13px] text-[var(--color-cream-dim)] mt-1.5 leading-relaxed">
                    {option.description}
                  </div>
                )}
              </div>
              <div className="tunnel-choice__chev">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
