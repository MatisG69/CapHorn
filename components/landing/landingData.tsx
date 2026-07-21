import type { ReactNode } from 'react'

const s = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}
const IconHome = () => (<svg width="24" height="24" viewBox="0 0 24 24" {...s}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9.5 21v-6h5v6" /></svg>)
const IconBriefcase = () => (<svg width="24" height="24" viewBox="0 0 24 24" {...s}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M3 12h18" /></svg>)
const IconShield = () => (<svg width="24" height="24" viewBox="0 0 24 24" {...s}><path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6Z" /><path d="m9 12 2 2 4-4" /></svg>)
const IconBalance = () => (<svg width="24" height="24" viewBox="0 0 24 24" {...s}><path d="M12 3v18" /><path d="M5 7h14" /><path d="M5 7 3 13h4Z" /><path d="m19 7-2 6h4Z" /><path d="M8 21h8" /></svg>)
const IconGlobe = () => (<svg width="24" height="24" viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.5 2.5 2.5 15 0 18-2.5-3-2.5-15.5 0-18Z" /></svg>)
const IconPuzzle = () => (<svg width="24" height="24" viewBox="0 0 24 24" {...s}><path d="M9 4h6v3a2 2 0 1 0 4 0V4h1v5h-3a2 2 0 1 0 0 4h3v6h-6v-2a2 2 0 1 0-4 0v2H4v-6h2a2 2 0 1 0 0-4H4V4h5Z" /></svg>)

export interface SvcCard {
  number: string
  title: string
  description: string
  details: string
  icon: ReactNode
}

export const SERVICES: SvcCard[] = [
  {
    number: '01', title: 'Immobilier', icon: <IconHome />,
    description: 'Résidence principale, investissement locatif, SCI. Près de cent banques mises en concurrence sur votre dossier.',
    details: 'Résidence principale, investissement locatif, acquisition via SCI : nous construisons votre dossier avant de le présenter, puis nous mettons près de cent banques en concurrence. Sur les profils solides, nous obtenons régulièrement 0,20 à 0,40 % sous les grilles affichées, soit plusieurs milliers d’euros sur la durée. Et nous négocions aussi ce que personne ne regarde : assurance, garanties, modulation d’échéances, indemnités de remboursement anticipé.',
  },
  {
    number: '02', title: 'Financement professionnel', icon: <IconBriefcase />,
    description: 'Trésorerie, matériel, véhicule, reprise, création, développement, levée de fonds.',
    details: 'Création, développement, matériel, trésorerie, croissance externe ou transmission : nous construisons la structure de financement avant d’aller la défendre devant les banques. Notre indépendance nous permet de combiner plusieurs lignes (prêt bancaire, crédit-bail, garantie Bpifrance, dette privée) là où une banque seule ne vous proposera jamais que son propre produit.',
  },
  {
    number: '03', title: 'Assurance emprunteur', icon: <IconShield />,
    description: 'Délégation d’assurance, renégociation. Jusqu’à 50 % d’économies sur votre prime annuelle.',
    details: 'La loi Lemoine vous autorise à changer d’assurance emprunteur à tout moment, sans frais ni pénalité. C’est un droit ouvert à tous, encore rarement exercé faute d’être accompagné. Nous confrontons votre contrat à plus de vingt assureurs, à garanties au moins équivalentes : sur un prêt de 250 000 € sur 20 ans, l’économie atteint couramment 15 000 à 30 000 €. Courriers, délais, formalisme auprès de votre banque : nous prenons tout en charge.',
  },
  {
    number: '04', title: 'Équilibre financier', icon: <IconBalance />,
    description: 'Restructuration de dettes, regroupement de crédits, reconstruction de votre capacité d’emprunt.',
    details: 'Quand les mensualités pèsent trop, ou avant de relancer un projet immobilier, le regroupement de crédits allège la charge et restaure votre capacité d’emprunt. Nous chiffrons plusieurs scénarios (durée, mensualité, taux, assurance, frais) et nous vous montrons le coût total de chacun, pas seulement la mensualité. Allonger la durée est toujours la solution la plus facile à vendre ; ce n’est presque jamais la meilleure pour vous.',
  },
  {
    number: '05', title: 'International', icon: <IconGlobe />,
    description: 'Solutions dédiées aux expatriés et non-résidents. Financement immobilier en France depuis l’étranger.',
    details: 'Revenus en devises, fiscalité étrangère, absence de domiciliation en France : la plupart des banques referment le dossier avant même de l’ouvrir. Nous travaillons avec le cercle restreint d’établissements qui financent réellement les non-résidents. Votre dossier est piloté à distance, en lien avec votre notaire, jusqu’à la signature, qui peut être organisée par procuration sans que vous ayez à prendre l’avion.',
  },
  {
    number: '06', title: 'Situations complexes', icon: <IconPuzzle />,
    description: 'Refus bancaire, dossiers atypiques. Notre indépendance trouve des solutions là où d’autres échouent.',
    details: 'CDD, profession atypique, séparation en cours, antécédent FICP, entrepreneur avec moins de trois bilans, levée de réserves : une banque qui dit non juge un dossier, pas un projet. Nous reprenons le vôtre depuis la première ligne, identifions les établissements dont les critères correspondent réellement à votre situation, et le présentons sous l’angle qui le rend finançable. Avant toute nouvelle démarche, jamais après.',
  },
]

export const STEPS = [
  { number: '1', title: 'Qualifiez votre projet', description: 'Trois minutes, quelques questions, aucun document à fournir. Vous repartez avec un premier avis de faisabilité.' },
  { number: '2', title: 'Échange personnalisé', description: 'Guillaume vous rappelle sous 24 h ouvrées. On creuse votre situation réelle, et la stratégie se décide ensemble.' },
  { number: '3', title: 'Montage & négociation', description: 'Nous montons le dossier à votre place et le défendons auprès des banques dont les critères collent à votre profil.' },
]

export const BANKS = [
  { title: 'BNP Paribas', logo: 'https://logo.clearbit.com/bnpparibas.com' },
  { title: 'Crédit Agricole', logo: 'https://logo.clearbit.com/credit-agricole.com' },
  { title: 'Société Générale', logo: 'https://logo.clearbit.com/societegenerale.com' },
  { title: 'BPCE', logo: 'https://logo.clearbit.com/bpce.fr' },
  { title: 'Crédit Mutuel', logo: 'https://logo.clearbit.com/creditmutuel.fr' },
  { title: 'CIC', logo: 'https://logo.clearbit.com/cic.fr' },
  { title: 'La Banque Postale', logo: 'https://logo.clearbit.com/labanquepostale.fr' },
  { title: 'HSBC', logo: 'https://logo.clearbit.com/hsbc.com' },
  { title: 'Caisse d’Épargne', logo: 'https://logo.clearbit.com/caisse-epargne.fr' },
  { title: 'Banque Populaire', logo: 'https://logo.clearbit.com/banquepopulaire.fr' },
  { title: 'LCL', logo: 'https://logo.clearbit.com/lcl.fr' },
  { title: 'AXA Banque', logo: 'https://logo.clearbit.com/axa.fr' },
]

export const PARTNERS = [
  'Banquiers', 'Notaires', 'Conseillers en patrimoine', 'Experts-comptables',
  'Agents immobiliers', 'Avocats fiscalistes', 'Family officers', 'Gestionnaires d’actifs',
]

export const STATS = [
  { value: 100, prefix: '', suffix: '+', decimals: 0, label: 'banques & assureurs partenaires' },
  { value: 0.3, prefix: '−', suffix: ' %', decimals: 2, label: 'de taux négocié sous les grilles affichées' },
  { value: 24, prefix: '', suffix: ' h', decimals: 0, label: 'pour un premier avis, sans engagement' },
  { value: 98, prefix: '', suffix: ' %', decimals: 0, label: 'de clients qui nous recommandent' },
]
