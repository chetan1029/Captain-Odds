"use client";
import GameList from "./GameList";
import useSWR from "swr";
import { fetcher } from "@/app/utils/swrFetcher";
import { formatDateOnly } from "@/app/utils/formatDate";

interface MatchupblockProps {
  todayDate: string;
}
export default function Matchupblock({ todayDate }: MatchupblockProps) {
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
      <h2 className="border-b pb-3 font-semibold">
        {formatDateOnly(todayDate)}
      </h2>
      <GameList games={games} />
    </div>
  );
}
