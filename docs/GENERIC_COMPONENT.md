# Composant Générique pour Pages Métier

## Vue d'ensemble

Ce document décrit l'architecture du composant générique `GenericBizPage` qui a été créé pour éliminer la duplication de code entre les différentes pages métier de l'application (changes, credits, guinee-credits, investments).

## Architecture

### 1. Composant Principal : `GenericBizPage`

**Fichier :** `src/components/GenericBizPage.tsx`

Le composant `GenericBizPage` est un composant réutilisable qui encapsule toute la logique commune aux pages métier :

- Gestion de l'état (loading, error, entities)
- Opérations CRUD (Create, Read, Update, Delete)
- Interface utilisateur (Header, EmptyState, ErrorComponent)
- Animations avec Framer Motion
- Modal d'ajout

### 2. Hook Personnalisé : `useBizPage`

**Fichier :** `src/hooks/use-biz-page.ts`

Le hook `useBizPage` encapsule toute la logique métier :

- Gestion de l'état local
- Appels API via le hook `useCrud`
- Gestion des erreurs
- Rechargement automatique des données

### 3. Configuration Centralisée

**Fichier :** `src/constants/pageConfigs.ts`

Toutes les configurations spécifiques à chaque page sont centralisées dans un objet `PAGE_CONFIGS` :

```typescript
export const PAGE_CONFIGS: Record<string, PageConfig> = {
  changes: {
    model: "changes",
    title: "Monnaies",
    buttonLabel: "Ajouter une Monnaie",
    // ...
  },
  // ...
};
```

## Interfaces TypeScript

### BizEntity

```typescript
export interface BizEntity {
  id: string;
  name: string;
  value: number;
  createdAt: Date;
  updatedAt?: Date;
}
```

### PageConfig

```typescript
export interface PageConfig {
  model: string;
  title: string;
  buttonLabel: string;
  addModalTitle: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
}
```

## Utilisation

### Page Simple

Pour créer une nouvelle page métier, il suffit maintenant de :

```typescript
"use client";

import GenericBizPage from "@/components/GenericBizPage";
import { PAGE_CONFIGS } from "@/constants/pageConfigs";

export default function MaNouvellePage() {
  return <GenericBizPage config={PAGE_CONFIGS["mon-modele"]} />;
}
```

### Ajout d'une Nouvelle Configuration

Pour ajouter une nouvelle page, il suffit d'ajouter sa configuration dans `pageConfigs.ts` :

```typescript
"mon-modele": {
  model: "mon-modele",
  title: "Mon Titre",
  buttonLabel: "Ajouter un Élément",
  addModalTitle: "Ajouter un élément",
  emptyStateTitle: "Aucun élément",
  emptyStateDescription: "Il n'y a actuellement aucun élément...",
},
```

## Avantages

### 1. Réduction de la Duplication de Code

- **Avant :** ~150 lignes par page
- **Après :** ~5 lignes par page
- **Réduction :** ~97% de code en moins

### 2. Maintenabilité

- Modifications centralisées dans un seul composant
- Configuration externalisée
- Logique métier séparée dans un hook

### 3. Cohérence

- Interface utilisateur uniforme
- Comportement identique sur toutes les pages
- Animations cohérentes

### 4. Extensibilité

- Facile d'ajouter de nouvelles pages
- Configuration flexible
- Hook réutilisable

## Pages Refactorisées

1. **Changes** (`src/app/(main)/changes/page.tsx`)
2. **Credits** (`src/app/(main)/credits/page.tsx`)
3. **Guinee-Credits** (`src/app/(main)/guinee-credits/page.tsx`)
4. **Investments** (`src/app/(main)/investments/page.tsx`)

## Fonctionnalités

### ✅ Implémentées

- [x] Affichage des entités avec animations
- [x] Ajout d'une nouvelle entité
- [x] Modification d'une entité existante
- [x] Suppression (déplacement vers l'historique)
- [x] Gestion des états de chargement
- [x] Gestion des erreurs
- [x] État vide avec message personnalisé
- [x] Animations fluides avec Framer Motion
- [x] Interface responsive

### 🔄 Extensions Possibles

- [ ] Filtrage et recherche
- [ ] Tri des entités
- [ ] Pagination
- [ ] Export des données
- [ ] Actions en lot
- [ ] Validation personnalisée
- [ ] Thèmes personnalisés

## Bonnes Pratiques

1. **Séparation des Responsabilités** : Logique métier dans le hook, UI dans le composant
2. **Configuration Externalisée** : Tous les textes et paramètres dans un fichier de config
3. **Type Safety** : Interfaces TypeScript pour tous les types
4. **Réutilisabilité** : Composant générique et hook personnalisé
5. **Maintenabilité** : Code centralisé et modulaire

## Tests

Pour tester le composant générique :

1. Vérifier que toutes les pages fonctionnent correctement
2. Tester les opérations CRUD sur chaque page
3. Vérifier la gestion des erreurs
4. Tester les animations
5. Vérifier la responsivité

## Conclusion

L'architecture générique mise en place permet une maintenance plus facile, une cohérence accrue et une extensibilité optimale pour l'ajout de nouvelles pages métier dans l'application.
