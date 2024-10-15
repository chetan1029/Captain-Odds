"use client";
import useSWR from "swr";
import { fetcher } from "@/app/utils/swrFetcher";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import GameHeading from "../../components/GameHeading";
import GameScore from "../../components/GameScore";
import { ChangeEvent, useState } from "react";
import TeamStatistics from "../../components/TeamStatistics";

// Define the specific type for odds
type OddsType = "MoneyLine" | "Spread" | "Total";

export default function BoxScore({ params }: { params: { slug: string } }) {
  const gameId = params.slug;

  const [oddsType, setOddsType] = useState<OddsType>("MoneyLine");

  const handleOddsType = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value as OddsType;
    setOddsType(selectedValue);
  };

  // Use SWR to fetch data, with auto-revalidation
  const { data: game, error } = useSWR(
    "/api/gameBySlug?gameSlug=" + gameId,
    fetcher,
    {
      refreshInterval: 60000, // Auto-revalidate every 60 seconds
    }
  );

  // If data is still loading
  if (!game) {
    return <div>Loading...</div>;
  }

  // If there is an error
  if (error) {
    return <div>Failed to load posts</div>;
  }

  const breadcrumbs = [
    { name: "WNBA", href: "/wnba" },
    { name: "Scores & Matchups", href: "/wnba/matchup" },
    { name: game.awayTeam.name + " @ " + game.homeTeam.name, href: "" },
  ];

  console.log(game);

  return (
    <main className="flex-grow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 mt-4">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="mx-auto max-w-7xl py-6 px-4 md:px-6 lg:px-8 bg-white mt-4 rounded-lg border border-gray-100 text-gray-900">
          <div className="border-b pb-5 mb-2">
            {game && <GameHeading game={game} />}
          </div>
          <div className="flex items-center justify-between pb-3">
            <h2 className="font-semibold">Score</h2>
            <div className="w-full max-w-[300px] min-w-[200px]">
              <div className="relative">
                <select
                  value={oddsType}
                  onChange={handleOddsType}
                  className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 focus:shadow-md appearance-none cursor-pointer"
                >
                  <option value="MoneyLine">MoneyLine</option>
                  <option value="Spread">Spread</option>
                  <option value="Total">Total</option>
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.2"
                  stroke="currentColor"
                  className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                  />
                </svg>
              </div>
            </div>
          </div>
          <ul
            role="list"
            className="grid divide-y divide-gray-100 overflow-x-auto"
          >
            <li
              key={gameId}
              className="min-w-[640px] md:flex md:divide-x md:divide-gray-300 py-3 "
            >
              <div className="flex justify-center w-full">
                {game && <GameScore game={game} oddsType={oddsType} />}
              </div>
            </li>
          </ul>
        </div>

        <div className="mx-auto max-w-7xl py-6 px-4 md:px-6 lg:px-8 bg-white mt-4 rounded-lg border border-gray-100 text-gray-900">
          <h2 className="border-b pb-3 font-semibold mb-5">Team Statistics</h2>
          {game && <TeamStatistics game={game} />}
        </div>
      </div>
    </main>
  );
}
