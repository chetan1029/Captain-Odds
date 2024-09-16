import { stringToSlug } from '@/app/utils/toSlug';
import {prisma} from '@/db';

async function insertEventGames(home: any, away: any, time: any, id: string, time_status: string, bet365_id: string) {
    try {
      // Check if the game already exists in the database
      const existingGame = await prisma.wnbaGame.findUnique({
        where: {
          externalId: id, // Assume 'externalId' is a unique identifier for the game
        },
      });

      // If the game doesn't exist, create a new entry
      if (!existingGame) {
        await prisma.wnbaGame.create({
          data: {
            homeTeam: {
              connectOrCreate: {
                where: { externalId: home.id },
                create: { name: home.name, logo: home.image_id, externalId: home.id, slug: stringToSlug(home.name) },
              },
            },
            awayTeam: {
              connectOrCreate: {
                where: { externalId: away.id },
                create: { name: away.name, logo: away.image_id, externalId: away.id, slug: stringToSlug(away.name) },
              },
            },
            date: new Date(time * 1000), // Convert timestamp to JS Date object
            externalId: id,
            dateUtc: time,
            bet365Id: bet365_id,
            status: time_status
          },
        });
      }
    } catch (error) {
        console.error('Error inserting/updating event games data:', error);
    }
}
    
export default insertEventGames;
