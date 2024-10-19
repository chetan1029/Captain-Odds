import { getGamesOdds } from '@/db/queries/odds';

export default async function handler(req: any, res: any) {
  try {
    const games = await getGamesOdds();
    res.status(200).json(games);
  } catch (error) {
    console.error("Error fetching games odds:", error);
    res.status(500).json({ error: 'Failed to fetch game odds' });
  }
}
