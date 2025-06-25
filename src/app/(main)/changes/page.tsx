"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BizInput } from "@/components/bizInput";
import { useState, useEffect } from "react";
import { AddModal } from "@/components/addModal";
import { Header } from "@/components/Header";
import { useCrud } from "@/hooks/use-crud";
import { EmptyState } from "@/components/empty";
import { ErrorComponent } from "@/components/erreur";

// Type pour les monnaies
interface Change {
  id: string;
  name: string;
  value: number;
  createdAt: Date;
  updatedAt?: Date;
}

export default function ChangesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [changes, setChanges] = useState<Change[]>([]);

  const {
    loading,
    error,
    create,
    findAll,
    update,
    delete: moveToHistory,
  } = useCrud<Change>();

  // Charger les données au montage du composant
  useEffect(() => {
    loadChanges();
  }, []);

  const loadChanges = async () => {
    const response = await findAll({ model: "changes" });
    if (response.success && response.data) {
      setChanges(response.data);
    }
  };

  const handleAdd = async (data: { prenomNom: string; montant: number }) => {
    const response = await create({
      model: "changes",
      data: {
        name: data.prenomNom,
        value: data.montant,
      },
    });

    if (response.success) {
      await loadChanges(); // Recharger les données
      setIsOpen(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Change>) => {
    const response = await update({
      model: "changes",
      id,
      data,
    });

    if (response.success) {
      await loadChanges(); // Recharger les données
    }
  };

  const handleMoveToHistory = async (id: string) => {
    const response = await moveToHistory({
      model: "changes",
      id,
      moveToHistory: true,
    });
    if (response.success) {
      await loadChanges(); // Recharger les données
    }
  };

  return (
    <>
      <main className='min-h-screen relative bg-white'>
        <div className='container mx-auto p-4'>
          <Header
            title='Monnaies'
            buttonLabel='Ajouter une Monnaie'
            onAddClick={() => setIsOpen(true)}
            className='flex-col md:flex-row gap-4'
          />

          {!loading && !error && changes.length === 0 && (
            <EmptyState
              title='Aucune monnaie'
              description="Il n'y a actuellement aucune monnaie enregistrée. Ajoutez votre première monnaie pour commencer."
            />
          )}

          {error && (
            <div className='text-center py-4 text-red-600'>
              <ErrorComponent
                title='Erreur de chargement'
                message='Impossible de charger les données. Veuillez réessayer.'
                onRetry={loadChanges}
              />
            </div>
          )}

          <div className='flex flex-col items-center gap-4'>
            <AnimatePresence>
              {changes.map((change, index) => (
                <motion.div
                  key={change.id}
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
                    prenomNom={change.name}
                    montant={change.value}
                    onUpdate={(data) => {
                      handleUpdate(change.id, {
                        name: data.prenomNom,
                        value: data.montant,
                      });
                    }}
                    onMoveToHistory={() => {
                      handleMoveToHistory(change.id);
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
        title='Ajouter une monnaie'
      />
    </>
  );
}
