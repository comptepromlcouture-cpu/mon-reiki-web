# Vérification v8 — icône lotus

Date : 12 octobre 2026

## Modification

- L'icône avec les mains en Gasshō a été retirée afin d'éviter une lecture religieuse.
- Elle est remplacée par une fleur de lotus aquarelle originale, sans personne, mains, symbole religieux, texte ni filigrane.
- La palette reprend le rose poudré, l'ivoire lumineux et le mauve discret de l'écran d'accueil.
- Le cache passe à `mon-reiki-v8` pour distribuer la nouvelle icône aux installations futures.

## Fichiers

- Source générée : `assets/icons/lotus-art-v3.png`
- Compositions : `assets/icons/icon.svg` et `assets/icons/icon-maskable.svg`
- Exports : 180 × 180, 192 × 192, 512 × 512 et 512 × 512 maskable.

## Contrôles effectués

- Les quatre exports ont les dimensions attendues et répondent en HTTP 200.
- Le manifeste est valide ; l'application et le service worker passent la vérification de syntaxe.
- Le navigateur charge réellement l'icône 192 × 192 dans la carte d'installation, sans erreur ni avertissement console.
