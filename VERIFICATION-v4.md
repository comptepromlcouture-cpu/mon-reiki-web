# Vérification locale — 12 octobre 2026

## Vérifié dans le navigateur

- Démarrage puis accès au programme ; conservation du parcours au jour 1 pendant les essais (aucun soin complet enregistré).
- Formats 375 × 667 et 390 × 844 : page de soin fixe, commandes visibles ; Gasshō, image de chakra et nouvelles positions.
- Passage manuel des 7 chakras et des 14 positions jusqu’aux pieds ; pause et arrêt du son.
- Transition automatique de la clôture « 8 / cacahuète » (10 s) à « Remonter les énergies » (8 s), sans clic.
- Curseur de lumière à 20 % : variable appliquée à 0,2 ; décocher la pulsation retire son activation. Réglages remis à 12 % et pulsation activée après le test.
- Apprendre : ouverture des chakras et sélection du cœur, Antahkarana, préceptes, Gasshō, positions, clôture, mudras et dépliage de la planche.
- Feuilletage des positions jusqu’à 14/14 ; bouton suivant désactivé à la dernière position.
- Formats tablette 768 × 1024 et bureau 1280 × 900 : vérification visuelle des fiches.
- Aucune erreur ou alerte dans les journaux du navigateur lors du contrôle.
- `node --check app.js` réussi.

## Limites

Pas de test sur téléphone physique, Safari mobile, lecteur d’écran ou exécution continue d’un soin de 22 minutes. Réduction des animations prise en compte dans le CSS, sans changement de la préférence système pendant le test. Sons toujours synthétiques. Aucun déploiement ni publication.

## Sources pour la fiche à approfondir

- https://himalayaninstitute.org/online/bandhas-and-mudras/ : uniquement les passages décrivant les gestes des mains en méditation et le confort de posture. Les exercices de bandhas de cette page ne sont pas repris.
- https://yogainternational.com/meditation/chakra-meditation/ : pratique de méditation intégrant les couleurs, noms et syllabes bīja ; ne valide pas chacune des associations de la planche fournie.

Les visuels de la planche sont cadrés en SVG au moment de l’affichage. Un filtre SVG atténue le blanc du papier ; aucun doigt ni placement des mains n’est redessiné. Les originaux restent conservés dans les assets.
