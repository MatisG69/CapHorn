import type { PillarData } from '@/components/landing/SeoPillar'

const PARCOURS_STD = [
  { n: '01', name: 'Qualification', desc: 'Vous décrivez votre projet en 3 minutes via notre outil. Aucun document requis à ce stade.' },
  { n: '02', name: 'Échange personnalisé', desc: 'Guillaume vous rappelle sous 24 h pour cadrer le besoin et la stratégie de financement.' },
  { n: '03', name: 'Montage & négociation', desc: 'Nous construisons un dossier solide et négocions auprès des banques et partenaires adaptés.' },
  { n: '04', name: 'Signature & suivi', desc: 'Nous orchestrons jusqu’au déblocage des fonds et sécurisons les conditions annexes.' },
]

export const SEO_PAGES: Record<string, PillarData> = {
  // ─── Axe 1 : Page mère ────────────────────────────────────────────────
  'financement-professions-liberales': {
    slug: 'financement-professions-liberales',
    eyebrow: 'Professions libérales',
    titleTop: 'Financer votre activité',
    titleEm: 'libérale, sereinement.',
    lead:
      "Installation, rachat de patientèle ou de clientèle, achat des murs du cabinet, matériel, trésorerie ou rachat de parts : Cap Horn structure et négocie chaque financement de profession libérale auprès des banques et partenaires spécialisés.",
    intro: [
      "Les professions libérales ont des codes bancaires particuliers : revenus en BNC, parts de SCM ou de SELARL, valorisation d’une patientèle, achat de murs via une SCI… Mal présenté, un excellent dossier peut être refusé ; bien structuré, il obtient des conditions premium.",
      "Notre rôle : traduire votre projet dans le langage des banques, identifier les établissements qui financent réellement votre profession, et négocier le taux, l’assurance et les garanties à votre place.",
    ],
    projets: [
      { title: 'Installation', desc: "Premier établissement, association, transfert de cabinet : financement du droit de présentation et des frais d’installation." },
      { title: 'Rachat de patientèle / clientèle', desc: "Financement de la valeur incorporelle d’un cabinet médical, paramédical, juridique ou comptable." },
      { title: 'Achat des murs / local', desc: "Acquisition des murs professionnels, en direct ou via une SCI, avec optimisation patrimoniale." },
      { title: 'Matériel professionnel', desc: "Équipement médical, fauteuil, imagerie, informatique métier — en prêt ou crédit-bail." },
      { title: 'Trésorerie professionnelle', desc: "Financement du besoin en fonds de roulement, des charges sociales ou d’un décalage de recettes." },
      { title: 'Rachat de parts', desc: "Entrée ou montée au capital d’une SELARL, SCP ou société d’exercice : financement des parts sociales." },
    ],
    professions: [
      'Professions de santé — médecins, chirurgiens-dentistes, kinésithérapeutes, infirmiers, sages-femmes, vétérinaires, pharmaciens',
      'Professions juridiques — avocats, notaires, commissaires de justice, administrateurs',
      'Professions du chiffre — experts-comptables, commissaires aux comptes',
      'Autres libéraux — architectes, géomètres, consultants, professions du conseil',
    ],
    solutions: [
      { title: 'Prêt professionnel', desc: "Le financement classique de l’installation, de la patientèle ou du matériel, négocié au meilleur taux." },
      { title: 'Crédit-bail / location financière', desc: "Préserver votre trésorerie en finançant le matériel sans apport, avec option d’achat." },
      { title: 'SCI & achat des murs', desc: "Structurer l’acquisition des murs via une SCI pour optimiser fiscalité et patrimoine." },
      { title: 'Financement in fine & patrimonial', desc: "Pour les profils à revenus élevés, des montages qui optimisent l’effet de levier." },
    ],
    parcours: PARCOURS_STD,
    faq: [
      { q: 'Comment financer une patientèle ?', a: "Le rachat d’une patientèle (ou clientèle) se finance par un prêt professionnel sur 7 à 12 ans, parfois adossé à une garantie. La banque évalue la récurrence des honoraires, l’ancienneté du cabinet et votre capacité de reprise. Nous valorisons ces éléments pour obtenir un financement à 100 % lorsque le dossier le permet." },
      { q: 'Comment financer son installation ?', a: "L’installation regroupe le droit de présentation, le matériel et parfois la trésorerie de démarrage. Nous montons un plan de financement global combinant prêt professionnel, crédit-bail matériel et, si besoin, une ligne de trésorerie, en présentant un prévisionnel crédible aux banques." },
      { q: 'Comment financer un cabinet médical ?', a: "Le financement d’un cabinet médical combine généralement l’acquisition de la patientèle, l’équipement et, souvent, les murs via une SCI. Chaque brique a sa logique bancaire : nous les articulons pour optimiser le coût total et préserver votre capacité d’emprunt personnelle." },
      { q: 'Comment financer les murs de son cabinet ?', a: "L’achat des murs se fait le plus souvent via une SCI qui loue à votre structure d’exercice. Ce montage déduit les intérêts et constitue un patrimoine. Nous négocions le prêt immobilier de la SCI et coordonnons l’ensemble avec votre notaire et votre expert-comptable." },
      { q: 'Quel apport pour acheter son cabinet ?', a: "De nombreux dossiers libéraux se financent avec un apport limité (souvent 10 % ou moins), voire sans apport pour les profils de santé à revenus réguliers. L’essentiel est la solidité du prévisionnel et la récurrence des honoraires. Nous identifions les banques qui acceptent les apports faibles." },
      { q: 'Comment financer du matériel médical ?', a: "Le matériel (imagerie, fauteuil, laser, informatique) se finance idéalement en crédit-bail : pas d’apport, loyers déductibles et option d’achat. Selon votre fiscalité, le prêt classique peut être préférable — nous comparons les deux scénarios." },
      { q: 'Comment financer un rachat de parts ?', a: "L’entrée ou la montée au capital d’une société d’exercice (SELARL, SCP) se finance par un prêt dédié au rachat de parts, dont le remboursement est calibré sur la quote-part de bénéfices. Le montage fiscal est déterminant : nous le construisons avec votre conseil." },
    ],
    related: [
      { href: '/financement-professions-sante', label: 'Professions de santé' },
      { href: '/financement-professions-juridiques', label: 'Professions juridiques' },
      { href: '/financement-professions-chiffre', label: 'Professions du chiffre' },
      { href: '/simulateur', label: 'Simulateur assurance emprunteur' },
      { href: '/tunnel', label: 'Démarrer mon étude' },
    ],
    metaTitle: 'Financement des professions libérales — Installation, patientèle, murs · Cap Horn Conseils',
    metaDescription:
      "Courtier spécialisé dans le financement des professions libérales : installation, rachat de patientèle ou clientèle, achat des murs, matériel, trésorerie, rachat de parts. Étude gratuite.",
  },

  // ─── Sous-pages ───────────────────────────────────────────────────────
  'financement-professions-sante': {
    slug: 'financement-professions-sante',
    eyebrow: 'Professions de santé',
    titleTop: 'Financer votre projet',
    titleEm: 'de santé.',
    lead:
      "Médecins, chirurgiens-dentistes, kinésithérapeutes, infirmiers, vétérinaires, pharmaciens : un financement calibré sur la régularité de vos honoraires et les spécificités de votre exercice.",
    intro: [
      "Les professionnels de santé bénéficient d’un regard bancaire favorable — revenus réguliers, faible sinistralité — à condition que le dossier soit présenté avec les bons repères : valorisation de la patientèle, nomenclature des actes, conventionnement.",
      "Nous travaillons avec les banques et les partenaires les plus actifs sur le secteur médical pour obtenir des financements à apport réduit et des conditions parmi les meilleures du marché.",
    ],
    projets: [
      { title: 'Rachat de patientèle', desc: "Financement de la valeur d’un cabinet médical, dentaire ou paramédical." },
      { title: 'Installation & association', desc: "Premier exercice, entrée en SCM/SELARL, transfert ou création de cabinet." },
      { title: 'Équipement médical', desc: "Fauteuil dentaire, imagerie, laser, matériel de cabinet — prêt ou crédit-bail." },
      { title: 'Murs du cabinet', desc: "Acquisition des locaux professionnels, en direct ou via SCI." },
    ],
    solutions: [
      { title: 'Prêt professionnel santé', desc: "Financement de la patientèle et de l’installation, souvent à apport réduit." },
      { title: 'Crédit-bail matériel', desc: "Équiper le cabinet sans entamer la trésorerie de démarrage." },
      { title: 'SCI des murs', desc: "Détenir les murs et optimiser fiscalité et patrimoine professionnel." },
    ],
    parcours: PARCOURS_STD,
    faq: [
      { q: 'Comment financer une patientèle médicale ?', a: "Par un prêt professionnel sur 7 à 12 ans valorisant la récurrence des honoraires et l’ancienneté du cabinet. Pour de nombreux profils de santé, un financement à 100 % est accessible." },
      { q: 'Faut-il un apport pour s’installer en santé ?', a: "Souvent peu, voire pas, grâce à la régularité des revenus médicaux. La qualité du prévisionnel prime sur l’apport." },
      { q: 'Comment financer du matériel dentaire ou d’imagerie ?', a: "Le crédit-bail est généralement le plus pertinent : loyers déductibles, pas d’apport, option d’achat. Nous comparons avec le prêt classique selon votre fiscalité." },
    ],
    related: [
      { href: '/financement-professions-liberales', label: 'Toutes les professions libérales' },
      { href: '/tunnel', label: 'Démarrer mon étude' },
    ],
    metaTitle: 'Financement professions de santé — Médecins, dentistes, kinés · Cap Horn Conseils',
    metaDescription:
      "Financement des professionnels de santé : patientèle, installation, matériel médical, murs du cabinet. Apport réduit, conditions négociées. Courtier spécialisé.",
  },

  'financement-professions-juridiques': {
    slug: 'financement-professions-juridiques',
    eyebrow: 'Professions juridiques',
    titleTop: 'Financer votre cabinet',
    titleEm: 'juridique.',
    lead:
      "Avocats, notaires, commissaires de justice : financement de l’installation, du rachat de clientèle ou d’office, des parts sociales et des locaux professionnels.",
    intro: [
      "Les professions juridiques cumulent des enjeux de valorisation (clientèle, office, parts) et de structuration (SCP, SEL, SCI). La présentation du dossier et le montage fiscal font toute la différence sur le coût final.",
      "Nous identifions les banques qui financent réellement ces opérations et négocions un montage cohérent avec votre stratégie patrimoniale.",
    ],
    projets: [
      { title: 'Rachat de clientèle / office', desc: "Financement de la valeur incorporelle d’un cabinet d’avocats ou d’un office." },
      { title: 'Rachat de parts', desc: "Entrée ou montée au capital d’une SCP / SEL : financement des parts sociales." },
      { title: 'Installation', desc: "Création de cabinet, association, frais d’installation et trésorerie de démarrage." },
      { title: 'Murs professionnels', desc: "Acquisition des locaux, en direct ou via une SCI dédiée." },
    ],
    solutions: [
      { title: 'Prêt rachat de clientèle / parts', desc: "Remboursement calibré sur la quote-part de bénéfices attendue." },
      { title: 'Financement immobilier des murs', desc: "Prêt SCI négocié pour détenir vos locaux professionnels." },
      { title: 'Ligne de trésorerie', desc: "Lisser les décalages d’encaissement propres à l’activité juridique." },
    ],
    parcours: PARCOURS_STD,
    faq: [
      { q: 'Comment financer un rachat de parts de SCP ou SEL ?', a: "Par un prêt dédié dont l’échéancier est calibré sur la quote-part de bénéfices. Le montage fiscal (holding, intégration) est déterminant et se construit avec votre conseil." },
      { q: 'Comment financer un office ou une clientèle ?', a: "La valeur incorporelle se finance par un prêt professionnel sur la base des produits récurrents et de l’ancienneté. Nous valorisons ces éléments auprès des banques spécialisées." },
    ],
    related: [
      { href: '/financement-professions-liberales', label: 'Toutes les professions libérales' },
      { href: '/tunnel', label: 'Démarrer mon étude' },
    ],
    metaTitle: 'Financement professions juridiques — Avocats, notaires · Cap Horn Conseils',
    metaDescription:
      "Financement des professions juridiques : rachat de clientèle ou d’office, parts sociales (SCP, SEL), installation, murs. Montage et négociation par un courtier spécialisé.",
  },

  'financement-professions-chiffre': {
    slug: 'financement-professions-chiffre',
    eyebrow: 'Professions du chiffre',
    titleTop: 'Financer votre cabinet',
    titleEm: "d'expertise comptable.",
    lead:
      "Experts-comptables et commissaires aux comptes : financement du rachat de cabinet, de la clientèle, des parts et de la croissance externe.",
    intro: [
      "Les cabinets d’expertise comptable se valorisent sur la récurrence des missions et le portefeuille clients. C’est un actif très finançable, à condition de présenter un dossier qui rassure sur la rétention de la clientèle après reprise.",
      "Nous structurons l’opération — souvent via une holding de reprise — et négocions le financement le plus efficient avec les banques actives sur le secteur.",
    ],
    projets: [
      { title: 'Rachat de cabinet', desc: "Acquisition d’un portefeuille clients d’expertise comptable, en direct ou par holding." },
      { title: 'Croissance externe', desc: "Rachat d’un confrère ou d’un portefeuille pour accélérer le développement." },
      { title: 'Rachat de parts', desc: "Entrée ou montée au capital de la structure d’exercice." },
      { title: 'Murs & équipement', desc: "Acquisition des locaux et financement des outils métier." },
    ],
    solutions: [
      { title: 'Holding de reprise', desc: "Montage avec effet de levier et remboursement sur les dividendes du cabinet repris." },
      { title: 'Prêt d’acquisition', desc: "Financement du portefeuille clients sur 7 à 10 ans." },
      { title: 'Financement des murs', desc: "Détenir les locaux via une SCI et optimiser le patrimoine." },
    ],
    parcours: PARCOURS_STD,
    faq: [
      { q: 'Comment financer le rachat d’un cabinet comptable ?', a: "Le plus souvent via une holding de reprise qui contracte la dette, remboursée par les dividendes du cabinet acquis. La rétention du portefeuille post-reprise est le point clé pour les banques." },
      { q: 'Quel apport pour racheter un portefeuille clients ?', a: "Généralement 10 à 20 %, modulable selon la qualité du portefeuille et la structuration. Un montage en holding peut réduire l’apport personnel nécessaire." },
    ],
    related: [
      { href: '/financement-professions-liberales', label: 'Toutes les professions libérales' },
      { href: '/reprise-transmission', label: 'Reprise & transmission' },
      { href: '/tunnel', label: 'Démarrer mon étude' },
    ],
    metaTitle: 'Financement experts-comptables — Rachat de cabinet & portefeuille · Cap Horn Conseils',
    metaDescription:
      "Financement des professions du chiffre : rachat de cabinet d’expertise comptable, portefeuille clients, parts, croissance externe. Montage en holding et négociation.",
  },

  // ─── Axe 3 : Franchise ────────────────────────────────────────────────
  'financement-franchise': {
    slug: 'financement-franchise',
    eyebrow: 'Franchise',
    titleTop: 'Financer votre projet',
    titleEm: 'de franchise.',
    lead:
      "Vous ouvrez un point de vente en franchise ? Cap Horn monte votre dossier bancaire, optimise l’apport et négocie le financement du droit d’entrée, de l’aménagement et du besoin en fonds de roulement.",
    intro: [
      "Un projet de franchise rassure les banques — concept éprouvé, accompagnement du franchiseur, prévisionnel cadré — mais le dossier doit être impeccable : business plan, apport, garanties et adéquation homme/projet.",
      "Nous présentons votre projet sous le bon angle aux banques partenaires des réseaux de franchise et négocions un plan de financement qui préserve votre trésorerie de démarrage.",
    ],
    projets: [
      { title: 'Droit d’entrée & redevances', desc: "Financement du droit d’entrée dans le réseau et des frais initiaux." },
      { title: 'Agencement & travaux', desc: "Aménagement du point de vente aux normes du concept." },
      { title: 'Stock & fonds de roulement', desc: "Constitution du stock initial et financement des premiers mois d’exploitation." },
      { title: 'Matériel & équipement', desc: "Équipement du local — en prêt ou en crédit-bail." },
    ],
    solutions: [
      { title: 'Prêt création / franchise', desc: "Financement global du projet, souvent adossé à une garantie (Bpifrance, caution)." },
      { title: 'Crédit-bail matériel', desc: "Équiper sans apport pour préserver la trésorerie de lancement." },
      { title: 'Optimisation de l’apport', desc: "Mobiliser prêt d’honneur, aides et garanties pour réduire l’apport personnel." },
    ],
    parcours: PARCOURS_STD,
    faq: [
      { q: 'Comment financer une franchise ?', a: "Par un prêt de création couvrant droit d’entrée, agencement, matériel et fonds de roulement, généralement adossé à une garantie (Bpifrance ou caution) pour limiter votre engagement personnel. Le business plan du franchiseur facilite l’instruction." },
      { q: 'Quel apport pour ouvrir une franchise ?', a: "Comptez en moyenne 20 à 30 % du besoin total, parfois moins avec un prêt d’honneur ou des aides. L’apport peut être renforcé par des financements complémentaires que nous mobilisons." },
      { q: 'Quels financements bancaires sont possibles ?', a: "Prêt bancaire classique, crédit-bail pour le matériel, prêt d’honneur à taux zéro, garanties Bpifrance, et parfois affacturage pour le BFR. Nous combinons ces leviers pour optimiser le plan." },
      { q: 'Comment présenter son dossier bancaire ?', a: "Un dossier convaincant articule prévisionnel réaliste, présentation du concept et du réseau, apport et garanties, et adéquation entre votre profil et le projet. Nous le construisons et le défendons pour vous." },
    ],
    related: [
      { href: '/expertises', label: 'Toutes nos expertises' },
      { href: '/tunnel', label: 'Démarrer mon étude' },
    ],
    metaTitle: 'Financement de franchise — Droit d’entrée, apport, prêt bancaire · Cap Horn Conseils',
    metaDescription:
      "Financer l’ouverture d’une franchise : droit d’entrée, agencement, stock, fonds de roulement. Optimisation de l’apport et négociation du prêt bancaire. Étude gratuite.",
  },

  // ─── Axe 4 : Reprise & transmission ──────────────────────────────────
  'reprise-transmission': {
    slug: 'reprise-transmission',
    eyebrow: 'Reprise & transmission',
    titleTop: 'Vendre ou reprendre',
    titleEm: 'une entreprise.',
    lead:
      "Que vous cédiez votre société ou que vous repreniez une entreprise, Cap Horn intervient sur la valorisation, le montage du financement et la mise en relation entre vendeurs et repreneurs.",
    intro: [
      "Côté cédant : préparer la vente, valoriser correctement la société et sécuriser la transmission. Côté repreneur : analyser la cible, structurer l’acquisition et financer le rachat avec le bon effet de levier.",
      "Notre double positionnement nous permet de rapprocher vendeurs et acquéreurs tout en pilotant le financement de l’opération du début à la fin.",
    ],
    projets: [
      { title: 'Vendre son entreprise', desc: "Préparation de la cession, estimation de valeur et recherche de repreneur." },
      { title: 'Reprendre une entreprise', desc: "Recherche de cible, analyse du projet et financement de l’acquisition." },
      { title: 'Rachat de parts / LBO', desc: "Montage en holding avec effet de levier pour la reprise majoritaire." },
      { title: 'Croissance externe', desc: "Acquisition d’un concurrent ou d’un fournisseur pour accélérer." },
    ],
    solutions: [
      { title: 'Valorisation & préparation', desc: "Estimation de la société et mise en ordre du dossier avant cession." },
      { title: 'Montage bancaire de reprise', desc: "Structuration de la dette d’acquisition et de l’apport du repreneur." },
      { title: 'Effet de levier (holding)', desc: "Optimiser le rendement des fonds propres via un montage holding." },
      { title: 'Mise en relation', desc: "Rapprochement entre cédants et repreneurs qualifiés de notre réseau." },
    ],
    parcours: PARCOURS_STD,
    faq: [
      { q: 'Comment préparer la vente de son entreprise ?', a: "En amont : fiabiliser les comptes, sécuriser les contrats clés, documenter la récurrence du chiffre d’affaires et estimer une fourchette de valeur réaliste. Une société « prête à vendre » se cède mieux et plus vite." },
      { q: 'Comment valoriser sa société ?', a: "Plusieurs méthodes coexistent (multiple d’EBE, rentabilité, actif net). Nous croisons les approches pour une fourchette crédible, base de discussion avec les repreneurs et les banques." },
      { q: 'Comment financer l’acquisition d’une entreprise ?', a: "Généralement via une holding de reprise qui contracte la dette d’acquisition, remboursée par les dividendes de la cible. L’apport, les garanties et la qualité du prévisionnel déterminent le levier accessible." },
      { q: 'Comment trouver un repreneur ?', a: "Au-delà des plateformes, la mise en relation directe avec des repreneurs qualifiés accélère la transmission. Nous activons notre réseau et accompagnons le financement côté acquéreur." },
    ],
    related: [
      { href: '/financement-professions-chiffre', label: 'Rachat de cabinet comptable' },
      { href: '/expertises', label: 'Toutes nos expertises' },
      { href: '/tunnel', label: 'Démarrer mon étude' },
    ],
    metaTitle: 'Reprise & transmission d’entreprise — Vendre ou racheter · Cap Horn Conseils',
    metaDescription:
      "Vendre son entreprise ou reprendre une société : valorisation, montage bancaire de reprise, effet de levier (holding), mise en relation cédants/repreneurs. Cap Horn Conseils.",
  },
}
