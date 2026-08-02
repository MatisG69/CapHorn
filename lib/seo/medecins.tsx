/**
 * Contenu de la page « Financement des médecins & chirurgiens à Lille ».
 *
 * Page fille de /financement-professions-sante, elle-même fille de
 * /financement-professions-liberales. Elle vise les requêtes les plus
 * qualifiées de l'axe santé (« financement médecin Lille », « rachat de
 * patientèle », « SELARL médecin »), là où la page mère reste générique.
 *
 * Tout le texte vit ici plutôt que dans le composant : la page est longue
 * (~4 000 mots, exigence SEO de l'axe), et le JSX resterait illisible si le
 * contenu y était mêlé. Les icônes sont des composants Lucide et non des
 * emojis : les emojis « font IA » et se rendent différemment selon l'OS.
 */
import {
  Accessibility,
  Baby,
  Bone,
  Brain,
  BrainCog,
  Building2,
  Droplet,
  Droplets,
  Ear,
  Eye,
  GraduationCap,
  Handshake,
  HeartHandshake,
  HeartPulse,
  Layers,
  MoreHorizontal,
  Repeat,
  Ribbon,
  Scan,
  Scissors,
  Stethoscope,
  Syringe,
  TrendingUp,
  Utensils,
  Wind,
  type LucideIcon,
} from 'lucide-react'

export const MEDECINS_SLUG = 'financement-medecins-chirurgiens-lille'

export const MEDECINS_META = {
  title: 'Financement des médecins & chirurgiens à Lille | Installation, SELARL, Patientèle',
  description:
    'Installation en libéral, reprise de patientèle, SELARL, SELAS, achat des murs du cabinet ou matériel médical. Cap Horn Conseils accompagne les médecins et chirurgiens dans les Hauts-de-France.',
  /** Titre court réutilisé par le fil d'Ariane et la carte de partage. */
  short: 'Médecins & chirurgiens',
}

/* ── Héros ────────────────────────────────────────────────────────────── */

export const HERO = {
  eyebrow: 'Médecins & chirurgiens · Lille',
  /** Chapô placé au-dessus du H1 : il qualifie le visiteur dès la première ligne. */
  chapo:
    'Vous préparez votre installation, reprenez une patientèle ou rejoignez une SELARL ? Découvrez comment structurer votre financement avant de rencontrer votre banque.',
  h1: 'Financement des médecins et chirurgiens : de l’installation à la transmission de votre activité',
  /** Titre du bloc d’appel du héros, au-dessus des deux boutons. */
  ctaTitle: 'Vous préparez une décision importante pour votre activité ?',
  claim:
    'Vous passez des années à construire votre carrière. Votre financement mérite le même niveau d’exigence.',
  paragraphs: [
    'S’installer en libéral, reprendre la patientèle d’un confrère, rejoindre une SELARL, acheter les murs de son cabinet ou investir dans un plateau technique… Derrière chacun de ces projets se cachent des décisions importantes qui auront un impact sur votre activité pendant de nombreuses années.',
    'Avant même de parler de banque ou de taux, il faut construire un projet cohérent. Choisir la bonne structure juridique, anticiper les besoins de trésorerie, présenter un dossier solide et comprendre les attentes des établissements bancaires font souvent la différence.',
    'Depuis plus de 15 ans, j’analyse des projets de financement. Aujourd’hui, j’accompagne les médecins et chirurgiens qui souhaitent structurer leur projet avec méthode, qu’il s’agisse d’une première installation, d’une association, d’un développement ou d’une transmission d’activité.',
    'Que vous exerciez à Lille, Villeneuve-d’Ascq, Marcq-en-Barœul, La Madeleine, Roubaix, Tourcoing ou plus largement dans les Hauts-de-France, nous réalisons une première étude confidentielle de votre projet.',
  ],
}

export const ENGAGEMENTS: { icon: 'stethoscope' | 'bank' | 'file' | 'hand'; text: string }[] = [
  { icon: 'stethoscope', text: 'Une parfaite compréhension des projets d’installation des professions médicales.' },
  { icon: 'bank', text: 'Plus de 100 partenaires bancaires et organismes de financement.' },
  { icon: 'file', text: 'Une étude confidentielle réalisée avant toute présentation en banque.' },
  { icon: 'hand', text: 'Un interlocuteur unique jusqu’au déblocage des fonds.' },
]

