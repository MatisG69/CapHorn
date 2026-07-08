import type { StepConfig } from '../types'

// ─── Entry ────────────────────────────────────────────────────────────────────

const STEP_ENTRY: StepConfig = {
  id: 'entry',
  type: 'choice',
  title: 'Vous êtes…',
  subtitle: 'Sélectionnez votre profil pour accéder aux solutions adaptées.',
  progressValue: 5,
  options: [
    { value: 'pro', label: "Chef d'entreprise / Professionnel", description: 'TPE, PME, artisan, commerçant, profession libérale' },
    { value: 'particulier', label: 'Particulier', description: 'Immobilier, patrimoine, assurance emprunteur' },
    { value: 'reseau', label: "Apporteur d'affaires / Partenaire", description: 'Recommandation, courtier, prescripteur' },
  ],
  getNext: () => 'contact',
}

// ─── Coordonnées (placées tôt : chaque dossier commencé est contactable) ─────

const STEP_CONTACT: StepConfig = {
  id: 'contact',
  type: 'contact',
  title: 'À qui adressons-nous votre étude ?',
  subtitle:
    'Vos coordonnées nous permettent de préparer votre analyse et de vous recontacter. Aucun engagement.',
  progressValue: 12,
  getNext: (answers) => {
    const v = answers['entry']
    if (v === 'pro') return 'pro_need'
    if (v === 'particulier') return 'particulier_need'
    if (v === 'reseau') return 'reseau_type'
    return null
  },
}

// ─── Pro need selection ───────────────────────────────────────────────────────

const STEP_PRO_NEED: StepConfig = {
  id: 'pro_need',
  type: 'choice',
  title: 'Quel est votre besoin ?',
  subtitle: 'Nous vous orientons vers la solution la plus adaptée à votre situation.',
  progressValue: 15,
  options: [
    { value: 'tresorerie', label: 'Trésorerie', description: 'Financement de cycle, découvert, affacturage' },
    { value: 'materiel', label: 'Matériel & équipements', description: 'Crédit-bail, location financière' },
    { value: 'vehicule', label: 'Véhicule professionnel', description: 'Flotte, utilitaire, véhicule de fonction' },
    { value: 'reprise', label: "Reprise d'entreprise", description: 'Acquisition de fonds de commerce ou société' },
    { value: 'lancement', label: "Lancement d'activité", description: 'Création, financement de démarrage' },
    { value: 'developpement', label: 'Développement', description: 'Croissance, ouverture, recrutement' },
    { value: 'levee_fonds', label: 'Levée de fonds', description: 'Tour de table, dette venture, equity' },
  ],
  getNext: (answers) => {
    const v = answers['pro_need']
    if (!v) return null
    return `${v}_step1`
  },
}

// ─── Trésorerie ───────────────────────────────────────────────────────────────

const STEP_TRESORERIE_1: StepConfig = {
  id: 'tresorerie_step1',
  type: 'choice',
  title: 'Pourquoi avez-vous besoin de trésorerie ?',
  progressValue: 28,
  options: [
    { value: 'growth', label: 'Financer ma croissance', description: 'Commandes, recrutement, stock' },
    { value: 'seasonal', label: 'Gérer la saisonnalité', description: 'Décalage encaissements / paiements' },
    { value: 'cash_gap', label: 'Combler un manque ponctuel', description: 'Retards clients, imprévu' },
    { value: 'recovery', label: 'Redresser la situation', description: 'Difficultés passagères' },
  ],
  getNext: () => 'tresorerie_amount',
}

const STEP_TRESORERIE_AMOUNT: StepConfig = {
  id: 'tresorerie_amount',
  type: 'input',
  title: 'Quel montant souhaitez-vous financer ?',
  subtitle: 'Donnez une estimation, même approximative.',
  inputType: 'number',
  inputLabel: 'Montant',
  inputPlaceholder: '50 000',
  inputSuffix: '€',
  progressValue: 45,
  getNext: () => 'common_revenue',
}

// ─── Matériel ─────────────────────────────────────────────────────────────────

