'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[var(--color-cream-mute)] hover:text-[var(--color-cream)] hover:bg-[rgba(201,168,76,0.06)] transition-colors text-sm"
    >
      <LogOut className="w-4 h-4" />
      Déconnexion
    </button>
  )
}
