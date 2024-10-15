/*
  Warnings:

  - A unique constraint covering the columns `[liveSpreadsId]` on the table `WnbaGame` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[liveTotalsId]` on the table `WnbaGame` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[liveMoneylinesId]` on the table `WnbaGame` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "OddsType" ADD VALUE 'LIVE';

-- DropForeignKey
ALTER TABLE "WnbaGame" DROP CONSTRAINT "WnbaGame_awayTeamId_fkey";

-- DropForeignKey
ALTER TABLE "WnbaGame" DROP CONSTRAINT "WnbaGame_homeTeamId_fkey";

-- DropForeignKey
ALTER TABLE "WnbaGame" DROP CONSTRAINT "WnbaGame_kickoffMoneylinesId_fkey";

-- DropForeignKey
ALTER TABLE "WnbaGame" DROP CONSTRAINT "WnbaGame_kickoffSpreadsId_fkey";

-- DropForeignKey
ALTER TABLE "WnbaGame" DROP CONSTRAINT "WnbaGame_kickoffTotalsId_fkey";

-- DropForeignKey
ALTER TABLE "WnbaGame" DROP CONSTRAINT "WnbaGame_startMoneylinesId_fkey";

-- DropForeignKey
ALTER TABLE "WnbaGame" DROP CONSTRAINT "WnbaGame_startSpreadsId_fkey";

-- DropForeignKey
ALTER TABLE "WnbaGame" DROP CONSTRAINT "WnbaGame_startTotalsId_fkey";

-- DropForeignKey
ALTER TABLE "WnbaScore" DROP CONSTRAINT "WnbaScore_gameId_fkey";

-- DropForeignKey
ALTER TABLE "WnbaStats" DROP CONSTRAINT "WnbaStats_gameId_fkey";

-- AlterTable
ALTER TABLE "WnbaGame" ADD COLUMN     "liveMoneylinesId" INTEGER,
ADD COLUMN     "liveSpreadsId" INTEGER,
ADD COLUMN     "liveTotalsId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "WnbaGame_liveSpreadsId_key" ON "WnbaGame"("liveSpreadsId");

-- CreateIndex
CREATE UNIQUE INDEX "WnbaGame_liveTotalsId_key" ON "WnbaGame"("liveTotalsId");

-- CreateIndex
CREATE UNIQUE INDEX "WnbaGame_liveMoneylinesId_key" ON "WnbaGame"("liveMoneylinesId");
