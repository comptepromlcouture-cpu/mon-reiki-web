# Vérification locale v5 — 12 octobre 2026

- Fichiers copiés depuis les chemins explicitement fournis : cinq MP3 et un WAV. Métadonnées décodables avec `afinfo` ; durées 207,96 / 306,05 / 428,78 / 983,26 / 288,03 secondes, et 13,24 secondes pour le bol.
- Syntaxe JavaScript validée par `node --check app.js`.
- Lecture réelle de Piano zen en aperçu : temps courant observé à 11,95 secondes, durée 207,96 secondes, sans erreur média.
- Séance avec Nature : lecteur actif, temps courant observé à 6,64 secondes, durée 428,78 secondes, propriété native `loop` activée.
- Bol réel lors d’un changement d’étape : lecture active, temps courant à 9,17 secondes.
- Pause : musique et bol tous deux arrêtés. Quitter : les trois lecteurs sont arrêtés et remis à zéro.
- Choix Silence : musique arrêtée et bol actif lors d’une transition (temps observé à 6,58 secondes).
- Choix Nature et volumes 25/50 conservés après rechargement. Valeurs de test remises à Piano zen, 35/60.
- Défaut reproduit à 375 × 667 avant correction : ordonnée de silhouette passant de 124,95 à 115,66 pixels entre racine et sacré.
- Après correction à 375 × 667 : les sept cadres ont exactement x=26, y=107, largeur=323, hauteur=323 pixels.
- Après correction à 768 × 1024 : les sept cadres ont exactement x=164, y=215, largeur=440, hauteur=440 pixels.
- Lecture des styles : aucune transformation sur la silhouette ; animations `energy-wave` sur le halo et `symbol-breath` sur le symbole ; fond du symbole entièrement transparent.
- Paramètres contrôlés aux largeurs 375/390, 768 et 1280. Les séances restent fixes ; seules les fiches et les paramètres défilent verticalement.

## Limites

Pas de test sur téléphone physique, écran verrouillé, Safari iOS ou lecture d’un morceau entier jusqu’à son rebouclage. Le rebouclage repose sur la fonction native `loop` du lecteur, vérifiée active pendant la lecture. Fin complète de soin non rejouée pour ne pas modifier le compteur des 21 jours. Aucun accordage musical ou traitement audio n’a été appliqué.
