import { getShortName } from "@/app/utils/common";
import { formatDateTimeMonthOnly, formatTime } from "@/app/utils/formatDate";
import { OddsType } from "@prisma/client";
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
  changes: any;
  latestChanges: any;
}

interface GameOddsProps {
  game: Game;
  oddsType: "MoneyLine" | "Spread" | "Total";
}

const GameOdds: React.FC<GameOddsProps> = ({ game, oddsType }) => {
  const [startOdds, setStartOdds] = useState("");
  const [kickOffOdds, setKickOffOdds] = useState("");
  const [liveOdds, setLiveOdds] = useState("");
  const [changeOdds, setChangeOdds] = useState("");
  const [latestChangeOdds, setLatestChangeOdds] = useState("");

  // Setup Odds
  useEffect(() => {
    // Set odds based on the selected oddsType
    if (oddsType === "MoneyLine") {
      setStartOdds(game.startMoneylines);
      setKickOffOdds(game.kickoffMoneylines);
      setLiveOdds(game.liveMoneylines);
      setChangeOdds(game.changes.moneylineChanges);
      setLatestChangeOdds(game.latestChanges.moneylineLatestChanges);
    } else if (oddsType === "Spread") {
      setStartOdds(game.startSpreads);
      setKickOffOdds(game.kickoffSpreads);
      setLiveOdds(game.liveSpreads);
      setChangeOdds(game.changes.spreadChanges);
      setLatestChangeOdds(game.latestChanges.spreadLatestChanges);
    } else if (oddsType === "Total") {
      setStartOdds(game.startTotals);
      setKickOffOdds(game.kickoffTotals);
      setLiveOdds(game.liveTotals);
      setChangeOdds(game.changes.totalsChanges);
      setLatestChangeOdds(game.latestChanges.totalsLatestChanges);
    }
  }, [oddsType, game]);

  const renderStatus = (game: any) => {
    if (game.status === "0") {
      return (
        <p className="font-medium">{formatDateTimeMonthOnly(game.dateUtc)}</p>
      );
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
  const renderOddsType = (gameStarted: boolean) => {
    return (
      <>
        <th className="w-auto px-3 pb-2 whitespace-nowrap">OPEN</th>
        {gameStarted && (
          <th className="w-auto px-3 pb-2 whitespace-nowrap">KICKOFF</th>
        )}
        <th className="w-auto px-3 pb-2 whitespace-nowrap">CURRENT</th>
        <th className="w-auto px-3 pb-2 whitespace-nowrap">DIFFERENCE</th>
        <th className="w-auto px-3 pb-2 whitespace-nowrap">DIFFERENCE</th>
      </>
    );
  };

  const getOddsValue = (
    odds: any,
    type: string,
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
    if (type === "MoneyLineChange") {
      return {
        main: isHomeTeam ? odds.home_od_change : odds.away_od_change,
        percentage: isHomeTeam
          ? odds.home_od_percentage
          : odds.away_od_percentage,
      };
    }
    if (type === "SpreadChange") {
      const home_handicap = odds.handicap_change;
      const away_handicap =
        home_handicap > 0 ? -Math.abs(home_handicap) : Math.abs(home_handicap);

      const home_handicap_percentage = odds.handicap_percentage;
      const away_handicap_percentage =
        home_handicap > 0
          ? -Math.abs(home_handicap_percentage)
          : Math.abs(home_handicap_percentage);
      return {
        main: isHomeTeam
          ? formatOdds(home_handicap)
          : formatOdds(away_handicap),
        percentage: isHomeTeam
          ? home_handicap_percentage
          : away_handicap_percentage,
        sub: isHomeTeam ? odds.home_od_change : odds.away_od_change,
        sub_percentage: isHomeTeam
          ? odds.home_od_percentage
          : odds.away_od_percentage,
      };
    }
    if (type === "TotalChange") {
      return {
        main: odds.handicap_change,
        percentage: odds.handicap_percentage,
        sub: isHomeTeam ? odds.over_od_change : odds.under_od_change,
        sub_percentage: isHomeTeam
          ? odds.over_od_percentage
          : odds.under_od_percentage,
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

  const OddsChangeButton = ({
    mainText,
    percentage,
    sub,
    sub_percentage,
  }: {
    mainText: number;
    percentage: number;
    sub?: number;
    sub_percentage?: number;
  }) => {
    let svgTrend;
    let sub_svgTrend;

    if (percentage > 0) {
      svgTrend = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`size-4 text-green-800 mr-1`}
        >
          <path
            fillRule="evenodd"
            d="M15.22 6.268a.75.75 0 0 1 .968-.431l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.695 12.695 0 0 1 5.68-4.974l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97Z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (percentage < 0) {
      svgTrend = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`size-4 text-red-800 mr-1`}
        >
          <path
            fillRule="evenodd"
            d="M1.72 5.47a.75.75 0 0 1 1.06 0L9 11.69l3.756-3.756a.75.75 0 0 1 .985-.066 12.698 12.698 0 0 1 4.575 6.832l.308 1.149 2.277-3.943a.75.75 0 1 1 1.299.75l-3.182 5.51a.75.75 0 0 1-1.025.275l-5.511-3.181a.75.75 0 0 1 .75-1.3l3.943 2.277-.308-1.149a11.194 11.194 0 0 0-3.528-5.617l-3.809 3.81a.75.75 0 0 1-1.06 0L1.72 6.53a.75.75 0 0 1 0-1.061Z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    if (sub_percentage && sub_percentage > 0) {
      sub_svgTrend = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`size-4 text-green-800 mr-1`}
        >
          <path
            fillRule="evenodd"
            d="M15.22 6.268a.75.75 0 0 1 .968-.431l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.695 12.695 0 0 1 5.68-4.974l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97Z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (sub_percentage && sub_percentage < 0) {
      sub_svgTrend = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`size-4 text-red-800 mr-1`}
        >
          <path
            fillRule="evenodd"
            d="M1.72 5.47a.75.75 0 0 1 1.06 0L9 11.69l3.756-3.756a.75.75 0 0 1 .985-.066 12.698 12.698 0 0 1 4.575 6.832l.308 1.149 2.277-3.943a.75.75 0 1 1 1.299.75l-3.182 5.51a.75.75 0 0 1-1.025.275l-5.511-3.181a.75.75 0 0 1 .75-1.3l3.943 2.277-.308-1.149a11.194 11.194 0 0 0-3.528-5.617l-3.809 3.81a.75.75 0 0 1-1.06 0L1.72 6.53a.75.75 0 0 1 0-1.061Z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    return (
      <button
        className={`w-30 h-12 md:w-36 flex flex-row items-center text-md justify-center rounded-md border py-1 text-center text-sm transition-all shadow-sm hover:shadow-lg`}
        type="button"
      >
        <div className="flex px-3 py-2 flex-col">
          <span className="text-xs flex flex-row">
            {svgTrend} {mainText} ({percentage}%)
          </span>
          {sub && (
            <span className="text-xs flex flex-row">
              {sub_svgTrend} {sub} ({sub_percentage}%)
            </span>
          )}
        </div>
      </button>
    );
  };

  const renderOdds = (
    team: "homeTeam" | "awayTeam",
    startOdds: any,
    kickOffOdds: any,
    liveOdds: any,
    changeOdds: any,
    type: "MoneyLine" | "Spread" | "Total",
    gameStarted: boolean
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
    const changeOddsValue = getOddsValue(
      changeOdds,
      type + "Change",
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
        {gameStarted && (
          <td key={kickOffOdds?.id} className="px-3 pb-2">
            {kickOffOddsValue && (
              <OddsButton
                mainText={kickOffOddsValue.main}
                subText={kickOffOddsValue.sub}
                isWinning={kickOffOddsValue.isWinning}
              />
            )}
          </td>
        )}
        <td key={liveOdds?.id} className="px-3 pb-2">
          {liveOddsValue && (
            <OddsButton
              mainText={liveOddsValue.main}
              subText={liveOddsValue.sub}
              isWinning={liveOddsValue.isWinning}
            />
          )}
        </td>
        <td key={changeOdds} className="px-3 pb-2">
          {changeOddsValue && (
            <OddsChangeButton
              mainText={changeOddsValue.main}
              percentage={changeOddsValue.percentage}
              sub={changeOddsValue.sub}
              sub_percentage={changeOddsValue.sub_percentage}
            />
          )}
        </td>
        <td key={changeOdds} className="px-3 pb-2">
          {changeOddsValue && (
            <OddsChangeButton
              mainText={changeOddsValue.main}
              percentage={changeOddsValue.percentage}
              sub={changeOddsValue.sub}
              sub_percentage={changeOddsValue.sub_percentage}
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

  // Check if game starts
  let gameStarted = false;
  if (game.status === "1" || game.status === "3") {
    gameStarted = true;
  }

  return (
    <table className="table-fixed md:w-full mr-5">
      <thead>
        <tr className="text-sm">
          <th className="w-auto pb-2 sticky left-0 bg-white">
            <div className="flex items-center gap-x-1.5">
              {renderStatus(game)}
            </div>
          </th>
          {renderOddsType(gameStarted)}
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
          {renderOdds(
            "homeTeam",
            startOdds,
            kickOffOdds,
            liveOdds,
            changeOdds,
            oddsType,
            gameStarted
          )}
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
          {renderOdds(
            "awayTeam",
            startOdds,
            kickOffOdds,
            liveOdds,
            changeOdds,
            oddsType,
            gameStarted
          )}
        </tr>
      </tbody>
    </table>
  );
};

export default GameOdds;
