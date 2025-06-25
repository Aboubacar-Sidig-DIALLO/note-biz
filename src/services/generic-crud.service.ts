import { PrismaClient } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { formatFrenchDate } from "@/utils/dateUtils";

// Types génériques pour les modèles
export interface BaseModel {
  id: string;
  name: string;
  value: number;
  createdAt: Date;
  updatedAt?: Date;
}

// Configuration des modèles
export interface ModelConfig {
  modelName: keyof PrismaClient;
  historyModelName: keyof PrismaClient;
  excludeFromHistory?: string[];
}

// Service générique CRUD
export class GenericCrudService<T extends BaseModel> {
  private prisma: PrismaClient;
  private config: ModelConfig;

  constructor(config: ModelConfig) {
    this.prisma = prisma;
    this.config = config;
  }

  // Créer un nouvel enregistrement
  async create(data: Omit<T, "createdAt" | "updatedAt">): Promise<T> {
    const model = this.prisma[
      this.config.modelName
    ] as PrismaClient[keyof PrismaClient];
    return await (model as any).create({
      data: {
        ...data,
        createdAt: formatFrenchDate(new Date()),
        updatedAt: formatFrenchDate(new Date()),
      },
    });
  }

  // Récupérer tous les enregistrements actifs (non supprimés)
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
    return await (model as any).findFirst({
      where: {
        id,
      },
    });
  }

  // Mettre à jour un enregistrement
  async update(id: string, data: Partial<Omit<T, "createdAt">>): Promise<T> {
    const model = this.prisma[
      this.config.modelName
    ] as PrismaClient[keyof PrismaClient];
    return await (model as any).update({
      where: { id },
      data: {
        ...data,
        updatedAt: formatFrenchDate(new Date()),
      },
    });
  }

  // Soft delete - déplacer vers l'historique
  async softDelete(id: string): Promise<{ success: boolean; message: string }> {
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

      const historyData: Record<string, unknown> = {
        createdAt: formatFrenchDate(new Date()),
      };

      // Copier tous les champs sauf ceux exclus
      Object.keys(record).forEach((key) => {
        if (!this.config.excludeFromHistory?.includes(key as string)) {
          historyData[key] = record[key];
        }
      });

      await (historyModel as any).create({
        data: historyData,
      });

      // 3. Marquer comme supprimé dans la table principale
      await (model as any).update({
        where: { id },
      });

      return {
        success: true,
        message: "Enregistrement déplacé vers l'historique avec succès",
      };
    } catch (error) {
      console.error("Erreur lors du soft delete:", error);
      return { success: false, message: "Erreur lors de la suppression" };
    }
  }

  // Récupérer l'historique d'un enregistrement
  async getHistory(originalId: string): Promise<BaseModel[]> {
    const historyModel = this.prisma[
      this.config.historyModelName
    ] as PrismaClient[keyof PrismaClient];

    return await (historyModel as any).findMany({
      where: { originalId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Récupérer tous les enregistrements de l'historique
  async getAllHistory(): Promise<BaseModel[]> {
    const historyModel = this.prisma[
      this.config.historyModelName
    ] as PrismaClient[keyof PrismaClient];

    return await (historyModel as any).findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Restaurer un enregistrement depuis l'historique
  async restoreFromHistory(
    originalId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // 1. Récupérer le dernier enregistrement de l'historique
      const historyModel = this.prisma[
        this.config.historyModelName
      ] as PrismaClient[keyof PrismaClient];

      const historyRecord = await (historyModel as any).findFirst({
        where: { originalId },
        orderBy: { createdAt: "desc" },
      });

      if (!historyRecord) {
        return {
          success: false,
          message: "Aucun enregistrement trouvé dans l'historique",
        };
      }

      // 2. Restaurer dans la table principale
      const model = this.prisma[
        this.config.modelName
      ] as PrismaClient[keyof PrismaClient];
      const restoreData: Record<string, unknown> = {};

      // Copier tous les champs sauf ceux exclus
      Object.keys(historyRecord).forEach((key) => {
        if (!["id", "originalId", "createdAt", "updatedAt"].includes(key)) {
          restoreData[key] = historyRecord[key];
        }
      });

      await (model as any).update({
        where: { id: originalId },
        data: {
          ...restoreData,
          updatedAt: new Date(),
        },
      });

      return { success: true, message: "Enregistrement restauré avec succès" };
    } catch (error) {
      console.error("Erreur lors de la restauration:", error);
      return { success: false, message: "Erreur lors de la restauration" };
    }
  }
}

// Configuration des modèles spécifiques
export const modelConfigs = {
  changes: {
    modelName: "changes" as keyof PrismaClient,
    historyModelName: "changesHistory" as keyof PrismaClient,
    excludeFromHistory: ["id"],
  },
  credits: {
    modelName: "credits" as keyof PrismaClient,
    historyModelName: "creditsHistory" as keyof PrismaClient,
    excludeFromHistory: ["id"],
  },
  investments: {
    modelName: "investments" as keyof PrismaClient,
    historyModelName: "investmentsHistory" as keyof PrismaClient,
    excludeFromHistory: ["id"],
  },
  guineeCredits: {
    modelName: "guineeCredits" as keyof PrismaClient,
    historyModelName: "guineeCreditsHistory" as keyof PrismaClient,
    excludeFromHistory: ["id"],
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
