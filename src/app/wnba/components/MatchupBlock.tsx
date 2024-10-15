"use client";
import GameList from "./GameList";
import useSWR from "swr";
import { fetcher } from "@/app/utils/swrFetcher";
import { formatDateOnly } from "@/app/utils/formatDate";
import { ChangeEvent, useState } from "react";

interface MatchupblockProps {
  todayDate: string;
}

// Define the specific type for odds
type OddsType = "MoneyLine" | "Spread" | "Total";

export default function Matchupblock({ todayDate }: MatchupblockProps) {
  const [oddsType, setOddsType] = useState<OddsType>("MoneyLine");

  const handleOddsType = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value as OddsType;
    setOddsType(selectedValue);
  };

  // Use SWR to fetch data, with auto-revalidation
  const { data: games, error } = useSWR(
    "/api/games?date=" + todayDate,
    fetcher,
    {
      refreshInterval: 60000, // Auto-revalidate every 60 seconds
    }
  );

  // If data is still loading
  if (!games) {
    return <div>Loading...</div>;
  }

  // If there is an error
  if (error) {
    return <div>Failed to load posts</div>;
  }

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 md:px-6 lg:px-6 bg-white rounded-lg border border-gray-100 text-gray-900">
      <div className="flex flex-col md:flex-row items-start items-center justify-between pb-3 border-b">
        <h2 className="font-semibold mb-2 md:mb-0">
          {formatDateOnly(todayDate)}
        </h2>

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

      <GameList games={games} oddsType={oddsType} />
    </div>
  );
}
