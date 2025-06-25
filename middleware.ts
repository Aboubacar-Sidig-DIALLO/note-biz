import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { PROTECTED_ROUTES, AUTH_REDIRECT } from "@/lib/auth-config";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Vérifier si l'utilisateur essaie d'accéder à une route protégée
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedRoute) {
      // Le middleware s'exécute seulement si l'utilisateur est authentifié
      // grâce à withAuth
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Vérifier si l'utilisateur a un token valide
        return !!token;
      },
    },
    pages: {
      signIn: AUTH_REDIRECT,
    },
  }
);

// Configurer les routes protégées
export const config = {
  matcher: [
    "/dashboard",
    "/credits",
    "/changes",
    "/guinee-credits",
    "/investments",
  ],
};
