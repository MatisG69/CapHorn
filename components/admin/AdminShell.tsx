'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, Anchor } from 'lucide-react'
import Sidebar from './Sidebar'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Ferme le tiroir à chaque navigation
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setOpen(false) }, [pathname])

  // Verrouille le scroll quand le tiroir est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // La page de login est autonome (pas de sidebar)
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-dvh" style={{ background: '#0E0C09' }}>
      {/* Sidebar fixe — desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Sidebar en tiroir — mobile */}
      <div className={`lg:hidden fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/55 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className={`absolute inset-y-0 left-0 transition-transform duration-300 ease-out ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar />
        </div>
      </div>

      <div className="admin-main flex-1 min-w-0 overflow-auto">
        {/* Barre supérieure — mobile uniquement */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-[var(--color-ink-soft)]/95 backdrop-blur border-b border-[var(--color-ink-line)]">
          <button
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
            className="w-10 h-10 -ml-1 rounded-xl flex items-center justify-center text-[var(--color-cream)] hover:bg-[var(--color-ink-raised)] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(160deg,#E8D29A,#B8922A)' }}>
              <Anchor className="w-3.5 h-3.5 text-[#17130D]" strokeWidth={2.2} />
            </span>
            <span className="text-sm font-semibold text-[var(--color-cream)]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>Cap Horn</span>
          </div>
          <span className="w-10" />
        </div>

        {children}
      </div>
    </div>
  )
}
