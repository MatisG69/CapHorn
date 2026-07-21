import { FlippingCard } from '@/components/ui/FlippingCard'

/**
 * Cartouche d'identité du cabinet, en carte retournable.
 *
 * Face avant : les caractéristiques (statut, fondateur, réseau…).
 * Face arrière, au survol : le logo Cap Horn.
 */
export interface Spec {
  k: string
  v: string
  sup?: string
}

export function SpecFlipCard({ head, specs }: { head: string; specs: Spec[] }) {
  return (
    <FlippingCard
      className="chc-spec-flip"
      frontContent={
        <div className="chc-spec-flip__front">
          <p className="chc-spec-flip__head">
            {head}
            <sup>®</sup>
          </p>
          <dl className="chc-spec-flip__list">
            {specs.map((s) => (
              <div className="chc-spec-flip__row" key={s.k}>
                <dt>{s.k}</dt>
                <dd>
                  {s.v}
                  {s.sup && <span>{s.sup}</span>}
                </dd>
              </div>
            ))}
          </dl>
          {/* Repère visuel : le retournement n'est pas devinable autrement. */}
          <span className="chc-spec-flip__hint" aria-hidden>
            <span /><span /><span />
          </span>
        </div>
      }
      backContent={
        <div className="chc-spec-flip__back">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-caphorn-dark.png" alt="" className="chc-spec-flip__logo" />
        </div>
      }
    />
  )
}
