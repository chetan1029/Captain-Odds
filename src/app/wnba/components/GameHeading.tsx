import { getShortName, renderStatus } from "@/app/utils/common";
import { formatDateTimeMonthOnly } from "@/app/utils/formatDate";
import Link from "next/link";

interface GameHeadingProps {
  game: any;
}
const GameHeading: React.FC<GameHeadingProps> = ({ game }) => {
  // Determine which team has the higher score
  const homeScore = game.homeScore;
  const awayScore = game.awayScore;

  const homeScoreClass =
    homeScore >= awayScore ? "text-black" : "text-gray-500";
  const awayScoreClass =
    awayScore >= homeScore ? "text-black" : "text-gray-500";

  return (
    <>
      <div className="flex justify-between mb-2">
        <p className="text-sm text-gray-900">
          {formatDateTimeMonthOnly(game.dateUtc)}
        </p>
      </div>
      <div className="flex justify-center">
        <div className="flex min-w-0 font-medium">
          <Link
            href={`/wnba/teams/${game.homeTeam.slug}`}
            className="flex gap-x-4 items-center"
          >
            <div className="flex">
              <p className="hidden md:block text-lg text-gray-900">
                {game.homeTeam.name}
              </p>
              <p className="md:hidden text-lg text-gray-900">
                {getShortName(game.homeTeam.name)}
              </p>
            </div>
            <img
              className="h-8 w-8 rounded-full bg-gray-50"
              src={
                "https://assets.b365api.com/images/team/m/" +
                  game.homeTeam.logo +
                  ".png" || "/placeholder-logo.png"
              }
              alt={game.homeTeam.name}
              width={30}
              height={30}
            />
            <div className={`flex text-2xl ${homeScoreClass}`}>
              {game.homeScore}
            </div>
          </Link>
        </div>
        <div className="flex items-center px-7">
          <p className="font-medium text-2xl">-</p>
        </div>
        <div className="flex min-w-0 font-medium">
          <Link
            href={`/wnba/teams/${game.awayTeam.slug}`}
            className="flex gap-x-4 items-center"
          >
            <div className={`flex text-2xl ${awayScoreClass}`}>
              {game.awayScore}
            </div>
            <img
              className="h-8 w-8 rounded-full bg-gray-50"
              src={
                "https://assets.b365api.com/images/team/m/" +
                  game.awayTeam.logo +
                  ".png" || "/placeholder-logo.png"
              }
              alt={game.awayTeam.name}
              width={30}
              height={30}
            />
            <div className="flex">
              <p className="hidden md:block text-lg text-gray-900">
                {game.awayTeam.name}
              </p>
              <p className="md:hidden text-lg text-gray-900">
                {getShortName(game.awayTeam.name)}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default GameHeading;
