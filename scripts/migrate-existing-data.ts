import { PrismaClient } from "@/generated/prisma";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

const prisma = new PrismaClient();

/**
 * Script de migration pour attribuer les données existantes à un utilisateur par défaut
 *
 * Ce script doit être exécuté APRÈS la migration Prisma mais AVANT la mise en production
 * des nouvelles APIs qui nécessitent l'userId
 */
async function migrateExistingData() {
  try {
    console.log("🚀 Début de la migration des données existantes...");

    // 1. Trouver ou créer un utilisateur par défaut
    let defaultUser = await prisma.user.findFirst({
      where: {
        email: process.env.DEFAULT_USER_EMAIL || "admin@default.com",
      },
    });

    if (!defaultUser) {
      console.log("👤 Création de l'utilisateur par défaut...");
      const bcrypt = await import("bcryptjs");
      const defaultPin = process.env.DEFAULT_USER_PIN || "123456";
      const hashedPin = await bcrypt.hash(defaultPin, 10);

      defaultUser = await prisma.user.create({
        data: {
          email: process.env.DEFAULT_USER_EMAIL || "admin@default.com",
          name: "Utilisateur par défaut",
          pin: hashedPin,
        },
      });
      console.log(
        `✅ Utilisateur par défaut créé avec l'ID: ${defaultUser.id}`
      );
    } else {
      console.log(
        `✅ Utilisateur par défaut trouvé avec l'ID: ${defaultUser.id}`
      );
    }

    // 2. Compter les données existantes sans userId
    const counts = {
      changes: await prisma.changes.count({ where: { userId: null } }),
      credits: await prisma.credits.count({ where: { userId: null } }),
      investments: await prisma.investments.count({ where: { userId: null } }),
      guineeCredits: await prisma.guineeCredits.count({
        where: { userId: null },
      }),
      changesHistory: await prisma.changesHistory.count({
        where: { userId: null },
      }),
      creditsHistory: await prisma.creditsHistory.count({
        where: { userId: null },
      }),
      investmentsHistory: await prisma.investmentsHistory.count({
        where: { userId: null },
      }),
      guineeCreditsHistory: await prisma.guineeCreditsHistory.count({
        where: { userId: null },
      }),
    };

    console.log("📊 Données à migrer:");
    Object.entries(counts).forEach(([model, count]) => {
      console.log(`  - ${model}: ${count} enregistrements`);
    });

    // 3. Migrer les données principales
    if (counts.changes > 0) {
      const result = await prisma.changes.updateMany({
        where: { userId: null },
        data: { userId: defaultUser.id },
      });
      console.log(`✅ ${result.count} enregistrements Changes migrés`);
    }

    if (counts.credits > 0) {
      const result = await prisma.credits.updateMany({
        where: { userId: null },
        data: { userId: defaultUser.id },
      });
      console.log(`✅ ${result.count} enregistrements credits migrés`);
    }

    if (counts.investments > 0) {
      const result = await prisma.investments.updateMany({
        where: { userId: null },
        data: { userId: defaultUser.id },
      });
      console.log(`✅ ${result.count} enregistrements Investments migrés`);
    }

    if (counts.guineeCredits > 0) {
      const result = await prisma.guineeCredits.updateMany({
        where: { userId: null },
        data: { userId: defaultUser.id },
      });
      console.log(`✅ ${result.count} enregistrements GuineeCredits migrés`);
    }

    // 4. Migrer les données d'historique
    if (counts.changesHistory > 0) {
      const result = await prisma.changesHistory.updateMany({
        where: { userId: null },
        data: { userId: defaultUser.id },
      });
      console.log(`✅ ${result.count} enregistrements ChangesHistory migrés`);
    }

    if (counts.creditsHistory > 0) {
      const result = await prisma.creditsHistory.updateMany({
        where: { userId: null },
        data: { userId: defaultUser.id },
      });
      console.log(`✅ ${result.count} enregistrements creditsHistory migrés`);
    }

    if (counts.investmentsHistory > 0) {
      const result = await prisma.investmentsHistory.updateMany({
        where: { userId: null },
        data: { userId: defaultUser.id },
      });
      console.log(
        `✅ ${result.count} enregistrements InvestmentsHistory migrés`
      );
    }

    if (counts.guineeCreditsHistory > 0) {
      const result = await prisma.guineeCreditsHistory.updateMany({
        where: { userId: null },
        data: { userId: defaultUser.id },
      });
      console.log(
        `✅ ${result.count} enregistrements GuineeCreditsHistory migrés`
      );
    }

    console.log("🎉 Migration terminée avec succès !");
    console.log(`📧 Utilisateur par défaut: ${defaultUser.email}`);
    console.log(
      `🔑 PIN par défaut: ${process.env.DEFAULT_USER_PIN || "123456"}`
    );
  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécution du script
if (require.main === module) {
  migrateExistingData()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { migrateExistingData };
