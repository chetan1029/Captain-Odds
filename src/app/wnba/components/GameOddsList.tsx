"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import GameOdds from "./GameOdds";

interface GameOddsListProps {
  games: any[];
  oddsType: "MoneyLine" | "Spread" | "Total";
}

const GameOddsList: React.FC<GameOddsListProps> = ({ games, oddsType }) => {
  // Check if games is an array
  if (!Array.isArray(games)) {
    console.error("Expected 'games' to be an array, but received:", games);
    return <div>No games available</div>; // or some other fallback UI
  }
  if (games.length <= 0) {
    return <div className="mt-4">No games available for this date</div>; // or some other fallback UI
  }
  return (
    <ul role="list" className="grid divide-y divide-gray-100 overflow-x-auto">
      {games?.map((game: any) => (
        <li
          key={game.id}
          className="min-w-[640px] md:flex md:divide-x md:divide-gray-300 py-3 "
        >
          <Link key={game.id} href={`/wnba/boxscore/${game.id}`}>
            <GameOdds game={game} oddsType={oddsType} />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default GameOddsList;
