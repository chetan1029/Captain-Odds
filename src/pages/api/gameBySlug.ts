import { getGameBySlug } from "@/db/queries/games";

export default async function handler(req: any, res: any) {
  try {
    // Extract the date from the query parameters
    const { gameSlug } = req.query;
    const game = await getGameBySlug(parseInt(gameSlug));
    res.status(200).json(game);
  } catch (error) {
    console.error("Error fetching game:", error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
}