const STEP_MATERIEL_1: StepConfig = {
  id: 'materiel_step1',
  type: 'choice',
  title: 'Quel type de matériel souhaitez-vous financer ?',
  progressValue: 28,
  options: [
    { value: 'machinery', label: 'Machine industrielle / outil de production' },
    { value: 'it', label: 'Informatique / bureautique' },
    { value: 'medical', label: 'Équipement médical / paramédical' },
    { value: 'restaurant', label: 'Matériel de restauration / cuisine' },
    { value: 'other', label: 'Autre équipement' },
  ],
  getNext: () => 'materiel_goal',
}

const STEP_MATERIEL_GOAL: StepConfig = {
  id: 'materiel_goal',
  type: 'choice',
  title: 'Quel est votre objectif ?',
  progressValue: 36,
  options: [
    { value: 'buy', label: 'Acheter (crédit-bail)', description: 'Je souhaite être propriétaire à terme' },
    { value: 'rent', label: 'Louer (location financière)', description: 'Je privilégie la flexibilité' },
    { value: 'unsure', label: 'Pas encore décidé' },
  ],
  getNext: () => 'materiel_quote',
}

const STEP_MATERIEL_QUOTE: StepConfig = {
  id: 'materiel_quote',
  type: 'choice',
  title: 'Avez-vous déjà un devis fournisseur ?',
  progressValue: 43,
  options: [
    { value: 'yes', label: 'Oui, je dispose d\'un devis' },
    { value: 'no', label: 'Non, pas encore' },
  ],
  getNext: () => 'materiel_amount',
}

const STEP_MATERIEL_AMOUNT: StepConfig = {
  id: 'materiel_amount',
  type: 'input',
  title: "Quel est le montant total de l'acquisition ?",
  inputType: 'number',
  inputLabel: 'Montant',
  inputPlaceholder: '120 000',
  inputSuffix: '€',
  progressValue: 50,
  getNext: () => 'common_revenue',
}

// ─── Véhicule ─────────────────────────────────────────────────────────────────

const STEP_VEHICULE_1: StepConfig = {
  id: 'vehicule_step1',
  type: 'choice',
  title: 'Quel type de véhicule souhaitez-vous financer ?',
  progressValue: 28,
  options: [
    { value: 'utility', label: 'Utilitaire / véhicule de livraison' },
    { value: 'company_car', label: 'Voiture de société / direction' },
    { value: 'fleet', label: 'Flotte de véhicules (3 ou plus)' },
    { value: 'heavy', label: 'Poids lourd / engin' },
  ],
  getNext: () => 'vehicule_chosen',
}

const STEP_VEHICULE_CHOSEN: StepConfig = {
  id: 'vehicule_chosen',
  type: 'choice',
  title: 'Avez-vous déjà choisi un véhicule ?',
  progressValue: 37,
  options: [
    { value: 'yes', label: 'Oui, j\'ai déjà un modèle / devis' },
    { value: 'no', label: 'Non, je suis en phase de recherche' },
  ],
  getNext: () => 'vehicule_usage',
}

const STEP_VEHICULE_USAGE: StepConfig = {
  id: 'vehicule_usage',
  type: 'choice',
  title: 'Pour quel usage principalement ?',
  progressValue: 45,
  options: [
    { value: 'professional_only', label: 'Exclusivement professionnel' },
    { value: 'mixed', label: 'Usage mixte (pro + personnel)' },
  ],
  getNext: () => 'vehicule_amount',
}

const STEP_VEHICULE_AMOUNT: StepConfig = {
  id: 'vehicule_amount',
  type: 'input',
  title: 'Quel budget prévoyez-vous ?',
  inputType: 'number',
  inputLabel: 'Montant total',
  inputPlaceholder: '35 000',
  inputSuffix: '€',
  progressValue: 52,
  getNext: () => 'common_revenue',
}

// ─── Reprise ──────────────────────────────────────────────────────────────────

const STEP_REPRISE_1: StepConfig = {
  id: 'reprise_step1',
  type: 'choice',
  title: 'Où en êtes-vous dans votre projet de reprise ?',
  progressValue: 25,
  options: [
    { value: 'searching', label: 'Je recherche encore', description: "Pas encore identifié de cible" },
    { value: 'found', label: "J'ai identifié une cible", description: 'Négociations en cours' },
    { value: 'letter', label: "Lettre d'intention signée" },
    { value: 'signed', label: "Protocole d'accord signé" },
  ],
  getNext: () => 'reprise_price',
}

