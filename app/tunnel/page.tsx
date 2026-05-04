'use client'

import { useState } from 'react'
import { useTunnel } from '@/hooks/useTunnel'
import TunnelLayout from '@/components/tunnel/TunnelLayout'
import ChoiceStep from '@/components/tunnel/ChoiceStep'
import InputStep from '@/components/tunnel/InputStep'
import LeadCapture from '@/components/tunnel/LeadCapture'
import ResultStep from '@/components/tunnel/ResultStep'
import type { LeadCaptureData, MessageVariant, TunnelType, SubType } from '@/lib/types'
import { track } from '@/lib/tracking'

export default function TunnelPage() {
  const { state, currentStep, answer, back, getProgress, dispatch } = useTunnel()
  const [messageVariant, setMessageVariant] = useState<MessageVariant>('neutral')
  const [captureFirstName, setCaptureFirstName] = useState<string>('')
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')

  const handleAnswer = (value: string) => {
    setDirection('forward')
    answer(value)
  }

  const handleBack = () => {
    setDirection('back')
    back()
  }

  const handleCaptureSubmit = async (data: LeadCaptureData) => {
    dispatch({ type: 'SET_SUBMITTING', value: true })
    dispatch({ type: 'SET_ERROR', error: null })
    setCaptureFirstName(data.first_name)
    setDirection('forward')

    const tunnelType = (state.answers['entry'] ?? 'pro') as TunnelType
    const subType = (
      state.answers['pro_need'] ??
      state.answers['particulier_need'] ??
      state.answers['reseau_type'] ??
      'tresorerie'
    ) as SubType

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tunnel_type: tunnelType,
          sub_type: subType,
          answers: state.answers,
          capture: data,
        }),
      })
      if (res.ok) {
        const json = await res.json()
        setMessageVariant(json.message_variant ?? 'neutral')
        track('lead_submitted', { tunnel: tunnelType, sub_type: subType })
      }
    } catch {
      // Resilient — always proceed to result
    } finally {
      dispatch({ type: 'SET_SUBMITTING', value: false })
      dispatch({ type: 'GO_TO_RESULT' })
    }
  }

  const progress = getProgress()
  const showBack = state.visitedSteps.length > 1 && state.phase !== 'result'

  return (
    <TunnelLayout
      progress={progress}
      onBack={handleBack}
      showBack={showBack}
      direction={direction}
      stepKey={state.currentStepId}
    >
      {state.phase === 'result' ? (
        <ResultStep messageVariant={messageVariant} firstName={captureFirstName} />
      ) : state.phase === 'capture' ? (
        <LeadCapture
          isSubmitting={state.isSubmitting}
          onSubmit={handleCaptureSubmit}
          isBusiness={state.answers['entry'] === 'pro'}
        />
      ) : currentStep?.type === 'choice' ? (
        <ChoiceStep step={currentStep} onAnswer={handleAnswer} />
      ) : currentStep?.type === 'input' ? (
        <InputStep step={currentStep} onAnswer={handleAnswer} />
      ) : null}
    </TunnelLayout>
  )
}
