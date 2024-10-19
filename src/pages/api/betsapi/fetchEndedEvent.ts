// Import necessary modules
import { format } from 'date-fns';
import insertEventGames from './common/eventGames';
import insertEventOdds from './common/eventOdds';
import insertGameScoresAndStats from './common/eventScoreStats';
import { sleep } from './utils';

// Fetch games from the external API
async function fetchEndedEvent(formattedDate: string) {
  const response = await fetch(`https://api.b365api.com/v3/events/ended?sport_id=18&league_id=244&token=39110-RHppqfIogUBlF1&per_page=100&day=${formattedDate}`);
  const data = await response.json();

  // Check if the data contains upcoming events
  if (data && data.results) {
    const events = data.results;

    // Store data in the database using Prisma
    for (const event of events) {
      const { home, away, time, id, time_status, bet365_id } = event;
      const externalEventId = id

      // Insert event game
      await insertEventGames(home, away, time, id, time_status, bet365_id)

      sleep(10) // 10 seconds
      // Fetch and update odds data 
      const score_response = await fetch('https://api.b365api.com/v1/event/view?token=39110-RHppqfIogUBlF1&event_id='+externalEventId);
      const score_data = await score_response.json();
      
      // Insert event odds
      insertGameScoresAndStats(externalEventId, score_data);

      sleep(10) // 10 seconds
      // Fetch and update odds data 
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
// call as /betsapi/fetchEndedEvent?startDate=2024-10-01&endDate=2024-10-05
export default async function handler(req: any, res: any) {
  try {
    // Extract start and end dates from the query parameters
    const { startDate: startDateParam, endDate: endDateParam } = req.query;

    // Get today's date
    const today = new Date();
    
    // Set the default endDate to yesterday
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    // If startDate or endDate are not provided, default startDate to today and endDate to yesterday
    const endDate = endDateParam ? new Date(endDateParam) : today; // If endDate is not provided, use yesterday
    const startDate = startDateParam ? new Date(startDateParam) : yesterday; // If startDate is not provided, use today

    // Check if dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    // Ensure startDate is before endDate
    if (startDate > endDate) {
      return res.status(400).json({ error: 'Start date must be before end date' });
    }

    let currentDate = startDate;

    while (currentDate <= endDate) {
      const formattedDate = format(currentDate, 'yyyyMMdd');
      console.log(formattedDate);
      await fetchEndedEvent(formattedDate);

      currentDate.setDate(currentDate.getDate() + 1);
    }
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching games' });
  }
}
