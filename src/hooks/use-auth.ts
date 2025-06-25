"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { isProtectedRoute, AUTH_REDIRECT } from "@/lib/auth-config";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une route protégée
    if (status === "unauthenticated" && isProtectedRoute(pathname)) {
      router.push(AUTH_REDIRECT);
    }
  }, [status, pathname, router]);

  return {
    session,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}
