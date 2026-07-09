/**
 * Documents légaux (source : dossier JURIDIQUES/ fourni par Guillaume).
 * Affichés dans une modale depuis le pied de page.
 */

export interface LegalBlock {
  heading?: string
  paragraphs?: string[]
  list?: string[]
}

export interface LegalDoc {
  id: 'mentions' | 'confidentialite' | 'cookies'
  label: string
  title: string
  updated?: string
  blocks: LegalBlock[]
}

export const LEGAL_DOCS: LegalDoc[] = [
  {
    id: 'mentions',
    label: 'Mentions légales',
    title: 'Mentions légales',
    blocks: [
      {
        heading: 'Éditeur du site',
        paragraphs: [
          'Le présent site est édité par GAH CONSULTING, société par actions simplifiée unipersonnelle (SASU), exploitant la marque déposée CAP HORN CONSEILS®.',
        ],
        list: [
          'Dénomination sociale : GAH CONSULTING',
          'Marque commerciale : CAP HORN CONSEILS®',
          'Président : Guillaume HORN',
          'Capital social : 6 500 €',
          'Siège social : 97 T rue Nationale, 59270 Méteren, France',
          'RCS : Dunkerque 939 507 190',
          'SIREN : 939 507 190',
          'SIRET : 939 507 190 00014',
          'Code APE : 66.19B, Autres activités auxiliaires de services financiers, hors assurance et caisses de retraite',
          'Téléphone : 06 28 71 83 95',
          'Courriel : contact@cap-horn-conseils.com',
          'Site internet : https://cap-horn-conseils.com',
          'Directeur de la publication : Guillaume HORN',
        ],
      },
      {
        heading: 'Sites édités',
        paragraphs: [
          'GAH CONSULTING édite plusieurs sites internet complémentaires dédiés au financement.',
          'CAP HORN CONSEILS® constitue le site institutionnel du cabinet et présente l’ensemble des expertises, services et activités de GAH CONSULTING.',
          'Le site FinancerMonProjet est un site complémentaire créé par Guillaume HORN et exploité par GAH CONSULTING. Il propose des contenus, outils et parcours destinés à accompagner les particuliers et les professionnels dans leurs projets de financement.',
        ],
      },
      {
        heading: 'Marque déposée',
        paragraphs: [
          'CAP HORN CONSEILS® est une marque verbale française déposée auprès de l’Institut National de la Propriété Industrielle (INPI).',
        ],
        list: [
          'Titulaire : GAH CONSULTING',
          'Numéro d’enregistrement : 5211380',
          'Date de dépôt : 23 décembre 2025',
          'Date d’enregistrement : 10 avril 2026',
          'Classes de Nice : 35 et 36',
        ],
      },
      {
        paragraphs: [
          'Toute reproduction, imitation, utilisation ou exploitation, totale ou partielle, de la marque CAP HORN CONSEILS®, sans autorisation écrite préalable de GAH CONSULTING, est interdite.',
        ],
      },
      {
        heading: 'Activités réglementées',
        paragraphs: [
          'GAH CONSULTING exerce des activités réglementées d’intermédiation dans le domaine du financement et de l’assurance, conformément aux dispositions du Code monétaire et financier et du Code des assurances.',
          'La société est immatriculée à l’ORIAS sous le numéro : 25001212.',
          'Le registre des intermédiaires est consultable sur : https://www.orias.fr',
        ],
      },
      {
        heading: 'Réseau de partenaires',
        paragraphs: [
          'Dans le cadre de son activité, CAP HORN CONSEILS® s’appuie sur un réseau de partenaires spécialisés afin d’apporter la solution la plus adaptée à chaque projet.',
          'Pour le financement immobilier, GAH CONSULTING intervient dans le cadre de son partenariat avec le réseau Pretto, donnant accès à un large réseau de banques et d’établissements prêteurs.',
          'Ce partenariat permet également de mobiliser des solutions spécialisées, notamment en financement professionnel, assurance emprunteur, prévoyance, regroupement de crédits, immobilier neuf, rénovation énergétique et accompagnement patrimonial.',
          'Lorsque les spécificités d’un dossier le justifient, CAP HORN CONSEILS® peut collaborer avec d’autres professionnels qualifiés (notaires, experts-comptables, conseillers en gestion de patrimoine, agents immobiliers ou courtiers spécialisés) afin d’apporter au client l’expertise la plus adaptée, tout en conservant un interlocuteur unique chargé du suivi du projet.',
        ],
      },
      {
        heading: 'Assurance de responsabilité civile professionnelle',
        paragraphs: [
          'Conformément à la réglementation applicable, GAH CONSULTING bénéficie d’une assurance de responsabilité civile professionnelle.',
        ],
        list: [
          'Courtier gestionnaire : ENDYA',
          'Compagnie : CGPA',
          'Contrat RC Professionnelle : n° 81996',
        ],
      },
      {
        heading: 'Autorité de contrôle',
        paragraphs: [
          'Les activités réglementées exercées par GAH CONSULTING sont placées sous le contrôle de l’Autorité de Contrôle Prudentiel et de Résolution (ACPR), 4 Place de Budapest, CS 92459, 75436 Paris Cedex 09.',
        ],
      },
      {
        heading: 'Hébergement',
        paragraphs: [
          'Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis, vercel.com.',
        ],
      },
      {
        heading: 'Conception et développement',
        paragraphs: [
          'Le présent site a été conçu et développé par MAPA DEVELOPPEMENT pour le compte de GAH CONSULTING.',
          'L’ensemble des droits patrimoniaux relatifs au site, à son architecture, à son identité visuelle et à ses contenus appartient à GAH CONSULTING, sauf mention contraire.',
        ],
      },
      {
        heading: 'Propriété intellectuelle',
        paragraphs: [
          'L’ensemble des contenus publiés sur le présent site (textes, photographies, illustrations, graphismes, vidéos, logos, icônes, éléments graphiques, bases de données et structure générale) est protégé par le Code de la propriété intellectuelle.',
          'Toute reproduction, représentation, adaptation, diffusion ou exploitation, totale ou partielle, sans autorisation écrite préalable de GAH CONSULTING est strictement interdite.',
        ],
      },
      {
        heading: 'Responsabilité',
        paragraphs: [
          'Les informations diffusées sur le présent site sont fournies à titre exclusivement informatif.',
          'Elles ne constituent ni une offre de crédit, ni une proposition d’assurance, ni un conseil personnalisé.',
          'L’octroi d’un financement ou d’un contrat d’assurance demeure soumis à l’étude du dossier ainsi qu’à l’acceptation définitive des organismes partenaires.',
          'Les simulations proposées sur le présent site sont fournies à titre indicatif et ne présentent aucun caractère contractuel.',
        ],
      },
      {
        heading: 'Liens hypertextes',
        paragraphs: [
          'Le présent site peut contenir des liens vers des sites internet édités par des tiers.',
          'GAH CONSULTING ne saurait être tenue responsable du contenu de ces sites ni des conséquences pouvant résulter de leur consultation.',
        ],
      },
      {
        heading: 'Droit applicable',
        paragraphs: [
          'Le présent site est régi par le droit français.',
          'Tout litige relatif à son utilisation relève de la compétence des juridictions territorialement compétentes.',
        ],
      },
      {
        heading: 'Avertissements',
        list: [
          'Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.',
          'L’octroi d’un crédit est soumis à l’acceptation définitive de l’établissement prêteur.',
          'Le regroupement de crédits peut entraîner un allongement de la durée de remboursement ainsi qu’une augmentation du coût total du crédit.',
          'Les simulations et estimations proposées sur le site sont fournies à titre indicatif et ne constituent pas un engagement contractuel.',
        ],
      },
    ],
  },

  {
    id: 'confidentialite',
    label: 'Politique de confidentialité',
    title: 'Politique de confidentialité',
    updated: '10 juillet 2026',
    blocks: [
      {
        paragraphs: [
          'CAP HORN CONSEILS® accorde une importance particulière à la protection de vos données personnelles et s’engage à les traiter conformément au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés.',
        ],
      },
      {
        heading: '1. Responsable du traitement',
        paragraphs: [
          'Le responsable du traitement des données est CAP HORN CONSEILS®, 97 T rue Nationale, 59270 Méteren, SIRET : 939 507 190 00014.',
        ],
      },
      {
        heading: '2. Données collectées',
        paragraphs: ['Nous pouvons être amenés à collecter les données suivantes :'],
        list: [
          'identité (nom, prénom) ;',
          'coordonnées (adresse e-mail, téléphone) ;',
          'informations relatives à votre projet de financement ;',
          'informations professionnelles ;',
          'documents transmis volontairement (bilans, justificatifs, business plan, etc.) ;',
          'données techniques (adresse IP, navigateur, cookies).',
        ],
      },
      {
        heading: '3. Finalités du traitement',
        paragraphs: ['Vos données sont utilisées pour :'],
        list: [
          'analyser votre demande ;',
          'préparer une étude de financement ;',
          'vous contacter ;',
          'assurer le suivi de votre dossier ;',
          'répondre à nos obligations légales ;',
          'améliorer notre site internet ;',
          'réaliser des statistiques anonymisées.',
        ],
      },
      {
        heading: '4. Base juridique',
        paragraphs: ['Les traitements reposent notamment sur :'],
        list: [
          'votre consentement ;',
          'l’exécution de mesures précontractuelles ;',
          'l’exécution d’un contrat ;',
          'nos obligations légales ;',
          'notre intérêt légitime.',
        ],
      },
      {
        heading: '5. Destinataires',
        paragraphs: ['Les données sont exclusivement destinées :'],
        list: [
          'aux collaborateurs habilités de CAP HORN CONSEILS ;',
          'aux établissements bancaires et partenaires financiers, uniquement avec votre accord ou lorsque cela est nécessaire à l’étude de votre dossier ;',
          'à nos prestataires techniques soumis à une obligation de confidentialité.',
        ],
      },
      {
        paragraphs: ['Aucune donnée n’est vendue ni cédée à des tiers à des fins commerciales.'],
      },
      {
        heading: '6. Durée de conservation',
        paragraphs: [
          'Les données sont conservées uniquement pendant la durée nécessaire à la réalisation des finalités poursuivies. À titre indicatif :',
        ],
        list: [
          'demandes sans suite : jusqu’à 3 ans ;',
          'dossiers clients : selon les obligations légales applicables ;',
          'cookies : 13 mois maximum.',
        ],
      },
      {
        heading: '7. Sécurité',
        paragraphs: [
          'CAP HORN CONSEILS met en œuvre des mesures techniques et organisationnelles destinées à protéger vos données contre toute perte, altération, accès non autorisé ou divulgation.',
        ],
      },
      {
        heading: '8. Vos droits',
        paragraphs: ['Conformément au RGPD, vous disposez notamment des droits suivants :'],
        list: [
          'droit d’accès ;',
          'droit de rectification ;',
          'droit d’effacement ;',
          'droit à la limitation ;',
          'droit d’opposition ;',
          'droit à la portabilité ;',
          'droit de retirer votre consentement lorsque celui-ci constitue la base juridique du traitement.',
        ],
      },
      {
        paragraphs: [
          'Vous pouvez exercer vos droits à tout moment en écrivant à contact@cap-horn-conseils.com. Une réponse vous sera apportée dans les meilleurs délais et au plus tard dans un délai d’un mois.',
        ],
      },
      {
        heading: '9. Réclamation',
        paragraphs: [
          'Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la Commission Nationale de l’Informatique et des Libertés (CNIL).',
        ],
      },
      {
        heading: '10. Cookies',
        paragraphs: [
          'Le site utilise des cookies nécessaires à son fonctionnement ainsi que, le cas échéant, des cookies de mesure d’audience. Vous pouvez gérer vos préférences à tout moment via le module de gestion des cookies.',
        ],
      },
    ],
  },

  {
    id: 'cookies',
    label: 'Politique de cookies',
    title: 'Politique de cookies',
    updated: '10 juillet 2026',
    blocks: [
      {
        paragraphs: [
          'Le site CAP HORN CONSEILS® peut utiliser des cookies et traceurs afin d’assurer son bon fonctionnement, mesurer son audience et améliorer l’expérience utilisateur.',
        ],
      },
      {
        heading: '1. Qu’est-ce qu’un cookie ?',
        paragraphs: [
          'Un cookie est un petit fichier déposé sur votre terminal lors de la consultation d’un site internet. Il permet notamment de reconnaître votre navigateur, de mémoriser certaines préférences ou de mesurer la fréquentation du site.',
        ],
      },
      {
        heading: '2. Cookies utilisés',
        paragraphs: ['Le site peut utiliser :'],
        list: [
          'cookies strictement nécessaires au fonctionnement du site ;',
          'cookies de mesure d’audience ;',
          'cookies de sécurité ;',
          'cookies liés aux formulaires de contact.',
        ],
      },
      {
        heading: '3. Gestion du consentement',
        paragraphs: [
          'Lors de votre première visite, vous pouvez accepter, refuser ou personnaliser les cookies non essentiels. Vous pouvez modifier votre choix à tout moment depuis le bandeau ou le module de gestion des cookies.',
        ],
      },
      {
        heading: '4. Durée de conservation',
        paragraphs: [
          'Les cookies sont conservés pour une durée maximale de 13 mois, sauf obligation légale différente ou suppression anticipée par l’utilisateur.',
        ],
      },
      {
        heading: '5. Vos droits',
        paragraphs: [
          'Vous pouvez configurer votre navigateur afin de bloquer tout ou partie des cookies. Le refus de certains cookies peut toutefois limiter certaines fonctionnalités du site.',
        ],
      },
      {
        heading: '6. Contact',
        paragraphs: [
          'Pour toute question relative à l’utilisation des cookies : contact@cap-horn-conseils.com',
        ],
      },
    ],
  },
]
