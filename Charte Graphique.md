# Charte Graphique
## Tournoi des Trois Rivières

> Version 1.0

---

# 1. Vision

Le site du **Tournoi des Trois Rivières** doit refléter :

- l'élégance des grands tournois de tennis ;
- un événement familial organisé dans un cadre naturel ;
- une interface moderne, épurée et intuitive ;
- une excellente lisibilité sur ordinateur, tablette et mobile.

Les maîtres mots sont :

- Élégance
- Simplicité
- Nature
- Tradition
- Modernité

---

# 2. Univers graphique

Inspirations :

- Wimbledon
- Roland-Garros
- Apple
- Notion
- Airbnb

Le design privilégie :

- beaucoup d'espace blanc ;
- une hiérarchie visuelle forte ;
- peu de couleurs mais bien utilisées ;
- des cartes élégantes ;
- une navigation très fluide.

---

# 3. Palette de couleurs

## Couleurs principales

| Nom | Hex | Usage |
|------|-----|-------|
| Vert principal | `#2E6B45` | Boutons, liens, éléments actifs |
| Vert foncé | `#1B3D2A` | Header, footer, titres |
| Beige | `#F7F4EC` | Fond principal |
| Blanc | `#FFFFFF` | Cartes |
| Gris clair | `#ECECEC` | Bordures |
| Gris texte | `#5C5C5C` | Texte secondaire |
| Or | `#B89646` | Badges, trophées |

---

## Couleurs fonctionnelles

| Etat | Couleur |
|-------|----------|
| Succès | `#27AE60` |
| Information | `#3A7BD5` |
| Avertissement | `#E7A928` |
| Erreur | `#D64545` |

---

# 4. Typographie

## Titres

Police :

```
Cormorant Garamond
```

Alternative :

```
Playfair Display
```

---

## Texte

Police :

```
Inter
```

Alternative :

```
Source Sans Pro
```

---

## Hiérarchie

| Élément | Taille |
|----------|---------|
| H1 | 48 px |
| H2 | 36 px |
| H3 | 28 px |
| H4 | 22 px |
| Texte | 18 px |
| Petit texte | 15 px |

---

# 5. Espacements

Grille de base :

```
8 px
```

Espacements recommandés

| Élément | Valeur |
|----------|---------|
| XS | 8 px |
| S | 16 px |
| M | 24 px |
| L | 32 px |
| XL | 48 px |
| XXL | 64 px |

---

# 6. Bordures

Rayons :

| Élément | Rayon |
|----------|--------|
| Boutons | 12 px |
| Cartes | 16 px |
| Fenêtres modales | 20 px |

---

# 7. Ombres

Carte

```css
box-shadow:
0 10px 30px rgba(0,0,0,.06);
```

Hover

```css
box-shadow:
0 18px 45px rgba(0,0,0,.12);
```

---

# 8. Boutons

## Primaire

Fond

```
#2E6B45
```

Texte

```
#FFFFFF
```

Hover

```
#245638
```

Transition

```
200 ms ease
```

---

## Secondaire

Fond transparent

Bordure

```
1px solid #2E6B45
```

Texte

```
#2E6B45
```

---

# 9. Cartes

Toutes les informations importantes doivent être présentées sous forme de cartes.

Exemple :

```
┌───────────────────────────┐

🎾 Murray

📍 La Morinais

🕒 Lundi 14h

👥 5 joueurs

───────────────

Voir →

└───────────────────────────┘
```

---

# 10. Icônes

Style :

- contour uniquement
- monochrome
- épaisseur 2 px

Icônes utilisées :

- 🎾 Tennis
- 🏆 Poule
- 📍 Terrain
- 🕒 Horaire
- 👤 Joueur
- 🏠 Adresse
- 📅 Planning

---

# 11. Navigation

Menu principal

```
Accueil

Planning

Poules

Terrains

Joueurs

Classements

Contact
```

Le menu reste fixe lors du défilement.

---

# 12. Style des tableaux

Éviter les tableaux HTML classiques.

Préférer :

- cartes
- accordéons
- listes responsives

Les tableaux ne sont utilisés que pour les exports PDF.

---

# 13. Responsive

Desktop

```
4 cartes par ligne
```

Tablette

```
2 cartes
```

Mobile

```
1 carte
```

---

# 14. Animations

Animations discrètes uniquement.

Autorisées :

- fade-in
- légère translation
- zoom 1.03
- changement d'ombre

Durée :

```
200 ms
```

Courbe :

```
ease
```

---

# 15. Composants

Le design system comprend :

- Boutons
- Cartes
- Badges
- Chips
- Alertes
- Accordéons
- Formulaires
- Menus
- Modales
- Tooltips
- Pagination

---

# 16. Style des pages

## Accueil

Grande bannière

Présentation

Accès rapide :

- Planning
- Poules
- Terrains

---

## Planning

Vue calendrier

Filtres :

- Jour
- Terrain
- Poule

---

## Terrain

Grande photo

Adresse

Google Maps

Poules

Navigation

---

## Poule

Carte de présentation

Liste des joueurs

Classement

Matchs

---

# 17. Variables CSS

```css
:root {

--color-primary:#2E6B45;
--color-primary-dark:#1B3D2A;

--color-secondary:#B89646;

--color-background:#F7F4EC;

--color-surface:#FFFFFF;

--color-border:#ECECEC;

--color-text:#202124;

--color-text-light:#5C5C5C;

--radius-small:12px;
--radius-medium:16px;
--radius-large:20px;

--shadow:
0 10px 30px rgba(0,0,0,.06);

}
```

---

# 18. Ton visuel

Le site doit donner l'impression :

- d'un tournoi prestigieux ;
- d'une organisation professionnelle ;
- d'un environnement chaleureux ;
- d'un produit moderne.

Le design doit rester minimaliste, aéré et intemporel.

---

Version : **1.0**