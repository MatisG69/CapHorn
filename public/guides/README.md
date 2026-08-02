# Guides téléchargeables

Fichier attendu, **sans extension imposée** :

`reussir-le-financement-de-son-installation-medicale.<ext>`

`POST /api/guide` cherche ce nom dans l'ordre `.pdf`, `.jpg`, `.jpeg`, `.png`,
`.webp` et sert le premier trouvé. Remplacer une version image par le PDF ne
demande donc aucune modification de code : il suffit de déposer le fichier.

Le guide n'est servi qu'**après** enregistrement des coordonnées, jamais par un
lien en dur dans la page : sinon le formulaire serait contournable en lisant le
code source.

Tant qu'aucun fichier n'est présent, le formulaire fonctionne quand même :
le contact est enregistré, Guillaume reçoit la notification e-mail, et le
visiteur lit « nous vous l'adressons par e-mail dans les prochaines minutes ».

Le nom de base est défini par `GUIDE.fileBase` dans `lib/seo/medecins.tsx`.
