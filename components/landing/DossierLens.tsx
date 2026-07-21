'use client'

import React, { useRef } from 'react'
import {
  Wallet,
  Scale,
  PiggyBank,
  Coins,
  Banknote,
  FileText,
  Landmark,
  ReceiptText,
  FileSignature,
  Home,
  Percent,
  ShieldCheck,
  KeyRound,
  Calculator,
  ArrowLeftRight,
  type LucideIcon,
} from 'lucide-react'
import { motion, useMotionValue, useMotionTemplate, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

/* Les mots-clés qui constituent un dossier de financement.
   Choisis pour le référencement (SEO) autant que pour le métier de Guillaume :
   ce sont les pièces et notions qu'il analyse dans chaque dossier. */
type Tag = { id: string; icon: LucideIcon; label: string }

const TAG_ROWS: Tag[][] = [
  [
    { id: 'capacite', icon: Wallet, label: "Capacité d'emprunt" },
    { id: 'endettement', icon: Scale, label: "Taux d'endettement" },
    { id: 'apport', icon: PiggyBank, label: 'Apport personnel' },
    { id: 'reste-a-vivre', icon: Coins, label: 'Reste à vivre' },
    { id: 'revenus', icon: Banknote, label: 'Revenus & salaires' },
  ],
  [
    { id: 'avis-imposition', icon: FileText, label: "Avis d'imposition" },
    { id: 'releves', icon: Landmark, label: 'Relevés de compte' },
    { id: 'bulletins', icon: ReceiptText, label: 'Bulletins de salaire' },
    { id: 'compromis', icon: FileSignature, label: 'Compromis de vente' },
    { id: 'domicile', icon: Home, label: 'Justificatif de domicile' },
  ],
  [
    { id: 'taeg', icon: Percent, label: 'Taux & TAEG' },
    { id: 'assurance', icon: ShieldCheck, label: 'Assurance emprunteur' },
    { id: 'garantie', icon: KeyRound, label: 'Garantie & hypothèque' },
    { id: 'amortissement', icon: Calculator, label: "Table d'amortissement" },
    { id: 'pret-relais', icon: ArrowLeftRight, label: 'Prêt relais' },
  ],
]

const CONFIG = {
  eyebrow: 'La lecture du dossier',
  title: 'Chaque dossier, passé au crible',
  description:
    'Revenus, apport, garanties, taux : nous analysons chaque pièce en profondeur pour présenter le meilleur profil aux banques.',
  lensSize: 96,
}

const ROW_DURATION = 26

export default function DossierLens() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const lensX = useMotionValue(0)
  const lensY = useMotionValue(0)

  // La loupe révèle les pastilles nettes dans un cercle qui suit son centre.
  const clipPath = useMotionTemplate`circle(30px at calc(50% + ${lensX}px - 10px) calc(50% + ${lensY}px - 10px))`
  const inverseMask = useMotionTemplate`radial-gradient(circle 30px at calc(50% + ${lensX}px - 10px) calc(50% + ${lensY}px - 10px), transparent 100%, black 100%)`

  const rowAnim = (rowIndex: number) =>
    reduce
      ? undefined
      : { x: rowIndex % 2 === 0 ? ['0%', '-33.333%'] : ['-33.333%', '0%'] }

  const rowTransition = { duration: ROW_DURATION, ease: 'linear' as const, repeat: Infinity }

  return (
    <div className="w-full max-w-[460px] mx-auto">
      <div className="group relative w-full overflow-hidden rounded-[2rem] border border-[var(--chc-bd)] bg-[var(--chc-white)] p-2 shadow-[0_40px_90px_-30px_rgba(30,46,63,0.42),0_8px_24px_-12px_rgba(30,46,63,0.28)]">
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden rounded-[1.6rem] bg-[var(--chc-cream)] h-[248px] sm:h-[292px]"
        >
          <div className="relative h-full w-full flex flex-col items-center justify-center">
            {/* Couche de base, pastilles estompées */}
            <motion.div
              style={{ WebkitMaskImage: inverseMask, maskImage: inverseMask }}
              className="flex flex-col gap-3.5 w-full h-full justify-center"
            >
              {TAG_ROWS.map((row, rowIndex) => (
                <motion.div
                  key={`row-${rowIndex}`}
                  className="flex gap-3.5 w-max"
                  animate={rowAnim(rowIndex)}
                  transition={rowTransition}
                >
                  {[...row, ...row, ...row].map((item, idx) => (
                    <Pill key={`${item.id}-${idx}`} item={item} />
                  ))}
                </motion.div>
              ))}
            </motion.div>

            {/* Couche révélée, pastilles nettes, dorées, sous la loupe */}
            <motion.div
              className="absolute inset-0 flex flex-col gap-3.5 justify-center pointer-events-none select-none z-10"
              style={{ clipPath }}
            >
              {TAG_ROWS.map((row, rowIndex) => (
                <motion.div
                  key={`row-reveal-${rowIndex}`}
                  className="flex gap-3.5 w-max"
                  animate={rowAnim(rowIndex)}
                  transition={rowTransition}
                >
                  {[...row, ...row, ...row].map((item, idx) => (
                    <Pill key={`${item.id}-${idx}-reveal`} item={item} revealed />
                  ))}
                </motion.div>
              ))}
            </motion.div>

            {/* La loupe, déplaçable */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 cursor-grab active:cursor-grabbing drop-shadow-xl"
              drag
              dragMomentum={false}
              dragConstraints={containerRef}
              style={{ x: lensX, y: lensY }}
            >
              <div className="relative">
                <MagnifyingLens size={CONFIG.lensSize} />
                <div className="absolute top-[6px] left-[6px] w-[62px] h-[62px] rounded-full bg-white/10 pointer-events-none" />
              </div>
            </motion.div>
          </div>

          {/* Dégradés de bord */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-[linear-gradient(to_right,var(--chc-cream),transparent)] z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-[linear-gradient(to_left,var(--chc-cream),transparent)] z-20" />
        </div>

        <div className="px-4 pt-5 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--chc-gold)]">
            {CONFIG.eyebrow}
          </p>
          <h3
            className="mt-2 text-2xl leading-tight text-[var(--chc-text)]"
            style={{ fontFamily: 'var(--chc-serif)', fontWeight: 400 }}
          >
            {CONFIG.title}
          </h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--chc-mid)]">
            {CONFIG.description}
          </p>
        </div>
      </div>
    </div>
  )
}

