# Sécurité et Authentification

## Vue d'ensemble

Ce projet utilise NextAuth.js pour l'authentification et un middleware personnalisé pour sécuriser les routes protégées.

## Routes Protégées

Les routes suivantes nécessitent une authentification :

- `/dashboard` - Tableau de bord principal
- `/credits` - Gestion des avoirs
- `/changes` - Gestion des monnaies
- `/guinee-credits` - Avoirs en Guinée
- `/investments` - Gestion des investissements

## Architecture de Sécurité

### 1. Middleware (middleware.ts)

Le middleware Next.js intercepte toutes les requêtes vers les routes protégées et vérifie l'authentification avant de permettre l'accès.

**Fonctionnalités :**

- Vérification automatique des tokens d'authentification
- Redirection vers `/auth/signin` si non authentifié
- Protection au niveau serveur

### 2. Composant ProtectedRoute

Protection côté client qui :

- Affiche un loader pendant la vérification de session
- Redirige automatiquement si non authentifié
- Appliqué automatiquement via le layout `(main)/layout.tsx`

### 3. Hook useAuth

Hook personnalisé qui centralise la logique d'authentification :

- Gestion des états de session
- Redirections automatiques
- Interface simplifiée pour les composants

### 4. Configuration Centralisée

Le fichier `src/lib/auth-config.ts` centralise :

- Liste des routes protégées
- Routes publiques
- Fonctions utilitaires
- Configuration des redirections

## Utilisation

### Protection Automatique

Toutes les pages dans le dossier `(main)` sont automatiquement protégées grâce au layout.

### Protection Manuelle

Pour protéger une page manuellement :

```tsx
import ProtectedRoute from "@/components/ProtectedRoute";

export default function MaPage() {
  return (
    <ProtectedRoute>
      <div>Contenu protégé</div>
    </ProtectedRoute>
  );
}
```

### Utilisation du Hook

```tsx
import { useAuth } from "@/hooks/use-auth";

export default function MonComposant() {
  const { isAuthenticated, isLoading, session } = useAuth();

  if (isLoading) return <div>Chargement...</div>;
  if (!isAuthenticated) return <div>Non autorisé</div>;

  return <div>Contenu pour utilisateur authentifié</div>;
}
```

### Déconnexion

```tsx
import LogoutButton from "@/components/LogoutButton";

<LogoutButton variant='destructive' />;
```

## Configuration

### Variables d'Environnement Requises

```env
NEXTAUTH_SECRET=votre_secret_jwt
NEXTAUTH_URL=http://localhost:3000
INTERNAL_AUTH_SECRET=votre_secret_interne
```

### Ajout de Nouvelles Routes Protégées

1. Ajouter la route dans `src/lib/auth-config.ts`
2. Ajouter la route dans `middleware.ts` (matcher)
3. Placer la page dans le dossier `(main)` ou utiliser `ProtectedRoute`

## Sécurité

- **Session courte** : 60 secondes par défaut
- **JWT** : Utilisation de tokens JWT pour l'authentification
- **Redirection sécurisée** : Redirection automatique vers la page de connexion
- **Protection multi-niveaux** : Middleware + composants + hooks

## Dépannage

### Problèmes Courants

1. **Session expirée** : L'utilisateur est automatiquement redirigé vers la connexion
2. **Boucle de redirection** : Vérifier que `/auth/signin` n'est pas dans les routes protégées
3. **Erreur de middleware** : Vérifier la configuration NextAuth dans `[...nextauth]/route.ts`
