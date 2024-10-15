import type { WnbaTeam } from '@prisma/client'
import {prisma} from '@/db'
import { unstable_cache } from "next/cache";

// Define a custom type that extends WnbaTeam to include stats
type WnbaTeamWithStats = WnbaTeam & {
  stats: {
      wins: number;
      losses: number;
      totalOvers: number;
      totalUnders: number;
      spreadWins: number;
      spreadLosses: number;
  };
};

export const getTeams = unstable_cache(
    async (): Promise<WnbaTeam[]> => {
        // Fetch Games from the database
        const teams = await prisma.wnbaTeam.findMany()

        return teams;
    },
    ['teams'],
    {
      revalidate: 600,
      tags: ['teams'], // Optionally, tag the cache if you want to invalidate it manually later
    }
);

export const getTeamBySlug = unstable_cache(
    async (teamSlug: string): Promise<WnbaTeamWithStats> => {
        // Fetch Games from the database
        const team = await prisma.wnbaTeam.findFirst({
            where: {
              slug: teamSlug,
            },
            include: {
              homeGames: {
                include: {
                  homeTeam: true,
                  awayTeam: true,
                  scores: false,
                  stats: false,
                  startSpreads: false,
                  kickoffSpreads: true,
                  startTotals: false,
                  kickoffTotals: true,
                  startMoneylines: false,
                  kickoffMoneylines: false,
                },
              },
              awayGames: {
                include: {
                  homeTeam: true,
                  awayTeam: true,
                  scores: false,
                  stats: false,
                  startSpreads: false,
                  kickoffSpreads: true,
                  startTotals: false,
                  kickoffTotals: true,
                  startMoneylines: false,
                  kickoffMoneylines: false,
                },
              },
            },
          })

        if (!team) {
            throw new Error(`Team with slug ${teamSlug} not found`);
        }

        const homeWins = team.homeGames.filter(game => (game.homeScore ?? 0) > (game.awayScore ?? 0)).length;
        const awayWins = team.awayGames.filter(game => (game.awayScore ?? 0) > (game.homeScore ?? 0)).length;
        const homeLosses = team.homeGames.filter(game => (game.homeScore ?? 0) < (game.awayScore ?? 0)).length;
        const awayLosses = team.awayGames.filter(game => (game.awayScore ?? 0) < (game.homeScore ?? 0)).length;


        const totalWins = homeWins + awayWins;
        const totalLosses = homeLosses + awayLosses;

        const totalHomeOvers = team.homeGames.filter(
          (game) => game.kickoffTotals && (game.homeScore ?? 0) + (game.awayScore ?? 0) < game.kickoffTotals.handicap
        ).length;
        const totalAwayOvers = team.awayGames.filter(
          (game) => game.kickoffTotals && (game.homeScore ?? 0) + (game.awayScore ?? 0) < game.kickoffTotals.handicap
        ).length;
        const totalHomeUnders = team.homeGames.filter(
          (game) => game.kickoffTotals && (game.homeScore ?? 0) + (game.awayScore ?? 0) > game.kickoffTotals.handicap
        ).length;
        const totalAwayUnders = team.awayGames.filter(
          (game) => game.kickoffTotals && (game.homeScore ?? 0) + (game.awayScore ?? 0) > game.kickoffTotals.handicap
        ).length;

        const totalOvers = totalHomeOvers + totalAwayOvers
        const totalUnders = totalHomeUnders + totalAwayUnders;

        const homeSpreadWin = team.homeGames.filter(
          (game) => game.kickoffSpreads && (game.homeScore ?? 0) + (game.kickoffSpreads.handicap ?? 0) > (game.awayScore ?? 0)
        ).length;
        const awaySpreadWin = team.awayGames.filter(
          (game) => game.kickoffSpreads && (game.awayScore ?? 0) + (game.kickoffSpreads.handicap ?? 0) > (game.homeScore ?? 0)
        ).length;
        const homeSpreadLoss = team.homeGames.filter(
          (game) => game.kickoffSpreads && (game.homeScore ?? 0) + (game.kickoffSpreads.handicap ?? 0) < (game.awayScore ?? 0)
        ).length;
        const awaySpreadLoss = team.awayGames.filter(
          (game) => game.kickoffSpreads && (game.awayScore ?? 0) + (game.kickoffSpreads.handicap ?? 0) < (game.homeScore ?? 0)
        ).length;

        const spreadWins = homeSpreadWin + awaySpreadWin
        const spreadLosses = homeSpreadLoss + awaySpreadLoss;

        return {
            ...team,
            stats: {
                wins: totalWins,
                losses: totalLosses,
                totalOvers: totalOvers,
                totalUnders: totalUnders,
                spreadWins: spreadWins,
                spreadLosses: spreadLosses,
            }
        };
    },
    ['teambySlug'],
    {
      revalidate: 600,
      tags: ['teambySlug'], // Optionally, tag the cache if you want to invalidate it manually later
    }
);