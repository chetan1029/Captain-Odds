"use client";
import {
  formatDateMonthOnly,
  formatDateTimeMonthOnly,
} from "@/app/utils/formatDate";
import { stringToSlug } from "@/app/utils/toSlug";
import Link from "next/link";
import { useState } from "react";

interface WnbaGame {
  id: number;
  date: Date;
  dateUtc: string;
  status: string;
  homeScore: number;
  awayScore: number;
  homeTeam: {
    id: number;
    name: string;
    slug: string;
  };
  awayTeam: {
    id: number;
    name: string;
    slug: string;
  };
  gameType?: string;
}

interface TeamScheduleProps {
  team: {
    id: number;
    name: string;
    slug: string;
    homeGames: WnbaGame[] | undefined;
    awayGames: WnbaGame[] | undefined;
  };
}

const TeamSchedule: React.FC<TeamScheduleProps> = ({ team }) => {
  const [activeTab, setActiveTab] = useState("pastResults");

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Get the current date in Toronto timezone
  const currentDate = new Date().toLocaleString("en-US", {
    timeZone: "America/Toronto",
  });

  // Updated filter and sort function
  const filterAndSortGames = (games: WnbaGame[], isUpcoming: boolean) => {
    return games
      .filter((game) => {
        // Convert game date to Toronto timezone
        const timestamp = parseInt(game.dateUtc) * 1000; // Convert to milliseconds
        const gameDate = new Date(timestamp).toLocaleString("en-US", {
          timeZone: "America/Toronto",
        });

        return isUpcoming
          ? new Date(gameDate) >= new Date(currentDate)
          : new Date(gameDate) < new Date(currentDate);
      })
      .sort((a, b) => {
        // Sort games based on date in Toronto timezone
        const dateA = new Date(parseInt(a.dateUtc) * 1000).toLocaleString(
          "en-US",
          { timeZone: "America/Toronto" }
        );
        const dateB = new Date(parseInt(b.dateUtc) * 1000).toLocaleString(
          "en-US",
          { timeZone: "America/Toronto" }
        );
        return isUpcoming
          ? new Date(dateA).getTime() - new Date(dateB).getTime()
          : new Date(dateB).getTime() - new Date(dateA).getTime();
      });
  };

  const totalGames = [
    ...(team.homeGames?.map((game) => ({ ...game, gameType: "home" })) ?? []),
    ...(team.awayGames?.map((game) => ({ ...game, gameType: "away" })) ?? []),
  ];

  const pastResults = filterAndSortGames(totalGames, false);
  const upcomingGames = filterAndSortGames(totalGames, true);

  const getOpponents = (game: WnbaGame) => {
    if (game.gameType === "home") {
      return (
        <Link
          href={`/wnba/teams/${stringToSlug(game.awayTeam.name)}`}
          className="font-semibold underline underline-offset-1"
        >
          {game.awayTeam.name}
        </Link>
      );
    } else if (game.gameType === "away") {
      return (
        <Link
          href={`/wnba/teams/${stringToSlug(game.homeTeam.name)}`}
          className="font-semibold underline underline-offset-1"
        >
          @{game.homeTeam.name}
        </Link>
      );
    }
  };

  const getScore = (game: WnbaGame) => {
    const score = `${game.homeScore ?? 0}-${game.awayScore ?? 0}`;
    let isWinningTeam = false;
    if (game.gameType === "home") {
      isWinningTeam = game.homeScore > game.awayScore;
    } else if (game.gameType === "away") {
      isWinningTeam = game.awayScore > game.homeScore;
    }
    const resultText = isWinningTeam ? "W" : "L";
    const resultColor = isWinningTeam ? "bg-green-800" : "bg-red-800";

    let statusText = "";
    if (game.status == "3") {
      statusText = ``;
    }
    return (
      <Link href={`/wnba/boxscore/${game.id}`}>
        <span
          className={`inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold text-gray-100 ${resultColor} rounded-full`}
        >
          {resultText}
        </span>
        <span className="inline-flex font-semibold">
          {score} {statusText}
        </span>
      </Link>
    );
  };

  return (
    <>
      <div className="mb-4 mt-2 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="me-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "pastResults"
                  ? "border-gray-200 dark:border-gray-700"
                  : ""
              }`}
              id="pastResults-tab"
              type="button"
              role="tab"
              aria-controls="pastResults"
              aria-selected={activeTab === "pastResults"}
              onClick={() => handleTabClick("pastResults")}
            >
              Past Results
            </button>
          </li>
          <li className="me-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "upcomingGames"
                  ? "border-gray-200 dark:border-gray-700"
                  : ""
              }`}
              id="upcomingGames-tab"
              type="button"
              role="tab"
              aria-controls="upcomingGames"
              aria-selected={activeTab === "upcomingGames"}
              onClick={() => handleTabClick("upcomingGames")}
            >
              Upcoming Games
            </button>
          </li>
        </ul>
      </div>
      <div id="default-tab-content">
        <div
          className={`rounded-lg ${
            activeTab === "pastResults" ? "block" : "hidden"
          }`}
          id="pastResults"
          role="tabpanel"
          aria-labelledby="pastResults-tab"
        >
          <h5 className="mb-2">Regular Season</h5>
          <table className="table-fixed text-sm w-full text-left">
            <thead>
              <tr>
                <th className="w-1/4 pr-3 py-2">Date</th>
                <th className="px-3 py-2">VS</th>
                <th className="px-3 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {pastResults.map((pastResult) => (
                <tr key={pastResult.id}>
                  <td className="w-1/4 pr-3 py-2">
                    <Link href={`/wnba/boxscore/${pastResult.id}`}>
                      {formatDateMonthOnly(pastResult.dateUtc)}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{getOpponents(pastResult)}</td>
                  <td className="px-3 py-2">{getScore(pastResult)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className={`rounded-lg ${
            activeTab === "upcomingGames" ? "block" : "hidden"
          }`}
          id="upcomingGames"
          role="tabpanel"
          aria-labelledby="upcomingGames-tab"
        >
          <h5 className="mb-2">Regular Season</h5>
          <table className="table-fixed text-sm w-full text-left">
            <thead>
              <tr>
                <th className="w-1/4 pr-3 py-2">Date</th>
                <th className="px-3 py-2">VS</th>
              </tr>
            </thead>
            <tbody>
              {upcomingGames.map((upcomingGame) => (
                <tr key={upcomingGame.id}>
                  <td className="w-1/4 pr-3 py-2">
                    <Link href={`/wnba/boxscore/${upcomingGame.id}`}>
                      {formatDateTimeMonthOnly(upcomingGame.dateUtc)}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{getOpponents(upcomingGame)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Preseason games, if applicable */}
        </div>
      </div>
    </>
  );
};

export default TeamSchedule;
