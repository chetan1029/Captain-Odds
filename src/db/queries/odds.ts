import type { WnbaGame } from '@prisma/client'
import {prisma} from '@/db'
import { unstable_cache } from "next/cache";

// Helper function to calculate percentage change
const calculatePercentageChange = (start: number | null, live: number | null) => {
    if (start === null || live === null) return null;
    if (start === 0) return live > 0 ? 100 : live < 0 ? -100 : 0; // Handle edge case when start is 0
    return Number((((live - start) / start) * 100).toFixed(1));
};

// Helper function to round values to two decimal places
const roundToTwoDecimals = (value: number | null): number | null => {
    return value !== null ? Number(value.toFixed(2)) : null;
  };

export const getGamesOdds = unstable_cache(
    async (): Promise<WnbaGame[]> => {
        // Fetch Games from the database
        const games = await prisma.wnbaGame.findMany({
            where: {
                OR: [
                    { status: '0' },
                    { status: '1' }
                  ],
            },
            include: {
                homeTeam: true,
                awayTeam: true,
                scores: true,
                stats: true,
                kickoffMoneylines: true,
                kickoffSpreads: true,
                kickoffTotals: true,
                startMoneylines: true,
                startSpreads: true,
                startTotals: true,
                liveMoneylines: true,
                liveSpreads: true,
                liveTotals: true,
                liveOldMoneylines: true,
                liveOldSpreads: true,
                liveOldTotals: true,
            },
            orderBy: {
                dateUtc: 'asc',
            },
        })

        // Map through games and calculate changes
    const gamesWithChanges = games.map((game) => {
        const {
          startMoneylines,
          liveMoneylines,
          liveOldMoneylines,
          startSpreads,
          liveSpreads,
          liveOldSpreads,
          startTotals,
          liveTotals,
          liveOldTotals,
        } = game;
  
        // Calculate absolute changes and percentage changes
        const moneylineChanges = startMoneylines && liveMoneylines ? {
          home_od_change: roundToTwoDecimals(liveMoneylines.home_od - startMoneylines.home_od),
          away_od_change: roundToTwoDecimals(liveMoneylines.away_od - startMoneylines.away_od),
          home_od_percentage: calculatePercentageChange(startMoneylines.home_od, liveMoneylines.home_od),
          away_od_percentage: calculatePercentageChange(startMoneylines.away_od, liveMoneylines.away_od),
        } : null;
  
        const spreadChanges = startSpreads && liveSpreads ? {
          handicap_change: roundToTwoDecimals(liveSpreads.handicap - startSpreads.handicap),
          home_od_change: roundToTwoDecimals(liveSpreads.home_od - startSpreads.home_od),
          away_od_change: roundToTwoDecimals(liveSpreads.away_od - startSpreads.away_od),
          handicap_percentage: calculatePercentageChange(startSpreads.handicap, liveSpreads.handicap),
          home_od_percentage: calculatePercentageChange(startSpreads.home_od, liveSpreads.home_od),
          away_od_percentage: calculatePercentageChange(startSpreads.away_od, liveSpreads.away_od),
        } : null;
  
        const totalsChanges = startTotals && liveTotals ? {
          handicap_change: roundToTwoDecimals(liveTotals.handicap - startTotals.handicap),
          over_od_change: roundToTwoDecimals(liveTotals.over_od - startTotals.over_od),
          under_od_change: roundToTwoDecimals(liveTotals.under_od - startTotals.under_od),
          handicap_percentage: calculatePercentageChange(startTotals.handicap, liveTotals.handicap),
          over_od_percentage: calculatePercentageChange(startTotals.over_od, liveTotals.over_od),
          under_od_percentage: calculatePercentageChange(startTotals.under_od, liveTotals.under_od),
        } : null;

        // Calculate absolute changes between live and liveOld
        const moneylineLatestChanges = liveMoneylines && liveOldMoneylines ? {
          home_od_change: roundToTwoDecimals(liveMoneylines.home_od - liveOldMoneylines.home_od),
          away_od_change: roundToTwoDecimals(liveMoneylines.away_od - liveOldMoneylines.away_od),
        } : null;
  
        const spreadLatestChanges = liveSpreads && liveOldSpreads ? {
          handicap_change: roundToTwoDecimals(liveSpreads.handicap - liveOldSpreads.handicap),
          home_od_change: roundToTwoDecimals(liveSpreads.home_od - liveOldSpreads.home_od),
          away_od_change: roundToTwoDecimals(liveSpreads.away_od - liveOldSpreads.away_od),
        } : null;
  
        const totalsLatestChanges = liveTotals && liveOldTotals ? {
          handicap_change: roundToTwoDecimals(liveTotals.handicap - liveOldTotals.handicap),
          over_od_change: roundToTwoDecimals(liveTotals.over_od - liveOldTotals.over_od),
          under_od_change: roundToTwoDecimals(liveTotals.under_od - liveOldTotals.under_od),
        } : null;
  
        return {
          ...game,
          changes: {
            moneylineChanges,
            spreadChanges,
            totalsChanges,
          },
          latestChanges: {
            moneylineLatestChanges,
            spreadLatestChanges,
            totalsLatestChanges,
          },
        };
      });
  
      return gamesWithChanges;
    },
    ['games'],
    {
      revalidate: 60,
      tags: ['games'], // Optionally, tag the cache if you want to invalidate it manually later
    }
);