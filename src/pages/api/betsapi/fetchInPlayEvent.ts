// Import necessary modules
import { format } from 'date-fns';
import insertEventGames from './common/eventGames';
import insertEventOdds from './common/eventOdds';
import { sleep } from './utils';
import insertGameScoresAndStats from './common/eventScoreStats';

// Fetch games from the external API
async function fetchInPlayEvent() {
  const response = await fetch(`https://api.b365api.com/v3/events/inplay?sport_id=18&league_id=244&token=39110-RHppqfIogUBlF1`);
  const data = await response.json();

  // Check if the data contains upcoming events
  if (data && data.results) {
    const events = data.results;

    // Store data in the database using Prisma
    for (const event of events) {
      const { home, away, time, id, time_status, bet365_id } = event;
      const externalEventId = id

      // Insert event game
      insertEventGames(home, away, time, id, time_status, bet365_id)

      sleep(10) // 10 seconds
      // Fetch and update odds data 
      const score_response = await fetch('https://api.b365api.com/v1/event/view?token=39110-RHppqfIogUBlF1&event_id='+externalEventId);
      const score_data = await score_response.json();
      
      // Insert event odds
      insertGameScoresAndStats(externalEventId, score_data);

      sleep(10)
      // Fetch and update oods data 
      const odds_response = await fetch('https://api.b365api.com/v2/event/odds/summary?token=39110-RHppqfIogUBlF1&event_id='+externalEventId);
      const odds_data = await odds_response.json();
      const odds_events = odds_data.results?.Bet365?.odds;

      // Insert event odds
      insertEventOdds(externalEventId, odds_events);
    }
  }

  return { status: 'success' };
}

// Handler for API request
export default async function handler(req: any, res: any) {
  try {
    await fetchInPlayEvent();
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching games' });
  }
}
