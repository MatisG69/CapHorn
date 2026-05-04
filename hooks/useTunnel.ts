'use client'

import { useReducer, useCallback } from 'react'
import { TUNNEL_STEPS, FIRST_STEP } from '@/lib/tunnel/config'
import type { TunnelState, TunnelAction, Phase } from '@/lib/types'

function getPhase(stepId: string): Phase {
  const step = TUNNEL_STEPS[stepId]
  if (!step) return 'entry'
  if (step.type === 'capture') return 'capture'
  if (step.type === 'result') return 'result'
  if (stepId === FIRST_STEP) return 'entry'
  return 'qualification'
}

const initialState: TunnelState = {
  phase: 'entry',
  currentStepId: FIRST_STEP,
  answers: {},
  visitedSteps: [FIRST_STEP],
  isSubmitting: false,
  submitError: null,
}

function reducer(state: TunnelState, action: TunnelAction): TunnelState {
  switch (action.type) {
    case 'ANSWER': {
      const newAnswers = { ...state.answers, [action.stepId]: action.value }
      if (action.nextStepId === null) return state
      const nextStep = TUNNEL_STEPS[action.nextStepId]
      if (!nextStep) return state
      const nextPhase = getPhase(action.nextStepId)
      return {
        ...state,
        answers: newAnswers,
        currentStepId: action.nextStepId,
        phase: nextPhase,
        visitedSteps: [...state.visitedSteps, action.nextStepId],
        submitError: null,
      }
    }

    case 'BACK': {
      if (state.visitedSteps.length <= 1) return state
      const prevSteps = state.visitedSteps.slice(0, -1)
      const prevStepId = prevSteps[prevSteps.length - 1]
      return {
        ...state,
        currentStepId: prevStepId,
        phase: getPhase(prevStepId),
        visitedSteps: prevSteps,
        submitError: null,
      }
    }

    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.value }

    case 'SET_ERROR':
      return { ...state, submitError: action.error }

    case 'GO_TO_RESULT':
      return { ...state, phase: 'result', currentStepId: 'result' }

    default:
      return state
  }
}

export function useTunnel() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const currentStep = TUNNEL_STEPS[state.currentStepId]

  const answer = useCallback(
    (value: string) => {
      if (!currentStep) return
      const nextStepId = currentStep.getNext({ ...state.answers, [currentStep.id]: value })
      dispatch({ type: 'ANSWER', stepId: currentStep.id, value, nextStepId })
    },
    [currentStep, state.answers],
  )

  const back = useCallback(() => dispatch({ type: 'BACK' }), [])

  const getProgress = useCallback(() => {
    return currentStep?.progressValue ?? 0
  }, [currentStep])

  const goToResult = useCallback(() => dispatch({ type: 'GO_TO_RESULT' }), [])

  return { state, currentStep, answer, back, getProgress, goToResult, dispatch }
}
