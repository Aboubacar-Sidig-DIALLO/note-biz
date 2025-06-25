-- AlterTable
ALTER TABLE "GuineeCredits" ADD COLUMN     "use" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Investments" ADD COLUMN     "recovered" BOOLEAN NOT NULL DEFAULT false;
