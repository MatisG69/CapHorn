'use client'

import { useState } from 'react'
import { useTunnel } from '@/hooks/useTunnel'
import { nextStepId } from '@/lib/tunnel/engine'
import TunnelLayout from '@/components/tunnel/TunnelLayout'
import ChoiceStep from '@/components/tunnel/ChoiceStep'
import InputStep from '@/components/tunnel/InputStep'
import ContactStep from '@/components/tunnel/ContactStep'
import FinalizeStep from '@/components/tunnel/FinalizeStep'
import ResultStep from '@/components/tunnel/ResultStep'
import type { LeadCaptureData, MessageVariant, TunnelType, SubType, TunnelConfig } from '@/lib/types'
import { track } from '@/lib/tracking'

function deriveTypes(answers: Record<string, string>): { tunnelType: TunnelType; subType?: SubType } {
  const tunnelType = (answers['entry'] ?? 'pro') as TunnelType
  const subType = (answers['pro_need'] ??
    answers['particulier_need'] ??
    answers['reseau_type'] ??
    undefined) as SubType | undefined
  return { tunnelType, subType }
}

export default function TunnelClient({ config }: { config: TunnelConfig }) {
  const { state, currentStep, map, answer, advance, setContact, ensureSessionId, back, getProgress, goToResult, dispatch } =
    useTunnel(config)
  const [messageVariant, setMessageVariant] = useState<MessageVariant>('neutral')

  const saveDraft = (opts: {
    answers: Record<string, string>
    stepId: string
    progress: number
    contact: LeadCaptureData | null
  }) => {
    const sessionId = ensureSessionId()
    if (!sessionId) return
    const { tunnelType, subType } = deriveTypes(opts.answers)
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        session_id: sessionId,
        tunnel_type: tunnelType,
        sub_type: subType,
        answers: opts.answers,
        progress: opts.progress,
        current_step: opts.stepId,
        completed: false,
        contact: opts.contact ?? undefined,
      }),
    }).catch(() => {})
  }

  const handleAnswer = (value: string) => {
    if (!currentStep) return
    const merged = { ...state.answers, [currentStep.id]: value }
    const nextId = nextStepId(map, currentStep.id, merged)
    const nextStep = nextId ? map[nextId] : null

    answer(value)

    if (state.contact && nextId) {
      saveDraft({
        answers: merged,
        stepId: nextId,
        progress: nextStep?.progress ?? getProgress(),
        contact: state.contact,
      })
    }
  }

  const handleContactSubmit = (data: LeadCaptureData) => {
    if (!currentStep) return
    setContact(data)
    const nextId = nextStepId(map, currentStep.id, state.answers)
    const nextStep = nextId ? map[nextId] : null

    saveDraft({
      answers: state.answers,
      stepId: nextId ?? 'contact',
      progress: nextStep?.progress ?? currentStep.progress ?? 12,
      contact: data,
    })

    const t = deriveTypes(state.answers)
    track('lead_contact', { tunnel: t.tunnelType, sub_type: t.subType ?? '' })
    advance()
  }

  const handleFinalize = async () => {
    dispatch({ type: 'SET_SUBMITTING', value: true })
    const sessionId = ensureSessionId()
    const { tunnelType, subType } = deriveTypes(state.answers)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          tunnel_type: tunnelType,
          sub_type: subType,
          answers: state.answers,
          progress: 100,
          current_step: 'result',
          completed: true,
          contact: state.contact ?? undefined,
        }),
      })
      if (res.ok) {
        const json = await res.json()
        setMessageVariant((json.message_variant as MessageVariant) ?? 'neutral')
        track('lead_submitted', { tunnel: tunnelType, sub_type: subType ?? '' })
      }
    } catch {
      // Résilient
    } finally {
      dispatch({ type: 'SET_SUBMITTING', value: false })
      goToResult()
    }
  }

  const progress = getProgress()
  const showBack = state.visitedSteps.length > 1 && state.phase !== 'result'

  return (
    <TunnelLayout progress={progress} onBack={back} showBack={showBack} stepKey={state.currentStepId}>
      {state.phase === 'result' ? (
        <ResultStep messageVariant={messageVariant} firstName={state.contact?.first_name} />
      ) : state.phase === 'capture' && currentStep ? (
        <FinalizeStep
          step={currentStep}
          contact={state.contact}
          answers={state.answers}
          isSubmitting={state.isSubmitting}
          onFinalize={handleFinalize}
        />
      ) : state.phase === 'contact' && currentStep ? (
        <ContactStep
          step={currentStep}
          initial={state.contact}
          isBusiness={state.answers['entry'] === 'pro'}
          onSubmit={handleContactSubmit}
        />
      ) : currentStep?.type === 'choice' ? (
        <ChoiceStep step={currentStep} onAnswer={handleAnswer} />
      ) : currentStep?.type === 'input' ? (
        <InputStep step={currentStep} onAnswer={handleAnswer} />
      ) : null}
    </TunnelLayout>
  )
}
