import { cn } from '@/lib/utils'

/**
 * Carte qui se retourne au survol.
 *
 * Adaptée du composant d'origine : ses classes `bg-white dark:bg-zinc-950`
 * supposaient un thème shadcn commutable, absent ici (le site est sombre en
 * permanence). Le rendu est repris avec les jetons Cap Horn.
 *
 * Accessibilité : le retournement est purement décoratif, la face arrière ne
 * portant que le logo. Aucune information n'est donc perdue là où le survol
 * n'existe pas (tactile, clavier) ; la face arrière est masquée aux lecteurs
 * d'écran et le retournement est désactivé au pointeur grossier.
 */
interface FlippingCardProps {
  className?: string
  frontContent: React.ReactNode
  backContent: React.ReactNode
}

export function FlippingCard({ className, frontContent, backContent }: FlippingCardProps) {
  return (
    <div className={cn('chc-flip', className)}>
      <div className="chc-flip__inner">
        <div className="chc-flip__face chc-flip__face--front">{frontContent}</div>
        <div className="chc-flip__face chc-flip__face--back" aria-hidden>{backContent}</div>
      </div>
    </div>
  )
}
