import { formatTime } from "@/app/utils/formatDate";
import Image from "next/image";

interface Score {
  id: number;
  gameId: number;
  quarter: number;
  homeScore: number;
  awayScore: number;
  createdAt: string;
}

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Game {
  id: number;
  date: string;
  dateUtc: string;
  homeTeamId: number;
  awayTeamId: number;
  scores: Score[];
  homeTeam: Team;
  awayTeam: Team;
  status: string;
  homeScore: number;
  awayScore: number;
  // other properties
}

interface GameScoreProps {
  game: Game;
  type: string;
}

const GameScore: React.FC<GameScoreProps> = ({ game, type }) => {
  const getShortName = (name: string) => {
    return name.split(/[\s-]/)[0];
  };

  const quartersToShow = () => {
    const uniqueQuarters = Array.from(
      new Set(game.scores.map((score) => score.quarter))
    ).sort((a, b) => a - b);

    // Exclude quarters 3 (halftime) and 7 (total)
    const filteredQuarters = uniqueQuarters.filter(
      (quarter) => quarter !== 3 && quarter !== 7
    );

    return filteredQuarters;
  };

  const renderPeriod = (quartersToShow: any) => {
    return quartersToShow.map((quarter: any) => (
      <th key={quarter} className="px-3 pb-2">
        {quarter >= 3 ? quarter - 1 : quarter}
      </th>
    ));
  };

  const renderPeriodScores = (
    team: "homeTeam" | "awayTeam",
    quarters: number[]
  ) => {
    // Filter scores to only include those for quarters that are being shown
    const filteredScores = game.scores.filter((score) =>
      quarters.includes(score.quarter)
    );

    return quarters.map((quarter) => {
      // Find the score for the current quarter
      const score = filteredScores.find((s) => s.quarter === quarter);

      if (!score) {
        return (
          <td key={quarter} className="px-3">
            -
          </td>
        ); // No score for this quarter
      }

      return (
        <td key={score.id} className="px-3">
          {team === "homeTeam" ? score.homeScore : score.awayScore}
        </td>
      );
    });
  };

  const renderTotal = (team: "homeTeam" | "awayTeam") => {
    const teamScore = team === "homeTeam" ? game.homeScore : game.awayScore;

    return (
      <td
        className={`px-3 font-bold ${game.status === "Final" && teamScore === game.homeScore ? "text-green-500" : ""}`}
      >
        {teamScore}
      </td>
    );
  };

  const renderStatus = (game: any) => {
    if (game.status === "0") {
      return <p className="font-medium">{formatTime(game.dateUtc)}</p>;
    } else if (game.status === "3") {
      return <p className="font-medium">{"Final"}</p>;
    } else {
      return (
        <>
          <div className="flex-none rounded-full bg-emerald-500/20 p-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>{" "}
          <p className="leading-5">{game.status}</p>
        </>
      );
    }
  };
  return (
    <table className="table-fixed mr-5">
      <thead>
        <tr className="text-sm">
          <th className="w-full pb-2">
            <div className="flex items-center gap-x-1.5">
              {renderStatus(game)}
            </div>
          </th>
          {renderPeriod(quartersToShow())}
          {game.status === "Pending" ? null : <th className="px-3 pb-2">T</th>}
        </tr>
      </thead>
      <tbody>
        <tr className="text-sm">
          <td className="pr-10">
            <div className="flex min-w-0 gap-x-4">
              {type == "gameList" ? (
                <Image
                  className="h-10 w-10 flex-none rounded-full bg-gray-50"
                  src={
                    "https://assets.b365api.com/images/team/m/" +
                      game.homeTeam.logo +
                      ".png" || "/placeholder-logo.png"
                  }
                  alt={game.homeTeam.name}
                  width={30}
                  height={30}
                />
              ) : null}
              <div className="flex-auto flex items-center">
                <p className="font-semibold leading-6 text-gray-900 text-left">
                  {getShortName(game.homeTeam.name)}
                </p>
              </div>
            </div>
          </td>
          {renderPeriodScores("homeTeam", quartersToShow())}
          {renderTotal("homeTeam")}
        </tr>
        <tr className="text-sm">
          <td className="pr-10">
            <div className="flex min-w-0 gap-x-4">
              {type == "gameList" ? (
                <Image
                  className="h-10 w-10 flex-none rounded-full bg-gray-50 "
                  src={
                    "https://assets.b365api.com/images/team/m/" +
                      game.awayTeam.logo +
                      ".png" || "/placeholder-logo.png"
                  }
                  alt={game.awayTeam.name}
                  width={30}
                  height={30}
                />
              ) : null}
              <div className="flex-auto flex items-center">
                <p className="font-semibold leading-6 text-gray-900 text-left">
                  {getShortName(game.awayTeam.name)}
                </p>
              </div>
            </div>
          </td>
          {renderPeriodScores("awayTeam", quartersToShow())}
          {renderTotal("awayTeam")}
        </tr>
      </tbody>
    </table>
  );
};

export default GameScore;
