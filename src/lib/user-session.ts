import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest } from "next/server";

/**
 * Récupère l'ID utilisateur depuis la session côté serveur
 * @returns L'ID utilisateur ou null si non authentifié
 */
export async function getUserIdFromSession(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions);
    return session?.user?.id || null;
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);
    return null;
  }
}

/**
 * Récupère l'ID utilisateur depuis la session avec une requête
 * Alternative pour les API routes
 */
export async function getUserIdFromRequest(
  _req: NextRequest
): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions);
    return session?.user?.id || null;
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);
    return null;
  }
}

/**
 * Type pour l'utilisateur de session étendu
 */
export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
}

/**
 * Vérifie si l'utilisateur est authentifié et retourne ses informations
 * Lève une erreur si non authentifié
 */
export async function requireAuth(): Promise<SessionUser> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Authentication required");
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };
}

/**
 * Hook pour récupérer l'utilisateur côté client (à utiliser dans les composants)
 */
export function useSessionUser() {
  // Cette fonction sera utilisée côté client avec useSession de next-auth/react
  // Elle sera implémentée dans les composants qui en ont besoin
}
