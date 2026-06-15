'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { X } from 'lucide-react'

export interface Service {
  number: string
  title: string
  description: string
  details: string
}

interface ServiceModalProps {
  service: Service | null
  onClose: () => void
}

const backdropStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 80,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1.5rem',
  background: 'rgba(7, 9, 12, 0.78)',
  backdropFilter: 'blur(14px) saturate(1.1)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.1)',
  animation: 'service-modal-backdrop-in 220ms cubic-bezier(0.16, 1, 0.3, 1)',
}

const modalStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: '36rem',
  maxHeight: 'calc(100dvh - 3rem)',
  overflowY: 'auto',
  background:
    'linear-gradient(180deg, rgba(201, 164, 92, 0.04), transparent 30%), var(--color-ink-soft)',
  border: '1px solid var(--color-ink-line)',
  borderRadius: 18,
  padding: '2.5rem 2rem 2.25rem',
  boxShadow:
    '0 0 0 1px rgba(201, 164, 92, 0.15), 0 40px 100px -24px rgba(0, 0, 0, 0.7)',
  animation: 'service-modal-in 320ms cubic-bezier(0.16, 1, 0.3, 1)',
}

const closeStyle: CSSProperties = {
  position: 'absolute',
  top: '1.25rem',
  right: '1.25rem',
  width: '2.25rem',
  height: '2.25rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: '1px solid var(--color-ink-line)',
  borderRadius: 999,
  color: 'var(--color-cream-dim)',
  cursor: 'pointer',
  transition: 'background 200ms, color 200ms, border-color 200ms',
}

const numberStyle: CSSProperties = {
  display: 'inline-block',
  fontFamily: 'var(--font-sans)',
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: '0.32em',
  color: 'var(--color-gold-deep)',
  marginBottom: '1rem',
}

const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontWeight: 500,
  fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
  lineHeight: 1.05,
  color: 'var(--color-cream)',
  margin: '0 0 1rem 0',
}

const leadStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-gold-soft)',
  fontFamily: 'var(--font-display)',
  fontStyle: 'italic',
  fontWeight: 400,
  fontSize: '1.1rem',
  lineHeight: 1.5,
}

const ruleStyle: CSSProperties = {
  height: 1,
  margin: '1.75rem 0',
  background:
    'linear-gradient(90deg, transparent, var(--color-gold-deep) 50%, transparent)',
  opacity: 0.45,
}

const detailsStyle: CSSProperties = {
  margin: 0,
  color: 'var(--color-cream-dim)',
  fontSize: '0.95rem',
  lineHeight: 1.7,
}

const topRuleStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 32,
  right: 32,
  height: 1,
  background:
    'linear-gradient(90deg, transparent, var(--color-gold-soft) 50%, transparent)',
  opacity: 0.55,
}

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!service) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [service, onClose])

  if (!service) return null

  return (
    <>
      <style>{`
        @keyframes service-modal-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes service-modal-in {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .service-modal__close:hover,
        .service-modal__close:focus-visible {
          background: rgba(201, 164, 92, 0.12) !important;
          color: var(--color-cream) !important;
          border-color: rgba(201, 164, 92, 0.45) !important;
          outline: none !important;
        }
        @media (min-width: 768px) {
          .service-modal { padding: 3rem 3rem 2.75rem !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .service-modal-backdrop, .service-modal { animation: none !important; }
        }
      `}</style>
      <div
        className="service-modal-backdrop"
        style={backdropStyle}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
      >
        <div
          className="service-modal"
          style={modalStyle}
          onClick={(e) => e.stopPropagation()}
        >
          <span style={topRuleStyle} aria-hidden />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="service-modal__close"
            style={closeStyle}
            aria-label="Fermer la fenêtre"
          >
            <X className="w-4 h-4" />
          </button>

          <span style={numberStyle}>{service.number}</span>
          <h3 id="service-modal-title" style={titleStyle}>
            {service.title}
          </h3>
          <p style={leadStyle}>{service.description}</p>
          <div style={ruleStyle} aria-hidden />
          <p style={detailsStyle}>{service.details}</p>
        </div>
      </div>
    </>
  )
}
