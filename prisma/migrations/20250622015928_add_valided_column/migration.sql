/*
  Warnings:

  - Added the required column `validatedAt` to the `Changes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validatedAt` to the `GuineeCredits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validatedAt` to the `Investments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validatedAt` to the `credits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Changes" ADD COLUMN     "validatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "GuineeCredits" ADD COLUMN     "validatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Investments" ADD COLUMN     "validatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "credits" ADD COLUMN     "validatedAt" TIMESTAMP(3) NOT NULL;
