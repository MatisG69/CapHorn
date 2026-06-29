'use client'

import { useState, useTransition } from 'react'
import { ChevronUp, LogOut } from 'lucide-react'
import { signOutAction } from '@/app/admin/login/actions'

export default function AdminProfile() {
  const [open, setOpen] = useState(false)
  const [pending, start] = useTransition()

  return (
    <div className="relative">
      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-white/10 bg-[#1A1611] p-1 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)]">
          <button
            onClick={() => start(() => signOutAction())}
            disabled={pending}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            {pending ? 'Déconnexion…' : 'Déconnexion'}
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-xl p-2.5 hover:bg-white/5 transition-colors"
      >
        <span className="w-9 h-9 rounded-full flex items-center justify-center text-[#1A1306] font-semibold text-sm shrink-0"
          style={{ background: 'linear-gradient(150deg, #E8D29A, #B8922A)' }}>
          A
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block text-sm font-medium text-white truncate">Admin Cap Horn</span>
          <span className="block text-[11px] text-white/45 truncate">admin@caphorn.com</span>
        </span>
        <ChevronUp className={`w-4 h-4 text-white/40 transition-transform ${open ? '' : 'rotate-180'}`} />
      </button>
    </div>
  )
}
