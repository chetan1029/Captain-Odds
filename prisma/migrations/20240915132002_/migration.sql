-- CreateEnum
CREATE TYPE "OddsType" AS ENUM ('START', 'KICKOFF');

-- CreateTable
CREATE TABLE "WnbaGame" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "dateUtc" TEXT NOT NULL,
    "homeTeamId" INTEGER NOT NULL,
    "awayTeamId" INTEGER NOT NULL,
    "startSpreadsId" INTEGER,
    "kickoffSpreadsId" INTEGER,
    "startTotalsId" INTEGER,
    "kickoffTotalsId" INTEGER,
    "startMoneylinesId" INTEGER,
    "kickoffMoneylinesId" INTEGER,
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "bet365Id" TEXT,
    "status" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WnbaGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WnbaScore" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL,
    "homeScore" INTEGER NOT NULL,
    "awayScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WnbaScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WnbaStats" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "statType" TEXT NOT NULL,
    "homeValue" DOUBLE PRECISION NOT NULL,
    "awayValue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WnbaStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WnbaTeam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "conference" TEXT,
    "logo" TEXT,
    "externalId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "WnbaTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WnbaSpreads" (
    "id" SERIAL NOT NULL,
    "home_od" DOUBLE PRECISION NOT NULL,
    "away_od" DOUBLE PRECISION NOT NULL,
    "handicap" DOUBLE PRECISION NOT NULL,
    "type" "OddsType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WnbaSpreads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WnbaTotals" (
    "id" SERIAL NOT NULL,
    "over_od" DOUBLE PRECISION NOT NULL,
    "under_od" DOUBLE PRECISION NOT NULL,
    "handicap" DOUBLE PRECISION NOT NULL,
    "type" "OddsType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WnbaTotals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WnbaMoneylines" (
    "id" SERIAL NOT NULL,
    "home_od" DOUBLE PRECISION NOT NULL,
    "away_od" DOUBLE PRECISION NOT NULL,
    "type" "OddsType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WnbaMoneylines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WnbaGame_startSpreadsId_key" ON "WnbaGame"("startSpreadsId");

-- CreateIndex
CREATE UNIQUE INDEX "WnbaGame_kickoffSpreadsId_key" ON "WnbaGame"("kickoffSpreadsId");

-- CreateIndex
CREATE UNIQUE INDEX "WnbaGame_startTotalsId_key" ON "WnbaGame"("startTotalsId");

-- CreateIndex
CREATE UNIQUE INDEX "WnbaGame_kickoffTotalsId_key" ON "WnbaGame"("kickoffTotalsId");

-- CreateIndex
CREATE UNIQUE INDEX "WnbaGame_startMoneylinesId_key" ON "WnbaGame"("startMoneylinesId");

-- CreateIndex
CREATE UNIQUE INDEX "WnbaGame_kickoffMoneylinesId_key" ON "WnbaGame"("kickoffMoneylinesId");

-- CreateIndex
CREATE UNIQUE INDEX "WnbaGame_externalId_key" ON "WnbaGame"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "WnbaTeam_externalId_key" ON "WnbaTeam"("externalId");

-- AddForeignKey
ALTER TABLE "WnbaGame" ADD CONSTRAINT "WnbaGame_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "WnbaTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WnbaGame" ADD CONSTRAINT "WnbaGame_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "WnbaTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WnbaGame" ADD CONSTRAINT "WnbaGame_startSpreadsId_fkey" FOREIGN KEY ("startSpreadsId") REFERENCES "WnbaSpreads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WnbaGame" ADD CONSTRAINT "WnbaGame_kickoffSpreadsId_fkey" FOREIGN KEY ("kickoffSpreadsId") REFERENCES "WnbaSpreads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WnbaGame" ADD CONSTRAINT "WnbaGame_startTotalsId_fkey" FOREIGN KEY ("startTotalsId") REFERENCES "WnbaTotals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WnbaGame" ADD CONSTRAINT "WnbaGame_kickoffTotalsId_fkey" FOREIGN KEY ("kickoffTotalsId") REFERENCES "WnbaTotals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WnbaGame" ADD CONSTRAINT "WnbaGame_startMoneylinesId_fkey" FOREIGN KEY ("startMoneylinesId") REFERENCES "WnbaMoneylines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WnbaGame" ADD CONSTRAINT "WnbaGame_kickoffMoneylinesId_fkey" FOREIGN KEY ("kickoffMoneylinesId") REFERENCES "WnbaMoneylines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WnbaScore" ADD CONSTRAINT "WnbaScore_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "WnbaGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WnbaStats" ADD CONSTRAINT "WnbaStats_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "WnbaGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
