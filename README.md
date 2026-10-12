# Mon Reiki — prototype personnel

## Expérience actuelle

L'application occupe tout l'écran, avec un fond ivoire et rose continu. L'ouverture assemble des couches indépendantes : lavis, lumière, illustration PNG transparente, titre « Mon Reiki » révélé par un masque de tracé SVG, et bouton rond respirant « Entrer ». La police de pinceau Kaushan Script est hébergée localement sous licence OFL.

Un toucher déclenche une ondulation et, si le navigateur le prend en charge, une vibration courte. L'ouverture monte pendant que le parcours arrive depuis le bas. Elle est ensuite retirée du document : aucun défilement ni bouton interne ne permet d'y retourner. Une nouvelle ouverture ou un rechargement de l'application rejoue le démarrage.

Le premier écran contient un chemin de 21 étapes, le jour courant (1/21 au départ), et une seule action principale « Suivre mon programme ». Le carrousel plein écran permet de passer à « Me centrer » et « Apprendre » en glissant horizontalement. Les chevrons discrets, les flèches du clavier et le défilement horizontal au pavé tactile assurent des alternatives.

## Programme

Après la préparation (1, 2, 3 ou 5 minutes par position), 27 étapes fixes s'enchaînent :

1. Gasshō, 5 préceptes et phrase personnelle — 1 minute.
2. Les 7 chakras, avec un symbole à son emplacement — durée choisie chacun.
3. Les 14 positions de la planche fournie — durée choisie chacune.
4. Clôture : 8 / cacahuète (10 s), remontée et nœud (8 s), lissage (8 s), Kenyoku (8 s), lavage (8 s).

La durée complète est de 22 min 42 s avec une minute par position. Le son de bol accompagne les transitions. Pause, passage manuel, sortie et silence sont disponibles. Les images sont affichées entières et le fond se teinte suivant le chakra actif.

Le compteur se conserve localement dans le navigateur, une journée accomplie au maximum par date locale. Un jour manqué ne remet rien à zéro. Le jour 21 affiche des félicitations. Les clés mon-reiki.completed-days et mon-reiki.last-day conservent le nombre et la dernière date de validation ; aucune donnée n'est envoyée.

## Ce qui reste provisoire

- Cinq musiques locales et le bol fourni sont disponibles dans Paramètres. Pas de YouTube. Les fichiers sont lus dans leur accordage original, sans conversion de fréquence.
- Pas encore de notifications, de compte ou de synchronisation. L'installation PWA est prête ; elle nécessite une adresse HTTPS sur téléphone (ou localhost pour les essais sur ordinateur).
- La nouvelle planche aquarelle fournie remplace les anciennes positions. Les 14 poses et Gasshō sont isolés visuellement, sans redessiner les mains.
- Significations, gestes et formulations à harmoniser avec l'enseignement reçu ; la phrase personnelle est présentée comme une intention du rituel.
- Antahkaranas Yin/Yang et PDF déjà accessibles dans Apprendre ; fiches explicatives encore provisoires.
- Navigation tactile et vibration à valider sur un téléphone physique.
- Aucune publication du site. Le prototype reste accessible localement sur http://127.0.0.1:4173/.

## Organisation

index.html et app.js portent les écrans et leurs comportements. experience.css définit la nouvelle expérience immersive ; les feuilles précédentes conservent les styles des fiches et des composants. L'illustration originale est assets/visuals/meditation-layer-v3.png. Son prompt et sa provenance sont dans assets/visuals/creation-v3.md.

## Révision visuelle v4

- Figure ivoire transparente pour les chakras, indépendante du fond et du symbole actif (`assets/visuals/chakra-body-v4.png`). Prompt : `assets/visuals/provenance-v4.md`.
- La lumière et les paramètres de la révision v4 ont été remplacés par la révision v5 ci-dessous.
- `harmony.css` unifie Apprendre et ses fiches : chakras interactifs, préceptes, Antahkarana, Gasshō, 14 positions consultables et aide-mémoire de clôture.
- Fiche Mudras & sons préparatoire, illustration originale accessible avec son crédit et deux sources de tradition identifiées. Aucune efficacité thérapeutique ni correspondance universelle n’est affirmée. La fiche n’ajoute aucune étape au programme.
- Les anciennes préférences `mon-reiki.light` et `mon-reiki.pulse` ne sont plus lues ni proposées.

## Révision v5 — sons et stabilité

Paramètres est accessible par le bouton discret en haut de l’écran et depuis la préparation du soin. Cinq cartes de paysages pastel permettent de sélectionner une musique et de l’écouter. Musique et bol ont chacun leur volume. Le choix Silence coupe seulement la musique ; le bol reste actif à son volume choisi.

Les trois lecteurs HTML `ambient-audio`, `bowl-audio`, `preview-audio` sont indépendants. La musique de séance boucle nativement avec `loop`, jusqu’à l’arrêt ou la fin du soin. Une pause interrompt la musique et le bol ; reprendre continue la musique au même point. Couper le son arrête les deux. Quitter remet les lecteurs de séance à zéro. Les aperçus s’arrêtent en quittant Paramètres. Les fichiers ne sont chargés qu’à la demande.

Le bol est le WAV « MUSCInst_Bol tibetain frappe 2 (ID 2553)_LaSonotheque.fr.wav », copié sous `assets/audio/bol-tibetain-2553.wav`. Les cinq MP3 gardent leurs noms originaux dans `assets/audio/`. Leurs droits devront être vérifiés avant une éventuelle diffusion publique ; aucune publication n’a été faite.

Préférences locales : `mon-reiki.music`, `mon-reiki.music-volume`, `mon-reiki.bowl-volume`. Défauts : Piano zen, musique 35 %, bol 60 %.

Le cadrage des sept chakras est fixe : hauteur de texte réservée, même nœud image conservé, aucune animation sur la silhouette. Le symbole transparent respire avec un halo circulaire diffus (cycle de 6 secondes) ; la couleur suit le chakra, sans réglage utilisateur. Pause et réduction des mouvements immobilisent ces animations.

La fiche Mudras utilise les références de recherche pour donner un premier geste concret, sans panneau de liens à lire. Les références de travail sont conservées dans `VERIFICATION-v4.md` ; elles ne sont plus affichées dans l’interface.

## Installation sur téléphone

L'application possède un manifeste, un mode autonome, une icône dédiée et un service worker. Après sa mise en ligne sur une adresse HTTPS :

- Android / Chrome : ouvrir le menu puis « Installer l'application » ; un bouton « Installer » peut aussi apparaître dans Paramètres.
- iPhone / Safari : toucher Partager puis « Sur l'écran d'accueil ».

L'interface principale et ses illustrations essentielles sont mises en cache pour le hors-ligne. Les musiques, plus lourdes, sont ajoutées au cache après leur première lecture. Une nouvelle version du code remplace automatiquement l'ancien cache au prochain chargement.

Le dépôt GitHub conserve le code et les futures mises à jour, mais ne rend pas à lui seul l'application installable depuis un téléphone : il faudra ensuite choisir un hébergement HTTPS privé ou public.
