import {prisma} from '@/db';

async function insertEventOdds(eventId: string, oddsData: any) {
    try {
        // Ensure oddsData is valid and exists
        if (!oddsData || typeof oddsData !== 'object') {
            console.warn('Invalid or undefined oddsData object, skipping odds processing.');
            return; // Exit early if oddsData is not valid
        }

        // Destructure the necessary parts of the data
        const { start = {}, kickoff = {}, end = {} } = oddsData;

        // Check if we have start and kickoff odds
        const startExists = start && Object.keys(start).length > 0;
        const kickoffExists = kickoff && Object.keys(kickoff).length > 0;
        
        // Parsing start odds (check if specific odds exist before accessing)
        const startSpreads = startExists && start["18_2"] ? start["18_2"] : null;
        const startTotals = startExists && start["18_3"] ? start["18_3"] : null;
        const startMoneylines = startExists && start["18_1"] ? start["18_1"] : null;

        // Parsing kickoff (or end) odds
        const kickoffSpreads = kickoffExists && kickoff["18_2"] ? kickoff["18_2"] : null;
        const kickoffTotals = kickoffExists && kickoff["18_3"] ? kickoff["18_3"] : null;
        const kickoffMoneylines = kickoffExists && kickoff["18_1"] ? kickoff["18_1"] : null;

        // Fetch existing game to see if odds are already present
        const existingGame = await prisma.wnbaGame.findUnique({
            where: { externalId: eventId },
            include: {
            startSpreads: true,
            startTotals: true,
            startMoneylines: true,
            kickoffSpreads: true,
            kickoffTotals: true,
            kickoffMoneylines: true,
            },
        });
    
        if (!existingGame) {
            console.warn('Game with eventId not found.');
            return;
        }
    
        // Insert start odds data into respective tables
        const startSpreadsEntry = startSpreads && !existingGame.startSpreads ? await prisma.wnbaSpreads.create({
            data: {
            home_od: parseFloat(startSpreads.home_od),
            away_od: parseFloat(startSpreads.away_od),
            handicap: parseFloat(startSpreads.handicap),
            type: 'START',
            }
        }) : null;
    
        const kickoffSpreadsEntry = kickoffSpreads && !existingGame.kickoffSpreads ? await prisma.wnbaSpreads.create({
            data: {
            home_od: parseFloat(kickoffSpreads.home_od),
            away_od: parseFloat(kickoffSpreads.away_od),
            handicap: parseFloat(kickoffSpreads.handicap),
            type: 'KICKOFF',
            }
        }) : null;
    
        const startTotalsEntry = startTotals && !existingGame.startTotals ? await prisma.wnbaTotals.create({
            data: {
            over_od: parseFloat(startTotals.over_od),
            under_od: parseFloat(startTotals.under_od),
            handicap: parseFloat(startTotals.handicap),
            type: 'START',
            }
        }) : null;
    
        const kickoffTotalsEntry = kickoffTotals && !existingGame.kickoffTotals ? await prisma.wnbaTotals.create({
            data: {
            over_od: parseFloat(kickoffTotals.over_od),
            under_od: parseFloat(kickoffTotals.under_od),
            handicap: parseFloat(kickoffTotals.handicap),
            type: 'KICKOFF',
            }
        }) : null;
    
        const startMoneylinesEntry = startMoneylines && !existingGame.startMoneylines ? await prisma.wnbaMoneylines.create({
            data: {
            home_od: parseFloat(startMoneylines.home_od),
            away_od: parseFloat(startMoneylines.away_od),
            type: 'START',
            }
        }) : null;
    
        const kickoffMoneylinesEntry = kickoffMoneylines && !existingGame.kickoffMoneylines ? await prisma.wnbaMoneylines.create({
            data: {
            home_od: parseFloat(kickoffMoneylines.home_od),
            away_od: parseFloat(kickoffMoneylines.away_od),
            type: 'KICKOFF',
            }
        }) : null;
  
        // Build the update data object dynamically based on existing odds
        const updateData: any = {};

        if (startSpreadsEntry) updateData.startSpreadsId = startSpreadsEntry.id;
        if (startTotalsEntry) updateData.startTotalsId = startTotalsEntry.id;
        if (startMoneylinesEntry) updateData.startMoneylinesId = startMoneylinesEntry.id;

        if (kickoffSpreadsEntry) updateData.kickoffSpreadsId = kickoffSpreadsEntry.id;
        if (kickoffTotalsEntry) updateData.kickoffTotalsId = kickoffTotalsEntry.id;
        if (kickoffMoneylinesEntry) updateData.kickoffMoneylinesId = kickoffMoneylinesEntry.id;

        updateData.updatedAt = new Date();

        // Update game entry only if we have some data to update
        if (Object.keys(updateData).length > 1) { // Ensures there is at least one odds update
        await prisma.wnbaGame.update({
            where: { externalId: eventId },
            data: updateData
        });
        }

        console.log('Odds data inserted/updated.');
    } catch (error) {
      console.error('Error inserting/updating odds data:', error);
    }
  }
  
  export default insertEventOdds;