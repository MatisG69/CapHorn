import { ArrowRight } from 'lucide-react'
import { LiquidButton } from '@/components/ui/LiquidButton'

/** Footer editorial Cap Horn — bandeau CTA (optionnel) + colonnes + bas de page. */
export function ChcFooter({ showCta = true }: { showCta?: boolean }) {
  return (
    <footer className="chc-footer">
      {showCta && (
        <div className="chc-footer__cta">
          <div className="chc-footer__cta-title">Prêt à faire avancer<br /><em>votre projet ?</em></div>
          <LiquidButton href="/tunnel" tone="dark" size="lg">Démarrer mon étude gratuite <ArrowRight className="w-4 h-4" /></LiquidButton>
        </div>
      )}
      <div className="chc-footer__grid">
        <div className="chc-footer__brand">
          <span className="chc-nav__name" style={{ fontSize: 18 }}>Cap Horn Conseils</span>
          <p style={{ marginTop: 14, fontSize: 13, fontWeight: 300, lineHeight: 1.8, maxWidth: '34ch', color: 'rgba(255,255,255,0.5)' }}>
            Cabinet de courtage indépendant en financement et assurance. Architecture financière sur mesure, à Marcq-en-Barœul.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 9 }}>
          <h4>Financements</h4>
          <LiquidButton href="/financement-professions-liberales" tone="dark" size="sm" uppercase={false}>Professions libérales</LiquidButton>
          <LiquidButton href="/financement-franchise" tone="dark" size="sm" uppercase={false}>Franchise</LiquidButton>
          <LiquidButton href="/reprise-transmission" tone="dark" size="sm" uppercase={false}>Reprise &amp; transmission</LiquidButton>
          <LiquidButton href="/expertises" tone="dark" size="sm" uppercase={false}>Toutes les expertises</LiquidButton>
          <LiquidButton href="/simulateur-credit-immobilier" tone="dark" size="sm" uppercase={false}>Simulateur crédit immo</LiquidButton>
          <LiquidButton href="/simulateur" tone="dark" size="sm" uppercase={false}>Simulateur assurance</LiquidButton>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 9 }}>
          <h4>Cabinet</h4>
          <LiquidButton href="/methode" tone="dark" size="sm" uppercase={false}>Méthode</LiquidButton>
          <LiquidButton href="/blog" tone="dark" size="sm" uppercase={false}>Blog &amp; conseils</LiquidButton>
          <LiquidButton href="/le-cabinet" tone="dark" size="sm" uppercase={false}>À propos</LiquidButton>
          <LiquidButton href="/tunnel" tone="dark" size="sm" uppercase={false}>Démarrer une étude</LiquidButton>
        </div>
      </div>
      <div className="chc-footer__bottom">
        <span>© {new Date().getFullYear()} Cap Horn Conseils · Courtage &amp; Financement</span>
        <span>Données protégées · RGPD · Mentions légales · Marcq-en-Barœul</span>
      </div>
    </footer>
  )
}
