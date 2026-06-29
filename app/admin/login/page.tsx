'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Anchor, Eye, EyeOff } from 'lucide-react'
import { signInAction, type SignInResult } from './actions'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '@/lib/admin/auth'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction, pending] = useActionState<SignInResult | null, FormData>(
    signInAction,
    null,
  )

  useEffect(() => {
    if (state?.ok) {
      router.replace('/admin')
    }
  }, [state, router])

  return (
    <div className="landing-root min-h-dvh flex items-center justify-center px-6">
      <div className="w-full max-w-sm relative z-[1]">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(180deg, var(--color-gold-soft), var(--color-gold))',
              boxShadow:
                '0 18px 40px -8px rgba(201, 168, 76, 0.55), inset 0 1px 0 rgba(255,255,255,0.4)',
            }}
          >
            <Anchor className="w-6 h-6 text-[var(--color-ink)]" />
          </div>
          <div className="text-center">
            <h1 className="display-serif text-2xl text-[var(--color-cream)] tracking-wide">
              Cap Horn Conseils
            </h1>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-cream-mute)] mt-2 font-mono">
              Espace administration
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="admin-card">
          <form action={formAction} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="tunnel-input"
                defaultValue={ADMIN_EMAIL}
                placeholder="admin@caphorn.fr"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)]"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="tunnel-input"
                  defaultValue={ADMIN_PASSWORD}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-cream-mute)] hover:text-[var(--color-gold-soft)] transition-colors"
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {state?.error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              className="btn-gold w-full justify-center mt-2"
              disabled={pending}
            >
              {pending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[var(--color-ink)]/30 border-t-[var(--color-ink)] rounded-full animate-spin" />
                  Connexion…
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Aide dev — credentials affichés tant que l'auth est hardcodée */}
          <div className="mt-5 pt-5 border-t border-[var(--color-ink-line)]">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)] mb-2">
              Identifiants de démo
            </p>
            <div className="text-[11px] font-mono text-[var(--color-cream-dim)] space-y-1">
              <div>
                <span className="text-[var(--color-cream-mute)]">email · </span>
                {ADMIN_EMAIL}
              </div>
              <div>
                <span className="text-[var(--color-cream-mute)]">mdp · </span>
                {ADMIN_PASSWORD}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
