/*
  Warnings:

  - You are about to drop the column `use` on the `Changes` table. All the data in the column will be lost.
  - You are about to drop the column `validatedAt` on the `Changes` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `GuineeCredits` table. All the data in the column will be lost.
  - You are about to drop the column `use` on the `GuineeCredits` table. All the data in the column will be lost.
  - You are about to drop the column `validatedAt` on the `GuineeCredits` table. All the data in the column will be lost.
  - You are about to drop the column `recovered` on the `Investments` table. All the data in the column will be lost.
  - You are about to drop the column `validatedAt` on the `Investments` table. All the data in the column will be lost.
  - You are about to drop the column `payed` on the `credits` table. All the data in the column will be lost.
  - You are about to drop the column `validatedAt` on the `credits` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Changes" DROP COLUMN "use",
DROP COLUMN "validatedAt";

-- AlterTable
ALTER TABLE "GuineeCredits" DROP COLUMN "currency",
DROP COLUMN "use",
DROP COLUMN "validatedAt";

-- AlterTable
ALTER TABLE "Investments" DROP COLUMN "recovered",
DROP COLUMN "validatedAt";

-- AlterTable
ALTER TABLE "credits" DROP COLUMN "payed",
DROP COLUMN "validatedAt",
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ChangesHistory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChangesHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creditsHistory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "creditsHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentsHistory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestmentsHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuineeCreditsHistory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuineeCreditsHistory_pkey" PRIMARY KEY ("id")
);
