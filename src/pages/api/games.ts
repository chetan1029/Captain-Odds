import { getTodayDate } from '@/app/utils/formatDate';
import { getGamesByDateUtc } from '@/db/queries/games';

export default async function handler(req: any, res: any) {
  try {
    // Extract the date from the query parameters
    const { date } = req.query;
    // If no date is provided, use the current date
    const targetDate = date ? date : getTodayDate();
    
    const games = await getGamesByDateUtc(targetDate);
    res.status(200).json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
}
