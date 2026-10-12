# Déploiement privé

## Adresse d'installation

`https://macmini-olivier.tail9ef6d6.ts.net:8457/`

Cette adresse est réservée au réseau Tailscale d'Olivier. Aucun Tailscale Funnel n'est activé et l'application n'est pas exposée sur Internet.

## Architecture

- Copie servie : `/srv/macmini/apps/mon-reiki`
- Service utilisateur : `mon-reiki.service`
- Écoute locale : `127.0.0.1:8788`
- Route Tailscale Serve : HTTPS `8457` vers `http://127.0.0.1:8788`
- Source et mises à jour : dépôt GitHub privé `comptepromlcouture-cpu/mon-reiki-app`

## Mise à jour

Après une modification validée, synchroniser le contenu du projet vers `/srv/macmini/apps/mon-reiki`, sans copier le dossier `.git`. Le service Python sert les fichiers immédiatement ; le changement de version du cache dans `service-worker.js` permet à l'application installée de récupérer la nouvelle version.

## Installation Android

1. Activer Tailscale sur le téléphone.
2. Ouvrir l'adresse HTTPS dans Chrome.
3. Menu ⋮ → « Installer l'application » ou « Ajouter à l'écran d'accueil ».
4. Accepter l'installation de « Mon Reiki ».

Le Mac mini et Tailscale doivent rester disponibles. Le fonctionnement hors ligne prend le relais pour les éléments déjà mis en cache.
