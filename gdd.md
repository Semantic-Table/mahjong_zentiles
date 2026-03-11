# GDD — Mahjong Chill
**Genre** : Puzzle / Casual  
**Plateforme** : Browser (CrazyGames), Mobile-ready  
**Stack** : TypeScript + PixiJS  
**Statut** : En développement  

---

## 1. Vision

Un Mahjong Solitaire moderne, épuré et sensoriel. Pas de surcharge visuelle, pas de timer stressant par défaut — juste le plaisir pur du matching, amplifié par un sound design génératif et une identité visuelle douce et cohérente.

L'objectif est de créer un jeu qu'on ouvre pour décompresser, et qu'on referme en se sentant bien.

---

## 2. Gameplay Core

### 2.1 Règles classiques
- 144 tuiles disposées en pyramide (layout Shanghai classique + variantes)
- Une tuile est **jouable** si elle est libres sur au moins un côté gauche ou droit, et non recouvertes par une autre tuile
- Le joueur sélectionne deux tuiles identiques et jouables pour les retirer
- La partie est gagnée quand toutes les tuiles sont retirées
- La partie est perdue quand aucun move n'est possible

### 2.2 Twists modernes
- **Pas de timer par défaut** (mode Zen) — un mode Chrono optionnel pour les joueurs qui le veulent
- **Undo illimité** — on ne punit pas l'erreur, on encourage l'exploration
- **Hint subtil** — après 15 secondes d'inactivité, deux tuiles matchables pulsent légèrement
- **Shuffle** — si aucun move n'est possible, le joueur peut mélanger les tuiles restantes (max 3 fois par partie)

---

## 3. Identité Visuelle

### 3.1 Direction artistique
Minimalisme chaleureux. Inspiré de l'esthétique mobile premium (*Good Sudoku*, *Monument Valley*). Chaque élément visuel doit avoir de l'air autour de lui.

### 3.2 Palette de couleurs
| Rôle | Couleur |
|---|---|
| Fond | Blanc cassé `#FAFAF8` |
| Tuile de base | Blanc `#FFFFFF` avec ombre douce |
| Tuile sélectionnée | Accent pastel (couleur selon le set actif) |
| Tuile non jouable | Légèrement grisée, `opacity: 0.5` |
| UI / Boutons | Gris doux `#E8E8E4`, coins très arrondis |

**Sets de couleurs pastel (débloquables ou sélectionnables) :**
- 🌸 Rose — `#F7C5D0`
- 🌿 Sauge — `#C5DBC8`
- 🌊 Ciel — `#C5D8F7`
- 🍑 Pêche — `#F7DFC5`
- 🪻 Lavande — `#D8C5F7`

### 3.3 Tuiles
- Coins très arrondis (`border-radius` généreux)
- Ombre douce multi-couche pour simuler la profondeur des tuiles empilées
- Symboles Mahjong redessinés — trait fin, style ligne, pas de remplissage lourd
- Légère élévation visuelle pour les tuiles jouables vs non jouables

### 3.4 Animations
| Événement | Animation |
|---|---|
| Sélection d'une tuile | Légère montée + highlight pastel |
| Match réussi | Tuiles qui s'effacent avec un *pop* doux + particules minuscules |
| Hint | Pulsation lente et douce (scale 1.0 → 1.03) |
| Shuffle | Tuiles qui volent et se replacent, aléatoire et organique |
| Victoire | Pluie de confettis pastel, lente et flottante |
| Aucun move disponible | Légère vibration de l'ensemble du plateau |

---

## 4. Sound Design

Tout le son est **génératif** — aucun asset audio externe.

### 4.1 Principes
- Tonalités douces, échelle **pentatonique** (naturellement agréable, jamais dissonant)
- Synthèse web avec **Tone.js** (oscillateurs, reverb, enveloppes)
- Chaque action a son propre caractère sonore, distinctif mais cohérent

### 4.2 Sons par action
| Action | Son |
|---|---|
| Sélection tuile | Note courte, douce, légèrement réverbérée |
| Match | Accord de deux notes harmoniques montantes |
| Combo (plusieurs matchs rapides) | Notes qui montent en gamme à chaque combo |
| Déselection | Note courte descendante, neutre |
| Hint | Très léger tintement doux |
| Shuffle | Swoosh doux + quelques notes éparses aléatoires |
| Victoire | Petite mélodie pentatonique ascendante (4-5 notes) |
| Défaite / blocage | Deux notes descendantes, graves mais douces |
| Ambiance | Drone très léger en fond, optionnel |

