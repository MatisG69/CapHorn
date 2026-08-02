# Visuels de la page « Médecins & chirurgiens »

Deux fichiers sont attendus ici. Tant qu'ils sont absents, la page ne casse pas :
elle retombe sur un visuel existant pour le héros et masque le bloc QR code.

| Fichier attendu | Usage | Format conseillé |
|---|---|---|
| `financement-medecin-chirurgien-lille-cap-horn-conseils.webp` | Photo du héros (Guillaume Horn en rendez-vous avec un médecin) | WebP, 1200 × 960 px, cadrage 5/4, < 250 Ko |
| `whatsapp-guillaume-horn-cap-horn-conseils.png` | QR code WhatsApp affiché dans le bloc d'appel intermédiaire | PNG, 640 × 640 px, fond blanc, marges incluses |

Le nom des fichiers est référencé dans
`components/landing/medecins/MedecinsPage.tsx` : le déposer sous un autre nom
n'aura aucun effet.

Le guide PDF, lui, se dépose dans `public/guides/`.
