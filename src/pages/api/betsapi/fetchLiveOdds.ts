// Import necessary modules
import { format } from 'date-fns';
import insertEventGames from './common/eventGames';
import insertEventOdds from './common/eventOdds';
import { sleep } from './utils';
import { getGamesOdds } from '@/db/queries/odds';

// Fetch games from the external API
async function fetchLiveOdds(eventIds: string[]) {

  // Check if the data contains upcoming events
  for (const externalEventId of eventIds) {
    // Wait for 10 seconds before fetching the next event's odds
      console.log(externalEventId)
      sleep(10)
      // Fetch and update oods data 
      const odds_response = await fetch('https://api.b365api.com/v2/event/odds/summary?token=39110-RHppqfIogUBlF1&event_id='+externalEventId);
      const odds_data = await odds_response.json();
      const odds_events = odds_data.results?.Bet365?.odds;

      // Insert event odds
      insertEventOdds(externalEventId, odds_events);
  }

  return { status: 'success Live odds' };
}

// Handler for API request
// call as /betsapi/fetchUpcomingEvent?startDate=2024-10-01&endDate=2024-10-05
export default async function handler(req: any, res: any) {
  try {
    const games = await getGamesOdds();
    if(games.length > 0){
        const eventIds = games.map((game: any) => game.externalId);
        await fetchLiveOdds(eventIds);
    }
    res.status(200).json({ status: 'success Live odds' });

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching games' });
  }
}
