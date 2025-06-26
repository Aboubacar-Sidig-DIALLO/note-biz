"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // Attendre que la session soit chargée

    if (session) {
      // Si l'utilisateur est déjà connecté, rediriger vers le dashboard
      router.push("/dashboard");
    } else {
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  // Afficher un loader pendant la redirection
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        <p className='mt-4 text-gray-600'>Chargement...</p>
      </div>
    </div>
  );
}
