# Vérification v6 — application installable

Date : 12 octobre 2026

## Ajouts

- Manifeste PWA en français, affichage autonome et orientation portrait.
- Icône lotus dédiée : 180 px pour iPhone, 192 et 512 px pour Android, plus une version 512 px plein cadre pour les masques Android.
- Service worker avec cache versionné de l'interface et des illustrations essentielles.
- Cache progressif des fichiers audio après leur première lecture.
- Aide d'installation adaptée : bouton natif quand le navigateur le propose, consigne Safari sur iPhone sinon.

## Contrôles effectués

- `app.js` et `service-worker.js` passent `node --check`.
- `manifest.webmanifest` est un JSON valide et servi en `application/manifest+json`.
- Les 24 fichiers déclarés dans le cache essentiel existent.
- Page, manifeste, service worker et quatre icônes répondent en HTTP 200 sur le serveur local.
- Le navigateur charge le lien du manifeste et l'icône Apple, affiche l'aide d'installation et ne remonte aucune erreur ni aucun avertissement console.
- Les dimensions des icônes générées correspondent à 180 × 180, 192 × 192 et 512 × 512.

## Limite connue

Le comportement d'installation n'est pas validé sur un téléphone physique. Une installation réelle depuis un téléphone exigera une adresse HTTPS ; le serveur local `127.0.0.1` n'est accessible que depuis l'ordinateur.