export const PREMIUM_BOX = {
  title: 'Pourquoi consulter un spécialiste avant votre banque ?',
  items: [
    'Vérifier la faisabilité de votre projet.',
    'Choisir la structure juridique adaptée.',
    'Anticiper les attentes des banques.',
    'Préserver votre trésorerie.',
    'Présenter un dossier solide dès le premier rendez-vous.',
  ],
}

/* ── Frise de carrière ────────────────────────────────────────────────── */

export const CARRIERE: { icon: LucideIcon; label: string }[] = [
  { icon: GraduationCap, label: 'Internat' },
  { icon: Stethoscope, label: 'Installation' },
  { icon: Handshake, label: 'Association' },
  { icon: TrendingUp, label: 'Développement' },
  { icon: Building2, label: 'Patrimoine' },
  { icon: Repeat, label: 'Transmission' },
]

/* ── Cartes « Où en êtes-vous ? » ─────────────────────────────────────── */

export interface Situation {
  icon: LucideIcon
  title: string
  body: string[]
  cta: string
}

export const SITUATIONS: Situation[] = [
  {
    icon: GraduationCap,
    title: 'Je termine mon internat',
    body: [
      'Vous préparez votre première installation ? Entre le choix du mode d’exercice, la recherche d’un cabinet, les premiers investissements et les démarches administratives, il est parfois difficile de savoir par où commencer.',
      'Nous vous aidons à construire un plan de financement cohérent avant même votre premier rendez-vous bancaire.',
    ],
    cta: 'Découvrir les solutions d’installation',
  },
  {
    icon: Stethoscope,
    title: 'Je reprends une patientèle',
    body: [
      'Reprendre l’activité d’un confrère ne consiste pas uniquement à financer un droit de présentation à patientèle. Il faut également anticiper la trésorerie, les éventuels travaux, le matériel médical, les frais liés à l’installation et le calendrier de la reprise.',
      'Nous structurons votre projet afin qu’il puisse être présenté dans les meilleures conditions aux établissements bancaires.',
    ],
    cta: 'Étudier mon projet',
  },
  {
    icon: Handshake,
    title: 'Je rejoins une SELARL ou une SELAS',
    body: [
      'Entrer au capital d’une société d’exercice libéral représente souvent une étape importante dans la carrière d’un médecin.',
      'Rachat de parts sociales, valorisation de la société, modalités d’association, financement de l’opération… chaque projet mérite une analyse spécifique.',
    ],
    cta: 'Préparer mon association',
  },
  {
    icon: Building2,
    title: 'J’achète les murs de mon cabinet',
    body: [
      'Devenir propriétaire de vos locaux peut permettre de développer progressivement votre patrimoine tout en sécurisant votre activité.',
      'Selon votre situation, l’acquisition peut être envisagée en nom propre ou via une SCI.',
    ],
    cta: 'Étudier mon acquisition',
  },
  {
    icon: Scan,
    title: 'Je développe mon activité',
    body: [
      'Votre patientèle progresse et de nouveaux investissements deviennent nécessaires.',
      'Plateau technique, travaux, nouveaux équipements, matériel médical, logiciels métier ou second lieu d’exercice : chaque investissement doit être pensé dans une stratégie globale.',
    ],
    cta: 'Développer mon cabinet',
  },
  {
    icon: Droplets,
    title: 'Je souhaite préserver ma trésorerie',
    body: [
      'Mobiliser toute son épargne n’est pas toujours la meilleure stratégie.',
      'Selon votre projet, il peut être préférable de conserver une partie de votre capacité d’investissement pour faire face aux imprévus ou préparer un futur développement.',
    ],
    cta: 'Optimiser mon financement',
  },
  {
    icon: Repeat,
    title: 'Je prépare la transmission de mon activité',
    body: [
      'Après plusieurs années d’exercice, transmettre son cabinet ou accueillir progressivement un successeur nécessite une véritable anticipation.',
      'Nous intervenons sur les financements liés à la reprise d’une patientèle, au rachat de parts sociales ou à l’acquisition des murs professionnels.',
    ],
    cta: 'Préparer ma transmission',
  },
]

