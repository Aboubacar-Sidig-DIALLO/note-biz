"use client";

import { useSession } from "next-auth/react";
import { SessionUser } from "@/lib/user-session";

export function useSessionUser() {
  const { data: session, status } = useSession();

  return {
    user: session?.user as SessionUser | undefined,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    userId: session?.user?.id,
  };
}
