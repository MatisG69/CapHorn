import type { PillarData } from '@/components/landing/SeoPillar'

const PARCOURS_STD = [
  { n: '01', name: 'Qualification', desc: 'Trois minutes pour décrire votre projet, aucun document à fournir. Vous repartez avec un premier avis de faisabilité.' },
  { n: '02', name: 'Échange personnalisé', desc: 'Guillaume vous rappelle sous 24 h ouvrées. On creuse votre situation réelle, et la stratégie se décide ensemble.' },
  { n: '03', name: 'Montage & négociation', desc: 'Nous montons le dossier à votre place et le défendons auprès des banques dont les critères collent à votre profil. Taux, assurance, garanties : tout se négocie.' },
  { n: '04', name: 'Signature & suivi', desc: 'Nous suivons chaque échéance jusqu’au déblocage des fonds. Nos honoraires ne sont dus qu’à ce moment-là.' },
]

export const SEO_PAGES: Record<string, PillarData> = {
  // ─── Axe 1 : Page mère ────────────────────────────────────────────────
  'financement-professions-liberales': {
    slug: 'financement-professions-liberales',
    eyebrow: 'Professions libérales',
    titleTop: 'Le financement adapté à votre',
    titleEm: 'activité libérale.',
    introTitle: 'Votre dossier ne se refuse pas, il se raconte mal.',
    professionsIntro:
      'Chaque profession libérale a ses propres codes bancaires. Nous montons votre dossier dans le langage des prêteurs, avec les indicateurs qu’ils regardent réellement, avant de le mettre en concurrence.',
    lead:
      "Médecin, chirurgien-dentiste, infirmier, kinésithérapeute, pharmacien, avocat, notaire, expert-comptable : votre BNC est solide, votre patientèle vaut cher, et pourtant les banques hésitent. CAP HORN CONSEILS monte et défend votre prêt professionnel (installation, rachat de patientèle ou de clientèle, murs du cabinet, équipements, trésorerie, rachat de parts) auprès des établissements qui financent vraiment les libéraux.",
    intro: [
      "Revenus en BNC, parts de SCM ou de SELARL, valorisation d’une patientèle, murs détenus via une SCI : un chargé d’affaires généraliste n’a ni les repères ni le temps de décoder tout cela. Résultat, un excellent dossier peut être refusé simplement parce qu’il a été mal présenté. Le même dossier, correctement structuré, obtient un accord et de meilleures conditions.",
      "Notre travail est là : traduire votre projet dans le langage des banques, écarter celles qui ne financent pas votre profession, et négocier pour vous le taux, l’assurance et les garanties. Vous ne payez qu’une fois le financement obtenu.",
    ],
    projets: [
      { title: 'Installation', desc: "Installation, reprise ou association : financement du droit de présentation, des murs professionnels et des frais d’installation." },
      { title: 'Rachat de patientèle / clientèle', desc: "Financement du rachat de patientèle ou de clientèle pour les médecins, chirurgiens-dentistes, infirmiers, kinésithérapeutes, avocats, notaires et experts-comptables." },
      { title: 'Achat des murs professionnels', desc: "Financement de l’acquisition des murs du cabinet, en direct ou via une SCI, avec une stratégie patrimoniale et bancaire adaptée." },
      { title: 'Matériel professionnel', desc: "Financement de vos équipements professionnels : matériel médical, informatique métier, fauteuil dentaire ou équipements spécialisés, en prêt ou crédit-bail." },
      { title: 'Trésorerie professionnelle', desc: "Financement des besoins de trésorerie, des charges d’exploitation et des décalages de recettes afin de préserver la continuité et le développement de votre activité." },
      { title: 'Rachat de parts', desc: "Financement du rachat de parts sociales pour intégrer ou développer une SELARL, une SCP ou toute société d’exercice libéral, avec une structuration bancaire adaptée." },
    ],
    professions: [
      'Professions de santé, médecins, chirurgiens-dentistes, kinésithérapeutes, infirmiers, sages-femmes, vétérinaires et pharmaciens.',
      'Professions juridiques, avocats, notaires, commissaires de justice et administrateurs judiciaires.',
      'Professions du chiffre, experts-comptables et commissaires aux comptes.',
      'Professions du conseil et techniques, architectes, géomètres-experts, consultants et autres professions libérales réglementées ou indépendantes.',
    ],
    solutions: [
      { title: 'Prêt professionnel', desc: "Financement de l’installation, du rachat de patientèle, des équipements professionnels ou des murs du cabinet, négocié auprès de nos partenaires bancaires." },
      { title: 'Crédit-bail / location financière', desc: "Financez vos équipements professionnels sans mobiliser votre trésorerie grâce au crédit-bail ou à la location financière, avec option d’achat selon le contrat." },
      { title: 'SCI & achat des murs', desc: "Structuration de l’acquisition des murs professionnels via une SCI afin d’optimiser votre stratégie patrimoniale et votre financement." },
      { title: 'Financement in fine & patrimonial', desc: "Pour les dirigeants et professions libérales disposant d’un patrimoine significatif, mise en place de financements in fine intégrés à une stratégie patrimoniale globale." },
    ],
    parcours: [
      { n: '01', name: 'Présentation du projet', desc: "Quelques minutes suffisent. Si vous êtes déjà installé, joignez vos derniers bilans : l’étude est alors bien plus précise dès le premier échange." },
      { n: '02', name: 'Analyse & stratégie', desc: "Un expert du cabinet décortique vos bilans et votre projet, puis arrête la stratégie avec vous. Rien n’est présenté à une banque avant que le dossier ne soit prêt à convaincre." },
      { n: '03', name: 'Structuration & négociation', desc: "Nous écartons les établissements qui ne financent pas votre profession, défendons le dossier auprès des autres et négocions le taux, l’assurance et les garanties." },
      { n: '04', name: 'Signature & suivi', desc: "Nous suivons chaque échéance jusqu’à la signature et au déblocage des fonds. Nos honoraires ne sont dus qu’à ce moment-là." },
    ],
    faq: [
      { q: 'Comment financer une patientèle ?', a: "Le rachat d’une patientèle ou d’une clientèle peut être financé par un prêt professionnel, parfois complété par une garantie adaptée. Les établissements bancaires analysent notamment la récurrence des honoraires, l’ancienneté du cabinet et votre capacité de reprise. Nous structurons et présentons votre dossier afin d’optimiser vos chances d’obtenir un financement pouvant couvrir jusqu’à 100 % du projet, lorsque votre situation le permet." },
      { q: 'Comment financer son installation ?', a: "L’installation d’une profession libérale peut inclure le droit de présentation, les équipements professionnels et les besoins de trésorerie de démarrage. Nous construisons un plan de financement global combinant prêt professionnel, crédit-bail et, si nécessaire, une ligne de trésorerie, présenté aux établissements bancaires avec un prévisionnel solide." },
      { q: 'Comment financer un cabinet médical ?', a: "Le financement d’un cabinet médical peut combiner le rachat de patientèle, l’acquisition des équipements professionnels, l’achat des murs du cabinet et les besoins de trésorerie. Chaque composante répond à des critères bancaires spécifiques. Nous structurons un plan de financement global afin d’optimiser le coût du crédit, de préserver votre capacité d’emprunt et d’aller chercher les établissements qui financent réellement ce type d’opération." },
      { q: 'Comment financer les murs de son cabinet ?', a: "L’acquisition des murs d’un cabinet s’effectue le plus souvent en direct ou via une SCI, selon votre situation patrimoniale et fiscale. Cette structuration permet de dissocier l’immobilier de l’activité professionnelle et de construire un patrimoine à long terme. Nous négocions le financement immobilier et coordonnons le montage avec votre notaire et votre expert-comptable." },
      { q: 'Quel apport pour acheter son cabinet ?', a: "Selon votre profession, votre expérience et la solidité de votre dossier, un financement avec un apport limité, voire sans apport dans certains cas, peut être envisagé. L’essentiel reste la qualité du projet, du prévisionnel et la stabilité des revenus. Nous savons quelles banques acceptent aujourd’hui de financer sans apport, et lesquelles ne le feront jamais." },
      { q: 'Comment financer du matériel médical ?', a: "Le matériel médical (imagerie, fauteuil dentaire, laser, informatique métier ou équipements spécialisés) peut être financé par un prêt professionnel ou un crédit-bail. Le crédit-bail permet généralement de préserver votre trésorerie, avec une option d’achat en fin de contrat. Nous comparons chaque solution afin de retenir le financement le plus adapté à votre activité, à votre fiscalité et à vos objectifs patrimoniaux." },
      { q: 'Comment financer un rachat de parts ?', a: "Le rachat de parts sociales d’une SELARL, d’une SCP ou de toute société d’exercice libéral peut être financé par un prêt professionnel dédié. Les établissements bancaires analysent notamment la rentabilité de la structure, votre capacité de remboursement et les perspectives de développement. Nous structurons le montage juridique, fiscal et bancaire avec votre expert-comptable et votre notaire afin de sécuriser l’opération." },
    ],
    related: [
      { href: '/financement-professions-sante', label: 'Professions de santé' },
      { href: '/financement-professions-juridiques', label: 'Professions juridiques' },
      { href: '/financement-professions-chiffre', label: 'Professions du chiffre' },
      { href: '/simulateur', label: 'Simulateur assurance emprunteur' },
      { href: '/tunnel', label: 'Démarrer mon étude' },
    ],
    metaTitle: 'Financement des professions libérales',
    metaDescription:
      "Courtier spécialisé du financement des professions libérales : installation, rachat de patientèle, achat des murs, matériel, trésorerie. Étude gratuite.",
  },

  // ─── Sous-pages ───────────────────────────────────────────────────────
  'financement-professions-sante': {
    slug: 'financement-professions-sante',
    eyebrow: 'Professions de santé',
    titleTop: 'Financer votre projet',
    titleEm: 'de santé.',
    lead:
      "Médecins, chirurgiens-dentistes, kinésithérapeutes, infirmiers, vétérinaires, pharmaciens : votre métier est l’un des mieux notés par les banques. Encore faut-il que votre dossier le montre. Nous le montons pour qu’il obtienne l’apport réduit et le taux que votre profil mérite.",
    intro: [
      "Revenus réguliers, faible sinistralité, patientèle qui ne s’évapore pas : le secteur de la santé est un excellent risque bancaire. Mais ce n’est vrai que si le dossier parle la bonne langue : valorisation de la patientèle, nomenclature des actes, conventionnement, projection d’activité.",
      "Nous travaillons avec les banques et partenaires réellement actifs sur le médical, ceux qui savent lire ces éléments. C’est ce qui ouvre les financements à apport réduit, parfois à 100 %, et des conditions que le guichet généraliste ne proposera pas.",
    ],
    projets: [
      { title: 'Rachat de patientèle', desc: "Financement de la valeur d’un cabinet médical, dentaire ou paramédical." },
      { title: 'Installation & association', desc: "Premier exercice, entrée en SCM/SELARL, transfert ou création de cabinet." },
      { title: 'Équipement médical', desc: "Fauteuil dentaire, imagerie, laser, matériel de cabinet, prêt ou crédit-bail." },
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
    metaTitle: 'Financement des professions de santé',
    metaDescription:
      "Financement des professionnels de santé : patientèle, installation, matériel médical, murs du cabinet. Apport réduit, conditions négociées. Courtier spécialisé.",
  },

  'financement-professions-juridiques': {
    slug: 'financement-professions-juridiques',
    eyebrow: 'Professions juridiques',
    titleTop: 'Le financement sur mesure des',
    titleEm: 'professions juridiques.',
    lead:
      "Avocats, notaires, commissaires de justice, administrateurs et mandataires judiciaires : installation, rachat de clientèle ou d’office, parts sociales, murs professionnels, trésorerie. Des opérations que peu de banques savent réellement financer. Nous savons lesquelles.",
    intro: [
      "Vos opérations cumulent deux difficultés : une valorisation incorporelle (clientèle, office, parts) que le banquier ne sait pas toujours apprécier, et une structuration juridique et fiscale (SCP, SEL, SCI, holding) qui pèse lourd sur le coût final. Sur une reprise d’office, quelques points de montage se chiffrent en dizaines de milliers d’euros.",
      "Nous identifions les établissements qui financent vraiment ces opérations, construisons le montage avec vos conseils et négocions un échéancier cohérent avec vos revenus réels. Sans honoraire tant que le financement n’est pas obtenu.",
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
    metaTitle: 'Financement avocats & notaires',
    metaDescription:
      "Financement des avocats et notaires : rachat de clientèle ou d’office, parts sociales (SCP, SEL), installation, murs. Montage par un courtier spécialisé.",
  },

  'financement-professions-chiffre': {
    slug: 'financement-professions-chiffre',
    eyebrow: 'Professions du chiffre',
    titleTop: 'Financer un cabinet d’expertise comptable,',
    titleEm: 'un portefeuille clients ou une croissance externe.',
    lead:
      "Experts-comptables et commissaires aux comptes : rachat de cabinet, portefeuille clients, parts sociales, croissance externe. Vous savez monter un plan de financement ; nous savons à qui le présenter, et comment le faire passer.",
    intro: [
      "Un cabinet d’expertise comptable se valorise sur la récurrence des missions et la solidité du portefeuille. C’est l’un des actifs les plus finançables du marché, à une condition : que le dossier réponde d’avance à la seule question qui inquiète le banquier, la rétention de la clientèle après la reprise.",
      "Nous structurons l’opération, le plus souvent via une holding de reprise, et négocions le financement avec les banques réellement actives sur le secteur. Vous ne payez qu’une fois l’accord obtenu.",
    ],
    projets: [
      { title: 'Rachat de cabinet', desc: "Acquisition d’un portefeuille clients d’expertise comptable, en direct ou par holding." },
      { title: 'Croissance externe', desc: "Rachat d’un confrère ou d’un portefeuille pour accélérer le développement." },
      { title: 'Rachat de parts', desc: "Entrée ou montée au capital de la structure d’exercice." },
      { title: 'Murs & équipement', desc: "Acquisition des locaux et financement des outils métier." },
    ],
    solutions: [
      { title: 'Holding de reprise (SAS, SARL ou SPFPL selon la structure)', desc: "Montage avec effet de levier et remboursement sur les dividendes du cabinet repris." },
      { title: 'Prêt d’acquisition', desc: "Financement du portefeuille clients sur 7 à 10 ans." },
      { title: 'Financement des murs', desc: "Détenir les locaux via une SCI et optimiser le patrimoine." },
    ],
    parcours: PARCOURS_STD,
    faq: [
      { q: 'Comment financer le rachat d’un cabinet comptable ?', a: "Le rachat d’un cabinet d’expertise comptable peut être financé par un prêt professionnel, souvent via une holding de reprise. Les banques analysent la rentabilité du cabinet, la récurrence du portefeuille clients et votre capacité de remboursement. Nous structurons le montage et négocions les meilleures conditions de financement." },
      { q: 'Quel apport pour racheter un portefeuille clients ?', a: "L’apport dépend de votre profil, du cabinet repris et de la banque. Un apport limité, voire nul dans certains dossiers, peut être accepté lorsque la rentabilité et le portefeuille clients offrent des garanties suffisantes. Nous savons lesquelles se positionnent réellement sur ce type de reprise." },
      { q: 'Comment financer une holding de reprise ?', a: "Une holding de reprise permet d’acquérir un cabinet en utilisant l’effet de levier du financement bancaire. Les remboursements sont généralement assurés par les dividendes remontés par la société reprise. Nous structurons l’opération avec votre expert-comptable et vos conseils." },
      { q: 'Comment financer une croissance externe ?', a: "La croissance externe peut être financée par un prêt professionnel, une holding de reprise ou un financement mixte. Nous analysons la rentabilité de l’opération et construisons une stratégie adaptée afin d’optimiser le coût du financement et votre capacité d’investissement." },
    ],
    related: [
      { href: '/financement-professions-liberales', label: 'Toutes les professions libérales' },
      { href: '/reprise-transmission', label: 'Reprise & transmission' },
      { href: '/tunnel', label: 'Démarrer mon étude' },
    ],
    metaTitle: 'Financement des experts-comptables',
    metaDescription:
      "Financement des experts-comptables : rachat de cabinet, portefeuille clients, parts sociales, croissance externe. Montage en holding et négociation bancaire.",
  },

  // ─── Axe 3 : Franchise ────────────────────────────────────────────────
  'financement-franchise': {
    slug: 'financement-franchise',
    eyebrow: 'Franchise',
    titleTop: 'Le financement sur mesure',
    titleEm: 'de votre franchise.',
    introTitle: 'Le concept est validé. Reste à convaincre la banque.',
    lead:
      "Vous ouvrez un point de vente en franchise ? Cap Horn monte votre dossier bancaire, réduit l’apport que vous devrez sortir et négocie le financement du droit d’entrée, des travaux, du matériel et du fonds de roulement.",
    intro: [
      "Une franchise part avec un avantage réel : concept éprouvé, accompagnement du franchiseur, prévisionnel cadré. Mais la banque, elle, ne finance pas un réseau : elle finance un porteur de projet. Elle regarde votre apport, vos garanties, et votre crédibilité personnelle sur ce métier-là.",
      "Nous construisons le dossier qui répond à ces trois questions, sélectionnons les banques actives sur votre enseigne et mobilisons les leviers qui allègent votre apport : prêt d’honneur, garantie Bpifrance, crédit-bail. L’objectif n’est pas seulement d’obtenir l’accord, c’est d’ouvrir avec de la trésorerie devant vous.",
    ],
    projets: [
      { title: 'Droit d’entrée & redevances', desc: "Financement du droit d’entrée dans le réseau et des frais initiaux." },
      { title: 'Agencement & travaux', desc: "Aménagement du point de vente aux normes du concept." },
      { title: 'Stock & fonds de roulement', desc: "Constitution du stock initial et financement des premiers mois d’exploitation." },
      { title: 'Matériel & équipement', desc: "Équipement du local, en prêt ou en crédit-bail." },
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
    metaTitle: 'Financement de franchise',
    metaDescription:
      "Financer l’ouverture d’une franchise : droit d’entrée, agencement, stock, fonds de roulement. Optimisation de l’apport et négociation du prêt bancaire.",
  },

  // ─── Axe 4 : Reprise & transmission ──────────────────────────────────
  'reprise-transmission': {
    slug: 'reprise-transmission',
    eyebrow: 'Reprise & transmission',
    titleTop: 'Vendre ou reprendre',
    titleEm: 'une entreprise.',
    cta: {
      title: 'Une reprise se gagne avant la signature.',
      text: 'Présentez votre projet en quelques minutes. Un expert CAP HORN CONSEILS étudie votre situation, arrête la stratégie avec vous et défend le financement jusqu’à la conclusion de l’opération. Sans honoraire tant qu’elle n’aboutit pas.',
    },
    lead:
      "Vendre la société d’une vie ou en reprendre une : dans les deux cas, tout se joue sur la valorisation et le montage. Cap Horn intervient sur l’estimation, la structuration du financement et la mise en relation entre cédants et repreneurs.",
    intro: [
      "Une reprise se gagne ou se perd bien avant la signature. Valorisation, audit d’acquisition, structuration juridique, niveau d’apport, dette senior, holding de reprise : chacun de ces arbitrages se répercute directement sur le coût du financement, et sur ce qu’il vous restera après remboursement.",
      "Nous accompagnons cédants et repreneurs sur toute la chaîne : structurer la transaction, aller chercher les financements, négocier avec les banques et sécuriser le calendrier. Une opération mal montée ne se rattrape pas ; une opération bien montée se finance.",
    ],
    projets: [
      { title: 'Vendre son entreprise', desc: "Préparation de la cession, valorisation d’entreprise et recherche de repreneur." },
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
      { q: 'Quel apport pour reprendre une entreprise ?', a: "L’apport personnel varie selon la taille de l’opération, le secteur d’activité et le profil du repreneur. Dans certains dossiers, des garanties ou des financements complémentaires permettent de limiter l’apport initial." },
      { q: 'Comment fonctionne une holding de reprise ?', a: "Une holding de reprise acquiert les titres de la société cible grâce à un financement bancaire. Les dividendes versés par l’entreprise reprise contribuent ensuite au remboursement de la dette d’acquisition." },
      { q: 'Qu’est-ce qu’un LBO ?', a: "Le LBO (Leveraged Buy-Out) consiste à reprendre une entreprise via une holding financée en partie par emprunt. Ce montage permet d’optimiser l’effet de levier tout en structurant le remboursement grâce aux résultats de la société reprise." },
      { q: 'Comment valoriser sa société ?', a: "La valorisation d’une entreprise repose notamment sur sa rentabilité, son chiffre d’affaires, ses actifs, son potentiel de développement et les références du marché. Nous vous accompagnons pour déterminer une valeur cohérente et crédible auprès des repreneurs et des banques." },
      { q: 'Comment trouver un repreneur ?', a: "Trouver un repreneur nécessite une valorisation réaliste, un dossier de présentation de qualité et un réseau qualifié. Nous mettons en relation cédants et acquéreurs, tout en sécurisant les aspects financiers de la transmission." },
      { q: 'Comment fonctionne un crédit vendeur ?', a: "Le crédit vendeur permet au cédant de financer une partie du prix de vente en accordant un paiement échelonné à l’acquéreur. Cette solution réduit souvent l’apport initial et facilite l’obtention du financement bancaire. Nous structurons ce montage avec les banques et vos conseils afin de sécuriser la transaction." },
      { q: 'Comment préparer la vente de son entreprise ?', a: "La préparation d’une cession commence par l’analyse des performances de l’entreprise, de son organisation et de ses documents financiers. Un dossier complet et une société bien préparée renforcent la confiance des acquéreurs et facilitent le financement de la reprise." },
    ],
    related: [
      { href: '/financement-professions-chiffre', label: 'Rachat de cabinet comptable' },
      { href: '/expertises', label: 'Toutes nos expertises' },
      { href: '/tunnel', label: 'Démarrer mon étude' },
    ],
    metaTitle: 'Reprise & transmission d’entreprise',
    metaDescription:
      "Vendre son entreprise ou reprendre une société : valorisation, montage bancaire, effet de levier via holding, mise en relation cédants et repreneurs.",
  },

  // ─── Page locale : Lille & métropole ─────────────────────────────────
  'courtier-credit-immobilier-lille': {
    slug: 'courtier-credit-immobilier-lille',
    eyebrow: 'Lille & métropole',
    titleTop: 'Votre courtier en crédit immobilier',
    titleEm: 'à Lille.',
    introTitle: 'À Lille, un dossier prêt vaut mieux qu’un dossier rapide.',
    professionsIntro:
      'À Lille comme dans toute la métropole, chaque profil a ses banques. Nous savons lesquelles diront oui au vôtre, et à quelles conditions.',
    lead:
      "Résidence principale, premier achat, investissement locatif ou acquisition via SCI : Cap Horn Conseils accompagne les acquéreurs de Lille et de la Métropole Européenne de Lille (Roubaix, Tourcoing, Villeneuve-d’Ascq, Marcq-en-Barœul…). Nous nous déplaçons chez vous, et nous mettons près de cent banques en concurrence sur votre crédit.",
    intro: [
      "Sur le marché lillois, un bien qui vous plaît plaît aussi à trois autres acquéreurs. Entre le Vieux-Lille, les quartiers en pleine mutation et la pression de la métropole, l’offre retenue est rarement la plus élevée : c’est celle dont le financement rassure le vendeur. Un dossier solide, présenté vite et bien, vaut souvent mieux que quelques milliers d’euros de plus.",
      "Notre rôle est de traduire votre projet dans le langage des banques, d’aller directement vers celles dont les critères correspondent à votre profil, et de négocier le taux, l’assurance emprunteur et les garanties. Nous ne sommes liés à aucun établissement : la solution que nous recommandons est celle qui vous sert, et nos honoraires ne sont dus qu’en cas de succès.",
    ],
    projets: [
      { title: 'Résidence principale', desc: "Achat de votre logement à Lille ou dans la métropole, dans l’ancien comme dans le neuf, avec un plan de financement optimisé." },
      { title: 'Premier achat (primo-accédant)', desc: "Constitution et défense de votre dossier de primo-accédant : prêt à taux zéro le cas échéant, apport limité, sécurisation des conditions." },
      { title: 'Investissement locatif', desc: "Financement d’un investissement locatif dans la métropole lilloise, en direct ou via une SCI, avec une stratégie patrimoniale adaptée." },
      { title: 'Achat via SCI', desc: "Structuration de l’acquisition via une SCI pour organiser votre patrimoine et optimiser votre financement." },
      { title: 'Renégociation & rachat de prêt', desc: "Rachat ou renégociation de votre crédit immobilier existant pour réduire vos mensualités ou le coût total du crédit." },
    ],
    professions: [
      'Primo-accédants et jeunes actifs de la métropole lilloise.',
      'Investisseurs immobiliers, en direct ou via SCI.',
      'Expatriés et non-résidents finançant un bien dans la région.',
      'Professions libérales, chefs d’entreprise et dossiers atypiques.',
    ],
    solutions: [
      { title: 'Crédit immobilier', desc: "Négociation du taux, des garanties et des conditions de votre prêt immobilier auprès de nos banques partenaires." },
      { title: 'Assurance emprunteur', desc: "Délégation d’assurance (loi Lemoine) pour réduire significativement le coût de votre assurance de prêt, à garanties équivalentes." },
      { title: 'Regroupement de crédits', desc: "Regroupement de vos crédits en cours pour retrouver de la capacité et alléger vos mensualités." },
      { title: 'Financement professionnel', desc: "Pour les indépendants et dirigeants lillois : financement des murs, de l’activité ou de l’installation." },
    ],
    parcours: PARCOURS_STD,
    faq: [
      { q: 'Faut-il se déplacer à votre bureau ?', a: "Non. Cap Horn Conseils est une entreprise de courtage qui se déplace : nous échangeons par téléphone et visioconférence, et le courtier peut vous rencontrer à Lille ou dans la métropole. Vous n’avez aucun déplacement à prévoir pour constituer votre dossier." },
      { q: 'Intervenez-vous dans toute la métropole de Lille ?', a: "Oui. Nous accompagnons les projets immobiliers à Lille et dans l’ensemble de la Métropole Européenne de Lille : Roubaix, Tourcoing, Villeneuve-d’Ascq, Marcq-en-Barœul, La Madeleine, Lambersart et les communes environnantes, ainsi que dans toute la région des Hauts-de-France." },
      { q: 'Un courtier coûte-t-il plus cher qu’une banque ?', a: "Non : nos honoraires ne sont dus qu’en cas de succès, et l’économie négociée sur le taux et l’assurance emprunteur les couvre généralement largement. Sans résultat, aucun honoraire n’est facturé." },
      { q: 'Quel apport pour acheter à Lille ?', a: "L’apport demandé varie selon votre profil, le type de bien et l’établissement. Un financement avec apport réduit reste possible pour les bons dossiers, notamment les primo-accédants. Nous identifions les banques les plus adaptées à votre situation." },
      { q: 'Combien de temps pour obtenir un accord de prêt ?', a: "Après un premier échange sous 24 h, le montage et la négociation prennent généralement quelques semaines selon la complexité du dossier et les délais des banques. Un dossier bien préparé accélère nettement l’obtention de l’accord." },
    ],
    related: [
      { href: '/simulateur-credit-immobilier', label: 'Simuler mon crédit immobilier' },
      { href: '/simulateur', label: 'Simulateur assurance emprunteur' },
      { href: '/expertises', label: 'Toutes nos expertises' },
      { href: '/tunnel', label: 'Démarrer mon étude' },
    ],
    metaTitle: 'Courtier en crédit immobilier à Lille',
    metaDescription:
      "Courtier en crédit immobilier indépendant à Lille et dans la métropole : résidence principale, primo-accédant, investissement locatif. Étude gratuite.",
  },
}