/* ── Structures juridiques ────────────────────────────────────────────── */

export interface Structure {
  sigle: string
  nom: string
  body: string
  points?: string[]
}

export const STRUCTURES: Structure[] = [
  {
    sigle: 'EI',
    nom: 'Entreprise individuelle',
    body:
      'Vous exercez seul et souhaitez financer votre installation, développer votre cabinet ou préparer une évolution vers une société d’exercice libéral.',
    points: ['Installation', 'Développement', 'Passage en société'],
  },
  {
    sigle: 'SELARL',
    nom: 'Société d’exercice libéral à responsabilité limitée',
    body:
      'La SELARL est souvent retenue par les médecins souhaitant exercer en société tout en préparant le développement de leur activité ou l’arrivée d’associés. Nous intervenons notamment lors :',
    points: [
      'd’une création ;',
      'd’une entrée au capital ;',
      'd’un rachat de parts sociales ;',
      'd’une évolution de la structure.',
    ],
  },
  {
    sigle: 'SELAS',
    nom: 'Société d’exercice libéral par actions simplifiée',
    body:
      'La SELAS est fréquemment choisie pour accompagner des projets de développement ou organiser une gouvernance plus souple. Chaque projet est étudié selon sa situation et ses objectifs.',
  },
  {
    sigle: 'SCP',
    nom: 'Société civile professionnelle',
    body:
      'Les projets portés par une Société Civile Professionnelle nécessitent une approche spécifique, notamment lors d’une association, d’une transmission ou d’un financement collectif.',
  },
  {
    sigle: 'SCM',
    nom: 'Société civile de moyens',
    body:
      'La Société Civile de Moyens permet de mutualiser certains moyens d’exploitation entre plusieurs professionnels de santé. Selon votre projet, nous pouvons étudier le financement des investissements réalisés par la structure.',
  },
  {
    sigle: 'SCI',
    nom: 'Société civile immobilière',
    body:
      'De nombreux médecins souhaitent devenir propriétaires de leurs locaux professionnels. L’acquisition peut être réalisée via une SCI lorsque ce montage est adapté à votre situation patrimoniale et professionnelle.',
  },
  {
    sigle: 'SPFPL',
    nom: 'Société de participations financières de profession libérale',
    body:
      'Certaines opérations de reprise ou de détention de participations nécessitent une réflexion plus globale. Nous travaillons en lien avec votre expert-comptable et votre avocat afin de construire un financement cohérent.',
  },
]

/* ── Spécialités ──────────────────────────────────────────────────────── */

export const SPECIALITES: { icon: LucideIcon; label: string }[] = [
  { icon: Stethoscope, label: 'Médecins généralistes' },
  { icon: HeartPulse, label: 'Cardiologues' },
  { icon: Brain, label: 'Neurologues' },
  { icon: Eye, label: 'Ophtalmologues' },
  { icon: Ear, label: 'ORL' },
  { icon: Baby, label: 'Pédiatres' },
  { icon: HeartHandshake, label: 'Gynécologues-obstétriciens' },
  { icon: Scan, label: 'Radiologues' },
  { icon: Layers, label: 'Dermatologues' },
  { icon: BrainCog, label: 'Psychiatres' },
  { icon: Bone, label: 'Chirurgiens orthopédiques' },
  { icon: Scissors, label: 'Chirurgiens' },
  { icon: Syringe, label: 'Anesthésistes-réanimateurs' },
  { icon: Wind, label: 'Pneumologues' },
  { icon: Utensils, label: 'Gastro-entérologues' },
  { icon: Ribbon, label: 'Oncologues' },
  { icon: Droplets, label: 'Néphrologues' },
  { icon: Droplet, label: 'Hématologues' },
  { icon: Accessibility, label: 'Rhumatologues' },
  { icon: MoreHorizontal, label: 'Et l’ensemble des médecins libéraux' },
]

/* ── Erreurs fréquentes ───────────────────────────────────────────────── */

