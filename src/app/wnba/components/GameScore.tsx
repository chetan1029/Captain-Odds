import { getShortName } from "@/app/utils/common";
import { formatTime } from "@/app/utils/formatDate";
import Image from "next/image";
import { useEffect, useState } from "react";

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
  liveMoneylines: any;
  liveSpreads: any;
  liveTotals: any;
}

interface GameScoreProps {
  game: Game;
  oddsType: "MoneyLine" | "Spread" | "Total";
}

const GameScore: React.FC<GameScoreProps> = ({ game, oddsType }) => {
  const [startOdds, setStartOdds] = useState("");
  const [kickOffOdds, setKickOffOdds] = useState("");
  const [liveOdds, setLiveOdds] = useState("");

  // Setup Odds
  useEffect(() => {
    // Set odds based on the selected oddsType
    if (oddsType === "MoneyLine") {
      setStartOdds(game.startMoneylines);
      setKickOffOdds(game.kickoffMoneylines);
      setLiveOdds(game.liveMoneylines);
    } else if (oddsType === "Spread") {
      setStartOdds(game.startSpreads);
      setKickOffOdds(game.kickoffSpreads);
      setLiveOdds(game.liveSpreads);
    } else if (oddsType === "Total") {
      setStartOdds(game.startTotals);
      setKickOffOdds(game.kickoffTotals);
      setLiveOdds(game.liveTotals);
    }
  }, [oddsType, game]);

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
      <th key={quarter} className="w-1/12 px-4 pb-2 text-center">
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
          <td key={quarter} className="px-3 text-center">
            -
          </td>
        ); // No score for this quarter
      }

      return (
        <td key={score.id} className="px-3 text-center">
          {team === "homeTeam" ? score.homeScore : score.awayScore}
        </td>
      );
    });
  };

  const renderTotal = (team: "homeTeam" | "awayTeam", teamClass: string) => {
    const teamScore = team === "homeTeam" ? game.homeScore : game.awayScore;

    return (
      <td className={`text-center text-lg px-3 font-medium ${teamClass}`}>
        {teamScore}
      </td>
    );
  };

  const renderStatus = (game: any) => {
    if (game.status === "0") {
      return <p className="font-medium">{formatTime(game.dateUtc)}</p>;
    } else if (game.status === "3") {
      return <p className="font-medium">{"Final"}</p>;
    } else if (game.status === "1") {
      return (
        <>
          <div className="flex-none rounded-full bg-emerald-500/20 p-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>{" "}
          <p className="leading-5">Live</p>
        </>
      );
    }
  };

  // For the Start, Kickoff and live odds
  const renderOddsType = () => {
    return (
      <>
        <th className="w-auto px-3 pb-2 whitespace-nowrap">OPEN</th>
        <th className="w-auto px-3 pb-2 whitespace-nowrap">KICKOFF</th>
        <th className="w-auto px-3 pb-2 whitespace-nowrap">LIVE</th>
      </>
    );
  };

  const getOddsValue = (
    odds: any,
    type: "MoneyLine" | "Spread" | "Total",
    isHomeTeam: boolean,
    homeScore: number,
    awayScore: number
  ) => {
    if (!odds) return undefined;

    // Helper function to format odds with a "+" for positive values
    const formatOdds = (value: number) => {
      return value > 0 ? `+${value}` : `${value}`;
    };

    if (type === "MoneyLine") {
      const isHomeWinning = homeScore > awayScore ? true : false;
      return {
        main: isHomeTeam ? odds.home_od : odds.away_od,
        isWinning: isHomeTeam ? isHomeWinning : !isHomeWinning,
      };
    }
    if (type === "Spread") {
      const home_handicap = odds.handicap;
      const away_handicap =
        home_handicap > 0 ? -Math.abs(home_handicap) : Math.abs(home_handicap);
      const homeSpreadWinning =
        odds.handicap + homeScore > awayScore ? true : false;
      return {
        main: isHomeTeam
          ? formatOdds(home_handicap)
          : formatOdds(away_handicap),
        sub: isHomeTeam ? odds.home_od : odds.away_od,
        isWinning: isHomeTeam ? homeSpreadWinning : !homeSpreadWinning,
      };
    }
    if (type === "Total") {
      const isOverWinning =
        odds.handicap < homeScore + awayScore ? true : false;
      return {
        main: isHomeTeam ? `o${odds.handicap}` : `u${odds.handicap}`,
        sub: isHomeTeam ? odds.over_od : odds.under_od,
        isWinning: isHomeTeam ? isOverWinning : !isOverWinning,
      };
    }
  };

  const OddsButton = ({
    mainText,
    subText,
    isWinning,
  }: {
    mainText: string | number;
    subText?: string | number;
    isWinning?: boolean;
  }) => (
    <button
      className={`w-24 h-12 md:w-32 flex flex-col items-center justify-center rounded-md border py-1 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 ${
        isWinning && game.status == "3"
          ? "border-green-500"
          : "border-slate-300"
      }`}
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
    liveOdds: any,
    type: "MoneyLine" | "Spread" | "Total"
  ) => {
    const isHomeTeam = team === "homeTeam";

    const startOddsValue = getOddsValue(
      startOdds,
      type,
      isHomeTeam,
      homeScore,
      awayScore
    );
    const kickOffOddsValue = getOddsValue(
      kickOffOdds,
      type,
      isHomeTeam,
      homeScore,
      awayScore
    );
    const liveOddsValue = getOddsValue(
      liveOdds,
      type,
      isHomeTeam,
      homeScore,
      awayScore
    );

    return (
      <>
        <td key={startOdds?.id} className="px-3 pb-2">
          {startOddsValue && (
            <OddsButton
              mainText={startOddsValue.main}
              subText={startOddsValue.sub}
              isWinning={startOddsValue.isWinning}
            />
          )}
        </td>
        <td key={kickOffOdds?.id} className="px-3 pb-2">
          {kickOffOddsValue && (
            <OddsButton
              mainText={kickOffOddsValue.main}
              subText={kickOffOddsValue.sub}
              isWinning={kickOffOddsValue.isWinning}
            />
          )}
        </td>
        <td key={liveOdds?.id} className="px-3 pb-2">
          {liveOddsValue && (
            <OddsButton
              mainText={liveOddsValue.main}
              subText={liveOddsValue.sub}
              isWinning={liveOddsValue.isWinning}
            />
          )}
        </td>
      </>
    );
  };

  // Determine which team has the higher score
  const homeScore = game.homeScore;
  const awayScore = game.awayScore;

  const homeScoreClass =
    homeScore >= awayScore ? "text-black" : "text-gray-500";
  const awayScoreClass =
    awayScore >= homeScore ? "text-black" : "text-gray-500";

  return (
    <table className="table-fixed md:w-full mr-5">
      <thead>
        <tr className="text-sm">
          <th className="w-auto pb-2 sticky left-0 bg-white">
            <div className="flex items-center gap-x-1.5">
              {renderStatus(game)}
            </div>
          </th>
          {renderOddsType()}
          {renderPeriod(quartersToShow())}
          {game.status === "0" ? null : (
            <th className="w-1/12 px-4 pb-2 text-center">T</th>
          )}
        </tr>
      </thead>
      <tbody>
        <tr className="text-sm">
          <td className="sticky left-0 bg-white">
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
                <p
                  className={`font-semibold leading-6 text-left ${homeScoreClass}`}
                >
                  {getShortName(game.homeTeam.name)}
                </p>
              </div>
            </div>
          </td>
          {renderOdds("homeTeam", startOdds, kickOffOdds, liveOdds, oddsType)}
          {renderPeriodScores("homeTeam", quartersToShow())}
          {game.status == "0" ? "" : renderTotal("homeTeam", homeScoreClass)}
        </tr>
        <tr className="text-sm">
          <td className="sticky left-0 bg-white">
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
                <p
                  className={`font-semibold leading-6 text-left ${awayScoreClass}`}
                >
                  {getShortName(game.awayTeam.name)}
                </p>
              </div>
            </div>
          </td>
          {renderOdds("awayTeam", startOdds, kickOffOdds, liveOdds, oddsType)}
          {renderPeriodScores("awayTeam", quartersToShow())}
          {game.status == "0" ? "" : renderTotal("awayTeam", awayScoreClass)}
        </tr>
      </tbody>
    </table>
  );
};

export default GameScore;
