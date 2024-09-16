import type { WnbaGame } from '@prisma/client'
import {prisma} from '@/db'
import { unstable_cache } from "next/cache";

export const getGamesByDateUtc = unstable_cache(
    async (date: string): Promise<WnbaGame[]> => {
        // Parse the date string and create a Date object in the Toronto timezone
        const torontoDate = new Date(date);
        console.log(torontoDate)
        
        // Convert the date to the Toronto timezone and get the offset in minutes
        const torontoTime = torontoDate.toLocaleString('en-US', { timeZone: 'America/Toronto' });
        const offsetDate = new Date(torontoTime);
        const offset = torontoDate.getTime() - offsetDate.getTime();
        
        // Convert the Toronto time to UTC time
        const utcDate = new Date(torontoDate.getTime() + offset);

        // Get the start and end of the day in UTC
        const startOfDayUtc = new Date(utcDate);
        startOfDayUtc.setUTCHours(0, 0, 0, 0);
        const endOfDayUtc = new Date(utcDate);
        endOfDayUtc.setUTCHours(23, 59, 59, 999);

        const startTimestamp = Math.floor(startOfDayUtc.getTime() / 1000);
        const endTimestamp = Math.floor(endOfDayUtc.getTime() / 1000);
        console.log(startTimestamp, endTimestamp)

        // Fetch Games from the database
        const games = await prisma.wnbaGame.findMany({
            where: {
                dateUtc: {
                    gte: startTimestamp.toString(),
                    lte: endTimestamp.toString(),
                  },
            },
            include: {
                homeTeam: true,
                awayTeam: true,
                scores: true,
                stats: true,
            },
        })

        return games;
    },
    ['games'],
    {
      revalidate: 60,
      tags: ['games'], // Optionally, tag the cache if you want to invalidate it manually later
    }
);