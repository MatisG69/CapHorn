'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { LEGAL_DOCS, type LegalDoc } from '@/lib/legal'

/** Liens légaux du pied de page : ouvrent une modale flottante avec le document. */
export default function LegalLinks() {
  const [openId, setOpenId] = useState<LegalDoc['id'] | null>(null)
  const doc = LEGAL_DOCS.find((d) => d.id === openId) ?? null

  useEffect(() => {
    if (!doc) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenId(null) }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [doc])

  return (
    <>
      <span className="chc-footer__legal">
        {LEGAL_DOCS.map((d) => (
          <button key={d.id} type="button" className="chc-legal-link" onClick={() => setOpenId(d.id)}>
            {d.label}
          </button>
        ))}
      </span>

      {doc && (
        <div
          className="chc-legal-modal"
          role="dialog"
          aria-modal="true"
          aria-label={doc.title}
          onClick={() => setOpenId(null)}
        >
          <div className="chc-legal-modal__card" onClick={(e) => e.stopPropagation()}>
            <div className="chc-legal-modal__head">
              <h2 className="chc-legal-modal__title">{doc.title}</h2>
              <button type="button" className="chc-legal-modal__close" onClick={() => setOpenId(null)} aria-label="Fermer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="chc-legal-modal__body">
              {doc.updated && <p className="chc-legal-modal__updated">Dernière mise à jour : {doc.updated}</p>}
              {doc.blocks.map((b, i) => (
                <section className="chc-legal-block" key={i}>
                  {b.heading && <h3 className="chc-legal-block__h">{b.heading}</h3>}
                  {b.paragraphs?.map((p, j) => (
                    <p className="chc-legal-block__p" key={j}>{p}</p>
                  ))}
                  {b.list && (
                    <ul className="chc-legal-block__list">
                      {b.list.map((li, j) => (<li key={j}>{li}</li>))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
