import { PrismaClient } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/user-session";

// Types génériques pour les modèles avec userId
export interface BaseModel {
  id: string;
  name: string;
  value: number;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface HistoryModel {
  id: string;
  name: string;
  value: number;
  userId: string;
  createdAt: Date;
}

// Configuration des modèles
export interface ModelConfig {
  modelName: keyof PrismaClient;
  historyModelName: keyof PrismaClient;
}

// Service générique CRUD avec support utilisateur
export class GenericCrudService<T extends BaseModel> {
  private prisma: PrismaClient;
  private config: ModelConfig;

  constructor(config: ModelConfig) {
    this.prisma = prisma;
    this.config = config;
  }

  // Créer un nouvel enregistrement pour l'utilisateur connecté
  async create(
    data: Omit<T, "id" | "createdAt" | "updatedAt" | "userId">
  ): Promise<T> {
    const userId = await getUserIdFromSession();
    if (!userId) {
      throw new Error("Utilisateur non authentifié");
    }

    const model = this.prisma[
      this.config.modelName
    ] as PrismaClient[keyof PrismaClient];

    return await (model as any).create({
      data: {
        ...data,
        userId,
      },
    });
  }

  // Récupérer tous les enregistrements de l'utilisateur connecté
  async findAll(): Promise<T[]> {
    const userId = await getUserIdFromSession();
    if (!userId) {
      throw new Error("Utilisateur non authentifié");
    }

    const model = this.prisma[
      this.config.modelName
    ] as PrismaClient[keyof PrismaClient];

    return await (model as any).findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Récupérer un enregistrement par ID (seulement pour l'utilisateur connecté)
  async findById(id: string): Promise<T | null> {
    const userId = await getUserIdFromSession();
    if (!userId) {
      throw new Error("Utilisateur non authentifié");
    }

    const model = this.prisma[
      this.config.modelName
    ] as PrismaClient[keyof PrismaClient];

    return await (model as any).findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  // Mettre à jour un enregistrement (seulement pour l'utilisateur connecté)
  async update(
    id: string,
    data: Partial<Omit<T, "id" | "createdAt" | "updatedAt" | "userId">>
  ): Promise<T> {
    const userId = await getUserIdFromSession();
    if (!userId) {
      throw new Error("Utilisateur non authentifié");
    }

    const model = this.prisma[
      this.config.modelName
    ] as PrismaClient[keyof PrismaClient];

    return await (model as any).update({
      where: {
        id,
        userId,
      },
      data,
    });
  }

  // Supprimer un enregistrement (seulement pour l'utilisateur connecté)
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const userId = await getUserIdFromSession();
      if (!userId) {
        throw new Error("Utilisateur non authentifié");
      }

      const model = this.prisma[
        this.config.modelName
      ] as PrismaClient[keyof PrismaClient];

      await (model as any).delete({
        where: {
          id,
          userId,
        },
      });

      return { success: true, message: "Enregistrement supprimé avec succès" };
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      return { success: false, message: "Erreur lors de la suppression" };
    }
  }

  // Récupérer l'historique de l'utilisateur connecté
  async getAllHistory(): Promise<HistoryModel[]> {
    const userId = await getUserIdFromSession();
    if (!userId) {
      throw new Error("Utilisateur non authentifié");
    }

    const historyModel = this.prisma[
      this.config.historyModelName
    ] as PrismaClient[keyof PrismaClient];

    return await (historyModel as any).findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Déplacer vers l'historique (seulement pour l'utilisateur connecté)
  async moveToHistory(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const userId = await getUserIdFromSession();
      if (!userId) {
        throw new Error("Utilisateur non authentifié");
      }

      // 1. Récupérer l'enregistrement original
      const model = this.prisma[
        this.config.modelName
      ] as PrismaClient[keyof PrismaClient];

      const record = await (model as any).findFirst({
        where: {
          id,
          userId,
        },
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
          userId,
        },
      });

      // 3. Supprimer de la table principale
      await (model as any).delete({
        where: {
          id,
          userId,
        },
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

  // Nouvelle méthode: créer avec userId explicite (pour migrations/admin)
  async createWithUserId(
    data: Omit<T, "id" | "createdAt" | "updatedAt">,
    userId: string
  ): Promise<T> {
    const model = this.prisma[
      this.config.modelName
    ] as PrismaClient[keyof PrismaClient];

    return await (model as any).create({
      data: {
        ...data,
        userId,
      },
    });
  }

  // Nouvelle méthode: récupérer pour un utilisateur spécifique (pour admin)
  async findAllForUser(userId: string): Promise<T[]> {
    const model = this.prisma[
      this.config.modelName
    ] as PrismaClient[keyof PrismaClient];

    return await (model as any).findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

// Configuration des modèles spécifiques
export const modelConfigs = {
  changes: {
    modelName: "Changes" as keyof PrismaClient,
    historyModelName: "ChangesHistory" as keyof PrismaClient,
  },
  credits: {
    modelName: "credits" as keyof PrismaClient,
    historyModelName: "creditsHistory" as keyof PrismaClient,
  },
  investments: {
    modelName: "Investments" as keyof PrismaClient,
    historyModelName: "InvestmentsHistory" as keyof PrismaClient,
  },
  guineeCredits: {
    modelName: "GuineeCredits" as keyof PrismaClient,
    historyModelName: "GuineeCreditsHistory" as keyof PrismaClient,
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
