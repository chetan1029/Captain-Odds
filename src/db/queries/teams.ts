import type { WnbaTeam } from '@prisma/client'
import {prisma} from '@/db'
import { unstable_cache } from "next/cache";

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
    async (teamSlug: string): Promise<WnbaTeam> => {
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
                  kickoffSpreads: false,
                  startTotals: false,
                  kickoffTotals: false,
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
                  kickoffSpreads: false,
                  startTotals: false,
                  kickoffTotals: false,
                  startMoneylines: false,
                  kickoffMoneylines: false,
                },
              },
            },
          })

        if (!team) {
            throw new Error(`Team with slug ${teamSlug} not found`);
        }

        return team;
    },
    ['teambySlug'],
    {
      revalidate: 600,
      tags: ['teambySlug'], // Optionally, tag the cache if you want to invalidate it manually later
    }
);