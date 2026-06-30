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
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div
                  key={i}
                  style={{
                    padding: 32,
                    borderRadius: 24,
                    border: '1px solid var(--chc-bd)',
                    boxShadow: '0 14px 34px -22px rgba(12,14,18,0.22)',
                    background: '#fff',
                    maxWidth: 320,
                    width: '100%',
                  }}
                >
                  <div style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.7, color: 'var(--chc-text)', fontWeight: 300 }}>{text}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img width={40} height={40} src={image} alt={name} style={{ height: 40, width: 40, borderRadius: '50%' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontFamily: SANS, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.25, color: 'var(--chc-text)' }}>{name}</div>
                      <div style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.25, letterSpacing: '-0.01em', color: 'var(--chc-mid)', opacity: 0.85 }}>{role}</div>
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
