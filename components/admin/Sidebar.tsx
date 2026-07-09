'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, BarChart3, FileText, Workflow, CalendarClock, Calculator } from 'lucide-react'
import AdminProfile from './AdminProfile'

const NAV_ITEMS = [
  { href: '/admin', label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: '/admin/leads', label: 'Leads', icon: Users, exact: false },
  { href: '/admin/rendez-vous', label: 'Rendez-vous', icon: CalendarClock, exact: false },
  { href: '/admin/simulateur', label: 'Simulateur', icon: Calculator, exact: false },
  { href: '/admin/tunnel', label: 'Tunnel', icon: Workflow, exact: false },
  { href: '/admin/blog', label: 'Blog', icon: FileText, exact: false },
  { href: '/admin/analytics', label: 'Analytique', icon: BarChart3, exact: false },
]

export default function Sidebar() {
  const pathname = usePathname()
  const isActive = (href: string, exact: boolean) => (exact ? pathname === href : pathname.startsWith(href))

  return (
    <aside
      className="w-64 shrink-0 flex flex-col min-h-dvh sticky top-0 border-r border-white/[0.06]"
      style={{ background: 'linear-gradient(180deg, #17130D 0%, #100D08 100%)' }}
    >
      {/* Marque */}
      <div className="px-5 pt-7 pb-6">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
            style={{ background: 'linear-gradient(160deg,#1c2432,#0b0d11)', border: '1px solid rgba(184,146,42,0.32)', boxShadow: '0 8px 20px -6px rgba(12,14,18,0.6)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt="Cap Horn Conseils" className="w-7 h-7 object-contain" />
          </div>
          <div className="min-w-0">
            <div className="font-[var(--font-cormorant)] text-[19px] font-medium text-white leading-none tracking-wide" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
              Cap Horn
            </div>
            <div className="text-[9px] text-[#C9A45C] mt-1.5 uppercase tracking-[0.3em] font-medium">
              Espace admin
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-1" aria-label="Navigation admin">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                active
                  ? 'text-[#E8D29A] bg-[rgba(184,146,42,0.13)]'
                  : 'text-white/55 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r bg-[#C9A45C]" aria-hidden />}
              <Icon className={`w-[18px] h-[18px] ${active ? 'text-[#C9A45C]' : 'text-white/40'}`} strokeWidth={1.9} />
              <span className="font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Profil */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        <AdminProfile />
      </div>
    </aside>
  )
}
