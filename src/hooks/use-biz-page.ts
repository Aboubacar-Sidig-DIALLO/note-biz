import { useState, useEffect, useCallback } from "react";
import { useCrud } from "@/hooks/use-crud";
import { BizEntity } from "@/components/GenericBizPage";

interface UseBizPageProps {
  model: string;
}

// Type pour les modèles Prisma - doit correspondre aux types dans use-crud.ts
export type PrismaModel =
  | "changes"
  | "credits"
  | "investments"
  | "guinee-credits";

export function useBizPage({ model }: UseBizPageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [entities, setEntities] = useState<BizEntity[]>([]);

  const {
    loading,
    error,
    create,
    findAll,
    update,
    delete: moveToHistory,
  } = useCrud<BizEntity>();

  const loadEntities = useCallback(async () => {
    const response = await findAll({ model: model as PrismaModel });
    if (response.success && response.data) {
      setEntities(response.data);
    }
  }, [findAll, model]);

  // Charger les données au montage du composant
  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  const handleAdd = async (data: { prenomNom: string; montant: number }) => {
    const response = await create({
      model: model as PrismaModel,
      data: {
        name: data.prenomNom,
        value: data.montant,
      },
    });

    if (response.success) {
      await loadEntities(); // Recharger les données
      setIsOpen(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<BizEntity>) => {
    const response = await update({
      model: model as PrismaModel,
      id,
      data,
    });

    if (response.success) {
      await loadEntities(); // Recharger les données
    }
  };

  const handleMoveToHistory = async (id: string) => {
    const response = await moveToHistory({
      model: model as PrismaModel,
      id,
      moveToHistory: true,
    });
    if (response.success) {
      await loadEntities(); // Recharger les données
    }
  };

  return {
    // État
    isOpen,
    entities,
    loading,
    error,

    // Actions
    setIsOpen,
    loadEntities,
    handleAdd,
    handleUpdate,
    handleMoveToHistory,
  };
}
