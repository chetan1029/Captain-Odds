"use client";
import React, { useEffect, useState } from "react";
// import GameOdds from "./GameOdds";
import GameScore from "./GameScore";
// import GameLinks from "./GameLinks";
import Link from "next/link";

interface GameListProps {
  games: any[];
}

const GameList: React.FC<GameListProps> = ({ games }) => {
  return (
    <ul role="list" className="grid divide-y divide-gray-100">
      {games.map((game: any) => (
        <li
          key={game.id}
          className="md:flex md:divide-x md:divide-gray-300 py-3 "
        >
          <div className="basis-2/5">
            <Link key={game.id} href={`/wnba/boxscore/${game.id}`}>
              <GameScore game={game} type="gameList" />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GameList;
