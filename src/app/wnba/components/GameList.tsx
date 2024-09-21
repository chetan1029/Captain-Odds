"use client";
import React, { useEffect, useState } from "react";
// import GameOdds from "./GameOdds";
import GameScore from "./GameScore";
// import GameLinks from "./GameLinks";
import Link from "next/link";

interface GameListProps {
  games: any[];
  oddsType: "MoneyLine" | "Spread" | "Total";
}

const GameList: React.FC<GameListProps> = ({ games, oddsType }) => {
  return (
    <ul role="list" className="grid divide-y divide-gray-100">
      {games.map((game: any) => (
        <li
          key={game.id}
          className="md:flex md:divide-x md:divide-gray-300 py-3 "
        >
          <Link key={game.id} href={`/wnba/boxscore/${game.id}`}>
            <GameScore game={game} oddsType={oddsType} />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default GameList;
