'use client'

import * as React from 'react'
import { useRef } from 'react'
import {
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Dock de liens sociaux à effet de loupe (macOS).
 *
 * Adapté du composant d'origine sur deux points :
 * — les classes `bg-primary` / `bg-secondary` / `text-*-foreground` viennent
 *   d'un thème shadcn absent de ce projet ; elles rendaient les pastilles
 *   transparentes. On utilise les jetons Cap Horn (--chc-*).
 * — `tailwind-merge` n'est pas installé : on réutilise le `cn` maison (clsx).
 */
export interface DockItemData {
  /** Lien externe, ou action locale via `onClick` (les deux s'excluent). */
  link?: string
  onClick?: () => void
  /** Reflète l'état ouvert/fermé quand l'élément est une action. */
  expanded?: boolean
  label: string
  Icon: React.ReactNode
  target?: string
  key?: string
}

export interface AnimatedDockProps {
  className?: string
  items: DockItemData[]
  /** `vertical` : rail latéral fixe, qui ne consomme aucune hauteur. */
  orientation?: 'horizontal' | 'vertical'
}

export const AnimatedDock = ({ className, items, orientation = 'horizontal' }: AnimatedDockProps) => {
  // On suit l'axe pertinent : la loupe doit réagir au déplacement le long
  // du dock, pas perpendiculairement à lui.
  const pointer = useMotionValue(Infinity)
  const vertical = orientation === 'vertical'

  return (
    <motion.div
      onMouseMove={(e) => pointer.set(vertical ? e.pageY : e.pageX)}
      onMouseLeave={() => pointer.set(Infinity)}
      className={cn('chc-dock', vertical && 'chc-dock--v', className)}
    >
      {items.map((item) => (
        <DockItem key={item.key ?? item.link} pointer={pointer} vertical={vertical}>
          {item.onClick ? (
            <button
              type="button"
              onClick={item.onClick}
              aria-label={item.label}
              aria-expanded={item.expanded}
              className="chc-dock__link"
            >
              {item.Icon}
            </button>
          ) : (
            <Link
              href={item.link ?? '#'}
              target={item.target}
              rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
              aria-label={item.label}
              className="chc-dock__link"
            >
              {item.Icon}
            </Link>
          )}
        </DockItem>
      ))}
    </motion.div>
  )
}

interface DockItemProps {
  pointer: MotionValue<number>
  vertical?: boolean
  children: React.ReactNode
}

export const DockItem = ({ pointer, vertical = false, children }: DockItemProps) => {
  const ref = useRef<HTMLDivElement>(null)
  // Sur mobile / pointeur grossier, l'agrandissement au survol n'existe pas :
  // on garde une taille fixe confortable au doigt.
  const reduced = useReducedMotion()

  const distance = useTransform(pointer, (val) => {
    const r = ref.current?.getBoundingClientRect()
    // Au premier rendu la ref est vide, et `pointer` vaut Infinity tant que la
    // souris n'est pas entrée. Renvoyer 0 signifiait « souris au centre » : les
    // pastilles s'affichaient donc à leur taille maximale (72 px) et
    // débordaient du dock. On renvoie une distance hors plage pour obtenir la
    // taille de repos.
    if (!r || !Number.isFinite(val)) return 9999
    // En vertical on mesure sur Y, en tenant compte du défilement de la page.
    return vertical
      ? val - (r.y + window.scrollY) - r.height / 2
      : val - r.x - r.width / 2
  })

  const sizeSync = useTransform(distance, [-140, 0, 140], [44, 72, 44])
  const size = useSpring(sizeSync, { mass: 0.1, stiffness: 150, damping: 12 })
  const iconScale = useTransform(size, [44, 72], [1, 1.35])
  const iconSpring = useSpring(iconScale, { mass: 0.1, stiffness: 150, damping: 12 })

  return (
    <motion.div
      ref={ref}
      style={reduced ? undefined : vertical ? { height: size } : { width: size }}
      className="chc-dock__item"
    >
      <motion.div
        style={reduced ? undefined : { scale: iconSpring }}
        className="chc-dock__icon"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
