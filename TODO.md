# TODO — Mahjong Chill

## Phase 1 — Setup & Core Logic
- [ ] Init projet Vite + TypeScript + PixiJS + Tone.js
- [ ] Structure des dossiers (`core/`, `rendering/`, `audio/`, `ui/`)
- [ ] Définir les types de tuiles Mahjong (TileSet) — 144 tuiles, 36 types × 4 copies
- [ ] Définir le format de données pour les layouts (grille 3D : col, row, layer)
- [ ] Implémenter le layout Shanghai (pyramide classique)
- [ ] Logique du Board : placement des tuiles, état de la partie
- [ ] Détection tuile jouable (libre à gauche ou droite + non recouverte)
- [ ] Sélection + matching de deux tuiles identiques
- [ ] Détection victoire (plateau vide)
- [ ] Détection défaite (aucun move possible)
- [ ] Solver : génération de plateau toujours soluble (placement inversé par paires)
- [ ] Undo (historique des coups)
- [ ] Hint (trouver une paire jouable)
- [ ] Shuffle (mélanger les tuiles restantes, max 3 par partie)

## Phase 2 — Rendu PixiJS
- [ ] Setup PixiJS (canvas, stage, resize responsive)
- [ ] TileSprite : rendu d'une tuile (coins arrondis, ombre douce, symbole)
- [ ] Dessiner les 36 symboles Mahjong (trait fin, style ligne)
- [ ] Rendu du plateau complet avec profondeur (empilement visuel)
- [ ] Distinction visuelle tuile jouable vs non jouable (opacity)
- [ ] Animation sélection (montée + highlight pastel)
- [ ] Animation match (fade out + pop + particules)
- [ ] Animation hint (pulsation lente scale 1.0 → 1.03)
- [ ] Animation shuffle (tuiles qui volent et se replacent)
- [ ] Animation victoire (confettis pastel flottants)
- [ ] Animation défaite (vibration légère du plateau)
- [ ] ParticleSystem pour les effets match / victoire

## Phase 3 — Sound Design (Tone.js)
- [ ] Init SoundEngine avec lazy-load AudioContext (après premier clic)
- [ ] Son sélection tuile (note courte pentatonique, reverb)
- [ ] Son match (accord deux notes harmoniques montantes)
- [ ] Son combo (notes qui montent en gamme à chaque combo rapide)
- [ ] Son déselection (note descendante, neutre)
- [ ] Son hint (tintement doux)
- [ ] Son shuffle (swoosh + notes éparses)
- [ ] Son victoire (mélodie pentatonique ascendante 4-5 notes)
- [ ] Son défaite (deux notes descendantes, graves, douces)
- [ ] Drone ambiant optionnel
- [ ] Toggle son ON/OFF + volume global

## Phase 4 — UI & Écrans
- [ ] Menu principal (titre, bouton Play, accès layouts / réglages)
- [ ] HUD en jeu (Undo, Hint, Shuffle, compteur paires restantes, Menu)
- [ ] Écran victoire (overlay, score, confettis, Rejouer / Menu)
- [ ] Écran défaite (overlay, options Shuffle / Rejouer)
- [ ] Panel réglages (Son, Mode Chrono, Sélection couleur pastel)
- [ ] Sélection de layout (avec difficulté + verrouillage)
- [ ] Typographie : intégrer une font sans-serif (DM Sans / Nunito / Plus Jakarta Sans)
- [ ] Boutons ronds, icônes ligne, style cohérent avec la DA

## Phase 5 — Layouts supplémentaires
- [ ] Layout Tortoise
- [ ] Layout Dragon
- [ ] Layout Fortress
- [ ] Layout Mini (36 tuiles)
- [ ] Système de déverrouillage par victoires

## Phase 6 — Polish & Juice
- [ ] Sets de couleurs pastel (Rose, Sauge, Ciel, Pêche, Lavande)
- [ ] Système de combo visuel + sonore
- [ ] Mode Chrono optionnel
- [ ] Peaufiner toutes les animations (easing, timing)
- [ ] Peaufiner tous les sons (mix, reverb, enveloppes)
- [ ] Micro-feedbacks sur chaque interaction

## Phase 7 — QA & Déploiement
- [ ] Tests sur desktop (Chrome, Firefox, Edge)
- [ ] Tests responsive / mobile
- [ ] Optimisation performances (draw calls, mémoire)
- [ ] Intégration CrazyGames SDK
- [ ] Build final + déploiement
