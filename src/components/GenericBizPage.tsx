"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BizInput } from "@/components/bizInput";
import { AddModal } from "@/components/addModal";
import { Header } from "@/components/Header";
import { EmptyState } from "@/components/empty";
import { ErrorComponent } from "@/components/erreur";
import { useBizPage } from "@/hooks/use-biz-page";

// Interface générique pour les entités métier
export interface BizEntity {
  id: string;
  name: string;
  value: number;
  createdAt: Date;
  updatedAt?: Date;
}

// Configuration pour chaque type de page
export interface PageConfig {
  model: string;
  title: string;
  buttonLabel: string;
  addModalTitle: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
}

interface GenericBizPageProps {
  config: PageConfig;
}

export default function GenericBizPage({ config }: GenericBizPageProps) {
  const {
    isOpen,
    entities,
    loading,
    error,
    setIsOpen,
    loadEntities,
    handleAdd,
    handleUpdate,
    handleMoveToHistory,
  } = useBizPage({ model: config.model });

  return (
    <>
      <main className='min-h-screen relative bg-white'>
        <div className='container mx-auto p-4'>
          <Header
            title={config.title}
            buttonLabel={config.buttonLabel}
            onAddClick={() => setIsOpen(true)}
            className='flex-col md:flex-row gap-4'
          />

          {!loading && !error && entities.length === 0 && (
            <EmptyState
              title={config.emptyStateTitle}
              description={config.emptyStateDescription}
            />
          )}

          {error && (
            <div className='text-center py-4 text-red-600'>
              <ErrorComponent
                title='Erreur de chargement'
                message='Impossible de charger les données. Veuillez réessayer.'
                onRetry={loadEntities}
              />
            </div>
          )}

          <div className='flex flex-col items-center gap-4'>
            <AnimatePresence>
              {entities.map((entity, index) => (
                <motion.div
                  key={entity.id}
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
                    prenomNom={entity.name}
                    montant={entity.value}
                    onUpdate={(data) => {
                      handleUpdate(entity.id, {
                        name: data.prenomNom,
                        value: data.montant,
                      });
                    }}
                    onMoveToHistory={() => {
                      handleMoveToHistory(entity.id);
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
        title={config.addModalTitle}
      />
    </>
  );
}