const STEP_REPRISE_PRICE: StepConfig = {
  id: 'reprise_price',
  type: 'input',
  title: 'Quel est le prix de cession envisagé ?',
  subtitle: "Donnez une estimation si vous n'avez pas encore de chiffre précis.",
  inputType: 'number',
  inputLabel: 'Prix de cession',
  inputPlaceholder: '500 000',
  inputSuffix: '€',
  progressValue: 35,
  getNext: () => 'reprise_apport',
}

const STEP_REPRISE_APPORT: StepConfig = {
  id: 'reprise_apport',
  type: 'input',
  title: 'Quel est votre apport personnel ?',
  inputType: 'number',
  inputLabel: 'Apport',
  inputPlaceholder: '100 000',
  inputSuffix: '€',
  progressValue: 44,
  getNext: () => 'reprise_experience',
}

const STEP_REPRISE_EXPERIENCE: StepConfig = {
  id: 'reprise_experience',
  type: 'choice',
  title: 'Avez-vous de l\'expérience dans ce secteur ?',
  progressValue: 52,
  options: [
    { value: 'yes', label: "Oui, j'ai une expérience significative" },
    { value: 'partial', label: 'Partielle, je me forme' },
    { value: 'no', label: "Non, c'est une reconversion" },
  ],
  getNext: () => 'reprise_profitability',
}

const STEP_REPRISE_PROFITABILITY: StepConfig = {
  id: 'reprise_profitability',
  type: 'choice',
  title: "L'entreprise cible est-elle rentable ?",
  progressValue: 60,
  options: [
    { value: 'profitable', label: 'Oui, elle est bénéficiaire' },
    { value: 'breakeven', label: "Elle est à l'équilibre" },
    { value: 'loss', label: 'Elle est en perte' },
    { value: 'unknown', label: 'Je ne sais pas encore' },
  ],
  getNext: () => 'common_revenue',
}

// ─── Lancement ────────────────────────────────────────────────────────────────

const STEP_LANCEMENT_1: StepConfig = {
  id: 'lancement_step1',
  type: 'choice',
  title: 'Où en êtes-vous dans votre projet ?',
  progressValue: 25,
  options: [
    { value: 'idea', label: 'Projet en cours de définition', description: 'Idée structurée, pas encore formalisée' },
    { value: 'bp', label: 'Business plan rédigé' },
    { value: 'registered', label: 'Entreprise créée / immatriculée' },
    { value: 'launched', label: 'Déjà en activité (< 2 ans)' },
  ],
  getNext: () => 'lancement_need',
}

const STEP_LANCEMENT_NEED: StepConfig = {
  id: 'lancement_need',
  type: 'choice',
  title: 'Quel est votre principal besoin de financement ?',
  progressValue: 35,
  options: [
    { value: 'equipment', label: 'Matériel & équipements de démarrage' },
    { value: 'stock', label: 'Stock initial' },
    { value: 'working_capital', label: 'Fonds de roulement' },
    { value: 'premises', label: 'Local commercial' },
    { value: 'mixed', label: 'Plusieurs besoins combinés' },
  ],
  getNext: () => 'lancement_amount',
}

const STEP_LANCEMENT_AMOUNT: StepConfig = {
  id: 'lancement_amount',
  type: 'input',
  title: 'Quel montant total recherchez-vous ?',
  inputType: 'number',
  inputLabel: 'Montant',
  inputPlaceholder: '80 000',
  inputSuffix: '€',
  progressValue: 45,
  getNext: () => 'lancement_apport',
}

const STEP_LANCEMENT_APPORT: StepConfig = {
  id: 'lancement_apport',
  type: 'input',
  title: 'Quel est votre apport personnel ?',
  inputType: 'number',
  inputLabel: 'Apport',
  inputPlaceholder: '20 000',
  inputSuffix: '€',
  progressValue: 53,
  getNext: () => 'lancement_bp',
}

