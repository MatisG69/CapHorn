'use client'

import { useEffect, useRef, useState } from 'react'
import { Mail, Phone } from 'lucide-react'
import { AnimatedDock, type DockItemData } from '@/components/ui/AnimatedDock'
import { LinkedInIcon } from '@/components/ui/SocialIcons'
import { LEGAL_ENTITY, SOCIALS } from '@/lib/seo/config'

/**
 * Dock des points de contact : LinkedIn, e-mail, téléphone.
 *
 * Le téléphone n'est pas un simple lien `tel:` : sur ordinateur celui-ci
 * n'aboutit à rien d'utile. Le bouton révèle donc le numéro, qui reste
 * lui-même appelable d'un geste sur mobile.
 */
export function SocialDock({ orientation = 'horizontal' }: { orientation?: 'horizontal' | 'vertical' }) {
  const [showPhone, setShowPhone] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Un clic à l'extérieur ou Échap referme la pastille.
  useEffect(() => {
    if (!showPhone) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowPhone(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowPhone(false) }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [showPhone])

  const items: DockItemData[] = [
    {
      key: 'linkedin',
      link: SOCIALS.linkedin,
      label: 'Guillaume Horn sur LinkedIn',
      target: '_blank',
      Icon: <LinkedInIcon className="w-[17px] h-[17px]" />,
    },
    {
      key: 'mail',
      link: `mailto:${LEGAL_ENTITY.email}`,
      label: `Écrire à ${LEGAL_ENTITY.email}`,
      Icon: <Mail className="w-[18px] h-[18px]" strokeWidth={1.7} />,
    },
    {
      key: 'phone',
      onClick: () => setShowPhone((v) => !v),
      expanded: showPhone,
      label: showPhone ? 'Masquer le numéro' : 'Afficher le numéro de téléphone',
      Icon: <Phone className="w-[17px] h-[17px]" strokeWidth={1.7} />,
    },
  ]

  return (
    <div ref={ref} className={`chc-sdock chc-sdock--${orientation}`}>
      <AnimatedDock items={items} orientation={orientation} />
      {showPhone && (
        <a href={`tel:${LEGAL_ENTITY.phone}`} className="chc-sdock__num">
          {LEGAL_ENTITY.phoneDisplay}
        </a>
      )}
    </div>
  )
}