export const ERREURS: { title: string; body: string[] }[] = [
  {
    title: 'Arriver en banque sans avoir défini la bonne structure juridique',
    body: [
      'Entreprise individuelle, SELARL, SELAS, SCP ou SCI : le choix de votre structure influence directement l’analyse de votre dossier.',
      'Avant toute demande de financement, il est préférable de vérifier que cette structure correspond à votre projet, à votre mode d’exercice et à vos objectifs.',
    ],
  },
  {
    title: 'Sous-estimer les besoins de trésorerie',
    body: [
      'Les premiers mois d’activité peuvent générer des dépenses importantes : cotisations, loyers, matériel, logiciels, secrétariat, travaux…',
      'Préserver une trésorerie suffisante permet d’aborder votre installation avec davantage de sérénité.',
    ],
  },
  {
    title: 'Ne financer que la patientèle',
    body: [
      'Le coût d’un projet ne se limite pas au droit de présentation.',
      'Travaux, matériel médical, informatique, mobilier, frais d’installation et besoin en fonds de roulement doivent être intégrés dès le départ.',
    ],
  },
  {
    title: 'Choisir une banque avant d’avoir construit son dossier',
    body: [
      'Toutes les banques ne financent pas les projets médicaux de la même manière.',
      'Présenter un dossier structuré dès le premier rendez-vous permet souvent de gagner du temps et d’éviter certaines incompréhensions.',
    ],
  },
  {
    title: 'Attendre la dernière minute',
    body: [
      'Une installation, une association ou une transmission se prépare plusieurs semaines, parfois plusieurs mois à l’avance.',
      'Plus le projet est anticipé, plus les possibilités sont nombreuses.',
    ],
  },
]

/* ── Méthode ──────────────────────────────────────────────────────────── */

export const METHODE: { n: string; title: string; body: string; details?: string[] }[] = [
  {
    n: '01',
    title: 'Nous échangeons sur votre projet.',
    body: 'Nous prenons le temps de comprendre votre activité, votre spécialité, vos objectifs et vos contraintes.',
  },
  {
    n: '02',
    title: 'Nous construisons votre stratégie.',
    body: '',
    details: ['Structure juridique', 'Plan de financement', 'Trésorerie', 'Garanties'],
  },
  {
    n: '03',
    title: 'Nous sollicitons les partenaires les plus adaptés.',
    body: 'Votre dossier est présenté uniquement lorsqu’il est prêt.',
  },
  {
    n: '04',
    title: 'Nous vous accompagnons jusqu’au déblocage des fonds.',
    body: 'Nous restons votre interlocuteur pendant toute l’opération.',
  },
]

/* ── Guide téléchargeable ─────────────────────────────────────────────── */

export const GUIDE = {
  title: 'Réussir le financement de son installation médicale',
  lead: 'Avant de rencontrer votre banque, découvrez les principaux points de vigilance.',
  intro: 'Dans ce guide, vous retrouverez notamment :',
  /**
   * Deux promesses possibles, selon que le PDF est déposé ou non dans
   * public/guides/. La page choisit seule (voir lib/guide.ts) : elle ne promet
   * jamais un téléchargement immédiat pour un fichier qui n'existe pas.
   */
  ready: {
    eyebrow: 'Téléchargement gratuit',
    heading: 'Téléchargez gratuitement notre guide',
    cta: 'Télécharger gratuitement',
    note: 'Aucun engagement. Vos données restent confidentielles.',
  },
  pending: {
    eyebrow: 'Guide offert',
    heading: 'Recevez gratuitement notre guide',
    cta: 'Recevoir le guide',
    note: 'Envoi par e-mail sous 24 h ouvrées. Aucun engagement.',
    /** Phrase ajoutée sous l'accroche pour que la promesse soit explicite. */
    lead: 'Laissez vos coordonnées : Guillaume Horn vous l’adresse personnellement par e-mail.',
  },
  points: [
    'Les critères analysés par les banques.',
    'Les erreurs les plus fréquentes.',
    'Les différences entre EI, SELARL et SELAS.',
    'Les questions à se poser avant de signer.',
    'La check-list d’un dossier complet.',
  ],
  /**
   * Fichier servi après enregistrement des coordonnées, SANS extension :
   * `/api/guide` cherche dans public/guides/ le fichier portant ce nom, quelle
   * que soit son extension (.pdf, .jpg, .png, .webp). Remplacer le format du
   * guide ne demande donc aucune modification de code.
   */
  fileBase: '/guides/reussir-le-financement-de-son-installation-medicale',
}

