"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BizInput } from "@/components/bizInput";
import { useState, useEffect } from "react";
import { AddModal } from "@/components/addModal";
import { Header } from "@/components/Header";
import { useCrud } from "@/hooks/use-crud";
import { EmptyState } from "@/components/empty";
import { ErrorComponent } from "@/components/erreur";

// Type pour les investissements
interface Investment {
  id: string;
  name: string;
  value: number;
  createdAt: Date;
  updatedAt?: Date;
}

export default function InvestmentsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [investments, setInvestments] = useState<Investment[]>([]);

  const {
    loading,
    error,
    create,
    findAll,
    update,
    delete: moveToHistory,
  } = useCrud<Investment>();

  // Charger les données au montage du composant
  useEffect(() => {
    loadInvestments();
  }, []);

  const loadInvestments = async () => {
    const response = await findAll({ model: "investments" });
    if (response.success && response.data) {
      setInvestments(response.data);
    }
  };

  const handleAdd = async (data: { prenomNom: string; montant: number }) => {
    const response = await create({
      model: "investments",
      data: {
        name: data.prenomNom,
        value: data.montant,
      },
    });

    if (response.success) {
      await loadInvestments(); // Recharger les données
      setIsOpen(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Investment>) => {
    const response = await update({
      model: "investments",
      id,
      data,
    });

    if (response.success) {
      await loadInvestments(); // Recharger les données
    }
  };

  const handleMoveToHistory = async (id: string) => {
    const response = await moveToHistory({
      model: "investments",
      id,
      moveToHistory: true,
    });
    if (response.success) {
      await loadInvestments(); // Recharger les données
    }
  };

  return (
    <>
      <main className='min-h-screen relative bg-white'>
        <div className='container mx-auto p-4'>
          <Header
            title='Investissements'
            buttonLabel='Ajouter un Investissement'
            onAddClick={() => setIsOpen(true)}
            className='flex-col md:flex-row gap-4'
          />

          {!loading && !error && investments.length === 0 && (
            <EmptyState
              title='Aucun investissement'
              description="Il n'y a actuellement aucun investissement enregistré. Ajoutez votre premier investissement pour commencer."
            />
          )}

          {error && (
            <div className='text-center py-4 text-red-600'>
              <ErrorComponent
                title='Erreur de chargement'
                message='Impossible de charger les données. Veuillez réessayer.'
                onRetry={loadInvestments}
              />
            </div>
          )}

          <div className='flex flex-col items-center gap-4'>
            <AnimatePresence>
              {investments.map((investment, index) => (
                <motion.div
                  key={investment.id}
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
                    prenomNom={investment.name}
                    montant={investment.value}
                    onUpdate={(data) => {
                      handleUpdate(investment.id, {
                        name: data.prenomNom,
                        value: data.montant,
                      });
                    }}
                    onMoveToHistory={() => {
                      handleMoveToHistory(investment.id);
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <AddModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAdd={handleAdd}
        title='Ajouter un investissement'
      />
    </>
  );
}
