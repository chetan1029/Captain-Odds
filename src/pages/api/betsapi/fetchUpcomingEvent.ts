// Import necessary modules
import { format } from 'date-fns';
import insertEventGames from './common/eventGames';
import insertEventOdds from './common/eventOdds';
import { sleep } from './utils';

// Fetch games from the external API
async function fetchUpcomingEvent(formattedDate: string) {
  const response = await fetch(`https://api.b365api.com/v3/events/upcoming?sport_id=18&league_id=244&token=39110-RHppqfIogUBlF1&per_page=100&day=${formattedDate}`);
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
// call as /betsapi/fetchUpcomingEvent?startDate=2024-10-01&endDate=2024-10-05
export default async function handler(req: any, res: any) {
  try {
    const { startDate: startDateParam, endDate: endDateParam } = req.query;

    // Get today's date
    const today = new Date();
    
    // Set the default endDate to yesterday
    const twoMoreDate = new Date(today);
    twoMoreDate.setDate(today.getDate() + 1);

    const endDate = endDateParam ? new Date(endDateParam) : twoMoreDate;
    const startDate = startDateParam ? new Date(startDateParam) : today;

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
      await fetchUpcomingEvent(formattedDate);

      currentDate.setDate(currentDate.getDate() + 1);
      
    }
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching games' });
  }
}