/* ── Critères analysés par les banques ────────────────────────────────── */

export const CRITERES: { title: string; items: string[]; note?: string }[] = [
  {
    title: 'Votre parcours professionnel',
    items: [
      'Interne, remplaçant ou médecin installé',
      'Ancienneté dans l’exercice',
      'Expérience professionnelle',
      'Stabilité de votre activité',
    ],
  },
  {
    title: 'Votre projet',
    items: [
      'Installation en libéral',
      'Reprise d’une patientèle',
      'Association',
      'Achat des murs professionnels',
      'Développement du cabinet',
      'Acquisition de matériel médical',
    ],
  },
  {
    title: 'Votre mode d’exercice',
    items: ['Secteur 1', 'Secteur 2', 'OPTAM', 'Exercice individuel', 'Exercice en groupe'],
  },
  {
    title: 'Votre structure juridique',
    items: ['Entreprise individuelle', 'SELARL', 'SELAS', 'SCP', 'SCM', 'SCI', 'SPFPL'],
  },
  {
    title: 'L’équilibre financier',
    items: [
      'Votre capacité de remboursement',
      'Votre niveau d’endettement',
      'Votre apport éventuel',
      'Votre épargne disponible',
      'Le besoin de trésorerie',
      'Le prévisionnel d’activité',
    ],
  },
  {
    title: 'Les garanties',
    items: [
      'Garanties susceptibles d’être mises en place',
      'Assurances associées au financement',
    ],
    note: 'Étudiées au cas par cas, selon le projet et l’établissement sollicité.',
  },
]

/* ── Cas pratique ─────────────────────────────────────────────────────── */

export const CAS_PRATIQUE = {
  contexte: {
    title: 'Le contexte',
    body: 'Un médecin généraliste souhaite reprendre la patientèle d’un confrère proche de son départ à la retraite dans la métropole lilloise. Le projet comprend :',
    items: [
      'le financement du droit de présentation à patientèle ;',
      'des travaux de rénovation ;',
      'l’achat du mobilier ;',
      'le renouvellement du matériel informatique ;',
      'une trésorerie de démarrage pour les premiers mois d’activité.',
    ],
  },
  enjeux: {
    title: 'Les enjeux',
    body: 'Le défi ne consiste pas uniquement à obtenir un prêt. Il faut également :',
    items: [
      'choisir la structure juridique adaptée ;',
      'dimensionner correctement la trésorerie ;',
      'présenter un prévisionnel cohérent ;',
      'construire un plan de financement global.',
    ],
  },
  intervention: {
    title: 'Notre intervention',
    body: 'Avant toute démarche bancaire, nous avons structuré le projet afin d’intégrer l’ensemble des investissements dans une seule stratégie de financement. Cette préparation a permis de présenter un dossier complet, cohérent et adapté aux attentes des établissements sollicités.',
    items: [],
  },
  disclaimer:
    'Chaque projet est différent. Les solutions de financement dépendent notamment de votre situation personnelle, de votre spécialité, de la nature de votre projet et des critères propres à chaque banque.',
}

/* ── Faisabilité ──────────────────────────────────────────────────────── */

export const FAISABILITE = {
  analyse: [
    'Votre situation professionnelle.',
    'Votre mode d’exercice.',
    'La structure juridique envisagée.',
    'Le montant de votre projet.',
    'Les investissements à financer.',
    'Votre capacité d’emprunt.',
    'Les garanties envisageables.',
    'Les points pouvant renforcer votre dossier.',
  ],
  resultat: [
    'une vision claire de votre projet ;',
    'les éventuels points à améliorer ;',
    'une stratégie de financement adaptée à votre situation ;',
    'une estimation des solutions envisageables.',
  ],
}

/* ── Villes ───────────────────────────────────────────────────────────── */

