'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { TunnelStepDef } from '@/lib/types'
import { stepGlyph, optionGlyph } from './stepIcons'

interface ChoiceStepProps {
  step: TunnelStepDef
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
    <div className="chc-step-wrap">
      <span className="chc-tunnel__icon">{stepGlyph(step)}</span>
      <p className="chc-tunnel__eyebrow">Étape</p>
      <h1 className="chc-tunnel__title">{step.title}</h1>
      {step.subtitle && <p className="chc-tunnel__lead">{step.subtitle}</p>}

      <div className="chc-choices">
        {step.options?.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            disabled={selected !== null && selected !== option.value}
            className={`chc-choice ${selected === option.value ? 'is-selected' : ''}`}
          >
            <span className="chc-choice__icon">{optionGlyph(option.value)}</span>
            <span className="min-w-0 flex-1 text-left">
              <span className="chc-choice__name block">{option.label}</span>
              {option.description && <span className="chc-choice__desc block">{option.description}</span>}
            </span>
            <span className="chc-choice__chev">
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
