# Vérification v11 — publication web normale

Date : 12 octobre 2026

- Workflow GitHub Pages ajouté pour publier automatiquement la branche `main`.
- Seuls les fichiers utiles à l'application sont placés dans l'artefact du site.
- Le manifeste, le service worker et tous les chemins restent relatifs pour fonctionner sous `/mon-reiki-app/`.
- L'ancien mode d'accès privé Tailscale n'est plus nécessaire pour l'utilisateur.
- GitHub Pages est réellement activé en HTTPS sur `https://comptepromlcouture-cpu.github.io/mon-reiki-web/`.
- La page, le manifeste, le service worker, l'icône et le son du bol répondent en HTTP 200.
- Contrôle navigateur réel : titre « Mon Reiki », manifeste, icône Apple, script versionné et aide d'installation présents, sans erreur console.

Le dernier contrôle restant est l'installation physique depuis le menu du navigateur du téléphone.
