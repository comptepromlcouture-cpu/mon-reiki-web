# Vérification v11 — publication web normale

Date : 12 octobre 2026

- Workflow GitHub Pages ajouté pour publier automatiquement la branche `main`.
- Seuls les fichiers utiles à l'application sont placés dans l'artefact du site.
- Le manifeste, le service worker et tous les chemins restent relatifs pour fonctionner sous `/mon-reiki-app/`.
- L'ancien mode d'accès privé Tailscale n'est plus nécessaire pour l'utilisateur.

La publication et l'URL publique doivent être contrôlées après l'exécution réelle du workflow GitHub Actions.
