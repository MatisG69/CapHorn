import { getGuideRequests } from '@/lib/supabase/queries'
import GuideRequestCard from '@/components/admin/GuideRequestCard'
import { isGuidePublished } from '@/lib/guide'

export const dynamic = 'force-dynamic'

export default async function AdminGuidesPage() {
  const requests = await getGuideRequests()
  const toSend = requests.filter((r) => r.status === 'new').length
  const published = isGuidePublished()

  return (
    <div className="p-8 space-y-6">
      <div>
        <p className="eyebrow eyebrow--single mb-3">Aimants à prospects</p>
        <h1 className="display-serif text-4xl text-[var(--color-cream)] tracking-tight">
          Demandes de guide
        </h1>
        <p className="text-sm text-[var(--color-cream-dim)] mt-2">
          {requests.length} demande{requests.length !== 1 ? 's' : ''}
          {toSend > 0 && (
            <span className="text-[var(--color-gold-soft)]"> · {toSend} à envoyer</span>
          )}
        </p>
      </div>

      {/* L'état du fichier conditionne tout le reste : tant qu'il n'est pas en
          ligne, chaque demande est une tâche manuelle. Autant le dire ici. */}
      {published ? (
        <div className="admin-card text-sm text-[var(--color-cream-dim)]">
          Le guide est en ligne : les visiteurs le téléchargent immédiatement après avoir laissé
          leurs coordonnées. Aucun envoi manuel n’est nécessaire.
        </div>
      ) : (
        <div className="admin-card text-sm text-[var(--color-cream-dim)]">
          <strong className="text-[var(--color-cream)]">Le guide n’est pas encore en ligne.</strong>{' '}
          La page annonce un envoi par e-mail sous 24 h ouvrées : chaque demande ci-dessous attend
          donc un envoi manuel. Le bouton e-mail ouvre un brouillon prêt, il ne reste qu’à joindre
          le document. Dès que le PDF est déposé dans <code>public/guides/</code>, la page bascule
          seule en téléchargement immédiat.
        </div>
      )}

      {requests.length === 0 ? (
        <div className="admin-card py-20 text-center text-[var(--color-cream-mute)] text-sm">
          Aucune demande pour le moment. Les coordonnées laissées depuis le bloc « guide » des pages
          métier apparaîtront ici.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <GuideRequestCard key={r.id} request={r} />
          ))}
        </div>
      )}
    </div>
  )
}
