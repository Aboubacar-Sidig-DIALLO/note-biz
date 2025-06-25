# Système CRUD Générique

Ce document explique comment utiliser le système CRUD générique mis en place pour votre application.

## Architecture

Le système est composé de plusieurs éléments :

1. **Service générique** (`src/lib/services/generic-crud.service.ts`)
2. **API routes dynamiques** (`src/app/api/crud/[model]/route.ts`)
3. **Hook personnalisé** (`src/hooks/use-crud.ts`)
4. **Tables d'historique** dans la base de données

## Fonctionnalités

### ✅ Opérations CRUD complètes

- **CREATE** : Créer un nouvel enregistrement
- **READ** : Récupérer tous les enregistrements ou un enregistrement spécifique
- **UPDATE** : Mettre à jour un enregistrement existant
- **DELETE** : Suppression définitive ou déplacement vers l'historique

### ✅ Système d'historique

- Chaque modèle a sa table d'historique correspondante
- Possibilité de déplacer les données vers l'historique avant suppression
- Historique simple avec les données essentielles

### ✅ Modèles supportés

- `changes` : Monnaies
- `credits` : Avoirs
- `investments` : Investissements
- `guinee-credits` : Avoirs en Guinée

## Structure des modèles

### Modèles principaux

Tous les modèles ont la même structure de base :

```typescript
interface BaseModel {
  id: string;
  name: string;
  value: number;
  createdAt: Date;
  updatedAt?: Date;
}
```

### Tables d'historique

Les tables d'historique contiennent :

```typescript
interface HistoryModel {
  id: string;
  name: string;
  value: number;
  createdAt: Date;
}
```

## Utilisation

### 1. Dans un composant React

```typescript
import { useCrud } from "@/hooks/use-crud";

interface MonModele {
  id: string;
  name: string;
  value: number;
  createdAt: Date;
  updatedAt?: Date;
}

function MonComposant() {
  const {
    loading,
    error,
    create,
    findAll,
    update,
    delete: deleteRecord,
  } = useCrud<MonModele>();

  // Charger tous les enregistrements
  const loadData = async () => {
    const response = await findAll({ model: "changes" });
    if (response.success && response.data) {
      console.log(response.data);
    }
  };

  // Créer un nouvel enregistrement
  const handleCreate = async () => {
    const response = await create({
      model: "changes",
      data: {
        name: "Nouveau nom",
        value: 100,
      },
    });
  };

  // Mettre à jour un enregistrement
  const handleUpdate = async (id: string) => {
    const response = await update({
      model: "changes",
      id,
      data: {
        name: "Nom modifié",
        value: 200,
      },
    });
  };

  // Supprimer définitivement
  const handleDelete = async (id: string) => {
    const response = await deleteRecord({
      model: "changes",
      id,
    });
  };

  // Déplacer vers l'historique
  const handleMoveToHistory = async (id: string) => {
    const response = await deleteRecord({
      model: "changes",
      id,
      moveToHistory: true,
    });
  };

  return (
    <div>
      {loading && <p>Chargement...</p>}
      {error && <p>Erreur: {error}</p>}
      {/* Votre interface utilisateur */}
    </div>
  );
}
```

### 2. Appels API directs

#### Récupérer tous les enregistrements

```bash
GET /api/crud/changes
```

#### Récupérer un enregistrement spécifique

```bash
GET /api/crud/changes?id=123
```

#### Créer un nouvel enregistrement

```bash
POST /api/crud/changes
Content-Type: application/json

{
  "name": "Nouveau nom",
  "value": 100
}
```

#### Mettre à jour un enregistrement

```bash
PUT /api/crud/changes?id=123
Content-Type: application/json

{
  "name": "Nom modifié",
  "value": 200
}
```

#### Supprimer définitivement

```bash
DELETE /api/crud/changes?id=123
```

#### Déplacer vers l'historique

```bash
DELETE /api/crud/changes?id=123&moveToHistory=true
```

### 3. Gestion de l'historique

#### Récupérer tout l'historique

```bash
GET /api/crud/changes/history
```

## Avantages du système

### 🔄 Réutilisabilité

- Un seul service pour tous les modèles
- API routes dynamiques
- Hook React réutilisable

### 📊 Simplicité

- Modèles simplifiés et cohérents
- Structure de données uniforme
- API intuitive

### 🛡️ Flexibilité

- Choix entre suppression définitive et historique
- Gestion d'erreurs centralisée
- Validation des données

### 🚀 Performance

- Requêtes optimisées
- Structure de base de données simple
- Cache côté client

## Migration des données existantes

Si vous avez des données existantes, elles seront automatiquement compatibles avec le nouveau système. Les nouveaux champs (`updatedAt`) auront des valeurs par défaut.

## Exemple complet

Voici un exemple complet d'utilisation dans une page :

```typescript
"use client";

import { useState, useEffect } from "react";
import { useCrud } from "@/hooks/use-crud";

interface GuineeCredit {
  id: string;
  name: string;
  value: number;
  createdAt: Date;
  updatedAt?: Date;
}

export default function GuineeCreditsPage() {
  const [credits, setCredits] = useState<GuineeCredit[]>([]);
  const { loading, error, create, findAll, update } = useCrud<GuineeCredit>();

  useEffect(() => {
    loadCredits();
  }, []);

  const loadCredits = async () => {
    const response = await findAll({ model: "guinee-credits" });
    if (response.success && response.data) {
      setCredits(response.data);
    }
  };

  const handleAdd = async (data: { name: string; value: number }) => {
    const response = await create({
      model: "guinee-credits",
      data,
    });

    if (response.success) {
      await loadCredits();
    }
  };

  const handleUpdate = async (id: string, data: Partial<GuineeCredit>) => {
    const response = await update({
      model: "guinee-credits",
      id,
      data,
    });

    if (response.success) {
      await loadCredits();
    }
  };

  return (
    <div>
      <h1>Avoirs en Guinée</h1>

      {loading && <p>Chargement...</p>}
      {error && <p>Erreur: {error}</p>}

      {credits.map((credit) => (
        <div key={credit.id}>
          <span>{credit.name}</span>
          <span>{credit.value}</span>
          <button
            onClick={() =>
              handleUpdate(credit.id, { value: credit.value + 100 })
            }>
            +100
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Support

Pour toute question ou problème avec le système CRUD générique, consultez :

1. Les logs de la console pour les erreurs
2. La documentation Prisma pour les requêtes
3. Les types TypeScript pour la validation
