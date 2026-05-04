'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Anchor, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        setError('Identifiants incorrects. Vérifiez votre email et mot de passe.')
        return
      }

      router.refresh()
      router.push('/admin')
    } catch {
      setError('Erreur de connexion. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

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
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-cream-mute)]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="tunnel-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  type={showPassword ? 'text' : 'password'}
                  className="tunnel-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {error && (
              <p className="text-xs text-red-300 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2.5">
                {error}
              </p>
            )}

            <button type="submit" className="btn-gold w-full justify-center mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[var(--color-ink)]/30 border-t-[var(--color-ink)] rounded-full animate-spin" />
                  Connexion…
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
