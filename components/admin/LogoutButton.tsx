'use client'

import { useTransition } from 'react'
import { LogOut } from 'lucide-react'
import { signOutAction } from '@/app/admin/login/actions'

export default function LogoutButton() {
  const [pending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => signOutAction())}
      disabled={pending}
      className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[var(--color-cream-mute)] hover:text-[var(--color-cream)] hover:bg-[rgba(201,168,76,0.06)] transition-colors text-sm disabled:opacity-50"
    >
      <LogOut className="w-4 h-4" />
      {pending ? 'Déconnexion…' : 'Déconnexion'}
    </button>
  )
}
