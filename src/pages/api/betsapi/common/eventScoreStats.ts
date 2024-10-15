import {prisma} from '@/db';

type Score = {
    home: string;
    away: string;
};

type Stats = {
    [key: string]: [string, string];  // Each stat contains two string values for home and away
};

type GameDataResult = {
    ss: string;
    scores: Record<string, Score>;
    stats: Stats;
    bet365_id: string;
};

type GameData = {
    results: GameDataResult[];
};

async function insertGameScoresAndStats(eventId: string, gameData: GameData) {
    try {
        const {
            ss,           // Final score "77-92"
            scores,       // Scores by quarters
            stats,        // Game statistics
            bet365_id
        } = gameData.results[0];

        const [homeScore, awayScore] = ss.split('-').map(Number);  // Parse final scores

        // Get the game ID from the database
        const game = await prisma.wnbaGame.findUnique({
            where: { externalId: eventId }
        });

        if (!game) {
            throw new Error('Game not found in database');
        }

        // Update bet365_id in the WnbaGame table
        await prisma.wnbaGame.update({
            where: { externalId: eventId },
            data: { bet365Id: bet365_id, homeScore: homeScore, awayScore: awayScore}
        });

        // Insert or update quarter-by-quarter scores
        for (const [quarter, score] of Object.entries(scores)) {
            const existingScore = await prisma.wnbaScore.findFirst({
                where: {
                    gameId: game.id,
                    quarter: parseInt(quarter)
                }
            });

            if (existingScore) {
                // Update the existing score if it already exists
                await prisma.wnbaScore.update({
                    where: { id: existingScore.id },
                    data: {
                        homeScore: parseInt(score.home),
                        awayScore: parseInt(score.away)
                    }
                });
            } else {
                // Create a new score if it doesn't exist
                await prisma.wnbaScore.create({
                    data: {
                        gameId: game.id,
                        quarter: parseInt(quarter),
                        homeScore: parseInt(score.home),
                        awayScore: parseInt(score.away),
                    }
                });
            }
        }

        // Insert or update stats
        for (const [statType, values] of Object.entries(stats)) {
            const [homeValue, awayValue] = values.map(Number);

            const existingStat = await prisma.wnbaStats.findFirst({
                where: {
                    gameId: game.id,
                    statType
                }
            });

            if (existingStat) {
                // Update the existing stat if it already exists
                await prisma.wnbaStats.update({
                    where: { id: existingStat.id },
                    data: {
                        homeValue,
                        awayValue
                    }
                });
            } else {
                // Create a new stat if it doesn't exist
                await prisma.wnbaStats.create({
                    data: {
                        gameId: game.id,
                        statType,
                        homeValue,
                        awayValue
                    }
                });
            }
        }

        console.log('Game scores and stats inserted successfully.');
    } catch (error) {
        console.error('Error inserting game scores and stats:', error);
    }
}

export default insertGameScoresAndStats;
