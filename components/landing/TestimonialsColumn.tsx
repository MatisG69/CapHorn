'use client'

import React from 'react'
import { motion } from 'motion/react'

export interface Testimonial {
  text: string
  image: string
  name: string
  role: string
}

const SANS = "var(--font-ibm-plex), 'Inter', system-ui, sans-serif"

export const TestimonialsColumn = (props: {
  className?: string
  testimonials: Testimonial[]
  duration?: number
  onSelect?: (t: Testimonial) => void
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 24 }}
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map((t, i) => (
                <div
                  key={i}
                  className="chc-testi-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => props.onSelect?.(t)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      props.onSelect?.(t)
                    }
                  }}
                  style={{
                    padding: 32,
                    borderRadius: 24,
                    border: '1px solid var(--chc-bd)',
                    boxShadow: '0 14px 34px -22px rgba(12,14,18,0.22)',
                    background: '#fff',
                    maxWidth: 320,
                    width: '100%',
                    cursor: 'pointer',
                  }}
                >
                  <div aria-label="Note : 5 sur 5" style={{ color: 'var(--chc-gold)', fontSize: 14, letterSpacing: 2, marginBottom: 12 }}>★★★★★</div>
                  <div className="chc-testi-card__text" style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.7, color: 'var(--chc-text)', fontWeight: 300 }}>{t.text}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img width={40} height={40} src={t.image} alt={t.name} style={{ height: 40, width: 40, borderRadius: '50%' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontFamily: SANS, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.25, color: 'var(--chc-text)' }}>{t.name}</div>
                      <div style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.25, letterSpacing: '-0.01em', color: 'var(--chc-mid)', opacity: 0.85 }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  )
}

export default TestimonialsColumn