const STEP_LANCEMENT_BP: StepConfig = {
  id: 'lancement_bp',
  type: 'choice',
  title: 'Avez-vous un business plan ?',
  progressValue: 61,
  options: [
    { value: 'yes', label: 'Oui, complet et chiffré' },
    { value: 'partial', label: 'En cours de rédaction' },
    { value: 'no', label: 'Pas encore' },
  ],
  getNext: () => 'lancement_clients',
}

const STEP_LANCEMENT_CLIENTS: StepConfig = {
  id: 'lancement_clients',
  type: 'choice',
  title: 'Avez-vous déjà des clients ou commandes ?',
  progressValue: 68,
  options: [
    { value: 'yes', label: "Oui, j'ai déjà du chiffre / des commandes" },
    { value: 'prospects', label: 'Des prospects avancés' },
    { value: 'no', label: 'Pas encore' },
  ],
  getNext: () => 'capture',
}

// ─── Développement ────────────────────────────────────────────────────────────

const STEP_DEVELOPPEMENT_1: StepConfig = {
  id: 'developpement_step1',
  type: 'choice',
  title: 'Quel est votre projet de développement ?',
  progressValue: 28,
  options: [
    { value: 'opening', label: "Ouverture d'un nouveau site / local" },
    { value: 'hiring', label: 'Recrutement & masse salariale' },
    { value: 'digital', label: 'Digitalisation / informatique' },
    { value: 'acquisition', label: 'Acquisition client / marketing' },
    { value: 'export', label: 'Développement export / international' },
    { value: 'other', label: 'Autre projet de croissance' },
  ],
  getNext: () => 'developpement_engaged',
}

const STEP_DEVELOPPEMENT_ENGAGED: StepConfig = {
  id: 'developpement_engaged',
  type: 'choice',
  title: 'Avez-vous déjà engagé des dépenses ?',
  progressValue: 38,
  options: [
    { value: 'yes', label: 'Oui, des dépenses sont déjà engagées' },
    { value: 'soon', label: 'Non, le projet démarre bientôt' },
    { value: 'study', label: "En phase d'étude" },
  ],
  getNext: () => 'developpement_amount',
}

const STEP_DEVELOPPEMENT_AMOUNT: StepConfig = {
  id: 'developpement_amount',
  type: 'input',
  title: 'Quel montant souhaitez-vous financer ?',
  inputType: 'number',
  inputLabel: 'Montant',
  inputPlaceholder: '200 000',
  inputSuffix: '€',
  progressValue: 50,
  getNext: () => 'common_revenue',
}

// ─── Levée de fonds ───────────────────────────────────────────────────────────

const STEP_LEVEE_1: StepConfig = {
  id: 'levee_fonds_step1',
  type: 'choice',
  title: 'Où en êtes-vous dans votre levée ?',
  progressValue: 25,
  options: [
    { value: 'preparing', label: 'En préparation', description: 'Pitch deck en cours, pas encore en process' },
    { value: 'conversations', label: 'En conversation avec des investisseurs' },
    { value: 'term_sheet', label: 'Term sheet reçue' },
    { value: 'closing', label: 'En phase de closing' },
  ],
  getNext: () => 'levee_ca',
}

const STEP_LEVEE_CA: StepConfig = {
  id: 'levee_ca',
  type: 'input',
  title: "Quel est votre chiffre d'affaires annuel actuel ?",
  subtitle: 'Indiquez 0 si vous êtes en phase pré-revenue.',
  inputType: 'number',
  inputLabel: 'CA annuel',
  inputPlaceholder: '500 000',
  inputSuffix: '€',
  progressValue: 35,
  getNext: () => 'levee_why',
}

const STEP_LEVEE_WHY: StepConfig = {
  id: 'levee_why',
  type: 'choice',
  title: 'Quel type de financement recherchez-vous ?',
  progressValue: 44,
  options: [
    { value: 'equity', label: 'Capital (equity)', description: "Cession de parts en échange d'un investissement" },
    { value: 'debt', label: 'Dette venture', description: 'Financement non-dilutif' },
    { value: 'both', label: 'Les deux, je compare' },
  ],
  getNext: () => 'levee_amount',
}

