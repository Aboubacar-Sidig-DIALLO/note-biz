import { headers } from "next/headers";

// Middleware pour vérifier l'authentification interne
export async function verifyInternalAuth() {
  const headersList = await headers();
  const internalAuth = headersList.get("x-internal-auth");
  const expectedAuth = process.env.INTERNAL_AUTH_SECRET;

  if (internalAuth !== expectedAuth) {
    throw new Error("Non autorisé");
  }
}