function Pill({ item, revealed = false }: { item: Tag; revealed?: boolean }) {
  const Icon = item.icon
  return (
    <div
      className={cn(
        'flex gap-2 items-center whitespace-nowrap w-fit rounded-full border px-3 py-2 text-xs',
        revealed
          ? 'bg-[var(--chc-white)] border-[rgba(86,150,141,0.30)] text-[var(--chc-text)] shadow-sm scale-[1.12] ml-5 font-medium'
          : 'bg-[rgba(255,255,255,0.55)] border-[var(--chc-bd)] text-[var(--chc-lite)]',
      )}
    >
      <Icon className="w-3.5 h-3.5" style={revealed ? { color: 'var(--chc-gold)' } : undefined} />
      <span>{item.label}</span>
    </div>
  )
}

/* Loupe premium (verre + monture chromée), fournie par le client. */
function MagnifyingLens({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M365.424 335.392L342.24 312.192L311.68 342.736L334.88 365.936L365.424 335.392Z" fill="#B0BDC6" />
      <path d="M358.08 342.736L334.88 319.552L319.04 335.392L342.24 358.584L358.08 342.736Z" fill="#DFE9EF" />
      <path d="M352.368 321.808L342.752 312.192L312.208 342.752L321.824 352.36L352.368 321.808Z" fill="#B0BDC6" />
      <path d="M332 332C260 404 142.4 404 69.6001 332C-2.3999 260 -2.3999 142.4 69.6001 69.6C141.6 -3.20003 259.2 -2.40002 332 69.6C404.8 142.4 404.8 260 332 332ZM315.2 87.2C252 24 150.4 24 88.0001 87.2C24.8001 150.4 24.8001 252 88.0001 314.4C151.2 377.6 252.8 377.6 315.2 314.4C377.6 252 377.6 150.4 315.2 87.2Z" fill="#DFE9EF" />
      <path d="M319.2 319.2C254.4 384 148.8 384 83.2001 319.2C18.4001 254.4 18.4001 148.8 83.2001 83.2C148 18.4 253.6 18.4 319.2 83.2C384 148.8 384 254.4 319.2 319.2ZM310.4 92C250.4 32 152 32 92.0001 92C32.0001 152 32.0001 250.4 92.0001 310.4C152 370.4 250.4 370.4 310.4 310.4C370.4 250.4 370.4 152 310.4 92Z" fill="#7A858C" />
      <path d="M484.104 428.784L373.8 318.472L318.36 373.912L428.672 484.216L484.104 428.784Z" fill="#333333" />
      <path d="M471.664 441.224L361.344 330.928L330.8 361.48L441.12 471.76L471.664 441.224Z" fill="#575B5E" />
      <path d="M495.2 423.2C504 432 432.8 504 423.2 495.2L417.6 489.6C408.8 480.8 480 408.8 489.6 417.6L495.2 423.2Z" fill="#B0BDC6" />
      <path d="M483.2 435.2C492 444 444.8 492 435.2 483.2L429.6 477.6C420.8 468.8 468 420.8 477.6 429.6L483.2 435.2Z" fill="#DFE9EF" />
    </svg>
  )
}