const STEP_LEVEE_AMOUNT: StepConfig = {
  id: 'levee_amount',
  type: 'input',
  title: 'Quel montant souhaitez-vous lever ?',
  inputType: 'number',
  inputLabel: 'Montant',
  inputPlaceholder: '2 000 000',
  inputSuffix: '€',
  progressValue: 53,
  getNext: () => 'levee_traction',
}

const STEP_LEVEE_TRACTION: StepConfig = {
  id: 'levee_traction',
  type: 'choice',
  title: 'Quelle est votre principale traction ?',
  progressValue: 62,
  options: [
    { value: 'revenue', label: "Chiffre d'affaires récurrent (ARR)" },
    { value: 'users', label: 'Base utilisateurs / clients actifs' },
    { value: 'pipeline', label: 'Pipeline commercial qualifié' },
    { value: 'tech', label: 'Technologie / IP propriétaire' },
    { value: 'team', label: 'Équipe & vision' },
  ],
  getNext: () => 'levee_deck',
}

const STEP_LEVEE_DECK: StepConfig = {
  id: 'levee_deck',
  type: 'choice',
  title: 'Avez-vous un pitch deck à jour ?',
  progressValue: 70,
  options: [
    { value: 'yes', label: 'Oui, prêt à partager' },
    { value: 'draft', label: 'En cours de finalisation' },
    { value: 'no', label: 'Non' },
  ],
  getNext: () => 'capture',
}

// ─── Common Pro Steps ─────────────────────────────────────────────────────────

const STEP_COMMON_REVENUE: StepConfig = {
  id: 'common_revenue',
  type: 'input',
  title: "Quel est votre chiffre d'affaires annuel ?",
  subtitle: 'Cette information nous aide à identifier les solutions disponibles.',
  inputType: 'number',
  inputLabel: 'CA annuel',
  inputPlaceholder: '800 000',
  inputSuffix: '€',
  progressValue: 65,
  getNext: () => 'common_bank_refusal',
}

const STEP_COMMON_BANK_REFUSAL: StepConfig = {
  id: 'common_bank_refusal',
  type: 'choice',
  title: 'Avez-vous eu une demande de financement refusée au cours des 6 derniers mois ?',
  subtitle: 'Cette information nous aide à mieux qualifier et orienter votre dossier dès le départ.',
  progressValue: 74,
  options: [
    { value: 'no', label: 'Non', description: "Aucun refus récent, ou je n'ai pas encore sollicité de banque" },
    { value: 'yes', label: 'Oui', description: "J'ai eu un refus au cours des 6 derniers mois" },
  ],
  getNext: (answers) => (answers['common_bank_refusal'] === 'yes' ? 'bank_refusal_org' : 'capture'),
}

const STEP_BANK_REFUSAL_ORG: StepConfig = {
  id: 'bank_refusal_org',
  type: 'input',
  title: 'Quelle banque ou quel organisme a refusé ?',
  subtitle: 'Indiquez le nom de l’établissement concerné.',
  inputType: 'text',
  inputLabel: 'Banque / organisme',
  inputPlaceholder: 'Ex. Crédit Agricole, BNP, BPI…',
  progressValue: 80,
  getNext: () => 'bank_refusal_reason',
}

const STEP_BANK_REFUSAL_REASON: StepConfig = {
  id: 'bank_refusal_reason',
  type: 'choice',
  title: 'Quel motif vous a été indiqué ?',
  subtitle: 'Même approximatif, cela nous aide à reconstruire votre dossier sous le bon angle.',
  progressValue: 86,
  options: [
    { value: 'apport_insuffisant', label: 'Apport jugé insuffisant' },
    { value: 'endettement', label: "Taux d'endettement / capacité" },
    { value: 'activite_recente', label: 'Activité trop récente / historique court' },
    { value: 'garanties', label: 'Garanties insuffisantes' },
    { value: 'rentabilite', label: 'Rentabilité / prévisionnel jugé fragile' },
    { value: 'scoring', label: 'Scoring interne / politique de la banque' },
    { value: 'sans_motif', label: 'Aucun motif clair communiqué' },
    { value: 'autre', label: 'Autre motif' },
  ],
  getNext: () => 'capture',
}

