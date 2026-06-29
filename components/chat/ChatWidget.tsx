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
    "Bonjour, je suis l'assistant de Cap Horn Conseils. Posez votre question sur votre projet de financement — immobilier, professionnel, assurance emprunteur…",
}

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

  const send = () => {
    const text = value.trim()
    if (!text || loading) return
    setMessages((m) => [...m, { role: 'user', content: text }])
    setValue('')
    setLoading(true)
    // TODO IA : remplacer ce placeholder par l'appel à l'API (clé fournie plus tard)
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            "Merci pour votre message. L'assistant intelligent sera bientôt connecté. En attendant, vous pouvez lancer votre étude gratuite : un expert Cap Horn vous recontacte sous 24 h.",
        },
      ])
      setLoading(false)
    }, 700)
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
              <span className="chc-chat__mark">CH</span>
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
              <div key={i} className={`chc-chat__msg chc-chat__msg--${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="chc-chat__msg chc-chat__msg--assistant chc-chat__typing">
                <span /><span /><span />
              </div>
            )}
          </div>

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
              onClick={send}
              disabled={!value.trim() || loading}
              aria-label="Envoyer"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bouton flottant */}
      <button
        className={`chc-chat__launcher ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant Cap Horn"}
      >
        {open ? <X className="w-5 h-5" /> : <span className="chc-chat__launcher-mark">CH</span>}
      </button>
    </div>
  )
}
