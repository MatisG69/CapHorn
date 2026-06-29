'use client'

import { useMemo, useReducer, useCallback } from 'react'
import { stepMap, nextStepId } from '@/lib/tunnel/engine'
import type { TunnelState, TunnelAction, Phase, LeadCaptureData, TunnelConfig, TunnelStepDef } from '@/lib/types'

type StepMap = Record<string, TunnelStepDef>

function getPhase(map: StepMap, stepId: string, firstStep: string): Phase {
  const step = map[stepId]
  if (!step) return 'entry'
  if (step.type === 'contact') return 'contact'
  if (step.type === 'finalize' || step.type === 'capture') return 'capture'
  if (step.type === 'result') return 'result'
  if (stepId === firstStep) return 'entry'
  return 'qualification'
}

const SID_KEY = 'ch_tunnel_sid'

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  try {
    const existing = sessionStorage.getItem(SID_KEY)
    if (existing) return existing
    const id = crypto.randomUUID()
    sessionStorage.setItem(SID_KEY, id)
    return id
  } catch {
    return crypto.randomUUID()
  }
}

function createInitialState(firstStep: string): TunnelState {
  return {
    phase: firstStep ? 'entry' : 'entry',
    currentStepId: firstStep,
    answers: {},
    visitedSteps: [firstStep],
    isSubmitting: false,
    submitError: null,
    sessionId: '',
    contact: null,
  }
}

function reducer(state: TunnelState, action: TunnelAction): TunnelState {
  switch (action.type) {
    case 'ANSWER': {
      const newAnswers = { ...state.answers, [action.stepId]: action.value }
      if (action.nextStepId === null) return { ...state, answers: newAnswers }
      return {
        ...state,
        answers: newAnswers,
        currentStepId: action.nextStepId,
        phase: action.phase,
        visitedSteps: [...state.visitedSteps, action.nextStepId],
        submitError: null,
      }
    }

    case 'ADVANCE': {
      return {
        ...state,
        currentStepId: action.nextStepId,
        phase: action.phase,
        visitedSteps: [...state.visitedSteps, action.nextStepId],
        submitError: null,
      }
    }

    case 'BACK': {
      if (state.visitedSteps.length <= 1) return state
      const prevSteps = state.visitedSteps.slice(0, -1)
      return {
        ...state,
        currentStepId: action.prevStepId,
        phase: action.phase,
        visitedSteps: prevSteps,
        submitError: null,
      }
    }

    case 'SET_CONTACT':
      return { ...state, contact: action.contact }
    case 'SET_SESSION':
      return { ...state, sessionId: action.sessionId }
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.value }
    case 'SET_ERROR':
      return { ...state, submitError: action.error }
    case 'GO_TO_RESULT':
      return { ...state, phase: 'result', currentStepId: action.resultStepId }
    default:
      return state
  }
}

export function useTunnel(config: TunnelConfig) {
  const map = useMemo(() => stepMap(config), [config])
  const firstStep = config.firstStepId
  const resultStepId = useMemo(
    () => config.steps.find((s) => s.type === 'result')?.id ?? 'result',
    [config],
  )

  const [state, dispatch] = useReducer(reducer, firstStep, createInitialState)

  const currentStep = map[state.currentStepId]

  const ensureSessionId = useCallback((): string => {
    if (state.sessionId) return state.sessionId
    const id = getSessionId()
    dispatch({ type: 'SET_SESSION', sessionId: id })
    return id
  }, [state.sessionId])

  const answer = useCallback(
    (value: string) => {
      if (!currentStep) return
      const merged = { ...state.answers, [currentStep.id]: value }
      const nextId = nextStepId(map, currentStep.id, merged)
      const phase = nextId ? getPhase(map, nextId, firstStep) : state.phase
      dispatch({ type: 'ANSWER', stepId: currentStep.id, value, nextStepId: nextId, phase })
    },
    [currentStep, state.answers, state.phase, map, firstStep],
  )

  const advance = useCallback(() => {
    if (!currentStep) return
    const nextId = nextStepId(map, currentStep.id, state.answers)
    if (nextId) dispatch({ type: 'ADVANCE', nextStepId: nextId, phase: getPhase(map, nextId, firstStep) })
  }, [currentStep, state.answers, map, firstStep])

  const setContact = useCallback(
    (contact: LeadCaptureData) => dispatch({ type: 'SET_CONTACT', contact }),
    [],
  )

  const back = useCallback(() => {
    if (state.visitedSteps.length <= 1) return
    const prev = state.visitedSteps[state.visitedSteps.length - 2]
    dispatch({ type: 'BACK', prevStepId: prev, phase: getPhase(map, prev, firstStep) })
  }, [state.visitedSteps, map, firstStep])

  const getProgress = useCallback(() => currentStep?.progress ?? 0, [currentStep])

  const goToResult = useCallback(
    () => dispatch({ type: 'GO_TO_RESULT', resultStepId }),
    [resultStepId],
  )

  return { state, currentStep, map, answer, advance, setContact, ensureSessionId, back, getProgress, goToResult, dispatch }
}
