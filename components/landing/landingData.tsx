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
    description: 'Résidence principale, investissement locatif, SCI. Négociation des meilleures conditions auprès de nos partenaires bancaires.',
    details: 'Que vous achetiez votre résidence principale, financiez un investissement locatif ou structuriez une acquisition via SCI, nous étudions chaque dossier individuellement. Nous comparons les offres de près de cent banques partenaires, négocions les marges, optimisons l’assurance et la garantie. Sur les profils premium, nous obtenons régulièrement des taux 0,20 à 0,40 % en dessous des grilles publiques.',
  },
  {
    number: '02', title: 'Financement professionnel', icon: <IconBriefcase />,
    description: 'Trésorerie, matériel, véhicule, reprise, création, développement, levée de fonds.',
    details: 'Nous accompagnons les chefs d’entreprise dans tous les financements liés à leur activité : besoin en fonds de roulement, acquisition de matériel ou de locaux, opération de croissance externe, transmission, levée de fonds bancaire ou alternative. Notre indépendance nous permet de combiner plusieurs lignes pour construire la structure la plus efficiente.',
  },
  {
    number: '03', title: 'Assurance emprunteur', icon: <IconShield />,
    description: 'Délégation d’assurance, renégociation. Jusqu’à 50 % d’économies sur votre prime annuelle.',
    details: 'La loi Lemoine vous autorise à changer d’assurance emprunteur à tout moment, sans frais ni pénalité. Nous comparons votre contrat actuel à plus de vingt assureurs partenaires et négocions des garanties au moins équivalentes. Sur un prêt de 250 000 € sur 20 ans, nous générons en moyenne 15 000 à 30 000 € d’économie cumulée.',
  },
  {
    number: '04', title: 'Équilibre financier', icon: <IconBalance />,
    description: 'Restructuration de dettes, regroupement de crédits, optimisation de votre capacité d’emprunt.',
    details: 'Lorsque les mensualités pèsent trop, ou avant un nouveau projet immobilier, le regroupement de crédits permet de réduire la charge mensuelle, restaurer la capacité d’emprunt et reprendre la main sur le budget. Nous simulons plusieurs scénarios et orientons vers la solution la plus saine, pas systématiquement la plus longue.',
  },
  {
    number: '05', title: 'International', icon: <IconGlobe />,
    description: 'Solutions dédiées aux expatriés et non-résidents. Financement immobilier en France depuis l’étranger.',
    details: 'Vivre à l’étranger ne doit pas vous priver d’investir en France. Nous travaillons avec un cercle restreint de banques spécialisées dans les profils non-résidents et expatriés. Notre cabinet pilote l’intégralité du dossier à distance, en lien avec votre notaire en France ; la signature peut se faire par procuration.',
  },
  {
    number: '06', title: 'Situations complexes', icon: <IconPuzzle />,
    description: 'Refus bancaire, dossiers atypiques. Notre indépendance trouve des solutions là où d’autres échouent.',
    details: 'Refus bancaire, profession atypique, contrat en CDD, séparation en cours, antécédent FICP, levée de réserves : un refus n’est presque jamais une fatalité. Notre rôle est de reconstruire le dossier, identifier les banques susceptibles de l’accepter et présenter votre situation sous le bon angle.',
  },
]

export const STEPS = [
  { number: '1', title: 'Qualifiez votre projet', description: 'Notre outil analyse votre situation en 3 minutes. Aucun document requis à cette étape.' },
  { number: '2', title: 'Échange personnalisé', description: 'Guillaume vous rappelle sous 24 h pour affiner votre dossier et identifier les meilleures pistes.' },
  { number: '3', title: 'Montage & négociation', description: 'Nous constituons votre dossier et négocions pour vous les meilleures conditions de financement.' },
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
  { value: 0.3, prefix: '−', suffix: ' %', decimals: 2, label: 'de taux négocié sous les grilles' },
  { value: 24, prefix: '', suffix: ' h', decimals: 0, label: 'pour un premier retour personnalisé' },
  { value: 98, prefix: '', suffix: ' %', decimals: 0, label: 'de clients qui nous recommandent' },
]
