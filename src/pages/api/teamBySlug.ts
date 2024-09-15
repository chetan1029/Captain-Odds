import { getTeamBySlug } from "@/db/queries/teams";

export default async function handler(req: any, res: any) {
  try {
    // Extract the date from the query parameters
    const { teamSlug } = req.query;
    const team = await getTeamBySlug(teamSlug);
    res.status(200).json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
}