export const VILLES = [
  'Lille',
  'Roubaix',
  'Tourcoing',
  'Villeneuve-d’Ascq',
  'Marcq-en-Barœul',
  'Dunkerque',
  'Armentières',
  'Bailleul',
]

export const PROXIMITE = [
  'Une parfaite connaissance du tissu économique local.',
  'Des échanges simplifiés avec vos conseils (expert-comptable, avocat, notaire).',
  'Un accompagnement en présentiel ou à distance selon vos contraintes.',
]

/* ── FAQ ──────────────────────────────────────────────────────────────── */

export const FAQ: { q: string; a: string }[] = [
  {
    q: 'Une banque peut-elle financer l’installation d’un médecin sans apport ?',
    a: 'Oui, selon votre profil, votre spécialité, votre expérience professionnelle et la nature du projet. Chaque établissement bancaire applique ses propres critères d’analyse.',
  },
  {
    q: 'Peut-on financer le rachat d’une patientèle ?',
    a: 'Oui. Selon la nature de l’opération, le financement peut porter sur un droit de présentation à patientèle ou sur l’acquisition de parts sociales au sein d’une société d’exercice libéral.',
  },
  {
    q: 'Quelle est la différence entre une SELARL et une SELAS ?',
    a: 'La SELARL et la SELAS sont deux sociétés d’exercice libéral. Le choix dépend notamment de votre organisation, de votre protection sociale, de votre fiscalité et de vos objectifs patrimoniaux. Cette décision doit être étudiée avec votre expert-comptable et votre avocat.',
  },
  {
    q: 'Une banque peut-elle financer le rachat de parts sociales ?',
    a: 'Oui. Les banques peuvent financer l’acquisition de parts sociales dans une SELARL, une SELAS ou une SCP, sous réserve de la solidité du projet et de la qualité du dossier présenté.',
  },
  {
    q: 'Puis-je acheter les murs de mon cabinet via une SCI ?',
    a: 'Oui. De nombreux médecins choisissent d’acquérir leurs locaux professionnels au travers d’une SCI. Ce montage doit être étudié en fonction de votre situation et de vos objectifs patrimoniaux.',
  },
  {
    q: 'Peut-on financer un plateau technique ?',
    a: 'Oui. Les investissements liés à un plateau technique peuvent être financés par un prêt professionnel ou, selon les équipements, par un crédit-bail ou une location financière.',
  },
  {
    q: 'Un interne ou un chef de clinique peut-il obtenir un financement ?',
    a: 'Oui. Selon votre parcours, votre spécialité et votre projet, certaines banques proposent des solutions adaptées aux jeunes médecins préparant leur installation.',
  },
  {
    q: 'Peut-on financer une trésorerie de démarrage ?',
    a: 'Oui. La constitution d’une trésorerie permet de faire face aux premières charges d’exploitation et peut être intégrée au plan de financement selon les caractéristiques du projet.',
  },
  {
    q: 'Comment les banques analysent-elles un dossier de médecin ?',
    a: 'Les banques étudient notamment votre spécialité, votre expérience, votre mode d’exercice, la cohérence du projet, votre capacité de remboursement, les investissements envisagés et la qualité de la présentation du dossier.',
  },
  {
    q: 'Quelles garanties demandent les banques ?',
    a: 'Les garanties varient selon le projet financé, le montant emprunté et la politique de chaque établissement bancaire. Elles sont étudiées au cas par cas.',
  },
  {
    q: 'Peut-on financer du matériel médical sans mobiliser toute sa trésorerie ?',
    a: 'Oui. Selon les équipements concernés, plusieurs solutions permettent de préserver votre capacité d’investissement tout en finançant votre matériel professionnel.',
  },
  {
    q: 'Puis-je financer plusieurs projets en même temps ?',
    a: 'Oui. Il est parfois possible de financer simultanément une patientèle, des travaux, du matériel médical et les murs professionnels dans le cadre d’un plan de financement global.',
  },
  {
    q: 'Une SCI peut-elle acheter les murs d’un cabinet médical ?',
    a: 'Oui. Une SCI peut acquérir les locaux professionnels qui seront ensuite loués à votre structure d’exercice, sous réserve de respecter les règles juridiques et fiscales applicables.',
  },
  {
    q: 'Combien de temps faut-il pour obtenir un accord bancaire ?',
    a: 'Le délai dépend de la complexité du projet, de la réactivité des intervenants et des établissements sollicités. Un dossier complet permet généralement d’accélérer l’instruction.',
  },
  {
    q: 'Quels documents faut-il fournir pour une demande de financement ?',
    a: 'Les banques demandent généralement une pièce d’identité, les justificatifs de revenus, un prévisionnel d’activité, les éléments relatifs à la patientèle ou à la société concernée, ainsi que les devis ou compromis selon la nature du projet.',
  },
  {
    q: 'Peut-on passer d’une entreprise individuelle à une SELARL ?',
    a: 'Oui. Cette évolution est fréquente au cours de la carrière d’un médecin. Elle nécessite une réflexion juridique, fiscale et financière afin de choisir la structure la plus adaptée.',
  },
  {
    q: 'Peut-on financer l’achat d’un cabinet médical existant ?',
    a: 'Oui. Selon le projet, le financement peut intégrer le droit de présentation à patientèle, les travaux, le matériel médical, la trésorerie de démarrage et, le cas échéant, les murs professionnels.',
  },
  {
    q: 'Pourquoi faire appel à un courtier spécialisé pour les médecins ?',
    a: 'Les professions médicales présentent des spécificités juridiques, fiscales et bancaires. Un courtier spécialisé connaît les attentes des établissements prêteurs et vous accompagne dans la structuration d’un dossier cohérent.',
  },
  {
    q: 'Intervenez-vous uniquement à Lille ?',
    a: 'Non. Nous accompagnons les médecins et chirurgiens à Lille, Villeneuve-d’Ascq, Marcq-en-Barœul, La Madeleine, Roubaix, Tourcoing, Dunkerque, Bailleul, Armentières et plus largement dans l’ensemble des Hauts-de-France.',
  },
  {
    q: 'Quand faut-il commencer à préparer son financement ?',
    a: 'Le plus tôt possible. Une étude réalisée en amont permet d’anticiper les attentes des banques, de choisir la structure juridique adaptée et d’optimiser le plan de financement avant tout engagement.',
  },
  {
    q: 'Une banque finance-t-elle un médecin conventionné en secteur 1 différemment d’un médecin en secteur 2 ?',
    a: 'Pas nécessairement. Les banques analysent avant tout la stabilité des revenus, la capacité de remboursement, la spécialité exercée et la qualité du projet. Un médecin en secteur 1 présente généralement des revenus plus prévisibles, tandis qu’un médecin en secteur 2 peut bénéficier de revenus plus élevés. Dans les deux cas, un dossier solide et bien préparé reste le principal critère d’obtention du financement.',
  },
  {
    q: 'Comment financer l’entrée au capital d’une SELARL de médecins ?',
    a: 'L’entrée au capital d’une SELARL peut être financée par un prêt professionnel dédié. La banque étudiera notamment votre expérience, vos revenus prévisionnels, la valorisation de la société et votre capacité de remboursement. Un montage adapté permet souvent de financer tout ou partie des parts sociales, avec ou sans apport selon votre profil.',
  },
  {
    q: 'Peut-on financer simultanément une patientèle, les murs du cabinet et le matériel médical ?',
    a: 'Oui. Il est possible de financer simultanément la patientèle, les murs professionnels et le matériel médical. Selon votre projet, un prêt professionnel peut être complété par une solution de leasing (crédit-bail ou location financière) pour le matériel, afin d’optimiser votre financement et de préserver votre trésorerie.',
  },
]

/* ── Ressources externes ──────────────────────────────────────────────── */

export const RESSOURCES = [
  {
    href: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F17042',
    label: 'Service-Public.fr — Exercice de la médecine en France',
  },
  {
    href: 'https://www.ameli.fr/medecin/exercice-liberal/vie-cabinet/convention-secteurs-adhesion/secteurs-conventionnels',
    label: 'Ameli.fr — Les secteurs conventionnels des médecins libéraux',
  },
]

/** Lien de contact WhatsApp professionnel de Guillaume Horn. */
export const WHATSAPP_URL = 'https://wa.me/message/2TZNTRK3GPY4L1'
