'use client'

import { useEffect } from 'react'

/** Active les animations [data-rise] au scroll. Ne rend rien. */
export function ScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('revealed') }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    document.querySelectorAll('[data-rise]').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
  return null
}
