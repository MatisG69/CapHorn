'use client'

import { useState } from 'react'
import { CalendarClock } from 'lucide-react'
import ContactModal from '@/components/landing/ContactModal'

/**
 * Bouton « Prendre rendez-vous » : ouvre la modale de contact déjà utilisée
 * par la navigation, plutôt que d'envoyer vers une page intermédiaire. La page
 * reste un composant serveur ; seul ce bouton est hydraté.
 */
export default function RdvButton({ className = 'med-btn med-btn--ghost' }: { className?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        <CalendarClock className="w-4 h-4" aria-hidden /> Prendre rendez-vous
      </button>
      <ContactModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
