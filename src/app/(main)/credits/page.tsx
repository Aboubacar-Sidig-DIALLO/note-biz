"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BizInput } from "@/components/bizInput";
import { useState, useEffect } from "react";
import { AddModal } from "@/components/addModal";
import { Header } from "@/components/Header";
import { useCrud } from "@/hooks/use-crud";
import { EmptyState } from "@/components/empty";
import { ErrorComponent } from "@/components/erreur";

// Type pour les crédits
interface Credit {
  id: string;
  name: string;
  value: number;
  createdAt: Date;
  updatedAt?: Date;
}

export default function CreditsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [credits, setCredits] = useState<Credit[]>([]);

  const {
    loading,
    error,
    create,
    findAll,
    update,
    delete: moveToHistory,
  } = useCrud<Credit>();

  // Charger les données au montage du composant
  useEffect(() => {
    loadCredits();
  }, []);

  const loadCredits = async () => {
    const response = await findAll({ model: "credits" });
    if (response.success && response.data) {
      setCredits(response.data);
    }
  };

  const handleAdd = async (data: { prenomNom: string; montant: number }) => {
    const response = await create({
      model: "credits",
      data: {
        name: data.prenomNom,
        value: data.montant,
      },
    });

    if (response.success) {
      await loadCredits(); // Recharger les données
      setIsOpen(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Credit>) => {
    const response = await update({
      model: "credits",
      id,
      data,
    });

    if (response.success) {
      await loadCredits(); // Recharger les données
    }
  };

  const handleMoveToHistory = async (id: string) => {
    const response = await moveToHistory({
      model: "credits",
      id,
      moveToHistory: true,
    });
    if (response.success) {
      await loadCredits(); // Recharger les données
    }
  };

  return (
    <>
      <main className='min-h-screen relative bg-white'>
        <div className='container mx-auto p-4'>
          <Header
            title='Avoirs'
            buttonLabel='Ajouter un Crédit'
            onAddClick={() => setIsOpen(true)}
            className='flex-col md:flex-row gap-4'
          />

          {!loading && !error && credits.length === 0 && (
            <EmptyState
              title='Aucun crédit trouvé'
              description="Il n'y a actuellement aucun crédit à afficher. Ajoutez votre premier crédit pour commencer."
            />
          )}

          {error && (
            <div className='text-center py-4 text-red-600'>
              <ErrorComponent
                title='Erreur de chargement'
                message='Impossible de charger les données. Veuillez réessayer.'
                onRetry={loadCredits}
              />
            </div>
          )}

          {!loading && !error && credits.length === 0 && (
            <EmptyState
              title='Aucun crédit trouvé'
              description="Il n'y a actuellement aucun crédit à afficher. Ajoutez votre premier crédit pour commencer."
            />
          )}

          {!loading && !error && credits.length > 0 && (
            <div className='flex flex-col items-center gap-4'>
              <AnimatePresence>
                {credits.map((credit, index) => (
                  <motion.div
                    key={credit.id}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: index * 0.1,
                      },
                    }}
                    exit={{ y: -100, opacity: 0 }}
                    className='w-full flex justify-center'>
                    <BizInput
                      prenomNom={credit.name}
                      montant={credit.value}
                      onUpdate={(data) => {
                        handleUpdate(credit.id, {
                          name: data.prenomNom,
                          value: data.montant,
                        });
                      }}
                      onMoveToHistory={() => {
                        handleMoveToHistory(credit.id);
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
      <AddModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAdd={handleAdd}
        title='Ajouter un crédit'
      />
    </>
  );
}
