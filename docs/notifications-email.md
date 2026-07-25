# Notifications e-mail des leads (Resend)

Guillaume reçoit un e-mail à chaque événement commercial du site :

| Événement | Déclencheur | Route |
|---|---|---|
| **Dossier commencé** | un visiteur laisse ses coordonnées dans le tunnel sans finaliser (1 seul e-mail) | `POST /api/leads` |
| **Dossier finalisé** | un dossier tunnel est soumis (1 seul e-mail) | `POST /api/leads` |
| **Simulation d'assurance** | envoi d'une estimation depuis le simulateur | `POST /api/simulateur` |
| **Demande de contact** | bouton « Prendre contact » | `POST /api/contact` |

Chaque e-mail a un **reply-to = adresse du client** : Guillaume clique sur « Répondre » et écrit directement au prospect.

Les envois partent **après** la réponse HTTP (`after()` de Next.js) : ils ne ralentissent jamais le site, et un échec d'envoi n'empêche jamais l'enregistrement du lead en base.

---

## 1. Créer la clé API Resend

1. Compte sur https://resend.com
2. **API Keys → Create** → copier la clé (commence par `re_…`)
3. La coller dans `RESEND_API_KEY` (voir §3).

## 2. Vérifier le domaine — l'étape anti-spam (indispensable)

Sans domaine vérifié, les e-mails partent en spam ou sont refusés. C'est **le** point qui décide de la délivrabilité.

1. Resend → **Domains → Add Domain** → `financezmonprojet.fr`
2. Resend affiche 3 enregistrements DNS. Les ajouter chez **Hostinger** (Domaines → DNS) :
   - **SPF** — un `TXT` (`send.financezmonprojet.fr` → `v=spf1 include:amazonses.com ~all`)
   - **DKIM** — un `TXT` (`resend._domainkey` → longue clé publique)
   - **MX** (pour le suivi des retours) — sur `send`
3. Attendre la propagation (quelques minutes à 1 h) puis cliquer **Verify**. Le domaine passe au vert.
4. **DMARC (fortement recommandé)** — ajouter un `TXT` sur `_dmarc.financezmonprojet.fr` :
   ```
   v=DMARC1; p=none; rua=mailto:contact@cap-horn-conseils.com
   ```
   `p=none` observe sans bloquer ; on pourra durcir en `quarantine` plus tard.

L'expéditeur configuré (`notifications@financezmonprojet.fr`) doit appartenir à ce domaine vérifié.

## 3. Variables d'environnement

En local (`.env.local`) **et** en production (Vercel → Settings → Environment Variables) :

| Variable | Rôle | Exemple |
|---|---|---|
| `RESEND_API_KEY` | clé API Resend | `re_xxxxxxxx` |
| `LEADS_EMAIL_TO` | boîte de Guillaume qui reçoit les alertes | `contact@cap-horn-conseils.com` |
| `LEADS_EMAIL_FROM` | expéditeur (domaine vérifié) | `Cap Horn Conseils <notifications@financezmonprojet.fr>` |

> ⚠️ Les valeurs de `.env.local` ne sont **pas** déployées. Il faut les saisir aussi dans Vercel, sinon les notifications ne partent pas en production.

Si `RESEND_API_KEY` est absente, le code ne plante pas : il journalise `RESEND_API_KEY absente : notification ignorée` et continue.

## 4. Anti-spam, ce qui est déjà en place dans le code

- E-mail **multipart** (HTML **+** texte brut) — signal de confiance majeur.
- Expéditeur sur le **domaine vérifié**, identité constante.
- **Reply-to** = adresse réelle du client.
- HTML sobre, **CSS 100 % en ligne**, aucune image distante, pas de mots « piège ».
- Objets clairs, sans capitales ni ponctuation excessive.

## 5. Tester

1. Renseigner les 3 variables (§3), relancer `npm run dev`.
2. Remplir le tunnel jusqu'aux coordonnées → Guillaume reçoit « Dossier en cours ».
3. Finaliser → « Nouveau dossier ».
4. Envoyer une simulation d'assurance → « Simulation assurance ».
5. Suivi des envois : tableau de bord Resend (onglet **Emails**).
