"use client";

import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Afficher un loader pendant la vérification de session
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
      </div>
    );
  }

  // Afficher le contenu seulement si authentifié
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Ne rien afficher si non authentifié (redirection en cours)
  return null;
};

export default ProtectedRoute;
