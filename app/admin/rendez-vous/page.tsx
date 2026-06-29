import { getAppointments } from '@/lib/supabase/queries'
import AppointmentCard from '@/components/admin/AppointmentCard'

export const dynamic = 'force-dynamic'

export default async function AdminAppointmentsPage() {
  const appts = await getAppointments()
  const newCount = appts.filter((a) => a.status === 'new').length

  return (
    <div className="p-8 space-y-6">
      <div>
        <p className="eyebrow eyebrow--single mb-3">Contact</p>
        <h1 className="display-serif text-4xl text-[var(--color-cream)] tracking-tight">Demandes de rendez-vous</h1>
        <p className="text-sm text-[var(--color-cream-dim)] mt-2">
          {appts.length} demande{appts.length !== 1 ? 's' : ''}
          {newCount > 0 && <span className="text-[var(--color-gold-soft)]"> · {newCount} à traiter</span>}
        </p>
      </div>

      {appts.length === 0 ? (
        <div className="admin-card py-20 text-center text-[var(--color-cream-mute)] text-sm">
          Aucune demande de rendez-vous pour le moment. Les demandes du formulaire « Prendre contact » apparaîtront ici.
        </div>
      ) : (
        <div className="space-y-4">
          {appts.map((a) => (
            <AppointmentCard key={a.id} appt={a} />
          ))}
        </div>
      )}
    </div>
  )
}