// ─── Particulier ──────────────────────────────────────────────────────────────

const STEP_PARTICULIER_NEED: StepConfig = {
  id: 'particulier_need',
  type: 'choice',
  title: 'Quel est votre projet ?',
  progressValue: 15,
  options: [
    { value: 'residence_principale', label: 'Résidence principale', description: 'Achat, renégociation, PTZ' },
    { value: 'investissement_locatif', label: 'Investissement locatif', description: 'LMNP, SCI, défiscalisation' },
    { value: 'patrimoine', label: 'Financement patrimonial', description: 'SCI, démembrement, assurance vie' },
    { value: 'assurance_emprunteur', label: 'Assurance emprunteur', description: 'Délégation, renégociation de contrat' },
  ],
  getNext: (answers) => {
    const v = answers['particulier_need']
    if (v === 'assurance_emprunteur') return 'assurance_step1'
    if (v === 'residence_principale') return 'immo_situation'
    if (v === 'investissement_locatif') return 'locatif_step1'
    return 'capture'
  },
}

const STEP_IMMO_SITUATION: StepConfig = {
  id: 'immo_situation',
  type: 'choice',
  title: 'Quelle est votre situation actuelle ?',
  progressValue: 30,
  options: [
    { value: 'first_buyer', label: 'Premier achat', description: 'Je suis locataire actuellement' },
    { value: 'owner', label: 'Déjà propriétaire', description: 'Je revends pour racheter' },
    { value: 'renegotiation', label: 'Renégociation de prêt existant' },
  ],
  getNext: () => 'immo_amount',
}

const STEP_IMMO_AMOUNT: StepConfig = {
  id: 'immo_amount',
  type: 'input',
  title: 'Quel est le montant du bien ?',
  inputType: 'number',
  inputLabel: 'Prix du bien',
  inputPlaceholder: '350 000',
  inputSuffix: '€',
  progressValue: 45,
  getNext: () => 'immo_apport',
}

const STEP_IMMO_APPORT: StepConfig = {
  id: 'immo_apport',
  type: 'input',
  title: 'Quel est votre apport personnel ?',
  inputType: 'number',
  inputLabel: 'Apport',
  inputPlaceholder: '50 000',
  inputSuffix: '€',
  progressValue: 58,
  getNext: () => 'capture',
}

const STEP_LOCATIF_1: StepConfig = {
  id: 'locatif_step1',
  type: 'choice',
  title: "Quel type d'investissement envisagez-vous ?",
  progressValue: 30,
  options: [
    { value: 'lmnp', label: 'LMNP / meublé', description: 'Location meublée non professionnelle' },
    { value: 'sci', label: 'SCI familiale', description: 'Détention via société' },
    { value: 'classic', label: 'Location nue classique' },
    { value: 'commercial', label: 'Local commercial / murs' },
  ],
  getNext: () => 'immo_amount',
}

const STEP_ASSURANCE_1: StepConfig = {
  id: 'assurance_step1',
  type: 'choice',
  title: 'Votre demande concerne…',
  progressValue: 30,
  options: [
    { value: 'new', label: 'Un nouveau prêt', description: 'Assurance pour un crédit en cours de montage' },
    { value: 'renegotiation', label: 'Un prêt existant', description: 'Délégation ou renégociation de contrat actuel' },
  ],
  getNext: () => 'assurance_amount',
}

const STEP_ASSURANCE_AMOUNT: StepConfig = {
  id: 'assurance_amount',
  type: 'input',
  title: 'Quel est le capital emprunté (ou à emprunter) ?',
  inputType: 'number',
  inputLabel: 'Capital',
  inputPlaceholder: '200 000',
  inputSuffix: '€',
  progressValue: 50,
  getNext: () => 'capture',
}

// ─── Réseau ───────────────────────────────────────────────────────────────────

