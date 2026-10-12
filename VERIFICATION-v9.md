# Vérification v9 — installation privée

Date : 12 octobre 2026

- Application copiée sur le Mac mini dans `/srv/macmini/apps/mon-reiki`.
- Service utilisateur `mon-reiki.service` activé et démarré automatiquement.
- Serveur lié uniquement à `127.0.0.1:8788`.
- Tailscale Serve publie uniquement dans le tailnet l'adresse HTTPS sur le port `8457` ; aucun Funnel.
- Page, manifeste, service worker, icône 192 px et son du bol répondent en HTTP 200 via HTTPS.
- Certificat Let's Encrypt valide pour `macmini-olivier.tail9ef6d6.ts.net`.
- Chargement réel dans Chromium : titre, manifeste, icône Apple et aide d'installation présents ; aucune erreur ni aucun avertissement console.

Reste à confirmer sur le téléphone physique : activation de Tailscale, ouverture de l'adresse et installation depuis le menu Chrome.
