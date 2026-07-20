'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { X, ArrowUp } from 'lucide-react'

interface Msg {
  role: 'user' | 'assistant'
  content: string
}

const GREETING: Msg = {
  role: 'assistant',
  content:
    "Bonjour, je suis l'assistant de Cap Horn Conseils. Posez votre question sur votre projet de financement, immobilier, professionnel, assurance emprunteur…",
}

const SUGGESTIONS = [
  'Financer un achat immobilier',
  'Changer mon assurance de prêt',
  'Financer mon activité pro',
]

export default function ChatWidget() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([GREETING])

  const taRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-resize du textarea
  useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = '0px'
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px'
  }, [value])

  // Auto-scroll vers le bas
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  // Le widget n'apparaît pas dans l'admin ni dans le tunnel
  if (pathname.startsWith('/admin') || pathname.startsWith('/tunnel')) return null

  const send = (preset?: string) => {
    const text = (preset ?? value).trim()
    if (!text || loading) return
    const next: Msg[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setValue('')
    setLoading(true)

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: next }),
    })
      .then(async (r) => {
        const data = (await r.json().catch(() => ({}))) as { reply?: string }
        const reply =
          data.reply ||
          "Désolé, je ne parviens pas à répondre pour l'instant. Vous pouvez lancer votre étude gratuite : un expert Cap Horn vous recontacte sous 24 h."
        setMessages((m) => [...m, { role: 'assistant', content: reply }])
      })
      .catch(() => {
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            content:
              "Désolé, une erreur est survenue. Un expert Cap Horn peut vous recontacter sous 24 h, n'hésitez pas à lancer votre étude gratuite.",
          },
        ])
      })
      .finally(() => setLoading(false))
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="chc-chat">
      {/* Panneau */}
      {open && (
        <div className="chc-chat__panel" role="dialog" aria-label="Assistant Cap Horn">
          <header className="chc-chat__header">
            <div className="chc-chat__id">
              <span className="chc-chat__mark-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-mark.png" alt="Cap Horn Conseils" className="chc-chat__mark" />
              </span>
              <div>
                <div className="chc-chat__title">Cap Horn Conseils</div>
                <div className="chc-chat__status">Assistant · en ligne</div>
              </div>
            </div>
            <button className="chc-chat__close" onClick={() => setOpen(false)} aria-label="Fermer">
              <X className="w-4 h-4" />
            </button>
          </header>

          <div className="chc-chat__body" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chc-chat__row chc-chat__row--${m.role}`}>
                {m.role === 'assistant' && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src="/logo-mark.png" alt="" aria-hidden className="chc-chat__avatar" />
                )}
                <div className={`chc-chat__msg chc-chat__msg--${m.role}`}>{m.content}</div>
              </div>
            ))}

            {messages.length === 1 && !loading && (
              <div className="chc-chat__suggests">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className="chc-chat__chip" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="chc-chat__row chc-chat__row--assistant">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-mark.png" alt="" aria-hidden className="chc-chat__avatar" />
                <div className="chc-chat__msg chc-chat__msg--assistant chc-chat__typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
          </div>

          <div className="chc-chat__footer">
            <div className="chc-chat__inputbar">
              <textarea
                ref={taRef}
                rows={1}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Écrivez votre message…"
                className="chc-chat__textarea"
              />
              <button
                className="chc-chat__send"
                onClick={() => send()}
                disabled={!value.trim() || loading}
                aria-label="Envoyer"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
            <p className="chc-chat__note">Réponse indicative · un expert vous recontacte sous 24 h.</p>
          </div>
        </div>
      )}

      {/* Bouton flottant + invitation */}
      <div className="chc-chat__launch-row">
        {!open && <span className="chc-chat__hint">Une question&nbsp;?</span>}
        <button
          className={`chc-chat__launcher ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant Cap Horn"}
        >
          {open ? (
            <X className="w-5 h-5" />
          ) : (
            // Décoratif : le bouton porte déjà un aria-label explicite.
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/logo-mark.png" alt="" aria-hidden className="chc-chat__launcher-mark" />
          )}
        </button>
      </div>
    </div>
  )
}
