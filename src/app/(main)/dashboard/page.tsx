"use client";

import { motion, AnimatePresence } from "framer-motion";
import BizCard from "@/components/bizCard";
import { useState, useEffect } from "react";
import { cn } from "@/utils/dateUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConfirmationSecret } from "@/components/ConfirmationSecret";

// Interface pour les statistiques du dashboard
interface DashboardStats {
  changes: {
    title: string;
    activeItems: number;
    somme: number;
    historyUrl: string;
  };
  credits: {
    title: string;
    activeItems: number;
    somme: number;
    historyUrl: string;
  };
  guineeCredits: {
    title: string;
    activeItems: number;
    somme: number;
    historyUrl: string;
  };
  investments: {
    title: string;
    activeItems: number;
    somme: number;
    historyUrl: string;
  };
  payables: {
    title: string;
    activeItems: number;
    somme: number;
    historyUrl: string;
  };
  receivables: {
    title: string;
    activeItems: number;
    somme: number;
    historyUrl: string;
  };
}

// Composant wrapper pour les effets d'animation
const AnimatedCardWrapper = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  return (
    <div className='group relative'>
      {/* Effet de brillance au survol */}
      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 -skew-x-10 translate-x-[-100%] z-10 pointer-events-none' />

      {/* Effet de bordure animée */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-[1px] z-10 pointer-events-none",
          isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      />

      {children}
    </div>
  );
};

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSecretConfirmation, setShowSecretConfirmation] = useState(false);
  const [canShowAmount, setCanShowAmount] = useState(false);
  const [activeCard, setActiveCard] = useState(-1);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard/stats");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Convertir les stats en tableau pour l'affichage
  const clients = stats
    ? [
        stats.credits,
        stats.changes,
        stats.guineeCredits,
        stats.investments,
        stats.payables,
        stats.receivables,
      ]
    : [];

  if (loading) {
    return (
      <main className='min-h-screen relative bg-white'>
        <div className='container mx-auto p-4'>
          <h1 className='text-2xl font-bold mb-6'>Dashboard</h1>
          <div className='flex items-center justify-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600'></div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className='min-h-screen relative bg-white'>
        <div className='container mx-auto p-4'>
          <h1 className='text-2xl font-bold mb-6'>Dashboard</h1>
          <div className='flex items-center justify-center h-64'>
            <div className='text-red-600 text-center'>
              <p className='text-lg font-semibold'>Erreur de chargement</p>
              <p className='text-sm mt-2'>{error}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const handleConfirmSecret = async (secret: string) => {
    try {
      const response = await fetch("/api/user/secret", {
        method: "POST",
        body: JSON.stringify({ secret }),
        headers: {
          "Content-Type": "application/json",
          "x-internal-auth": process.env.INTERNAL_AUTH_SECRET || "secret-auth",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setShowSecretConfirmation(false);
        setCanShowAmount(true);
        return true;
      } else {
        setCanShowAmount(false);
        console.log("Erreur lors de la vérification du secret:", data);
        return false;
      }
    } catch (error) {
      console.log("Erreur lors de la vérification du secret:", error);
      return false;
    }
  };

  return (
    <main className='min-h-screen relative bg-white'>
      <div className='container mx-auto p-4'>
        <h1 className='text-2xl font-bold mb-6'>Dashboard</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-2 h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide'>
          <AnimatePresence>
            {clients.map((client, index) => (
              <motion.div
                key={client.title}
                initial={{ y: 100, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                    delay: index * 0.1,
                  },
                }}
                exit={{ y: -100, opacity: 0 }}
                whileHover={{
                  y: -4,
                  scale: 1.01,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className='cursor-pointer'>
                <AnimatedCardWrapper>
                  <BizCard
                    title={client.title}
                    activeItems={client.activeItems}
                    historyUrl={client.historyUrl}
                    somme={client.somme}
                    setShowSecretConfirmation={setShowSecretConfirmation}
                    canShowAmount={canShowAmount}
                    setCanShowAmount={setCanShowAmount}
                    index={index}
                    setActiveCard={setActiveCard}
                    activeCard={activeCard}
                  />
                </AnimatedCardWrapper>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <ConfirmationSecret
        isOpen={showSecretConfirmation}
        onClose={() => {
          setShowSecretConfirmation(false);
          setActiveCard(-1);
        }}
        onConfirm={handleConfirmSecret}
      />
    </main>
  );
};

export default DashboardPage;
