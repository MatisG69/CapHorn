import { getReferrals } from '@/lib/supabase/queries'
import ReferralCard from '@/components/admin/ReferralCard'

export const dynamic = 'force-dynamic'

const euros = (n: number) => `${new Intl.NumberFormat('fr-FR').format(n)} €`

export default async function AdminReferralsPage() {
  const referrals = await getReferrals()
  const newCount = referrals.filter((r) => r.status === 'new').length
  const signedCount = referrals.filter((r) => r.status === 'signed' || r.status === 'paid').length
  // Ce qui reste à payer : signé mais prime non encore versée.
  const dueAmount = referrals
    .filter((r) => r.status === 'signed')
    .reduce((sum, r) => sum + (r.reward_amount ?? 0), 0)

  return (
    <div className="p-8 space-y-6">
      <div>
        <p className="eyebrow eyebrow--single mb-3">Réseau</p>
        <h1 className="display-serif text-4xl text-[var(--color-cream)] tracking-tight">
          Parrainages
        </h1>
        <p className="text-sm text-[var(--color-cream-dim)] mt-2">
          {referrals.length} recommandation{referrals.length !== 1 ? 's' : ''}
          {newCount > 0 && (
            <span className="text-[var(--color-gold-soft)]"> · {newCount} à traiter</span>
          )}
          {signedCount > 0 && <span> · {signedCount} signé{signedCount !== 1 ? 's' : ''}</span>}
          {dueAmount > 0 && (
            <span className="text-[var(--color-gold-soft)]">
              {' '}
              · {euros(dueAmount)} de primes à verser
            </span>
          )}
        </p>
      </div>

      {referrals.length === 0 ? (
        <div className="admin-card py-20 text-center text-[var(--color-cream-mute)] text-sm">
          Aucun parrainage pour le moment. Les recommandations envoyées depuis la page
          « Parrainage &amp; apport d’affaires » apparaîtront ici.
        </div>
      ) : (
        <div className="space-y-4">
          {referrals.map((r) => (
            <ReferralCard key={r.id} referral={r} />
          ))}
        </div>
      )}
    </div>
  )
}
