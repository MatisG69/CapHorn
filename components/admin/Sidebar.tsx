'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, BarChart3, Settings, Anchor } from 'lucide-react'
import LogoutButton from './LogoutButton'

const NAV_ITEMS = [
  { href: '/admin', label: "Vue d'ensemble", shortLabel: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/leads', label: 'Leads', shortLabel: 'Leads', icon: Users, exact: false },
  { href: '/admin/analytics', label: 'Analytique', shortLabel: 'Analytics', icon: BarChart3, exact: false },
  { href: '/admin/settings', label: 'Paramètres', shortLabel: 'Settings', icon: Settings, exact: false },
]

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <aside
      className="w-64 shrink-0 flex flex-col min-h-dvh border-r border-[var(--color-ink-line)] sticky top-0"
      style={{ background: 'linear-gradient(180deg, #090B0F 0%, var(--color-ink) 60%)' }}
    >
      {/* En-tête marque */}
      <div className="px-5 pt-7 pb-6 border-b border-[var(--color-ink-line)] relative">
        {/* Filet doré en bas, signature éditoriale */}
        <div
          className="absolute bottom-0 left-5 right-5 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold-deep) 50%, transparent)', opacity: 0.5 }}
        />
        <Link href="/admin" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
            style={{
              background: 'linear-gradient(180deg, var(--color-gold-soft), var(--color-gold))',
              boxShadow:
                '0 8px 18px -6px rgba(201, 168, 76, 0.45), inset 0 1px 0 rgba(255,255,255,0.4)',
            }}
          >
            <Anchor className="w-4 h-4 text-[var(--color-ink)]" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <div className="display-serif text-[17px] font-medium text-[var(--color-cream)] leading-none tracking-wide">
              Cap Horn
            </div>
            <div className="text-[9px] text-[var(--color-cream-mute)] mt-1.5 uppercase tracking-[0.28em] font-mono">
              Espace admin
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 px-3 py-6 space-y-0.5" aria-label="Navigation principale">
        <p className="px-3 mb-3 text-[9px] uppercase tracking-[0.28em] text-[var(--color-cream-mute)] font-mono">
          Pilotage
        </p>
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                active
                  ? 'text-[var(--color-cream)] bg-[rgba(201,168,76,0.08)]'
                  : 'text-[var(--color-cream-dim)] hover:text-[var(--color-cream)] hover:bg-[rgba(201,168,76,0.04)]'
              }`}
            >
              {/* Indicateur vertical à gauche, gold, visible si actif */}
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] rounded-r-sm transition-all duration-200 ${
                  active ? 'h-5 bg-[var(--color-gold)]' : 'h-0'
                }`}
                aria-hidden
              />
              <Icon
                className={`w-4 h-4 transition-colors ${
                  active ? 'text-[var(--color-gold)]' : 'text-[var(--color-cream-mute)] group-hover:text-[var(--color-gold-soft)]'
                }`}
                strokeWidth={1.8}
              />
              <span className="flex-1">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Pied de sidebar */}
      <div className="px-3 py-4 border-t border-[var(--color-ink-line)]">
        <LogoutButton />
        <p className="mt-4 px-3 text-[9px] text-[var(--color-cream-mute)] font-mono uppercase tracking-[0.22em] text-center opacity-50">
          Cap Horn · 2026
        </p>
      </div>
    </aside>
  )
}