### 4.3 Contrôles son
- Toggle Son ON/OFF (bouton discret, coin UI)
- Volume unique global
- Son activé par défaut

---

## 5. Layouts & Progressions

### 5.1 Layouts disponibles
| Nom | Description | Difficulté |
|---|---|---|
| Shanghai | Pyramide classique, 144 tuiles | ⭐⭐ |
| Tortoise | Forme de tortue, plus dense | ⭐⭐⭐ |
| Dragon | Longue forme serpentine | ⭐⭐⭐ |
| Fortress | Forme de forteresse, très dense | ⭐⭐⭐⭐ |
| Mini | 36 tuiles, idéal pour une partie rapide | ⭐ |

### 5.2 Progression
- Les layouts se débloquent au fil des victoires
- Pas de monnaie, pas de méta-progression lourde — juste débloquer plus de puzzles
- Chaque layout peut être rejoué à l'infini (seeds aléatoires)

---

## 6. UI / UX

### 6.1 Écrans
- **Menu principal** : fond blanc, nom du jeu en typographie fine, bouton Play central, accès aux layouts et aux réglages
- **Plateau de jeu** : plateau centré, UI minimaliste en bas (Undo, Hint, Shuffle, Score/Temps, Menu)
- **Victoire** : overlay doux, score, confettis, bouton Rejouer / Menu
- **Réglages** : panel latéral glissant — Son, Mode Chrono, Sélection de couleur

### 6.2 Éléments UI
- Boutons **ronds** ou très arrondis, icônes simples (ligne)
- Typographie : sans-serif léger type *DM Sans*, *Nunito* ou *Plus Jakarta Sans*
- Hiérarchie visuelle douce — rien ne crie, tout guide

### 6.3 Responsive
- Conçu pour desktop (CrazyGames) mais layout adaptatif pour mobile
- Tuiles redimensionnées selon la taille de l'écran
- Touch-friendly (tap pour sélectionner)

---

## 7. Stack Technique

| Élément | Technologie |
|---|---|
| Langage | TypeScript |
| Rendu | PixiJS (2D, WebGL) |
| Son | Tone.js (synthèse génératif) |
| Build | Vite |
| Déploiement | CrazyGames SDK |

### Architecture modulaire
```
src/
├── core/
│   ├── Board.ts          # Logique plateau, tuiles, règles
│   ├── TileSet.ts        # Définition et génération des tuiles
│   └── Solver.ts         # Vérification si partie soluble
├── rendering/
│   ├── BoardRenderer.ts  # Rendu PixiJS du plateau
│   ├── TileSprite.ts     # Sprite + animations d'une tuile
│   └── ParticleSystem.ts # Particules match / victoire
├── audio/
│   └── SoundEngine.ts    # Synthèse Tone.js, tous les sons
├── ui/
│   ├── HUD.ts            # Boutons Undo / Hint / Shuffle
│   └── Screens.ts        # Menu, Victoire, Réglages
└── main.ts
```

---

## 8. Estimation de développement

| Phase | Contenu | Durée estimée |
|---|---|---|
| Setup & Core Logic | Board, règles, matching, solver | 2 jours |
| Rendu PixiJS | Tuiles, layouts, animations de base | 2 jours |
| Sound Design | SoundEngine, tous les sons Tone.js | 1 jour |
| UI & Écrans | Menu, HUD, Victoire, Réglages | 1.5 jours |
| Polish & Juice | Particules, animations avancées, feedback | 1.5 jours |
| QA & CrazyGames | Tests, SDK, optimisation | 1 jour |
| **Total** | | **~9 jours** |

---

## 9. Ce qui le rendra spécial

- **L'absence de stress** comme feature — pas de timer par défaut, undo illimité
- **Le sound design génératif** — aucun autre jeu browser Mahjong ne fait ça bien
- **L'identité visuelle cohérente** — tout est dans le même registre, du menu aux particules
- **Le juice sur les petits moments** — le match parfait, le combo, la victoire... chaque micro-moment est soigné

---

*GDD v1.0 — Mars 2026*