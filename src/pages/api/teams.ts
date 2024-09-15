import { getTeams } from "@/db/queries/teams";

export default async function handler(req: any, res: any) {
  try {
    const teams = await getTeams();
    res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
}

