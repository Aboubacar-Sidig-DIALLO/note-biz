import { PrismaClient } from "@/generated/prisma";
import prisma from "@/lib/prisma";

// Types génériques pour les modèles
export interface BaseModel {
  id: string;
  name: string;
  value: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface HistoryModel {
  id: string;
  name: string;
  value: number;
  createdAt: Date;
}

// Configuration des modèles
export interface ModelConfig<T extends BaseModel> {
  modelName: keyof PrismaClient;
  historyModelName: keyof PrismaClient;
}

// Service générique CRUD
export class GenericCrudService<T extends BaseModel> {
  private prisma: PrismaClient;
  private config: ModelConfig<T>;

  constructor(config: ModelConfig<T>) {
    this.prisma = prisma;
    this.config = config;
  }

  // Créer un nouvel enregistrement
  async create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    const model = this.prisma[
      this.config.modelName
    ] as PrismaClient[keyof PrismaClient];
    return await (model as any).create({
      data,
    });
  }

  // Récupérer tous les enregistrements
  async findAll(): Promise<T[]> {
    const model = this.prisma[
      this.config.modelName
    ] as PrismaClient[keyof PrismaClient];
    return await (model as any).findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Récupérer un enregistrement par ID
  async findById(id: string): Promise<T | null> {
    const model = this.prisma[
      this.config.modelName
    ] as PrismaClient[keyof PrismaClient];
    return await (model as any).findUnique({
      where: { id },
    });
  }

  // Mettre à jour un enregistrement
  async update(
    id: string,
    data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>
  ): Promise<T> {
    const model = this.prisma[
      this.config.modelName
    ] as PrismaClient[keyof PrismaClient];
    return await (model as any).update({
      where: { id },
      data,
    });
  }

  // Supprimer un enregistrement (hard delete)
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const model = this.prisma[
        this.config.modelName
      ] as PrismaClient[keyof PrismaClient];
      await (model as any).delete({
        where: { id },
      });

      return { success: true, message: "Enregistrement supprimé avec succès" };
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      return { success: false, message: "Erreur lors de la suppression" };
    }
  }

  // Récupérer tous les enregistrements de l'historique
  async getAllHistory(): Promise<HistoryModel[]> {
    const historyModel = this.prisma[
      this.config.historyModelName
    ] as PrismaClient[keyof PrismaClient];
    return await (historyModel as any).findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Déplacer vers l'historique (soft delete manuel)
  async moveToHistory(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // 1. Récupérer l'enregistrement original
      const model = this.prisma[
        this.config.modelName
      ] as PrismaClient[keyof PrismaClient];
      const record = await (model as any).findUnique({
        where: { id },
      });

      if (!record) {
        return { success: false, message: "Enregistrement non trouvé" };
      }

      // 2. Créer l'enregistrement dans l'historique
      const historyModel = this.prisma[
        this.config.historyModelName
      ] as PrismaClient[keyof PrismaClient];
      await (historyModel as any).create({
        data: {
          name: record.name,
          value: record.value,
        },
      });

      // 3. Supprimer de la table principale
      await (model as any).delete({
        where: { id },
      });

      return {
        success: true,
        message: "Enregistrement déplacé vers l'historique avec succès",
      };
    } catch (error) {
      console.error("Erreur lors du déplacement vers l'historique:", error);
      return {
        success: false,
        message: "Erreur lors du déplacement vers l'historique",
      };
    }
  }
}

// Configuration des modèles spécifiques
export const modelConfigs = {
  changes: {
    modelName: "changes" as keyof PrismaClient,
    historyModelName: "changesHistory" as keyof PrismaClient,
  },
  credits: {
    modelName: "credits" as keyof PrismaClient,
    historyModelName: "creditsHistory" as keyof PrismaClient,
  },
  investments: {
    modelName: "investments" as keyof PrismaClient,
    historyModelName: "investmentsHistory" as keyof PrismaClient,
  },
  guineeCredits: {
    modelName: "guineeCredits" as keyof PrismaClient,
    historyModelName: "guineeCreditsHistory" as keyof PrismaClient,
  },
};

// Instances des services pour chaque modèle
export const changesService = new GenericCrudService(modelConfigs.changes);
export const creditsService = new GenericCrudService(modelConfigs.credits);
export const investmentsService = new GenericCrudService(
  modelConfigs.investments
);
export const guineeCreditsService = new GenericCrudService(
  modelConfigs.guineeCredits
);
