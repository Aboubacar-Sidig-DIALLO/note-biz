# 🚀 Guide de Migration - Isolation des Données par Utilisateur

## Vue d'ensemble

Ce guide vous accompagne dans la migration pour lier toutes les données (credits, changes, investments, guineeCredits) aux comptes utilisateurs spécifiques.

## ⚠️ IMPORTANT - Sauvegarde

Avant de commencer, **sauvegardez votre base de données** :

```bash
# PostgreSQL
pg_dump your_database_name > backup_$(date +%Y%m%d_%H%M%S).sql
```

## 📋 Étapes de Migration

### 1. Installation des dépendances manquantes

```bash
npm install dotenv bcryptjs
npm install -D @types/bcryptjs
```

### 2. Variables d'environnement

Ajoutez à votre fichier `.env` :

```env
# Utilisateur par défaut pour la migration des données existantes
DEFAULT_USER_EMAIL=admin@notebiz.com
DEFAULT_USER_PIN=123456
```

### 3. Génération du client Prisma mis à jour

```bash
npx prisma generate
```

### 4. Création et exécution de la migration

```bash
npx prisma migrate dev --name add_user_relations
```

### 5. Migration des données existantes

```bash
npx tsx scripts/migrate-existing-data.ts
```

### 6. Vérification de la migration

```bash
npx prisma studio
# Vérifiez que tous les enregistrements ont maintenant un userId
```

## 📊 Changements apportés

### Modèles Prisma

- ✅ Ajout de `userId` à tous les modèles principaux et d'historique
- ✅ Relations `User` ↔ `Changes/credits/Investments/GuineeCredits`
- ✅ Index sur `userId` pour les performances
- ✅ `onDelete: Cascade` pour la cohérence des données

### Services CRUD

- ✅ Filtrage automatique par utilisateur connecté
- ✅ Vérification d'authentification dans toutes les méthodes
- ✅ Isolation complète des données entre utilisateurs
- ✅ Méthodes admin pour la gestion multi-utilisateurs

### Authentification

- ✅ Types NextAuth étendus avec `userId`
- ✅ Utilitaires de session serveur et client
- ✅ Hook React `useSessionUser()` pour les composants

## 🔧 Nouveaux Utilitaires

### Côté Serveur

```typescript
import { getUserIdFromSession, requireAuth } from "@/lib/user-session";

// Dans une API route
const userId = await getUserIdFromSession();
const user = await requireAuth(); // Lève une erreur si non auth
```

### Côté Client

```typescript
import { useSessionUser } from "@/hooks/use-session-user";

function MonComposant() {
  const { userId, user, isAuthenticated } = useSessionUser();
  // ...
}
```

## 🔒 Sécurité améliorée

### Isolation des données

- Chaque utilisateur ne voit que ses propres données
- Impossibilité d'accéder aux données d'autres utilisateurs
- Suppression en cascade si un utilisateur est supprimé

### Performance

- Index sur `userId` pour des requêtes rapides
- Requêtes filtrées automatiquement
- Pas de surcharge pour l'authentification

## 🧪 Tests recommandés

### 1. Test d'isolation

```bash
# Créer un nouvel utilisateur via l'API
curl -X POST http://localhost:3000/api/user/new \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","pin":"654321","name":"Test User"}'

# Se connecter avec ce nouvel utilisateur
# Vérifier qu'il ne voit aucune donnée existante
```

### 2. Test de migration

```bash
# Vérifier que l'utilisateur par défaut voit toutes les anciennes données
# Se connecter avec DEFAULT_USER_PIN
```

## 🚨 Résolution de problèmes

### Erreur "Utilisateur non authentifié"

- Vérifiez que la session NextAuth fonctionne
- Vérifiez que l'utilisateur a bien un `id` dans la session

### Données manquantes après migration

- Vérifiez les logs du script de migration
- Utilisez `npx prisma studio` pour inspecter la base

### Erreurs de types TypeScript

- Exécutez `npx prisma generate` après la migration
- Redémarrez votre serveur de développement

## 📈 Prochaines étapes possibles

### Gestion multi-utilisateurs avancée

- Interface admin pour voir tous les utilisateurs
- Statistiques globales pour les administrateurs
- Gestion des permissions granulaires

### Optimisations

- Cache Redis pour les sessions utilisateur
- Pagination des données utilisateur
- Soft delete avec archivage

## ✅ Validation de la migration

Après migration, vérifiez que :

- [ ] Tous les modèles ont un champ `userId` non nul
- [ ] L'utilisateur par défaut peut voir les anciennes données
- [ ] Les nouveaux utilisateurs voient une interface vierge
- [ ] Les APIs CRUD fonctionnent avec l'isolation
- [ ] L'historique est correctement filtré par utilisateur

## 🔄 Rollback (si nécessaire)

En cas de problème, vous pouvez revenir en arrière :

```bash
# Restaurer la base de données
psql your_database_name < backup_YYYYMMDD_HHMMSS.sql

# Revenir au commit précédent
git reset --hard HEAD~1
```

---

💡 **Astuce** : Testez d'abord sur un environnement de développement avec une copie de vos données de production.
