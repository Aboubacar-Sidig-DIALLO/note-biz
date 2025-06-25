// Configuration des routes protégées
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/credits",
  "/changes",
  "/guinee-credits",
  "/investments",
] as const;

// Configuration des routes publiques
export const PUBLIC_ROUTES = ["/", "/auth/signin", "/auth/error"] as const;

// Fonction pour vérifier si une route est protégée
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

// Fonction pour vérifier si une route est publique
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

// Configuration des redirections
export const AUTH_REDIRECT = "/auth/signin";
export const DEFAULT_REDIRECT = "/dashboard";
