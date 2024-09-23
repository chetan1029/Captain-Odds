import { formatTime } from "@/app/utils/formatDate";
import Image from "next/image";
import { useEffect, useState } from "react";
import { start } from "repl";

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
  startMoneylines: any;
  startSpreads: any;
  startTotals: any;
  kickoffMoneylines: any;
  kickoffSpreads: any;
  kickoffTotals: any;
  // other properties
}

interface GameScoreProps {
  game: Game;
  oddsType: "MoneyLine" | "Spread" | "Total";
}

const GameScore: React.FC<GameScoreProps> = ({ game, oddsType }) => {
  const [startOdds, setStartOdds] = useState("");
  const [kickOffOdds, setKickOffOdds] = useState("");

  // Setup Odds
  useEffect(() => {
    // Set odds based on the selected oddsType
    if (oddsType === "MoneyLine") {
      setStartOdds(game.startMoneylines);
      setKickOffOdds(game.kickoffMoneylines);
    } else if (oddsType === "Spread") {
      setStartOdds(game.startSpreads);
      setKickOffOdds(game.kickoffSpreads);
    } else if (oddsType === "Total") {
      setStartOdds(game.startTotals);
      setKickOffOdds(game.kickoffTotals);
    }
  }, [oddsType, game]);

  // for the score
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
      <th key={quarter} className="px-4 pb-2 text-center">
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

  // For the Start, Kickoff and live odds
  const renderOddsType = () => {
    return (
      <>
        <th className="px-3 pb-2 whitespace-nowrap">OPEN</th>
        <th className="px-3 pb-2 whitespace-nowrap">KICKOFF</th>
      </>
    );
  };

  const getOddsValue = (
    odds: any,
    type: "MoneyLine" | "Spread" | "Total",
    isHomeTeam: boolean
  ) => {
    if (!odds) return undefined;

    // Helper function to format odds with a "+" for positive values
    const formatOdds = (value: number) => {
      return value > 0 ? `+${value}` : `${value}`;
    };

    if (type === "MoneyLine") {
      return { main: isHomeTeam ? odds.home_od : odds.away_od };
    }
    if (type === "Spread") {
      const home_handicap = odds.handicap;
      const away_handicap =
        home_handicap > 0 ? -Math.abs(home_handicap) : Math.abs(home_handicap);
      return {
        main: isHomeTeam
          ? formatOdds(home_handicap)
          : formatOdds(away_handicap),
        sub: isHomeTeam ? odds.home_od : odds.away_od,
      };
    }
    if (type === "Total") {
      return {
        main: isHomeTeam ? `o${odds.handicap}` : `u${odds.handicap}`,
        sub: isHomeTeam ? odds.over_od : odds.under_od,
      };
    }
  };

  const OddsButton = ({
    mainText,
    subText,
  }: {
    mainText: string | number;
    subText?: string | number;
  }) => (
    <button
      className="w-32 h-12 flex flex-col items-center justify-center rounded-md border border-slate-300 py-1 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      type="button"
    >
      <span className="text-md">{mainText}</span>
      {subText && <span className="text-xs">{subText}</span>}
    </button>
  );

  const renderOdds = (
    team: "homeTeam" | "awayTeam",
    startOdds: any,
    kickOffOdds: any,
    type: "MoneyLine" | "Spread" | "Total"
  ) => {
    const isHomeTeam = team === "homeTeam";

    const startOddsValue = getOddsValue(startOdds, type, isHomeTeam);
    const kickOffOddsValue = getOddsValue(kickOffOdds, type, isHomeTeam);

    return (
      <>
        <td key={startOdds?.id} className="px-3 pb-2">
          {startOddsValue && (
            <OddsButton
              mainText={startOddsValue.main}
              subText={startOddsValue.sub}
            />
          )}
        </td>
        <td key={kickOffOdds?.id} className="px-3 pb-2">
          {kickOffOddsValue && (
            <OddsButton
              mainText={kickOffOddsValue.main}
              subText={kickOffOddsValue.sub}
            />
          )}
        </td>
      </>
    );
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
          {renderOddsType()}
          {renderPeriod(quartersToShow())}
          {game.status === "Pending" ? null : (
            <th className="px-4 pb-2 text-center">T</th>
          )}
        </tr>
      </thead>
      <tbody>
        <tr className="text-sm">
          <td className="pr-10">
            <div className="flex w-32 gap-x-4">
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

              <div className="flex-auto flex items-center">
                <p className="font-semibold leading-6 text-gray-900 text-left">
                  {getShortName(game.homeTeam.name)}
                </p>
              </div>
            </div>
          </td>
          {renderOdds("homeTeam", startOdds, kickOffOdds, oddsType)}
          {renderPeriodScores("homeTeam", quartersToShow())}
          {renderTotal("homeTeam")}
        </tr>
        <tr className="text-sm">
          <td className="pr-10">
            <div className="flex w-32 gap-x-4">
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

              <div className="flex-auto flex items-center">
                <p className="font-semibold leading-6 text-gray-900 text-left">
                  {getShortName(game.awayTeam.name)}
                </p>
              </div>
            </div>
          </td>
          {renderOdds("awayTeam", startOdds, kickOffOdds, oddsType)}
          {renderPeriodScores("awayTeam", quartersToShow())}
          {renderTotal("awayTeam")}
        </tr>
      </tbody>
    </table>
  );
};

export default GameScore;