const STEP_RESEAU_TYPE: StepConfig = {
  id: 'reseau_type',
  type: 'choice',
  title: 'Vous êtes…',
  progressValue: 20,
  options: [
    { value: 'recommandation', label: 'Je recommande un proche', description: 'Particulier ou chef d\'entreprise' },
    { value: 'apporteur', label: "Apporteur d'affaires", description: 'Je transmets des leads régulièrement' },
    { value: 'partenaire', label: 'Partenaire prescripteur', description: 'Expert-comptable, avocat, notaire, CGP' },
    { value: 'courtier', label: 'Confrère courtier', description: 'Collaboration ou co-courtage' },
  ],
  getNext: () => 'capture',
}

// ─── Capture & Result ─────────────────────────────────────────────────────────

const STEP_CAPTURE: StepConfig = {
  id: 'capture',
  type: 'finalize',
  title: 'Votre analyse personnalisée est prête',
  subtitle:
    'Vérifiez les éléments transmis puis finalisez : un expert Cap Horn étudie votre dossier et vous recontacte.',
  progressValue: 92,
  getNext: () => 'result',
}

const STEP_RESULT: StepConfig = {
  id: 'result',
  type: 'result',
  title: 'Merci',
  progressValue: 100,
  getNext: () => null,
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const TUNNEL_STEPS: Record<string, StepConfig> = {
  entry: STEP_ENTRY,
  contact: STEP_CONTACT,
  pro_need: STEP_PRO_NEED,

  tresorerie_step1: STEP_TRESORERIE_1,
  tresorerie_amount: STEP_TRESORERIE_AMOUNT,

  materiel_step1: STEP_MATERIEL_1,
  materiel_goal: STEP_MATERIEL_GOAL,
  materiel_quote: STEP_MATERIEL_QUOTE,
  materiel_amount: STEP_MATERIEL_AMOUNT,

  vehicule_step1: STEP_VEHICULE_1,
  vehicule_chosen: STEP_VEHICULE_CHOSEN,
  vehicule_usage: STEP_VEHICULE_USAGE,
  vehicule_amount: STEP_VEHICULE_AMOUNT,

  reprise_step1: STEP_REPRISE_1,
  reprise_price: STEP_REPRISE_PRICE,
  reprise_apport: STEP_REPRISE_APPORT,
  reprise_experience: STEP_REPRISE_EXPERIENCE,
  reprise_profitability: STEP_REPRISE_PROFITABILITY,

  lancement_step1: STEP_LANCEMENT_1,
  lancement_need: STEP_LANCEMENT_NEED,
  lancement_amount: STEP_LANCEMENT_AMOUNT,
  lancement_apport: STEP_LANCEMENT_APPORT,
  lancement_bp: STEP_LANCEMENT_BP,
  lancement_clients: STEP_LANCEMENT_CLIENTS,

  developpement_step1: STEP_DEVELOPPEMENT_1,
  developpement_engaged: STEP_DEVELOPPEMENT_ENGAGED,
  developpement_amount: STEP_DEVELOPPEMENT_AMOUNT,

  levee_fonds_step1: STEP_LEVEE_1,
  levee_ca: STEP_LEVEE_CA,
  levee_why: STEP_LEVEE_WHY,
  levee_amount: STEP_LEVEE_AMOUNT,
  levee_traction: STEP_LEVEE_TRACTION,
  levee_deck: STEP_LEVEE_DECK,

  common_revenue: STEP_COMMON_REVENUE,
  common_bank_refusal: STEP_COMMON_BANK_REFUSAL,
  bank_refusal_org: STEP_BANK_REFUSAL_ORG,
  bank_refusal_reason: STEP_BANK_REFUSAL_REASON,

  particulier_need: STEP_PARTICULIER_NEED,
  immo_situation: STEP_IMMO_SITUATION,
  immo_amount: STEP_IMMO_AMOUNT,
  immo_apport: STEP_IMMO_APPORT,
  locatif_step1: STEP_LOCATIF_1,
  assurance_step1: STEP_ASSURANCE_1,
  assurance_amount: STEP_ASSURANCE_AMOUNT,

  reseau_type: STEP_RESEAU_TYPE,

  capture: STEP_CAPTURE,
  result: STEP_RESULT,
}

export const FIRST_STEP = 'entry'
